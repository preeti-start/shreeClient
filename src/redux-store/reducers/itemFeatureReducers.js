import types from '../actions/types';

const initialState = {
    ItemFeaturesList:undefined,
};

export default ((state = initialState, actions = {}) => {
    switch (actions.type) {
        case types.itemFeatures.GET_ITEM_FEATURES: {
            const { data } = actions.payload;
            return {
                ...state,
                ItemFeaturesList: data,
            };
        }
        case types.itemFeatures.ADD_ITEM_FEATURES: {
            const { data } = actions.payload;
            return {
                ...state,
                ItemFeaturesList: state.ItemFeaturesList ? [...state.ItemFeaturesList, data] : [data]
            };
        }
        case types.itemFeatures.UPDATE_ITEM_FEATURES: {
            const { data } = actions.payload;
            return {
                ...state,
                ItemFeaturesList: state.ItemFeaturesList.map(itemVal => ((data && data._id && itemVal._id === data._id) ? data : itemVal))
            };
        }
        case types.itemFeatures.REMOVE_ITEM_FEATURES: {
            const { itemIds } = actions.payload;
            return {
                ...state,
                ItemFeaturesList: [...state.ItemFeaturesList.filter(itemVal => itemIds.indexOf(itemVal._id) === -1)]
            };
        }
        case types.user.LOGOUT_USER: {
            return initialState;
        }
        default:
            return state;
    }
})