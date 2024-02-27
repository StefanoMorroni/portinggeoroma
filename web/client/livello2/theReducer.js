import {
    LIVELLO2_TOGGLE
} from './theActions';

const defaultState = {
    enabled: false,
    layer: {},
    feature: {}
};

const theReducer = (state = defaultState, action) => {
    const { type, ...other } = action;
    switch (action.type) {
        case LIVELLO2_TOGGLE:
            //return state.enabled ? { ...state, ...defaultState } : { ...state, ...other, enabled: true };
            return { ...state, ...other, enabled: !state.enabled };
        default:
            return state;
    }
}

export default theReducer;