import types from '../actions/types';

const initialState = {
    itemListData: { isLoading: false, data: undefined },
    itemDetails: undefined,
    relatedItemVersions: undefined,
    shopItemsListData: { isLoading: false, data: undefined },
};

export default ((state = initialState, actions = {}) => {
    switch (actions.type) {
        case types.items.UPDATE_ITEMS_LOADING_STATUS: {
            const { status } = actions.payload;
            return { ...state, itemListData: { ...state.itemListData, isLoading: status } }
        }
        case types.items.CLEAR_SHOP_ITEMS: {
            return { ...state, shopItemsListData: initialState.shopItemsListData }
        }
        case types.items.UPDATE_SHOP_ITEMS_LOADING_STATUS: {
            const { status } = actions.payload;
            return { ...state, shopItemsListData: { ...state.shopItemsListData, isLoading: status } }
        }
        case types.items.GET_ITEMS: {
            const { data, skipCount } = actions.payload;
            return {
                ...state,
                itemListData: {
                    data: skipCount !== 0 ? [...state.itemListData.data, ...data.data] : data.data,
                    pagination: { ...data.pagination, skipCount }
                }
            };
        }
        case types.items.UPDATE_ITEM_FEATURE_SELECTION: {
            const { activeItems, finalRelatedItemFeatures } = actions.payload;
            return {
                ...state,
                relatedItemVersions: {
                    ...state.relatedItemVersions,
                    features: finalRelatedItemFeatures,
                    activeItems,
                }
            }
        }
        case types.items.CLEAR_ITEM_DETAIL: {
            return {
                ...state,
                relatedItemVersions: initialState.relatedItemVersions,
                itemDetails: initialState.itemDetails
            }
        }
        case types.items.GET_ITEM_DETAIL: {
            const { data } = actions.payload;
            return { ...state, itemDetails: data }
        }
        case types.items.GET_RELATED_ITEM_FEATURES: {
            const { data } = actions.payload;
            return { ...state, relatedItemVersions: { ...data, allItemsList: [...data.activeItems] } }
        }
        case types.items.UPDATE_ITEMS_STATUS: {
            const { data, status } = actions.payload;
            return {
                ...state,
                itemListData: {
                    data: [...state.itemListData.data.map(itemVal => ({
                        ...itemVal,
                        is_active: (data.updatedItemsList.indexOf(itemVal._id) > -1) ? status : itemVal.is_active,
                    }))],
                    pagination: state.itemListData.pagination
                },
            }
        }
        case types.items.GET_SHOP_ITEMS: {
            const { data, skipCount } = actions.payload;
            return {
                ...state,
                shopItemsListData: {
                    data: skipCount !== 0 ? [...state.shopItemsListData.data, ...data.data] : data.data,
                    pagination: { ...data.pagination, skipCount }
                },
            };
        }
        case types.items.UPDATE_ITEM: {
            const { data } = actions.payload;
            return {
                ...state,
                itemListData: {
                    data: [...state.itemListData.data.map(itemVal => ((data && data._id && itemVal._id === data._id) ? data : itemVal))],
                    pagination: state.itemListData.pagination
                },
            };
        }
        case types.items.INSERT_NEW_ITEM: {
            const { data } = actions.payload;
            return {
                ...state,
                itemListData: {
                    pagination: state.itemListData && state.itemListData.pagination,
                    data: (state.itemListData && state.itemListData.data) ? [data, ...state.itemListData.data] : [data]
                },
            };
        }
        case types.items.REMOVE_ITEM: {
            const { itemIds } = actions.payload;
            return {
                ...state,
                itemListData: {
                    pagination: state.itemListData.pagination,
                    data: [...state.itemListData.data.filter(itemVal => itemIds.indexOf(itemVal._id) === -1)]
                }
            };
        }
        case types.user.LOGOUT_USER: {
            return initialState;
        }
        default: {
            return state;
        }
    }
})
