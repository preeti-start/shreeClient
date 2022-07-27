import types from '../actions/types';
import { completedOrderStatus } from '../../constants';

const initialState = {
    activeOrdersListData: { isLoading: false },
    ordersHistoryListData: { isLoading: false },
    orderJson: undefined,
    orderDetails: undefined,
};

export default ((state = initialState, actions = {}) => {
    switch (actions.type) {
        case types.orders.UPDATE_ACTIVE_ORDERS_LOADING_STATUS: {
            const { status } = actions.payload;
            return { ...state, activeOrdersListData: { ...state.activeOrdersListData, isLoading: status } }
        }
        case types.orders.SET_ORDER_DETAILS: {
            const { data } = actions.payload;
            return { ...state, orderDetails: data }
        }
        case types.orders.UPDATE_ORDER_HISTORY_LOADING_STATUS: {
            const { status } = actions.payload;
            return { ...state, ordersHistoryListData: { ...state.ordersHistoryListData, isLoading: status } }
        }
        case types.orders.GET_ACTIVE_ORDERS_LIST: {
            const { data, skipCount } = actions.payload;
            return {
                ...state,
                activeOrdersListData: {
                    data: skipCount !== 0 ? [...state.activeOrdersListData.data, ...data.data] : data.data,
                    pagination: { ...data.pagination, skipCount }
                }
            };
        }
        case types.orders.GET_ORDER_HISTORY_LIST: {
            const { data, skipCount } = actions.payload;
            return {
                ...state,
                ordersHistoryListData: {
                    data: skipCount !== 0 ? [...state.ordersHistoryListData.data, ...data.data] : data.data,
                    pagination: { ...data.pagination, skipCount }
                }
            };
        }
        case types.orders.UPDATE_ORDER_DETAILS: {
            const { data } = actions.payload;
            const { orderDetails } = state;
            let finalOrderDetails = {};
            let isDetailsUpdated = false;
            const removeFromList = data && data.status && [...completedOrderStatus].indexOf(data.status) > -1;
            if (orderDetails && data && orderDetails._id === data._id) {
                isDetailsUpdated = true;
                finalOrderDetails = { ...orderDetails, ...data }
            }
            return {
                ...state,
                orderDetails: isDetailsUpdated ? finalOrderDetails : orderDetails,
                activeOrdersListData: {
                    pagination: state.activeOrdersListData.pagination,
                    data: removeFromList ? [...state.activeOrdersListData.data.filter(orderVal => ((data && data._id && orderVal._id !== data._id)))] : [...state.activeOrdersListData.data.map(orderVal => ((data && data._id && orderVal._id === data._id) ? data : orderVal))],
                },
            };
        }
        case types.orders.GET_ORDER_JSON: {
            const { data } = actions.payload;
            return { ...state, orderJson: data };
        }
        case types.user.LOGOUT_USER: {
            return initialState;
        }
        default: {
            return state;
        }
    }
})