import types from './types';
import { dbnames, notificationStatus } from '../../constants'
import { addToasts } from "./toastActions";
import { getErrorMessage } from "../../utils/functions";


export const getMeasuringUnits = payload => {
    const { userToken, isMobile = false, onSuccess } = payload;
    return {
        type: types.measuringUnits.GET_MEASURING_UNITS,
        fetchConfig: [{
            path: `/query?query={"collection":"${dbnames.MeasuringUnits}"}&token=${userToken}`,
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
                    id: 'get_measuring_units_error',
                    status: notificationStatus['2'],
                    toast_text: errMsg,
                }));
            }
        },
    }
};
export const addMeasuringUnits = payload => {
    const { userToken, name, isMobile = false, short_name, onSuccess } = payload;
    return {
        type: types.measuringUnits.ADD_MEASURING_UNITS,
        fetchConfig: [{
            path: `/insert?insert={"collection":"${dbnames.MeasuringUnits}","insert":{"name":"${name}","short_name":"${short_name}"}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            if (data && data[0] && data[0].response) {
                actions.payload = { ...actions.payload, data: data[0].response };
                next(actions);
            }
        },
        onError: ({ error, store }) => {
            !isMobile && error && store.dispatch(addToasts({
                id: 'add_measuring_units_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));
        },
    }
};
export const removeMeasuringUnit = payload => {
    const { userToken, onError, isMobile = false, onSuccess, recordId } = payload;
    return {
        type: types.measuringUnits.REMOVE_MEASURING_UNITS,
        fetchConfig: [{
            path: `/delete?query={"collection":"${dbnames.MeasuringUnits}","filter":{"_id":"${recordId}"}}&token=${userToken}`,
        }],
        onSuccess: ({ data, store, next, actions }) => {
            onSuccess && onSuccess();
            actions.payload = { ...actions.payload, recordId };
            next(actions);
        },
        onError: ({ error, store }) => {
            onError && onError();
            !isMobile && error && store.dispatch(addToasts({
                id: 'remove_measuring_unit_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));
        },
    }
};

export const updateMeasuringUnit = payload => {
    const { userToken, recordId, onError, isMobile = false, updateJson, onSuccess } = payload;
    const updateObject = {
        "collection": dbnames.MeasuringUnits,
        "update": { "$set": updateJson },
        "filter": { "_id": recordId },
    };
    return {
        type: types.measuringUnits.UPDATE_MEASURING_UNIT,
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
                id: 'update_measuring_unit_error',
                status: notificationStatus['2'],
                toast_text: getErrorMessage(error),
            }));
        },
    }
};