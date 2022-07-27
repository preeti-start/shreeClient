import types from '../actions/types';

const initialState = {
    shopCategoriesList: undefined,
};

export default ( (state = initialState, actions = {}) => {
    switch (actions.type) {
        case types.shopCategories.GET_SHOP_CATEGORIES: {
            const { data } = actions.payload;
            return { ...state, shopCategoriesList: data };
        }
        case types.shopCategories.ADD_SHOP_CATEGORY: {
            const { data } = actions.payload;
            return {
                ...state,
                shopCategoriesList: state.shopCategoriesList ? [...state.shopCategoriesList, data] : [data]
            };
        }
        case types.shopCategories.UPDATE_SHOP_CATEGORY: {
            const { data } = actions.payload;
            return {
                ...state,
                shopCategoriesList: state.shopCategoriesList.map(itemVal => ( ( data && data._id && itemVal._id === data._id ) ? data : itemVal ))
            };
        }
        case types.shopCategories.REMOVE_SHOP_CATEGORY: {
            const { recordId } = actions.payload;
            return {
                ...state,
                shopCategoriesList: [...state.shopCategoriesList.filter(shopCategoryVal => shopCategoryVal._id !== recordId)]
            };
        }
        case types.user.LOGOUT_USER: {
            return initialState;
        }
        default:
            return state;
    }
} )