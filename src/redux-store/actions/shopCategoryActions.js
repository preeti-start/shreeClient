import types from './types';
import { dbnames, notificationStatus } from '../../constants'
import { addToasts } from "./toastActions";
import { getErrorMessage, isNewFile } from "../../utils/functions";


export const getShopCategories = payload => {
    const { userToken, isMobile = false, authenticateUser = true } = payload;
    return {
        type: types.shopCategories.GET_SHOP_CATEGORIES,
        fetchConfig: [{
            path: `/query?query={"collection":"${dbnames.ShopCategories}"}&token=${userToken}&authenticateUser=${authenticateUser}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            actions.payload = { ...actions.payload, data: data[0].response };
            next(actions);
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'get_shop_categories_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        },
    }
};
export const addShopCategory = payload => {
    const { userToken, img, name, description, isMobile = false, onError, onSuccess } = payload;
    const awsUploadConfig = img ? [img] : undefined;
    const insertJson = { name, description };
    return {
        type: types.shopCategories.ADD_SHOP_CATEGORY,
        fetchConfig: [{
            path: `/insert?insert={"collection":"${dbnames.ShopCategories}","insert":${JSON.stringify(insertJson)}}&token=${userToken}`,
        }],
        awsUploadConfig,
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            if (data && data[0] && data[0].response) {
                if (img) {
                    img.url = data[1].url;
                    payload.hasOwnProperty("img") && store.dispatch(updateShopCategoryImg({
                        categoryId: data[0].response._id,
                        img: img ? { url: img.url, name: img.name } : null,
                        userToken,
                    }));
                }
                actions.payload = { ...actions.payload, data: { ...data[0].response, img } };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            onError && onError();
            if (!isMobile) {
                error && store.dispatch(addToasts({
                    id: 'add_shop_category_error',
                    status: notificationStatus['2'],
                    toast_text: getErrorMessage(error),
                }));
            }
        },
    }
};
export const removeShopCategory = payload => {
    const { userToken, recordId, isMobile = false, onError, onSuccess } = payload;
    return {
        type: types.shopCategories.REMOVE_SHOP_CATEGORY,
        fetchConfig: [{
            path: `/delete?query={"collection":"${dbnames.ShopCategories}","filter":{"_id":"${recordId}"}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            actions.payload = { ...actions.payload, recordId };
            next(actions);
        },
        onError: ({ error, store }) => {
            onError && onError();
            if (!isMobile) {
                error && store.dispatch(addToasts({
                    id: 'remove_shop_category_error',
                    status: notificationStatus['2'],
                    toast_text: getErrorMessage(error),
                }));
            }
        },
    }
};

export const updateShopCategoryImg = payload => {
    const { categoryId, img = null, userToken } = payload;
    return {
        type: types.shopCategories.UPDATE_SHOP_CATEGORY_IMG,
        payload,
        fetchConfig: [{
            path: `/update?update={"collection":"${dbnames.ShopCategories}","filter":{"_id":"${categoryId}"},"update":{"$set":${JSON.stringify({ img })}}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
        },
        onError: ({ error, store }) => {
            error && store.dispatch(addToasts({
                id: 'update_shop_category_img_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        },
    }
};

export const updateShopCategory = payload => {
    const { userToken, recordId, img, isMobile = false, onError, updateJson, onSuccess } = payload;
    const updateObject = {
        "collection": dbnames.ShopCategories,
        "update": { "$set": updateJson },
        "filter": { "_id": recordId },
    };
    const awsUploadConfig = [];
    if (img && isNewFile(img)) {
        awsUploadConfig.push(img)
    }
    return {
        type: types.shopCategories.UPDATE_SHOP_CATEGORY,
        fetchConfig: [{
            path: `/update?update=${JSON.stringify(updateObject)}&token=${userToken}`,
        }],
        awsUploadConfig,
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            if (img && isNewFile(img)) {
                img.url = data[1].url;
            }
            // this update should be done each time as in case of del no img upload will be their but still category_img should be blank
            payload.hasOwnProperty("img") && store.dispatch(updateShopCategoryImg({
                categoryId: recordId,
                img: img ? { url: img.url, name: img.name } : null,
                userToken,
            }));
            if (data && data[0] && data[0].response && data[0].response[0]) {
                actions.payload = {
                    ...actions.payload,
                    data: { ...data[0].response[0], img }
                };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            onError && onError();
            if (!isMobile) {
                error && store.dispatch(addToasts({
                    id: 'update_shop_category_error',
                    status: notificationStatus['2'],
                    toast_text: getErrorMessage(error),
                }));
            }
        },
    }
};