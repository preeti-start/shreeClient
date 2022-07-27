import types from '../actions/types';

const initialState = {
    measuringUnitsList: undefined,
};

export default ( (state = initialState, actions = {}) => {
    switch (actions.type) {
        case types.measuringUnits.GET_MEASURING_UNITS:
            const { data } = actions.payload;
            return { ...state, measuringUnitsList: data };
        case types.measuringUnits.REMOVE_MEASURING_UNITS: {
            const { recordId } = actions.payload;
            return {
                ...state,
                measuringUnitsList: [...state.measuringUnitsList.filter(measuringUnitVal => measuringUnitVal._id !== recordId)]
            };
        }
        case types.measuringUnits.UPDATE_MEASURING_UNIT: {
            const { data } = actions.payload;
            return {
                ...state,
                measuringUnitsList: state.measuringUnitsList.map(itemVal => ( ( data && data._id && itemVal._id === data._id ) ? data : itemVal ))
            };
        }
        case types.measuringUnits.ADD_MEASURING_UNITS: {
            const { data } = actions.payload;
            return {
                ...state,
                measuringUnitsList: state.measuringUnitsList ? [...state.measuringUnitsList, data] : [data]
            };
        }
        case types.user.LOGOUT_USER: {
            return initialState;
        }
        default:
            return state;
    }
} )