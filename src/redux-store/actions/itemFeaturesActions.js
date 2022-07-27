import types from './types';
import { dbnames, notificationStatus } from '../../constants'
import { addToasts } from "./toastActions";
import { getErrorMessage } from "../../utils/functions";


export const getItemFeatures = payload => {
    const { vendorId, isMobile = false, onSuccess, userToken } = payload;
    const finalFilter = {};
    if (vendorId) {
        finalFilter["vendor_id._id"] = vendorId
    }
    return {
        type: types.itemFeatures.GET_ITEM_FEATURES,
        fetchConfig: [{
            path: `/query?query={"collection":"${dbnames.ItemFeatures}","filter":
            ${JSON.stringify(finalFilter)},"fields":{"name":1,"item_category_id":1,"is_sale_based":1,"options":1,"vendor_id._id":1,"vendor_id.name":
            1}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            const finalRes = data[0].response;
            onSuccess && onSuccess({ data: finalRes });
            actions.payload = { ...actions.payload, data: finalRes };
            next(actions);
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'get_item_features_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }

        },
    }
};
export const addItemFeature = payload => {
    const { vendorId, isMobile = false, onError, userToken, options, is_sale_based, name, onSuccess } = payload;
    const insertJson = {
        "collection": dbnames.ItemFeatures,
        "insert": {
            name,
            is_sale_based,
            options,
            vendor_id: { _id: vendorId }
        }
    };
    return {
        type: types.itemFeatures.ADD_ITEM_FEATURES,
        fetchConfig: [{
            path: `/insert?insert=${JSON.stringify(insertJson)}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            actions.payload = { ...actions.payload, data: data[0].response };
            next(actions);
        },
        onError: ({ error, store }) => {
            onError && onError();
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'add_item_feature_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        },
    }
};
export const removeItemFeature = payload => ({
    type: types.itemFeatures.REMOVE_ITEM_FEATURES,
    payload,
});

export const updateItemFeature = payload => {
    const { userToken, recordId, onError, updateJson, onSuccess } = payload;
    const updateObject = {
        "collection": dbnames.ItemFeatures,
        "update": { "$set": updateJson },
        "filter": { "_id": recordId },
    };
    return {
        type: types.itemFeatures.UPDATE_ITEM_FEATURES,
        fetchConfig: [{
            path: `/update?update=${JSON.stringify(updateObject)}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            if (data && data[0] && data[0].response && data[0].response[0]) {
                actions.payload = {
                    ...actions.payload,
                    data: { ...data[0].response[0] }
                };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            onError && onError();
            error && store.dispatch(addToasts({
                id: 'update_item_feature_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));
        },
    }
};