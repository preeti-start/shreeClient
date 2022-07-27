import types from '../actions/types';
import appStringConstants from "../../constants/appStringConstants";

const initialState = {
    userDetails: undefined,
    userToken: undefined,
    aboutUs: undefined,
    otpResponseMessage: '',
    vendorSummaryData: undefined,
    webHomeData: undefined,
    homeData: undefined,
    vendorDetails: undefined,
    buyerDetails: undefined,
    allBuyersListData: undefined,
    allVendorsListData: undefined,
    appSummaryData: undefined,
    buyerSummaryData: undefined,
    allVendors: undefined,
    isAppLoading: false,
    vendorDashboardData: undefined
};

export default ((state = initialState, actions = {}) => {
    switch (actions.type) {
        case types.user.GET_ABOUT_US_DATA: {
            const { data } = actions.payload;
            return { ...state, aboutUs: data };
        }
        case types.user.GENERATE_USER_OTP: {
            const { msg } = actions.payload;
            return { ...state, otpResponseMessage: msg };
        }
        case types.user.GET_BUYER_SUMMARY_DATA: {
            const { data } = actions.payload;
            return { ...state, buyerSummaryData: data }
        }
        case types.user.GET_APP_SUMMARY_DATA: {
            const { data } = actions.payload;
            return { ...state, appSummaryData: data }
        }
        case types.user.GET_VENDORS_LIST_FOR_FILTER: {
            const { data } = actions.payload;
            return {
                ...state,
                allVendors: [{
                    _id: appStringConstants.dropDownFirstOption,
                    shop_name: appStringConstants.dropDownFirstOption
                }, ...data]
            }
        }
        case types.user.GET_BUYERS_LIST_FOR_FILTER: {
            const { data } = actions.payload;
            return {
                ...state,
                allBuyers: [{
                    _id: appStringConstants.dropDownFirstOption,
                    name: appStringConstants.dropDownFirstOption
                }, ...data]
            }
        }
        case types.user.GET_USER_DETAILS: {
            const { data, userToken } = actions.payload;
            return { ...state, userDetails: data, userToken };
        }
        case types.user.GET_ALL_VENDORS: {
            const { data, skipCount } = actions.payload;
            return {
                ...state,
                allVendorsListData: {
                    data: skipCount !== 0 ? [...state.allVendorsListData.data, ...data.data] : data.data,
                    pagination: { ...data.pagination, skipCount }
                }
            };
        }
        case types.user.GET_ALL_BUYERS: {
            const { data, skipCount } = actions.payload;
            return {
                ...state,
                allBuyersListData: {
                    data: skipCount !== 0 ? [...state.allBuyersListData.data, ...data.data] : data.data,
                    pagination: { ...data.pagination, skipCount }
                },
            };
        }
        case types.user.GET_VENDOR_DETAILS: {
            const { data } = actions.payload;
            return { ...state, vendorDetails: data };
        }
        case types.user.GET_BUYER_DETAILS: {
            const { data } = actions.payload;
            return { ...state, buyerDetails: data };
        }
        case types.user.REGISTER_USER_ROLE: {
            const { role } = actions.payload;
            return { ...state, userDetails: { ...state.userDetails, role } }
        }
        case types.user.UPDATE_VENDOR_LIST: {
            const { data, vendorId = [] } = actions.payload;
            return {
                ...state,
                allVendorsListData: {
                    data: state.allVendorsListData.data.map(vendor => vendorId.indexOf(vendor._id) > -1 ? { ...vendor, ...data } : vendor),
                    pagination: state.allVendorsListData.pagination
                }
            };
        }
        case types.user.UPDATE_VENDOR_DETAILS: {
            const { data } = actions.payload;
            return { ...state, vendorDetails: { ...state.vendorDetails, ...data } };
        }
        case types.user.UPDATE_BUYER_DETAILS: {
            const { data } = actions.payload;
            return { ...state, buyerDetails: { ...state.buyerDetails, ...data } };
        }
        case types.user.LOGIN_USER: {
            const { userDetails } = actions.payload;
            return { ...state, userDetails, userToken: userDetails.token }
        }
        case types.user.GET_HOME_DATA: {
            const { data } = actions.payload;
            return { ...state, homeData: data }
        }
        case types.user.GET_WEB_HOME_DATA: {
            const { data } = actions.payload;
            return { ...state, webHomeData: data }
        }
        case types.user.GET_VENDOR_SUMMARY_DATA: {
            const { data } = actions.payload;
            return { ...state, vendorSummaryData: data }
        }
        case types.user.GET_VENDOR_DASHBOARD_DATA: {
            const { data } = actions.payload;
            return { ...state, vendorDashboardData: data }
        }
        case types.user.UPDATE_LOADING_STATUS: {
            const { status } = actions.payload;
            return { ...state, isAppLoading: status }
        }
        case types.user.LOGOUT_USER: {
            return initialState;
        }
        default: {
            return state;
        }
    }
})
