import get from 'lodash/get';

import types from './types';
import { getErrorMessage, logoutOnError, isNewFile } from '../../utils/functions'
import { setItemInPersistentStore, clearPersistentStore } from '../../utils/Persist'
import {
    notificationStatus,
    validAppRoutes,
    dbnames,
    userNotifications, defaultPageCount
} from '../../constants'
import { getCartItemsCount } from '../actions/cartActions'
import { addToasts } from "./toastActions";
import { appRoutes, roles } from "../../constants";
import mobileStringConstants from "../../constants/mobileStringConstants";

export const getPresignedUrl = payload => {
    const { contentType, onError, name, isMobile = false, onSuccess, userToken } = payload;

    return {
        type: types.user.GET_PRESIGNED_URL,
        payload,
        fetchConfig: [{
            path: `/presignedUrl?contentType=${contentType}&keyName=${name}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess({ presignedUrl: data[0].response, name });
        },
        onError: ({ error, store }) => {
            onError && onError();
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'get_presigned_url_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        }
    }
};


export const getHomeData = payload => {
    const { isMobile, coordinates = [], onError } = payload;
    return {
        type: types.user.GET_HOME_DATA,
        payload,
        fetchConfig: [{
            path: `/home-data${coordinates.length > 0 ? `?lng=${coordinates[0]}&lat=${coordinates[1]}` : ''}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (data && data.length > 0 && data[0].response) {
                actions.payload = { ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            onError && onError();
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'get_home_data_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        }
    }
};

export const getWebHomeData = payload => {
    const { coordinates = [] } = payload;
    return {
        type: types.user.GET_WEB_HOME_DATA,
        payload,
        fetchConfig: [{
            path: `/web-home-data${coordinates.length > 0 ? `?lng=${coordinates[0]}&lat=${coordinates[1]}` : ''}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (data && data.length > 0 && data[0].response) {
                actions.payload = { ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            error && store.dispatch(addToasts({
                id: 'get_home_data_error',
                status: notificationStatus['2'],
                toast_text: errMsg,
            }));
        }
    }
};


export const removeListRow = payload => {
    const { userToken, isMobile = false, collection, onError, onSuccess, itemIds } = payload;
    const finalFilter = { "_id": { "$in": itemIds } };
    return {
        type: types.items.REMOVE_LIST_ROW,
        fetchConfig: [{
            path: `/delete?query={"collection":"${collection}","filter":${JSON.stringify(finalFilter)}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
        },
        onError: ({ error, store }) => {
            onError && onError();
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                store.dispatch(addToasts({
                    id: 'remove_list_row_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        },
    }
};
const onUserLoginSuccess = ({ userDetails, store, navigation, navigationDetails, history, isMobile }) => {
    if (userDetails.role === roles.vendor) {
        store.dispatch(getVendorDetails({
            userId: userDetails._id,
            isMobile,
            filter: { "user_id._id": userDetails._id },
            userToken: userDetails.token,
            onSuccess: _ => {
                if (isMobile) {
                    if (navigationDetails) {
                        navigation.navigate(navigationDetails.route, { ...navigationDetails.params });
                    } else {
                        navigation.navigate(appRoutes.VendorRoutes.route)
                    }
                } else {
                    if (navigationDetails) {
                        history && history.push(navigationDetails.path, { ...navigationDetails });
                    } else {
                        history && history.push(validAppRoutes.vendorProfile.replace(":userId", userDetails._id));
                    }
                }
            }
        }));
    } else if (userDetails.role === roles.buyer) {
        store.dispatch(getBuyerDetails({
            userId: userDetails._id,
            isMobile,
            userToken: userDetails.token,
            filter: { "user_id._id": userDetails._id },
            onSuccess: _ => {
                if (isMobile) {
                    if (navigationDetails) {
                        navigation.navigate(navigationDetails.route, { ...navigationDetails.params });
                    } else {
                        navigation.navigate(appRoutes.BuyerRoutes.route);
                    }
                } else {
                    if (navigationDetails) {
                        history && history.push(navigationDetails.path, { ...navigationDetails });
                    } else {
                        history && history.push(validAppRoutes.buyerProfile.replace(":userId", userDetails._id));
                    }
                }
            }
        }));
    }
};

export const loginUser = payload => {
    const {
        navigation, history, onError, onSuccess,
        setStoreDetails, navigationDetails, isMobile = false, phone_no, password
    } = payload;
    return {
        type: types.user.LOGIN_USER,
        payload,
        fetchConfig: [{
            path: `/validate-user?user={"phone_no":"${phone_no}","password":"${password}"}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            if (get(data, `0.response`, []).length > 0 && get(data, `0.response.0.token`)) {
                const userDetails = data[0].response[0];
                if (!isMobile) {
                    setItemInPersistentStore("user", userDetails);
                }
                actions.payload = { ...actions.payload, userDetails };
                next(actions);
                if (!userDetails.role) {
                    if (isMobile) {
                        navigation.push(appRoutes.AppRoutes.childRoutes.Login.childRoutes.SignupForm.route, { navigationDetails });
                    }
                }
                else if (get(userDetails, 'role') === roles.admin) {
                    if (isMobile) {
                        onError && onError({ error: mobileStringConstants.adminLoginErrorString });
                    } else {
                        history && history.push(validAppRoutes.shopCategories.replace(":userId", userDetails._id));
                    }
                }
                if (isMobile) {
                    setStoreDetails && setStoreDetails(userDetails.token, 'userToken').then(_ => {
                        setStoreDetails && setStoreDetails(userDetails, 'userDetails').then(_ => {
                            onUserLoginSuccess({
                                userDetails,
                                history,
                                store,
                                navigation,
                                navigationDetails,
                                isMobile
                            })
                        });
                    })
                } else {
                    onUserLoginSuccess({ userDetails, history, store, navigation, navigationDetails, isMobile })
                }
            }
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            onError && onError({ error: errMsg });
            if (!isMobile) {
                error && store.dispatch(addToasts({
                    id: 'user_login_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        }
    }
};
export const getAboutUsData = payload => {
    return {
        type: types.user.GET_ABOUT_US_DATA,
        payload,
        fetchConfig: [{
            path: `/about-us`,

        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (data[0] && data[0].response && data[0].response.data) {
                actions.payload = { ...actions.payload, data: data[0].response.data };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            error && store.dispatch(addToasts({
                id: 'about_us',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        }

    }
};
export const contactUs = payload => {
    const { name, msg, emailId, userId } = payload;
    return {
        type: types.user.CONTACT_US,
        payload,
        fetchConfig: [{
            path: `/contact-us?msg=${msg}&name=${name}&emailId=${emailId}${userId ? `&user_id=${userId}` : ''}`,

        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (data && data.length > 0 && data[0].response && data[0].response.length > 0 && data[0].response[0].msg) {
                store.dispatch(addToasts({
                    id: 'contact_us_success',
                    status: notificationStatus['1'],
                    toast_text: data[0].response[0].msg,
                }));
            }
        },
        onError: ({ error, store }) => {
            error && store.dispatch(addToasts({
                id: 'contact_us_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        }

    }
};

export const getVendorSummaryData = payload => {
    const { userToken, vendorId } = payload;
    return {
        type: types.user.GET_VENDOR_SUMMARY_DATA,
        fetchConfig: [{
            path: `/vendor-summary-data?vendorId=${JSON.stringify(vendorId)}&token=${userToken}`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            if (data && data.length > 0 && data[0].response && data[0].response) {
                actions.payload = { ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error }) => {
            alert(getErrorMessage(error))
        }
    }
};

export const getAppSummaryData = payload => {
    return {
        type: types.user.GET_APP_SUMMARY_DATA,
        fetchConfig: [{
            path: `/app-summary-data`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            if (data && data.length > 0 && data[0].response && data[0].response) {
                actions.payload = { ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error }) => {
            alert(getErrorMessage(error))
        }
    }
};

export const getVendorDashboardData = payload => {
    const { userToken, vendorId } = payload;
    return {
        type: types.user.GET_VENDOR_DASHBOARD_DATA,
        fetchConfig: [{
            path: `/vendor-dashboard-data?vendorId=${JSON.stringify(vendorId)}&token=${userToken}`,
        }],
        onSuccess: ({ data, next, store, actions }) => {
            if (data && data.length > 0 && data[0].response && data[0].response) {
                actions.payload = { ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error }) => {
            alert(getErrorMessage(error))
        }
    }
};

export const getBuyerSummaryData = payload => {
    const { userToken, buyerId } = payload;
    return {
        type: types.user.GET_BUYER_SUMMARY_DATA,
        fetchConfig: [
            {
                path: `/buyer-summary-data?buyerId="${buyerId}"&token=${userToken}`,
            }
        ],
        onSuccess: ({ data, next, store, actions }) => {
            if (data && data.length > 0 && data[0].response && data[0].response) {
                actions.payload = { ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error }) => {
            alert(getErrorMessage(error))
        }
    }
};

export const logoutUser = payload => {
    const { userToken, history, delStoreDetails, isMobile = false } = payload;
    if (isMobile) {
        delStoreDetails && delStoreDetails('userDetails');
        delStoreDetails && delStoreDetails('userToken');
    }
    return {
        type: types.user.LOGOUT_USER,
        payload,
        fetchConfig: [{
            path: `/logout?token=${userToken}`,

        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (!isMobile) {
                clearPersistentStore();
                history && history.push(validAppRoutes.home);
            }
            next(actions);
        },
        onError: ({ error, store }) => {
            if (!isMobile) {
                error && store.dispatch(addToasts({
                    id: 'user_logout_error',
                    status: notificationStatus['2'],
                    toast_text: getErrorMessage(error),
                }));
            }
        }
    }
};

export const getUserDetails = payload => {
    const { userId, delStoreDetails, history, onError, onSuccess, isMobile = false, userToken } = payload;
    return {
        type: types.user.GET_USER_DETAILS,
        payload,
        fetchConfig: [{
            path: `/getUserDetails?userId=${userId}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {

            if (get(data, `${0}.response`, []).length > 0) {
                actions.payload = { ...actions.payload, userToken, data: data[0].response[0] };
                next(actions);
                if (get(data, `${0}.response.${0}.role`, [])) {
                    if (data[0].response[0].role === roles.vendor) {
                        store.dispatch(getVendorDetails({
                            isMobile,
                            userToken,
                            userId: data[0].response[0]._id,
                            filter: { "user_id._id": data[0].response[0]._id },
                            onSuccess: _ => {
                                onSuccess && onSuccess({ data: data[0].response[0] })
                            }
                        }))
                    } else if (data[0].response[0].role === roles.buyer) {
                        store.dispatch(getBuyerDetails({
                            isMobile,
                            userToken,
                            userId: data[0].response[0]._id,
                            filter: { "user_id._id": data[0].response[0]._id },
                            onSuccess: _ => {
                                onSuccess && onSuccess({ data: data[0].response[0] })
                            }
                        }))
                    }
                }
            } else {
                logoutOnError({ store, onError, error: data, isMobile, delStoreDetails, userToken, history })
            }
        },
        onError: ({ error, store }) => {
            logoutOnError({ store, onError, error, isMobile, delStoreDetails, userToken, history })
        },
    }
};

export const registerUserWithRole = payload => {
    const { navigation, navigationDetails, shop_name, setStoreDetails, userId, token, role, name } = payload;
// signup case
    return {
        type: types.user.REGISTER_USER_ROLE,
        fetchConfig: [
            {
                path: `/register-user-role?user=${JSON.stringify({
                    _id: userId,
                    name,
                    shop_name,
                    role
                })}&token=${token}`,
            }
        ],
        onSuccess: ({ data, next, store, actions }) => {
            if (data && data.length > 0 && data[0].response && data[0].response.length > 0) {
                const serverData = data[0].response[0];
                actions.payload = { ...actions.payload, role: serverData.role };
                next(actions);
                setStoreDetails && setStoreDetails(serverData, 'userDetails').then(_ => {
                    if (serverData.role) {
                        if (serverData.role === roles.vendor) {
                            store.dispatch(getVendorDetails({
                                isMobile: true,
                                userId: serverData._id,
                                userToken: token,
                                filter: { "user_id._id": serverData._id },
                                onSuccess: _ => navigation.navigate(appRoutes.VendorRoutes.route)
                            }));
                        } else if (serverData.role === roles.buyer) {
                            store.dispatch(getBuyerDetails({
                                isMobile: true,
                                userId: serverData._id,
                                userToken: token,
                                filter: { "user_id._id": serverData._id },
                                onSuccess: _ => {
                                    if (navigationDetails) {
                                        navigation.navigate(navigationDetails.route, { ...navigationDetails.params });
                                    } else {
                                        navigation.navigate(appRoutes.BuyerRoutes.route);
                                    }
                                }
                            }));
                        }
                    }
                });
            }
        },
        onError: ({ error }) => {
            alert(getErrorMessage(error))
        }
    }
};
export const generateUserOtp = payload => {
    const { navigation, phone_no, forgot_password, resend_code, onError, navigationDetails } = payload;
    return {
        type: types.user.GENERATE_USER_OTP,
        fetchConfig: [
            {
                path: `/generate-otp?phone_no=${phone_no}${resend_code ? '&resend_code=true' : ''}${forgot_password ? '&forgot_password=true' : ''}`,
            }
        ],
        onSuccess: ({ data, store, next, actions }) => {
            if (data && data.length > 0 && data[0].response &&
                data[0].response.length > 0 && data[0].response[0].msg) {
                if (!resend_code) {
                    //  as resend code has already been done from OTPRegistration screen
                    navigation.push(appRoutes.AppRoutes.childRoutes.Login.childRoutes.OTPRegistrationForm.route, {
                        navigationDetails,
                        phone_no,
                    });
                }
                actions.payload = { ...actions.payload, msg: data[0].response[0].msg };
                next(actions)
            } else {
                alert(mobileStringConstants.errorCaseIfUserOTPNotGenerated)
            }
        },
        onError: ({ error }) => {
            onError && onError({ error: getErrorMessage(error) });
        }
    }
};
export const getVendorDetails = payload => {
    const { userId, onSuccess, isMobile, userToken } = payload;
    const finalQuery = {
        "collection": dbnames.Vendors,
        fields: {
            "name": 1,
            "shop_img": 1,
            "profile_img": 1,
            "is_active": 1,
            "phone_no": 1,
            "shop_name": 1,
            "location": 1,
            "shop_number": 1,
            "shop_timings": 1,
            "is_home_delivery_active": 1,
            "shop_category_id._id": 1,
            "shop_category_id.name": 1,
            "delivery_amount_slabs": 1
        },
        "filter": { "user_id._id": userId }
    };
    return {
        type: types.user.GET_VENDOR_DETAILS,
        payload,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify(finalQuery)}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {

            if (data[0] && data[0].response && data[0].response[0]) {
                actions.payload = { ...actions.payload, data: data[0].response[0] };
                next(actions);
            }
            onSuccess && onSuccess();
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'get_vendor_details_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        },
    }
};

export const getBuyerDetails = payload => {
    const { userId, onSuccess, isMobile, userToken } = payload;
    return {
        type: types.user.GET_BUYER_DETAILS,
        payload,
        fetchConfig: [{
            path: `/query?query={"collection":"${dbnames.Buyers}","filter":{"user_id._id":"${userId}"}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (data && data.length > 0 && data[0].response && data[0].response[0]) {
                actions.payload = { ...actions.payload, data: data[0].response[0] };
                next(actions);
                onSuccess && onSuccess();
            }
            if (data[0].response[0]._id) {
                store.dispatch(getCartItemsCount({
                    userToken,
                    buyerId: data[0].response[0]._id
                }))
            }
        },
        onError: ({ error, store }) => {
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'get_buyer_details_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        },
    }
};


export const updateVendorProfileImg = payload => {
    const { vendorId, profile_img = null, userToken } = payload;
    return {
        type: types.user.UPDATE_VENDOR_PROFILE_IMG,
        payload,
        fetchConfig: [{
            path: `/update?update={"collection":"${dbnames.Vendors}","filter":{"_id":"${vendorId}"},"update":{"$set":${JSON.stringify({ 'profile_img': profile_img })}}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
        },
        onError: ({ error, store }) => {
            error && store.dispatch(addToasts({
                id: 'update_vendor_profile_img_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        },
    }
};

export const updateVendorShopImg = payload => {
    const { vendorId, shop_img = null, userToken } = payload;
    return {
        type: types.user.UPDATE_VENDOR_SHOP_IMG,
        payload,
        fetchConfig: [{
            path: `/update?update={"collection":"${dbnames.Vendors}","filter":{"_id":"${vendorId}"},"update":{"$set":${JSON.stringify({ shop_img })}}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
        },
        onError: ({ error, store }) => {
            error && store.dispatch(addToasts({
                id: 'update_vendor_shop_img_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        },
    }
};

export const getAllBuyers = payload => {
    const { userToken, filter = {}, sort, onSuccess, onError, skipCount } = payload;
    const finalQuery = {
        collection: dbnames.Buyers,
        limit: defaultPageCount,
        skip: skipCount,
        filter,
        sort,
    };
    return {
        type: types.user.GET_ALL_BUYERS,
        payload,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify(finalQuery)}&paginated=true&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            if (data && data[0] && data[0].response) {
                actions.payload = { skipCount, ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            onError && onError();
            error && store.dispatch(addToasts({
                id: 'get_all_buyers_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        },
    }
};
export const getAllVendors = payload => {
    const { userToken, filter = {}, onSuccess, onError, skipCount } = payload;
    const finalQuery = {
        collection: dbnames.Vendors,
        limit: defaultPageCount,
        skip: skipCount,
        filter,
        fields: {
            "profile_img": 1,
            "phone_no": 1,
            "is_home_delivery_active": 1,
            "is_authorized": 1,
            "is_recommended": 1,
            "is_active": 1,
            "name": 1,
            "shop_number": 1,
            "shop_name": 1,
            "shop_category_id._id": 1,
            "shop_category_id.name": 1,
            "shop_img": 1,
        }
    };
    return {
        type: types.user.GET_ALL_VENDORS,
        payload,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify(finalQuery)}&paginated=true&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            if (data && data[0] && data[0].response) {
                actions.payload = { skipCount, ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            onError && onError();
            error && store.dispatch(addToasts({
                id: 'get_all_vendors_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        },
    }
};

export const getVendorsListForFilter = payload => {
    const { userToken } = payload;
    const finalQuery = {
        collection: dbnames.Vendors,
        fields: {
            name: 1,
            shop_name: 1,
        },
        filter: { "name": { $exists: true } }
    };
    return {
        type: types.user.GET_VENDORS_LIST_FOR_FILTER,
        payload,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify(finalQuery)}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (data && data[0] && data[0].response) {
                actions.payload = { data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            error && store.dispatch(addToasts({
                id: 'get_vendors_list_for_filter_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        },
    }
};

export const getBuyersListForFilter = payload => {
    const { userToken } = payload;
    const finalQuery = {
        collection: dbnames.Buyers,
        fields: {
            "name": 1,
        },
        filter: { "name": { $exists: true } }
    };
    return {
        type: types.user.GET_BUYERS_LIST_FOR_FILTER,
        payload,
        fetchConfig: [{
            path: `/query?query=${JSON.stringify(finalQuery)}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            if (data && data[0] && data[0].response) {
                actions.payload = { data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            error && store.dispatch(addToasts({
                id: 'get_buyers_list_for_filter_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        },
    }
};

export const updateBuyerProfileImg = payload => {
    const { buyerId, profile_img = null, userToken } = payload;
    return {
        type: types.user.UPDATE_BUYER_PROFILE_IMG,
        payload,
        fetchConfig: [{
            path: `/update?update={"collection":"${dbnames.Buyers}","filter":{"_id":"${buyerId}"},"update":{"$set":${JSON.stringify({ profile_img })}}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
        },
        onError: ({ error, store }) => {
            error && store.dispatch(addToasts({
                id: 'update_buyer_profile_img_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        },
    }
};

export const updateVendorDetails = payload => {
    const {
        vendorId, onSuccess, userToken, shop_timings, isMobile = false, shop_category_id, delivery_amount_slabs, location, is_active,
        is_home_delivery_active, onError, isListUpdate = false, is_recommended, is_authorized, shop_img, profile_img, name, shop_name
    } = payload;
    const updateJson = {};
    if (payload.hasOwnProperty("name")) {
        updateJson['name'] = name
    }
    if (payload.hasOwnProperty("shop_timings")) {
        updateJson['shop_timings'] = shop_timings
    }
    if (payload.hasOwnProperty("location")) {
        updateJson['location'] = location
    }
    if (payload.hasOwnProperty("is_authorized")) {
        updateJson['is_authorized'] = is_authorized
    }
    if (payload.hasOwnProperty("is_recommended")) {
        updateJson['is_recommended'] = is_recommended
    }
    if (payload.hasOwnProperty("is_home_delivery_active")) {
        updateJson['is_home_delivery_active'] = is_home_delivery_active
    }
    if (payload.hasOwnProperty("shop_category_id")) {
        updateJson['shop_category_id'] = shop_category_id
    }
    if (payload.hasOwnProperty("is_active")) {
        updateJson['is_active'] = is_active
    }
    if (payload.hasOwnProperty("shop_name")) {
        updateJson['shop_name'] = shop_name
    }
    if (payload.hasOwnProperty("delivery_amount_slabs")) {
        updateJson['delivery_amount_slabs'] = delivery_amount_slabs
    }
    const awsUploadConfig = [];
    if (profile_img && isNewFile(profile_img)) {
        awsUploadConfig.push(profile_img)
    }
    if (shop_img && isNewFile(shop_img)) {
        awsUploadConfig.push(shop_img)
    }
    const finalUpdate = {
        "collection": dbnames.Vendors,
        "filter": Array.isArray(vendorId) ? { "_id": { "$in": vendorId } } : { "_id": vendorId },
        "update": { "$set": updateJson }
    };
    return {
        type: types.user.UPDATE_VENDOR_DATA,
        payload,
        fetchConfig: [{
            path: `/update?update=${JSON.stringify(finalUpdate)}&token=${userToken}`,
        }],
        awsUploadConfig,
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            if (profile_img && isNewFile(profile_img)) {
                profile_img.url = data[1].url;
            }
            if (shop_img && isNewFile(shop_img)) {
                shop_img.url = data[((profile_img && isNewFile(profile_img)) ? 2 : 1)].url;
            }

            // this update should be done each time as in case of del no img upload will be their but still profile_img should be blank
            payload.hasOwnProperty("profile_img") && store.dispatch(updateVendorProfileImg({
                vendorId,
                profile_img: profile_img ? { url: profile_img.url, name: profile_img.name } : null,
                userToken,
            }));

            payload.hasOwnProperty("shop_img") && store.dispatch(updateVendorShopImg({
                vendorId,
                shop_img: shop_img ? { url: shop_img.url, name: shop_img.name } : null,
                userToken,
            }));

            if (isListUpdate) {
                store.dispatch({
                    type: types.user.UPDATE_VENDOR_LIST,
                    payload: { vendorId, data: { ...updateJson } }
                })
            } else {
                store.dispatch({
                    type: types.user.UPDATE_VENDOR_DETAILS,
                    payload: { ...actions.payload, data: { ...updateJson, shop_img, profile_img } }
                })
            }

            if (!isMobile) {
                store.dispatch(addToasts({
                    id: 'update_vendor_details_success',
                    status: notificationStatus['1'],
                    toast_text: userNotifications.msgOnProfileUpdateSuccess,
                }));
            }

        },
        onError: ({ error, store }) => {
            onError && onError();
            const errMsg = getErrorMessage(error);
            if (isMobile) {
                alert(errMsg)
            } else {
                error && store.dispatch(addToasts({
                    id: 'update_vendor_details_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        },
    }
};


export const updateBuyerDetails = payload => {

    const { buyerId, profile_img, userToken, location, name } = payload;
    const updateJson = { name, location };
    return {
        type: types.user.UPDATE_BUYER_DETAILS,
        payload,
        fetchConfig: [{
            path: `/update?update={"collection":"${dbnames.Buyers}","filter":{"_id":"${buyerId}"},"update":{"$set":${JSON.stringify(updateJson)}}}&token=${userToken}`,
        }],
        awsUploadConfig: profile_img && isNewFile(profile_img) ? [profile_img] : undefined,
        onSuccess: ({ data, store, next, actions }) => {
            if (profile_img && isNewFile(profile_img)) {
                profile_img.url = data[1].url;
            }
            payload.hasOwnProperty("profile_img") && store.dispatch(updateBuyerProfileImg({
                buyerId,
                profile_img: profile_img ? { url: profile_img.url, name: profile_img.name } : null,
                userToken,
            }));

            actions.payload = { ...actions.payload, data: { ...updateJson, profile_img } };
            next(actions);
            store.dispatch(addToasts({
                id: 'update_buyer_details_success',
                status: notificationStatus['1'],
                toast_text: userNotifications.msgOnProfileUpdateSuccess,
            }));

        },
        onError: ({ error, store }) => {
            error && store.dispatch(addToasts({
                id: 'update_buyer_details_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));

        },
    }
};


export function updateLoadingStatus(payload) {
    return {
        type: types.user.UPDATE_LOADING_STATUS,
        payload,
    }
}
