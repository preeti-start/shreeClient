import types from './types';
import { getErrorMessage } from '../../utils/functions'
import {
    notificationStatus, dbnames, defaultPageCount,
} from '../../constants'
import { addToasts } from "./toastActions";


export const updateShopsLoadingStatus = payload => {
    return {
        type: types.shop.UPDATE_SHOPS_LOADING_STATUS,
        payload
    }
};

export const clearShopsList = payload => {
    return {
        type: types.shop.CLEAR_SHOPS_LIST,
        payload
    }
};

export const getShopsList = payload => {
    const { userToken, skipCount, onSuccess, onError, isMobile = false, filters, sortByDistance, lat, lng, sortByShopName } = payload;
    let path = `/get-shops-list?token=${userToken}`;
    if (sortByDistance) path += `&sortByDistance=${sortByDistance}`;
    if (lng) path += `&lng=${lng}`;
    if (lat) path += `&lat=${lat}`;
    if (sortByShopName) path += `&sortByShopName=${sortByShopName}`;
    if (filters) path += `&filters=${JSON.stringify(filters)}`;
    path += `&skip=${skipCount}&limit=${defaultPageCount}`;
    return dispatch => {
        dispatch(updateShopsLoadingStatus({ status: true }));
        dispatch({
            type: types.shop.GET_SHOPS_LIST,
            payload,
            fetchConfig: [{
                path,
            }],
            onSuccess: ({ data, store, next, actions }) => {
                onSuccess && onSuccess();
                dispatch(updateShopsLoadingStatus({ status: false }));
                if (data && data.length > 0 && data[0].response) {
                    actions.payload = { ...actions.payload, skipCount, data: data[0].response };
                    next(actions);
                }
            },
            onError: ({ error, store }) => {
                onError && onError();
                dispatch(updateShopsLoadingStatus({ status: false }));
                const errMsg = getErrorMessage(error);
                if (isMobile) {
                    alert(errMsg)
                } else {
                    error && store.dispatch(addToasts({
                        id: 'get_shops_list_error',
                        status: notificationStatus['2'],
                        toast_text: errMsg,
                    }));
                }
            },
        })
    }

};


export const getShopName = payload => {
    const { shopId } = payload;
    return {
        type: types.shop.GET_SHOPS_NAME,
        payload,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify({
                "collection": dbnames.Vendors,
                "filter": { "_id": shopId },
                "fields": { "shop_name": 1 }
            })}&authenticateUser=false`
        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (data && data.length > 0 && data[0].response && data[0].response[0]) {
                actions.payload = { ...actions.payload, shopName: data[0].response[0].shop_name };
                next(actions);
            }
        },
        onError: ({ error, store }) => {

        },
    }
};

