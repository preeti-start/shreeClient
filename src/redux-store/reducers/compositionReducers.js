import types from '../actions/types';

const initialState = {
    compositions: [],
    compCartsList: undefined,
    composition: undefined,
    compCartDetails: { isLoading: false },
};

export default ((state = initialState, actions = {}) => {
    switch (actions.type) {
        case types.compositions.GET_COMPOSITIONS: {
            const { data } = actions.payload;
            return { ...state, compositions: data };
        }
        case types.compositions.GET_COMP_CARTS_LIST: {
            const { data } = actions.payload;
            return { ...state, compCartsList: data };
        }
        case types.compositions.GET_COMP_CART_DETAIL: {
            const { data } = actions.payload;
            return { ...state, compCartDetails: { ...state.compCartDetails, data } };
        }
        case types.compositions.GET_COMPOSITION_DETAILS: {
            const { data } = actions.payload;
            return { ...state, composition: data };
        }
        default: {
            return state;
        }
    }
})
