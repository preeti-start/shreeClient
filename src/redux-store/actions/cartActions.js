import types from './types';
import { dbnames, notificationStatus, validAppRoutes } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import { addToasts } from "./toastActions";
import { getErrorMessage } from "../../utils/functions";

export const getCartsList = payload => {
    const { userToken, userId, isMobile = false } = payload;
    const finalQuery = {
        "collection": dbnames.ItemsCart,
        "fields": {
            "vendor_id._id": 1,
            "total_items_amount": 1,
            "delivery_amount": 1,
            "items.item_id.measuring_unit_id": 1,
            "vendor_id.name": 1,
            "vendor_id.is_home_delivery_active": 1,
            "vendor_id.shop_name": 1,
            "buyer_id._id": 1,
            "items.features": 1,
            "items.quantity": 1,
            "buyer_id.name": 1
        }
    };
    if (userId) {
        finalQuery["filter"] = { "buyer_id._id": userId };
    }
    return {
        type: types.cart.GET_CARTS_LIST,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify(finalQuery)}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (data && data[0] && data[0].response) {
                actions.payload = { ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'get_carts_list_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }

        },
    }
};

export const getCartDetail = payload => {
    const { cartId, onSuccess, isMobile = false, userToken } = payload;
    return dispatch => {
        dispatch({
            type: types.cart.GET_CART_DETAIL,
            fetchConfig: [{
                path: `/get-cart-details?cartId="${cartId}"&token=${userToken}`,
            }],
            onSuccess: ({ data, next, store, actions }) => {
                if (data && data.length > 0 && data[0].response) {
                    actions.payload = { ...actions.payload, data: data[0].response[0] };
                    next(actions);
                    onSuccess && onSuccess();
                }
            },
            onError: ({ error, store }) => {
                const errMsg = getErrorMessage(error);
                if (isMobile) {
                    alert(errMsg)
                } else {
                    error && store.dispatch(addToasts({
                        id: 'get_cart_details_error',
                        status: notificationStatus['2'],
                        toast_text: errMsg,
                    }));
                }
            }
        })
    }
};

export const updateCartItemQuantity = payload => {
    const { cartId, navigation, history, onSuccess, buyerId, isMobile = false, itemId, incBy, itemIndex, userToken } = payload;
    return {
        type: types.cart.UPDATE_CART_ITEM_QUANTITY,
        fetchConfig: [{
            path: `/update-cart-item-quantity?cartDetails=${JSON.stringify({
                itemId,
                cartId,
                incBy,
                itemIndex
            })}&token=${userToken}`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            onSuccess && onSuccess();
            buyerId && userToken && store.dispatch(getCartItemsCount({
                buyerId,
                userToken
            }));
            if (data && data[0] && data[0].response) {
                actions.payload = { ...actions.payload, data: data[0].response };
                next(actions);
            } else {
                // undefined response will be the case when cart itself will be deleted due to zero item's left
                if (isMobile) {
                    store.dispatch(delCartFromList({ cartId }));
                    navigation && navigation.goBack();
                } else {
                    history && history.replace(validAppRoutes.itemCartList);
                }
            }
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'update_cart_item_quantity_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }

        }
    }
};
export const delCartFromList = payload => {
    return {
        type: types.cart.DELETE_CART_FROM_LIST,
        payload
    }
};
export const clearCartDetails = payload => {
    return {
        type: types.cart.CLEAR_CART_DETAIL,
        payload
    }
};
export const addItemToUserCart = payload => {
    const { buyerId, features, isMobile = false, vendorId, onSuccess, quantity, itemId, userToken } = payload;
    return {
        type: types.cart.ADD_ITEM_TO_CART,
        fetchConfig: [{
            path: `/add-item-to-cart?itemDetails=${JSON.stringify({
                "buyer_id": buyerId,
                features,
                "vendor_id": vendorId,
                "item_id": itemId,
                quantity
            })}&token=${userToken}`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            onSuccess && onSuccess();
            store.dispatch(getCartItemsCount({ userToken, buyerId }));
            if (!isMobile) {
                store.dispatch(addToasts({
                    id: 'add_cart_item_success',
                    status: notificationStatus['1'],
                    toast_text: appStringConstants.itemSuccessfullyAddedToCartSuccessAlter,
                }))
            }
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'add_item_to_cart_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        }
    }
};


export const getCartItemsCount = payload => {
    const { buyerId, userToken } = payload;
    return {
        type: types.cart.GET_CART_ITEMS_COUNT,
        fetchConfig: [{
            path: `/total-cart-items-count?buyerId=${buyerId}&token=${userToken}`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            if (data && data[0] && data[0].response) {
                actions.payload = {
                    ...actions.payload,
                    cartItemIds: data[0].response.cartItemIds,
                    totalCartItemsCount: data[0].response.totalCartItemsCount
                };
                next(actions);
            }
        },
        onError: ({ error, store }) => {

        }
    }
};

