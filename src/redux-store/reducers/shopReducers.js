import types from '../actions/types';

const initialState = {
    shopsListData: { isLoading: false },
};

export default ((state = initialState, actions = {}) => {
    switch (actions.type) {
        case types.shop.GET_SHOPS_LIST: {
            const { data, skipCount } = actions.payload;
            return {
                ...state,
                shopsListData: {
                    ...state.shopsListData,
                    data: skipCount !== 0 ? [...state.shopsListData.data, ...data.data] : data.data,
                    pagination: { ...data.pagination, skipCount }
                }
            };
        }
        case types.shop.CLEAR_SHOPS_LIST: {
            return { ...state, shopsListData: initialState.shopsListData }
        }
        case types.shop.UPDATE_SHOPS_LOADING_STATUS: {
            const { status } = actions.payload;
            return { ...state, shopsListData: { ...state.shopsListData, isLoading: status } }
        }
        case types.shop.GET_SHOPS_NAME: {
            const { shopName } = actions.payload;
            return { ...state, shopName };
        }

        case types.user.LOGOUT_USER: {
            return initialState;
        }
        default: {
            return state;
        }
    }
})