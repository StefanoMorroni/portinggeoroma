import queryString from 'query-string';
import axios from 'axios';
import qs from 'qs';

class Auth {
    props = {};

    constructor(props) {
        this.props = { ...this.props, ...props };
        this.login = this.login.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.logout = this.logout.bind(this);
    }

    login() {
        sessionStorage.setItem('redirectUri', window.location.href);
        console.log("[STF]", window.location.origin);
        var url = this.props.authorize
            + "?response_type=code"
            + "&client_id=" + this.props.clientId
            //+ "&client_secret=" + this.props.client_secret
            + "&scope=" + (this.props.scope ? this.props.scope : "openid profile")
            + "&redirect_uri=" + (window.location.origin == 'http://127.0.0.1:7070' ? 'http://127.0.0.1:7070/' : (this.props.redirect_uri ? this.props.redirect_uri : window.location.origin + window.location.pathname))
        window.location.href = url;
    }

    logout(accessToken, refreshToken, idToken) {
        sessionStorage.setItem('redirectUri', window.location.href);
        if (this.props.vendor == "keycloak") {
            axios({
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + accessToken
                },
                data: qs.stringify({
                    client_id: this.props.clientId,
                    //client_secret: this.props.client_secret,
                    refresh_token: refreshToken
                }),
                url: this.props.logout,
            })
                .then((response) => {
                })
                .catch(error => {
                    console.error("[STF] error:", error);
                });
        } else if (this.props.vendor == "wso2") {
            axios({
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': 'Bearer ' + accessToken
                },
                data: qs.stringify({
                    client_id: this.props.clientId,
                    //client_secret: this.props.client_secret,
                    refresh_token: refreshToken
                }),
                url: this.props.userinfo,
            })
                .then((response) => {
                    if (response?.data?.preferred_username || response?.data?.sub) {
                        var url = this.props.logout
                        + "?id_token_hint=" + idToken
                        //+ "&state=13e2312637dg136e1"
                        + "&post_logout_redirect_uri=" + window.location.origin + window.location.pathname;
                        window.location.href = url;
                    }
                })
                .catch(error => {
                    console.error("[STF] error:", error);
                });
        } else if (this.props.vendor == "openAM") {
            axios({
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': 'Bearer ' + accessToken
                },
                url: this.props.logout + "?id_token_hint=" + idToken,
            })
                .then((response) => {
                    console.log("[STF] logout eseguito con successo", response);
                })
                .catch(error => {
                    console.error("[STF] error:", error);
                });
        }
    }

    handleAuthentication() {
        const authResult = queryString.parse(window.location.search);
        if (authResult.code) {
            console.log("[STF] Auth.handleAuthentication() handle login callback");
            axios({
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    grant_type: 'authorization_code',
                    code: authResult.code,
                    client_id: this.props.clientId,
                    //client_secret: this.props.client_secret,
                    redirect_uri: (window.location.origin == 'http://127.0.0.1:7070' ? 'http://127.0.0.1:7070/' : (this.props.redirect_uri ? this.props.redirect_uri : window.location.origin + window.location.pathname))
                }),
                url: this.props.token,
            })
                .then((response) => {
                    const security = {
                        authHeader: response?.data?.token_type + " " + response?.data?.access_token,
                        errorCause: null,
                        expires: Math.floor(Date.now() / 1000) + 3600000, //1625491889,
                        loginError: null,
                        refresh_token: response?.data?.refresh_token,
                        token: response?.data?.access_token,
                        id_token: response?.data?.id_token,
                        user: {
                            enabled: true,
                        }
                    }
                    localStorage.setItem('mapstore2.persist.security', JSON.stringify(security));
                    if (sessionStorage.getItem('redirectUri')) {
                        window.location.replace(sessionStorage.getItem('redirectUri'));
                    }
                })
                .catch(error => {
                    console.error("[STF] error(1):", error);
                });

        } else if (authResult.sp) {
            console.log("[STF] Auth.handleAuthentication() handle logout callback");
            if (sessionStorage.getItem('redirectUri')) {
                window.location.replace(sessionStorage.getItem('redirectUri'));
            }
        }
    }

    refreshToken(accessToken, refreshToken) {
        return axios({
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
                //'Authorization': 'Bearer ' + accessToken
            },
            data: qs.stringify({
                grant_type: 'refresh_token',
                client_id: this.props.clientId,
                //client_secret: this.props.client_secret,
                refresh_token: refreshToken
            }),
            url: this.props.token,
        })
    }

    userInfo(accessToken, refreshToken) {
        return axios({
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': 'Bearer ' + accessToken
            },
            data: qs.stringify({
                client_id: this.props.clientId,
                //client_secret: this.props.client_secret,
                refresh_token: refreshToken
            }),
            url: this.props.userinfo,
        })
    }
}

export default Auth;