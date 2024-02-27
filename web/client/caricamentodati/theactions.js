import axios from '../libs/ajax';

export const CARICAMENTODATI_TOGGLE = 'CARICAMENTODATI:TOGGLE';
export const CARICAMENTODATI_SPINNER = 'CARICAMENTODATI:SPINNER';
export const CARICAMENTODATI_PARAMS = 'CARICAMENTODATI:PARAMS';
export const CARICAMENTODATI_NEWFILE = 'CARICAMENTODATI:NEWFILE';
export const CARICAMENTODATI_DELETEFILE = 'CARICAMENTODATI:DELETEFILE';

export function caricamentodatiToggle() {
    return {
        type: CARICAMENTODATI_TOGGLE
    };
}

export function caricamentodatiSpinner(flag) {
    return {
        type: CARICAMENTODATI_SPINNER,
        flag
    };
}

export function caricamentodatiParams(params) {
    return {
        type: CARICAMENTODATI_PARAMS,
        params
    };
}

export function caricamentodatiNewFile(file) {
    return {
        type: CARICAMENTODATI_NEWFILE,
        file
    };
}

export function caricamentodatiDeleteFile(file) {
    return {
        type: CARICAMENTODATI_DELETEFILE,
        file
    };
}

export function fetchMeWorkflows() {
    return (dispatch, state) => {
        return axios({
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            url: state().localConfig?.georoma?.loaderMeWorkflows,
        })
            .then((response) => {
                dispatch(caricamentodatiParams({ workflows: response?.data }));
            }).catch((error) => {
                console.error("[STF]", error);
            });
    };
}

export function fetchDepartments() {
    return (dispatch, state) => {
        axios({
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            url: state().localConfig?.georoma?.loaderMeDepartments,
        })
            .then((response) => {
                dispatch(caricamentodatiParams({ departments: response?.data }));
            }).catch((error) => {
                console.error("[STF]", error);
            });
    };
}

export function fetchMeWorkspaces() {
    return (dispatch, state) => {
        axios({
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            url: state().localConfig?.georoma?.loaderMeWorkspaces,
        })
            .then((response) => {
                if (response?.data?.workspaces) {
                    dispatch(caricamentodatiParams({ workspaces: response?.data?.workspaces }));
                }
            }).catch((error) => {
                console.error("[STF]", error);
            });
    };
}

export function fetchAdminWorkspaces() {
    return (dispatch, state) => {
        axios({
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            url: state().localConfig?.georoma?.loaderAdminWorkspaces,
        })
            .then((response) => {
                if (response?.data) {
                    dispatch(caricamentodatiParams({ adminworkspaces: response?.data }));
                }
            }).catch((error) => {
                console.error("[STF]", error);
            });
    };
}

export function fetchWorkspaceAdministrators(workspace) {
    return (dispatch, state) => {
        axios({
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            url: state().localConfig?.georoma?.WorkspaceAdministrators?.replace("workspace_id", workspace),
        })
            .then((response) => {
                if (response?.data) {
                    dispatch(caricamentodatiParams({ adminworkspaces: response?.data }));
                }
            }).catch((error) => {
                console.error("[STF]", error);
            });
    };
}