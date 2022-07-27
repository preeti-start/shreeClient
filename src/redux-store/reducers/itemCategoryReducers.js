import types from '../actions/types';

const initialState = {
    itemCategoriesList: undefined,
};

export default ((state = initialState, actions = {}) => {
    switch (actions.type) {
        case types.itemCategories.GET_ITEM_CATEGORIES: {
            const { data } = actions.payload;
            return { ...state, itemCategoriesList: data };
        }
        case types.itemCategories.ADD_ITEM_CATEGORY: {
            const { data } = actions.payload;
            return {
                ...state,
                itemCategoriesList: state.itemCategoriesList ? [...state.itemCategoriesList, data] : [data]
            };
        }
        case types.itemCategories.UPDATE_ITEM_CATEGORY: {
            const { data } = actions.payload;
            return {
                ...state,
                itemCategoriesList: state.itemCategoriesList.map(itemVal => ( ( data && data._id && itemVal._id === data._id ) ? data : itemVal ))
            };
        }
        case types.itemCategories.REMOVE_ITEM_CATEGORY: {
            const { itemIds } = actions.payload;
            return {
                ...state,
                itemCategoriesList: [...state.itemCategoriesList.filter(itemVal => itemIds.indexOf(itemVal._id) === -1)]
            };
        }
        case types.user.LOGOUT_USER: {
            return initialState;
        }
        default:
            return state;
    }
})