import {
    CARICAMENTODATI_TOGGLE,
    CARICAMENTODATI_SPINNER,
    CARICAMENTODATI_PARAMS,
    CARICAMENTODATI_NEWFILE,
    CARICAMENTODATI_DELETEFILE
} from './theactions';

const defaultState = {
    enabled: false,
    spinner: false,
    viewDepartments: [],
    editDepartments: [],
    toUpload: [],
    workspaces: [],
    departments: [],
    workflows: [],
    panelNuovoLayer: false,
    panelElencoCaricamenti: false,
    type: 'shapefile',
    visibility: 'PUBLIC',
    workspace: '',
    title: '',
    panelAdministration: false,
    adminworkspace: '',
    adminworkspaces: []
};

const thereducer = (state = defaultState, action) => {
    const { type, ...other } = action;
    switch (action.type) {
        case CARICAMENTODATI_TOGGLE:
            return { ...state, enabled: !state.enabled };
        case CARICAMENTODATI_SPINNER:
            return { ...state, spinner: action.flag }
        case CARICAMENTODATI_PARAMS:
            return { ...state, ...action.params }
        case CARICAMENTODATI_NEWFILE:
            return { ...state, toUpload: [...state.toUpload.filter(x => x.name != action.file.name), action.file] }
        case CARICAMENTODATI_DELETEFILE:
            return { ...state, toUpload: [...state.toUpload.filter(x => x.name != action.file.name)] }
        default:
            return state;
    }
}

export default thereducer;