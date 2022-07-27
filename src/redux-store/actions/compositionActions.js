import get from "lodash/get";

import types from "./types";
import { dbnames, defaultPageCount, notificationStatus } from "../../constants";
import { getErrorMessage } from "../../utils/functions";
import { addToasts } from "./toastActions";
import appStringConstants from "../../constants/appStringConstants";

export const getCompositions = payload => {
    const finalQuery = {
        collection: dbnames.Compositions,
    };
    return {
        type: types.compositions.GET_COMPOSITIONS,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify(finalQuery)}&authenticateUser=false`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            const response = get(data, `0.response`);
            if (response) {
                actions.payload = { ...actions.payload, data: response };
                next(actions);
            }
        },
        onError: ({ error, store }) => {

        }
    }
};


export const getCompCartDetail = payload => {
    const { cartId, isMobile = false, userToken } = payload;
    const finalQuery = {
        "collection": dbnames.CompCart,
        filter: { "_id": cartId }
    };
    return {
        type: types.compositions.GET_COMP_CART_DETAIL,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify(finalQuery)}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (get(data, `0.response.0`)) {
                actions.payload = { ...actions.payload, data: data[0].response[0] };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'get_comp_carts_detail_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }

        },
    }
};

export const addCompToUserCart = payload => {
    const { buyerId, isMobile = false, total_comp_amount, onSuccess, userToken, composition } = payload;
    return {
        type: types.compositions.ADD_COMP_TO_CART,
        fetchConfig: [{
            path: `/add-comp-to-cart?compDetails=${JSON.stringify({
                buyer_id: buyerId,
                composition,
                total_comp_amount
            })}&token=${userToken}`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            onSuccess && onSuccess();
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


export const getCompCartsList = payload => {
    const { userToken, userId, isMobile = false } = payload;
    const finalQuery = {
        "collection": dbnames.CompCart,
    };
    if (userId) {
        finalQuery["filter"] = { "buyer_id._id": userId };
    }
    return {
        type: types.compositions.GET_COMP_CARTS_LIST,
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
                    id: 'get_comp_carts_list_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }

        },
    }
};

export const getCompositionDetails = payload => {
    const { onSuccess } = payload;
    const finalQuery = {
        collection: dbnames.Compositions,
        filter: {
            _id: payload._id
        }
    };
    return {
        type: types.compositions.GET_COMPOSITION_DETAILS,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify(finalQuery)}&authenticateUser=false`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            const response = get(data, `0.response.0`);
            if (response) {
                onSuccess && onSuccess({ data: response });
                actions.payload = { ...actions.payload, data: response };
                next(actions);
            }
        },
        onError: ({ error, store }) => {

        }
    }
};
