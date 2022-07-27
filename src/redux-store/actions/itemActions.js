import intersection from "lodash/intersection";

import types from './types';
import { dbnames, notificationStatus, itemsRequiredList, defaultPageCount } from '../../constants'
import { addToasts } from "./toastActions";
import { getErrorMessage, isNewFile } from "../../utils/functions";

export const updateItemDetails = payload => {

    const { itemId, itemImages = [], isMobile = false, onSuccess, userToken, updateJson } = payload;

    const newFilesArray = [];
    if (itemImages && itemImages.length > 0) {
        for (const imgCount in itemImages) {
            if (itemImages.hasOwnProperty(imgCount) && isNewFile(itemImages[imgCount])) {
                newFilesArray.push(itemImages[imgCount]);
            }
        }
    }
    const finalUpdateJson = {
        "collection": dbnames.Items,
        "filter": { "_id": itemId },
        "update": { "$set": updateJson },
        "fields": itemsRequiredList,
    };
    return {
        type: types.items.UPDATE_ITEM,
        payload,
        fetchConfig: [{
            path: `/update?update=${JSON.stringify(finalUpdateJson)}&token=${userToken}`,
        }],
        awsUploadConfig: newFilesArray && newFilesArray.length > 0 ? newFilesArray : undefined,
        onSuccess: ({ data, store, next, actions }) => {

            onSuccess && onSuccess();

            if (data && data[0] && data[0].response && data[0].response[0]) {
                actions.payload = {
                    ...actions.payload,
                    data: { ...data[0].response[0], item_images: [...itemImages] }
                };
                next(actions);
            }
            store.dispatch(updateItemImages({
                itemId,
                itemImages,
                imgPresignedUrls: data && data.length > 1 && data.slice(1, data.length),
                userToken,
            }));
        },
        onError: ({ error, store }) => {

            !isMobile && error && store.dispatch(addToasts({
                id: 'update_item_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        },
    }
};


export const uploadItemsInBulk = payload => {
    const {
        data, userToken, isMobile = false, vendorId, onSuccess
    } = payload;

    return {
        type: types.items.UPLOAD_ITEMS_IN_BULK,
        imgUploadToNodeServerConfig: {
            data,
            path: `/bulkUploadItems?vendor_id=${vendorId}&token=${userToken}`,
            downloadResponseFile: true,
        },
        onSuccess: ({ data, store }) => {
            onSuccess && onSuccess();
        },
        onError: ({ error, store }) => {
            !isMobile && error && store.dispatch(addToasts({
                id: 'items_uploading',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));
        },

    }
};

export const uploadItemSampleFile = payload => {

    return {
        type: types.items.UPLOAD_ITEMS_IN_BULK,
        imgUploadToNodeServerConfig: {
            path: `/itemUploadSample?vendor_id=${payload.vendor_id}`,
            downloadResponseFile: true,
        },
        onSuccess: ({ data, store }) => {
        },
        onError: ({ error, store }) => {
        },
    }
};

export const removeItem = payload => ({
    payload,
    type: types.items.REMOVE_ITEM,
});

export const updateItemsStatus = payload => {
    const { selectedItemIds, onSuccess, isMobile = false, status, userToken } = payload;
    return {
        type: types.items.UPDATE_ITEMS_STATUS,
        fetchConfig: [{
            path: `/update-items-status?item_ids=${JSON.stringify(selectedItemIds)}&isActive=${JSON.stringify(status)}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            actions.payload = { ...actions.payload, status, data: data[0].response };
            next(actions);
        },
        onError: ({ error, store }) => {
            !isMobile && error && store.dispatch(addToasts({
                id: 'items_status_update_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));
        },
    }
};

export const updateItemsLoadingStatus = payload => {
    return {
        type: types.items.UPDATE_ITEMS_LOADING_STATUS,
        payload
    }
};
export const clearShopItems = payload => {
    return {
        type: types.items.CLEAR_SHOP_ITEMS,
        payload
    }
};

export const updateShopItemsLoadingStatus = payload => {
    return {
        type: types.items.UPDATE_SHOP_ITEMS_LOADING_STATUS,
        payload
    }
};

export const getItems = payload => {
    const {
        userToken, filters = {}, sortBy = {},
        onError, onSuccess, isMobile = false, userId, skipCount
    } = payload;
    const finalQuery = {
        collection: dbnames.Items,
        fields: itemsRequiredList,
        limit: defaultPageCount,
        skip: skipCount,
    };
    finalQuery.filter = {};
    if (userId) {
        finalQuery.filter = { "vendor_id._id": userId };
    }
    if (filters) {
        finalQuery.filter = { ...finalQuery.filter, ...filters }
    }
    finalQuery.sort = sortBy;
    return dispatch => {
        dispatch(updateItemsLoadingStatus({ status: true }));
        dispatch({
            type: types.items.GET_ITEMS,
            fetchConfig: [{
                path: `/query?query=${JSON.stringify(finalQuery)}&paginated=true&token=${userToken}`,
            }],
            onSuccess: ({ data, store, next, actions }) => {
                onSuccess && onSuccess();
                store.dispatch(updateItemsLoadingStatus({ status: false }));
                actions.payload = { skipCount, ...actions.payload, data: data[0].response };
                next(actions);
            },
            onError: ({ error, store }) => {
                onError && onError();
                store.dispatch(updateItemsLoadingStatus({ status: false }));
                const errMsg = getErrorMessage(error);
                if (isMobile) {
                    alert(errMsg)
                } else {
                    error && store.dispatch(addToasts({
                        id: 'get_items_error',
                        status: notificationStatus['2'],
                        toast_text: errMsg,
                    }));
                }
            },
        })
    };

};


export const getShopItems = payload => {
    const { sort = {}, isMobile = false, onSuccess, onError, filter = {}, shopId, skipCount } = payload;
    const finalQuery = {
        collection: dbnames.Items,
        limit: defaultPageCount,
        skip: skipCount,
        fields: {
            "name": 1,
            "set_count": 1,
            "discount": 1,
            "is_active": 1,
            "item_code": 1,
            "vendor_id._id": 1,
            "category_id.name": 1,
            "category_id._id": 1,
            "measuring_unit_id._id": 1,
            "measuring_unit_id.short_name": 1,
            "per_item_price": 1,
            "maintain_stock": 1,
            "allow_negative_stock": 1,
            "quantity": 1,
            "item_images": 1
        },
        filter: { ...filter, "vendor_id._id": shopId, "is_active": true },
        sort,
    };
    return dispatch => {
        dispatch(updateShopItemsLoadingStatus({ status: true }));
        dispatch({
            type: types.items.GET_SHOP_ITEMS,
            fetchConfig: [{
                path: `/query?query=${JSON.stringify(finalQuery)}&paginated=true&authenticateUser=false`,
            }],
            onSuccess: ({ data, store, next, actions }) => {
                onSuccess && onSuccess();
                dispatch(updateShopItemsLoadingStatus({ status: false }));
                actions.payload = { skipCount, ...actions.payload, data: data[0].response };
                next(actions);
            },
            onError: ({ error, store }) => {
                onError && onError();
                dispatch(updateShopItemsLoadingStatus({ status: false }));
                const errMsg = getErrorMessage(error);
                if (isMobile) {
                    alert(errMsg)
                } else {
                    error && store.dispatch(addToasts({
                        id: 'get_shop_items_error',
                        status: notificationStatus['2'],
                        toast_text: errMsg,
                    }));
                }
            },
        })
    }

};

export const updateItemImages = payload => {
    const { itemId, imgPresignedUrls = [], isMobile = false, itemImages = [], userToken } = payload;

    const fileNewUrlsJson = {};
    for (let newFileCount = 0; newFileCount < imgPresignedUrls.length; newFileCount++) {
        fileNewUrlsJson[imgPresignedUrls[newFileCount].name] = imgPresignedUrls[newFileCount];
    }

    if (itemImages && itemImages.length > 0) {
        for (const itemImgCount in itemImages) {
            if (itemImages.hasOwnProperty(itemImgCount) && itemImages[itemImgCount].name && fileNewUrlsJson.hasOwnProperty(itemImages[itemImgCount].name) && fileNewUrlsJson[itemImages[itemImgCount].name].url) {
                itemImages[itemImgCount].url = fileNewUrlsJson[itemImages[itemImgCount].name].url;
            }
        }
    }
    return {
        type: types.items.UPDATE_ITEM_IMAGES,
        payload,
        fetchConfig: [{
            path: `/update?update={"collection":"${dbnames.Items}","filter":{"_id":"${itemId}"},"update":{"$set":${JSON.stringify({
                'item_images': itemImages && itemImages.map(fileData => ({
                    url: fileData.url,
                    name: fileData.name
                }))
            })}}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
        },
        onError: ({ error, store }) => {
            !isMobile && error && store.dispatch(addToasts({
                id: 'update_item_images_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));
        },
    }
};

export const clearItemDetail = payload => ({ type: types.items.CLEAR_ITEM_DETAIL, payload });

export const getItemDetail = payload => {
    const { itemId, isMobile = false, onSuccess } = payload;
    return {
        type: types.items.GET_ITEM_DETAIL,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify({
                collection: dbnames.Items,
                filter: { "_id": itemId },
                fields: {
                    name: 1,
                    discount: 1,
                    set_count: 1,
                    description: 1,
                    category_id: 1,
                    "item_features.feature_id.is_sale_based": 1,
                    "item_features.feature_id._id": 1,
                    "item_features.feature_id.name": 1,
                    "item_features.options": 1,
                    item_images: 1,
                    vendor_id: 1,
                    measuring_unit_id: 1,
                    per_item_price: 1
                }
            })}&authenticateUser=false`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            if (data && data.length > 0 && data[0].response && data[0].response.length > 0) {
                const details = data[0].response[0];
                onSuccess && onSuccess({ data: details });
                actions.payload = { ...actions.payload, data: details };
                next(actions);
            }
        },
        onError: ({ error }) => {
            isMobile && alert(getErrorMessage(error))
        }
    }
};

export const getRelatedItemFeatures = payload => {
    const { isMobile = false, itemId } = payload;
    return {
        type: types.items.GET_RELATED_ITEM_FEATURES,
        fetchConfig: [{
            path: `/related-item-features?itemId="${itemId}"&authenticateUser=false`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            if (data && data[0].response) {
                actions.payload = { ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error }) => {
            isMobile && alert(getErrorMessage(error));
        }
    }
};

export const updateItemFeatureSelection = payload => dispatch => {

    // const demo = {
    //     activeItems: [],
    //     features: {
    //         [feature_id]: {
    //             feature: {
    //                 _id: "",
    //                 name: ""
    //             },
    //             options: {
    //                 [opt_name]:{
    //                     name: '',
    //                     isSelected: true/false,
    //                     relatedItemIds: [],
    //                 }
    //             }
    //         }
    //     }
    // };

    const { relatedItemVersions, featureId, option, isMobile = false } = payload;
    const finalRelatedItemFeatures = relatedItemVersions && relatedItemVersions.features ? { ...relatedItemVersions.features } : {};

    // .. this is logic to select / unselect item options
    if (finalRelatedItemFeatures[featureId] && finalRelatedItemFeatures[featureId].options && finalRelatedItemFeatures[featureId].options[option]) {

        finalRelatedItemFeatures[featureId].options[option] = {
            ...finalRelatedItemFeatures[featureId].options[option],
            isSelected: !finalRelatedItemFeatures[featureId].options[option].isSelected
        };

        // logic to unselect if any other option is in selected form
        if (finalRelatedItemFeatures[featureId].options[option].isSelected === true) {
            for (const optKey in finalRelatedItemFeatures[featureId].options) {
                if (optKey !== option) {
                    finalRelatedItemFeatures[featureId].options[optKey] = {
                        ...finalRelatedItemFeatures[featureId].options[optKey],
                        isSelected: false
                    }
                }
            }
        }
    }

    const finalSelectedArrayItems = [];
    let gotSingleSelectedOption = false;

    // .. this is logic to get array of items for all active options
    for (const featureKey in finalRelatedItemFeatures) {
        if (finalRelatedItemFeatures[featureKey].options && Object.keys(finalRelatedItemFeatures[featureKey].options).length > 0) {
            let gotSelectedOption = false;
            for (const optKey in finalRelatedItemFeatures[featureKey].options) {
                if (!gotSelectedOption && finalRelatedItemFeatures[featureKey].options[optKey].isSelected) {
                    gotSelectedOption = true;
                    gotSingleSelectedOption = true;
                    finalSelectedArrayItems.push(finalRelatedItemFeatures[featureKey].options[optKey].relatedItemIds);
                }
            }
        }
    }
    const activeItems = gotSingleSelectedOption ? intersection(...finalSelectedArrayItems) : relatedItemVersions.allItemsList;
    dispatch(getItemDetail({ itemId: activeItems[0], isMobile }));
    dispatch({
        type: types.items.UPDATE_ITEM_FEATURE_SELECTION,
        payload: { ...payload, activeItems, finalRelatedItemFeatures }
    })
};


export const insertNewItem = payload => {
    const { userToken, isMobile = false, onSuccess, itemImages = [], finalInsertJson } = payload;
    return {
        type: types.items.INSERT_NEW_ITEM,
        fetchConfig: [{
            path: `/insert?insert=${JSON.stringify({
                "collection": dbnames.Items,
                "fields": itemsRequiredList,
                "insert": finalInsertJson
            })}&token=${userToken}`,
        }],
        awsUploadConfig: itemImages && itemImages.length > 0 ? itemImages : undefined,
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            if (data && data.length > 0) {
                actions.payload = { ...actions.payload, data: { ...data[0].response, item_images: [...itemImages] } };
                next(actions);
            }
            if (data && data[0].response && data[0].response._id && itemImages && itemImages.length > 0) {
                store.dispatch(updateItemImages({
                    itemId: data[0].response._id,
                    imgPresignedUrls: data.slice(1, data.length),
                    itemImages,
                    userToken,
                }))
            }
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'insert_item_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        },
    }
};

