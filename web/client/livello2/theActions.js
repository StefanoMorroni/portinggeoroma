export const LIVELLO2_TOGGLE = 'LIVELLO2:TOGGLE';

export function livello2Toggle(layer,feature) {
    return {
        type: LIVELLO2_TOGGLE,
        layer,
        feature
    };
}
