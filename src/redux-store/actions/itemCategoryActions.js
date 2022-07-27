import types from './types';
import { dbnames, notificationStatus } from '../../constants'
import { addToasts } from "./toastActions";
import { getErrorMessage } from "../../utils/functions";


export const getItemCategories = payload => {
    const { vendorId, authenticateUser = true, filter = {}, onSuccess, isMobile = false, userToken } = payload;
    const finalFilter = { ...filter };
    if (vendorId) {
        finalFilter["vendor_id._id"] = vendorId
    }
    return {
        type: types.itemCategories.GET_ITEM_CATEGORIES,
        fetchConfig: [{
            path: `/query?query={"collection":"${dbnames.ItemCategories}","filter":${JSON.stringify(finalFilter)},
            "fields":{"name":1,"vendor_id._id":1,"vendor_id.shop_name":1,"vendor_id.name":1}}&authenticateUser=${authenticateUser}&token=${userToken}`,
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
                    id: 'get_item_categories_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }

        },
    }
};
export const addItemCategory = payload => {
    const { vendorId, isMobile = false, onError, userToken, name, onSuccess } = payload;
    return {
        type: types.itemCategories.ADD_ITEM_CATEGORY,
        fetchConfig: [{
            path: `/insert?insert={"collection":"${dbnames.ItemCategories}","insert":{"name":"${name}","vendor_id":{"_id":"${vendorId}"}}}&token=${userToken}`,
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
                    id: 'add_item_category_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        },
    }
};
export const removeItemCategory = payload => ({
    type: types.itemCategories.REMOVE_ITEM_CATEGORY,
    payload,
});

export const updateItemCategory = payload => {
    const { userToken, recordId, isMobile = false, onError, updateJson, onSuccess } = payload;
    const updateObject = {
        "collection": dbnames.ItemCategories,
        "update": { "$set": updateJson },
        "filter": { "_id": recordId },
    };
    return {
        type: types.itemCategories.UPDATE_ITEM_CATEGORY,
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
            !isMobile && error && store.dispatch(addToasts({
                id: 'update_item_category_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));
        },
    }
};