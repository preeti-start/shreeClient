import types from '../actions/types';

const initialState = {
    cartsList: undefined,
    cartDetails: { isLoading: false },
    totalCartItemsCount: 0,
    cartItemIds: {},
};

export default ((state = initialState, actions = {}) => {
    switch (actions.type) {
        case types.cart.GET_CARTS_LIST: {
            const { data } = actions.payload;
            return { ...state, cartsList: data };
        }
        case types.cart.DELETE_CART_FROM_LIST: {
            const { cartId } = actions.payload;
            return {
                ...state,
                cartsList: state.cartsList.filter(cartData => cartData._id !== cartId)
            }
        }
        case types.cart.CLEAR_CART_DETAIL: {
            return { ...state, cartDetails: initialState.cartDetails };
        }
        case types.cart.GET_CART_DETAIL: {
            const { data } = actions.payload;
            return { ...state, cartDetails: { ...state.cartDetails, data } };
        }
        case types.cart.UPDATE_CART_ITEM_QUANTITY: {
            const { data } = actions.payload;
            return { ...state, cartDetails: { ...state.cartDetails, data } };
        }
        case types.cart.GET_CART_ITEMS_COUNT: {
            const { totalCartItemsCount, cartItemIds } = actions.payload;
            return { ...state, totalCartItemsCount, cartItemIds };
        }
        case types.user.LOGOUT_USER: {
            return initialState;
        }
        default: {
            return state;
        }
    }
})
