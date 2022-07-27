import types from './types';
import get from 'lodash/get';
import {
    dbnames,
    defaultPageCount,
    notificationStatus,
    completedOrderStatus,
    validAppRoutes
} from "../../constants";
import { addToasts } from "./toastActions";
import { getErrorMessage } from "../../utils/functions";
import { getCartItemsCount } from "./cartActions";


export const updateOrderDetails = payload => {

    const { orderId, isMobile = false, onSuccess, userToken, updateJson } = payload;
    return {
        type: types.orders.UPDATE_ORDER_DETAILS,
        payload,
        fetchConfig: [{
            path: `/update?update={"collection":"${dbnames.Orders}","filter":{"_id":"${orderId}"},"update":{"$set":${JSON.stringify(updateJson)}}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            if (data && data[0] && data[0].response && data[0].response[0]) {
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
                    id: 'update_order_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        },
    }
};


export const setOrderDetails = payload => ({
    type: types.orders.SET_ORDER_DETAILS,
    payload,
});

export const getOrderJson = payload => {
    const { cartDetails = {}, isMobile = false, onSuccess, userToken, toLocation = {} } = payload;
    return {
        type: types.orders.GET_ORDER_JSON,
        fetchConfig: [{
            path: `/get-order-json?cartDetails=${JSON.stringify(cartDetails)}&toLocation=${JSON.stringify(toLocation)}&token=${userToken}`,

        }],
        onSuccess: ({ data, next, store, actions }) => {
            if (data && data[0] && data[0].response) {
                if (!isMobile) {
                    actions.payload = { ...actions.payload, data: data[0].response };
                    next(actions);
                }
                onSuccess && onSuccess({ data: data[0].response });
            }
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'get_orders_json_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        }
    }
};
export const createOrder = payload => {
    const {
        orderJson, onSuccess, onShopNotOpen, excludeShopTimings = false, orderFrom, history,
        buyerId, onError, isMobile = false, cartId, userToken
    } = payload;
    // console.log("final ---- " + JSON.stringify({ orderJson, cartId, userToken }));
    return {
        type: types.orders.CREATE_ORDER,
        fetchConfig: [{
            path: `/place-order?cartId=${cartId}&date=${JSON.stringify(new Date().getTime())}&orderJson=${JSON.stringify(orderJson)}&excludeShopTimings=${excludeShopTimings}&token=${userToken}${orderFrom ? `&orderFrom=${orderFrom}` : ''}`,

        }],
        onSuccess: ({ data, next, store, actions }) => {
            if (!get(data, `0.response.isShopOpen`, true) && onShopNotOpen) {
                onShopNotOpen()
            } else {
                onSuccess && onSuccess();
                buyerId && userToken && store.dispatch(getCartItemsCount({ userToken, buyerId }));
                if (!isMobile) {
                    history && history.push(validAppRoutes.ordersList);
                    // store.dispatch(addToasts({
                    //     id: 'order_successfully_placed',
                    //     renderScene: OrderSuccessPopup,
                    // }));
                }
            }
        },
        onError: ({ error, store }) => {
            onError && onError();
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            }
        }
    }
};
export const getActiveOrdersList = payload => {
    const {
        userToken, onSuccess, onError, startDate, endDate, sort = {}, skipCount, isMobile = false, filter = {}, fields = {
            "vendor_id._id": 1,
            "vendor_id.name": 1,
            "vendor_id.phone_no": 1,
            "vendor_id.shop_name": 1,
            "buyer_id._id": 1,
            "buyer_id.name": 1,
            "buyer_id.phone_no": 1,
            "date": 1,
            "from_location": 1,
            "to_location": 1,
            "status": 1,
            "delivery_amount": 1,
            "order_type": 1,
            "order_number": 1,
            "total_items_amount": 1,
            "total_amount": 1,
            "items": 1,
        }
    } = payload;
    const finalQuery = {
        fields,
        collection: dbnames.Orders,
        limit: defaultPageCount,
        sort,
        skip: skipCount,
    };
    finalQuery["filter"] = { "status": { "$nin": [...completedOrderStatus] }, ...filter };

    return dispatch => {
        dispatch(updateActiveOrdersLoadingStatus({ status: true }));
        dispatch({
            type: types.orders.GET_ACTIVE_ORDERS_LIST,
            fetchConfig: [{
                path: `/query?query=${JSON.stringify(finalQuery)}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}&paginated=true&token=${userToken}`,
            }],
            onSuccess: ({ data, store, next, actions }) => {
                onSuccess && onSuccess();
                dispatch(updateActiveOrdersLoadingStatus({ status: false }));
                if (data && data[0] && data[0].response) {
                    actions.payload = { ...actions.payload, skipCount, data: data[0].response };
                    next(actions);
                }
            },
            onError: ({ error, store }) => {
                onError && onError();
                dispatch(updateActiveOrdersLoadingStatus({ status: false }));
                const errMsg = getErrorMessage(error);
                if (isMobile) {
                    alert(errMsg)
                } else {
                    error && store.dispatch(addToasts({
                        id: 'get_active_orders_list_error',
                        status: notificationStatus['2'],
                        toast_text: errMsg,
                    }));
                }
            },
        })
    }
};

export const updateActiveOrdersLoadingStatus = payload => {
    return { type: types.orders.UPDATE_ACTIVE_ORDERS_LOADING_STATUS, payload }
};

export const updateOrderHistoryLoadingStatus = payload => {
    return { type: types.orders.UPDATE_ORDER_HISTORY_LOADING_STATUS, payload }
};

export const getOrderHistoryList = payload => {
    const {
        skipCount, startDate, onSuccess, onError, endDate, isMobile = false,
        userToken, sort = {}, filter = {}, fields = {
            "buyer_id._id": 1,
            "vendor_id._id": 1,
            "vendor_id.phone_no": 1,
            "vendor_id.name": 1,
            "vendor_id.shop_name": 1,
            "buyer_id.name": 1,
            "buyer_id.phone_no": 1,
            "date": 1,
            "to_location": 1,
            "order_type": 1,
            "order_number": 1,
            "status": 1,
            "delivery_amount": 1,
            "total_items_amount": 1,
            "total_amount": 1,
            "items": 1,
        }
    } = payload;
    const finalQuery = {
        fields,
        sort,
        limit: defaultPageCount,
        skip: skipCount,
        collection: dbnames.Orders,
    };
    finalQuery["filter"] = { "status": { "$in": [...completedOrderStatus] }, ...filter };
    return dispatch => {
        dispatch(updateOrderHistoryLoadingStatus({ status: true }));
        dispatch({
            type: types.orders.GET_ORDER_HISTORY_LIST,
            fetchConfig: [{
                path: `/query?query=${JSON.stringify(finalQuery)}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}&paginated=true&token=${userToken}`,
            }],
            onSuccess: ({ data, store, next, actions }) => {
                onSuccess && onSuccess();
                dispatch(updateOrderHistoryLoadingStatus({ status: false }));
                if (data && data[0] && data[0].response) {
                    actions.payload = { skipCount, ...actions.payload, data: data[0].response };
                    next(actions);
                }
            },
            onError: ({ error, store }) => {
                onError && onError();
                dispatch(updateOrderHistoryLoadingStatus({ status: false }));
                const errMsg = getErrorMessage(error);
                if (isMobile) {
                    alert(errMsg)
                } else {
                    error && store.dispatch(addToasts({
                        id: 'get_order_history_list_error',
                        status: notificationStatus['2'],
                        toast_text: errMsg,
                    }));
                }
            },
        })
    }
};