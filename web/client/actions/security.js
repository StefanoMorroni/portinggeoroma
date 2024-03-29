/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Here you can change the API to use for AuthenticationAPI
 */
import AuthenticationAPI from '../api/GeoStoreDAO';

import {getToken, getRefreshToken, getIdToken} from '../utils/SecurityUtils';
import { loadMaps } from './maps';
import ConfigUtils from '../utils/ConfigUtils';
import {encodeUTF8} from '../utils/EncodeUtils';


export const CHECK_LOGGED_USER = 'CHECK_LOGGED_USER';
export const LOGIN_SUBMIT = 'LOGIN_SUBMIT';
export const LOGIN_PROMPT_CLOSED = "LOGIN:LOGIN_PROMPT_CLOSED";
export const LOGIN_REQUIRED = "LOGIN:LOGIN_REQUIRED";
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const RESET_ERROR = 'RESET_ERROR';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAIL = 'CHANGE_PASSWORD_FAIL';
export const LOGOUT = 'LOGOUT';
export const USERINFO_SUCCESS = 'USERINFO_SUCCESS';
export const REFRESH_SUCCESS = 'REFRESH_SUCCESS';
export const SESSION_VALID = 'SESSION_VALID';

export function loginSuccess(userDetails, username, password, authProvider) {
    return {
        type: LOGIN_SUCCESS,
        userDetails: userDetails,
        // set here for compatibility reasons
        // TODO: verify if the compatibility reasons still hold and remove otherwise
        authHeader: 'Basic ' + btoa(encodeUTF8(username) + ':' + encodeUTF8(password)),
        username: username,
        password: password,
        authProvider: authProvider
    };
}

export function loginFail(e) {
    return {
        type: LOGIN_FAIL,
        error: e
    };
}

export function resetError() {
    return {
        type: RESET_ERROR
    };
}

export function logout(redirectUrl) {
    return {
        type: LOGOUT,
        redirectUrl: redirectUrl
    };
}

/**
 * Asks for  login
 */
export function loginRequired() {
    return {
        type: LOGIN_REQUIRED
    };
}

/**
 * event of login close after a LOGIN_REQUIRED event
 * @param {string} owner
 */
export function loginPromptClosed() {
    return {
        type: LOGIN_PROMPT_CLOSED
    };
}

export function logoutWithReload() {
    return (dispatch, getState) => {
        window.auth.logout(getToken(), getRefreshToken(), getIdToken());
        dispatch(logout(null));
        dispatch(loadMaps(false, getState().maps && getState().maps.searchText || ConfigUtils.getDefaults().initialMapFilter || "*"));
    };
}

export function login(username, password) {
    return (dispatch, getState) => {
        return AuthenticationAPI.login(username, password).then((response) => {
            dispatch(loginSuccess(response, username, password, AuthenticationAPI.authProviderName));
            dispatch(loadMaps(false, getState().maps && getState().maps.searchText || ConfigUtils.getDefaults().initialMapFilter || "*"));
        }).catch((e) => {
            dispatch(loginFail(e));
        });
    };
}

export function changePasswordSuccess(user, newPassword) {
    return {
        type: CHANGE_PASSWORD_SUCCESS,
        user: user,
        authHeader: 'Basic ' + btoa(encodeUTF8(user.name) + ':' + encodeUTF8(newPassword))
    };
}

export function changePasswordFail(e) {
    return {
        type: CHANGE_PASSWORD_FAIL,
        error: e
    };
}

export function changePasswordStart() {
    return {
        type: CHANGE_PASSWORD
    };
}

export function changePassword(user, newPassword) {
    return (dispatch) => {
        dispatch(changePasswordStart());
        AuthenticationAPI.changePassword(user, newPassword).then(() => {
            dispatch(changePasswordSuccess(user, newPassword));
        }).catch((e) => {
            dispatch(changePasswordFail(e));
        });
    };
}

export function userInfoSuccess(interval) {
    return {
        type: USERINFO_SUCCESS,
        interval
    };
}

export function refreshSuccess(userDetails, authProvider) {
    return {
        type: REFRESH_SUCCESS,
        userDetails: userDetails,
        authProvider: authProvider
    };
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

export function refreshAccessToken() {
    return (dispatch, getState) => {
        const accessToken = getToken();
        const refreshToken = getRefreshToken();
        const userinfo = getState().security.userinfo | 0;
        const accessTokenDecoded = parseJwt(accessToken);
        const currentseconds = Math.floor(Date.now() / 1000);
        console.log("[STF] exp:", accessTokenDecoded?.exp, "currentseconds", currentseconds);
        if (currentseconds > (accessTokenDecoded.exp - 60)) {
            window.auth.refreshToken(accessToken, refreshToken)
                .then((response) => {
                    console.log("[STF] refreshToken completata con successo ", userinfo, response.data);
                    dispatch(refreshSuccess(response.data, AuthenticationAPI.authProviderName));
                }).catch(() => {
                    console.error("[STF] refreshToken fallita, eseguo logout(null) ", userinfo);
                    dispatch(logout(null));
                });
        }
    };
}

export function sessionValid(userDetails, authProvider) {
    return {
        type: SESSION_VALID,
        userDetails: userDetails,
        authProvider: authProvider
    };
}

export function verifySession() {
    return (dispatch) => {
        AuthenticationAPI.verifySession().then((response) => {
            dispatch(sessionValid(response, AuthenticationAPI.authProviderName));
        }).catch(() => {
            dispatch(logout(null));
        });
    };
}

export const checkLoggedUser = () => ({type: CHECK_LOGGED_USER});
