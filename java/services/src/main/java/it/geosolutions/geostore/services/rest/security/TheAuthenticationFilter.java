package it.geosolutions.geostore.services.rest.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.geosolutions.geostore.core.model.User;
import it.geosolutions.geostore.core.model.UserAttribute;
import it.geosolutions.geostore.core.model.UserGroup;
import it.geosolutions.geostore.services.UserGroupService;
import it.geosolutions.geostore.services.exception.BadRequestServiceEx;
import it.geosolutions.geostore.services.exception.NotFoundServiceEx;
import it.geosolutions.mapstore.utils.ResourceUtils;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.Proxy;
import java.net.ProxySelector;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManager;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.ServletContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;

public class TheAuthenticationFilter extends TokenAuthenticationFilter {

	private final static Logger LOGGER = LogManager.getLogger(TheAuthenticationFilter.class);
	private ObjectMapper jsonMapper = new ObjectMapper();
	@Value("${datadir.location:}")
	private String dataDir = "";
	@Autowired
	private ServletContext context;
	@Autowired
	protected UserGroupService userGroupService;

	public TheAuthenticationFilter() {
		super();
		try {
			SSLContext ctx = SSLContext.getInstance("TLS");
			ctx.init(new KeyManager[0], new TrustManager[]{new DefaultTrustManager()}, new SecureRandom());
			SSLContext.setDefault(ctx);
		} catch (Exception e) {
			LOGGER.error(e);
		}
	}

	@Override
	protected Authentication checkToken(String token) {
		String url = null;
		String vendor = null;
		String tipoutente = null;
		HttpURLConnection conn = null;
		try {
			if (token == null) return null;

			Optional<File> resource = ResourceUtils.findResource(dataDir, context, "configs/localConfig.json");
			if (resource.isPresent()) {
				String content = new String(Files.readAllBytes(Paths.get(resource.get().getPath())));
				url = jsonMapper.readTree(content).get("sso").get("backend_userinfo").asText();
				vendor = jsonMapper.readTree(content).get("sso").get("vendor").asText();
				if (jsonMapper.readTree(content).get("sso").get("tipoutente") != null) {
					tipoutente = jsonMapper.readTree(content).get("sso").get("tipoutente").asText();
				}
			} else {
				LOGGER.info("[STF] dataDir:" + dataDir);
			}

			LOGGER.info("[STF] url:" + url + ", token:" + token);
			URL theurl = new URL(url);
			ProxySelector selector = ProxySelector.getDefault();
			List<Proxy> proxyList = selector.select(theurl.toURI());
			Proxy proxy = proxyList.get(0);
			LOGGER.info("[STF] url:" + url + ", token:" + token + ", proxy:" + proxy.toString());
			conn = (HttpURLConnection) theurl.openConnection(proxy);
			if (conn instanceof HttpsURLConnection) {
				((HttpsURLConnection) conn).setHostnameVerifier(new HostnameVerifier() {
					@Override
					public boolean verify(String arg0, SSLSession arg1) {
						return true;
					}
				});
			}

			conn.setDoOutput(false);
			conn.setInstanceFollowRedirects(false);
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Accept", "application/json");
			conn.setRequestProperty("Authorization", "Bearer " + token);
			conn.setUseCaches(false);

			LOGGER.info("[STF] url:" + url + ", token:" + token + ",responseCode:" + conn.getResponseCode());

			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
			StringBuilder response = new StringBuilder();
			String responseLine = null;
			while ((responseLine = br.readLine()) != null) {
				response.append(responseLine.trim());
			}
			br.close();
			LOGGER.info("[STF] url:" + url + ", token:" + token + ",responseCode:" + conn.getResponseCode() + ",response:" + response.toString());

			JsonNode xx = jsonMapper.readTree(response.toString());

			if ("openAM".equalsIgnoreCase(vendor)) {
				String userName = xx.get("sub").asText();
				User user = null;
				try {
					user = userService.get(userName);
					if (xx.get(tipoutente) != null) {
						String iv_tipoutente = xx.get(tipoutente).asText();
						UserGroup ug = userGroupService.get(iv_tipoutente);
						if (ug != null) {
							userGroupService.assignUserGroup(user.getId(), ug.getId());
						}
					}
					return createAuthenticationForUser(user);
				} catch (NotFoundServiceEx e) {
					try {
						user = createUser(userName, null, "");
						if (xx.get(tipoutente) != null) {
							String iv_tipoutente = xx.get(tipoutente).asText();
							UserGroup ug = userGroupService.get(iv_tipoutente);
							if (ug != null) {
								userGroupService.assignUserGroup(user.getId(), ug.getId());
							}
						}
						return createAuthenticationForUser(user);
					} catch (BadRequestServiceEx | NotFoundServiceEx e1) {
						LOGGER.error("Error creating user for " + userName, e);
					}
				}
			} else {
				if (xx.get("preferred_username") != null) {

					String userName = xx.get("preferred_username").asText();
					User user = null;
					try {
						user = userService.get(userName);
					} catch (NotFoundServiceEx e) {
						try {
							user = createUser(userName, null, "");
						} catch (BadRequestServiceEx e1) {
							LOGGER.error("Error creating user for " + userName, e);
						} catch (NotFoundServiceEx e1) {
							LOGGER.error("Error creating user for " + userName, e);
						}
					}

					if (user != null) {
						if (xx.get("sub") != null) {
							List<UserAttribute> attributes = new ArrayList();
							UserAttribute userAttr = new UserAttribute();
							userAttr.setUser(user);
							userAttr.setName("sub");
							userAttr.setValue(xx.get("sub").asText().toUpperCase());
							attributes.add(userAttr);
							userService.updateAttributes(user.getId(), attributes);
						}
						return createAuthenticationForUser(user);
					}
				} else if (xx.get("sub") != null) {
					String sub = xx.get("sub").asText().toUpperCase();
					UserAttribute attribute = new UserAttribute();
					attribute.setName("sub");
					attribute.setValue(sub);
					Collection<User> users = userService.getByAttribute(attribute);
					LOGGER.info("[STF] con sub:" + sub + " trovati " + users.size() + " utenti");
					for (User user : users) {
						LOGGER.info("[STF] con sub:" + sub + " trovato l'utente " + user.toString());
						return createAuthenticationForUser(user);
					}
				}
			}
		} catch (Exception e) {
			LOGGER.error("[STF] Error contacting webservice: " + url, e);
		}
		return null;
	}

	private static class DefaultTrustManager implements X509TrustManager {

		@Override
		public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
		}

		@Override
		public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
		}

		@Override
		public X509Certificate[] getAcceptedIssuers() {
			return null;
		}
	}
}

