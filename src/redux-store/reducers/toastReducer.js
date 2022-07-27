import types from '../actions/types';

const initialState = [];

const popup = (state = initialState, actions = {}) => {
    switch (actions.type) {

        case types.toasts.ADD_TOASTS: {
            return [...state, { ...actions.payload, is_active: true }];
        }

        case types.toasts.REMOVE_TOASTS: {
            const { id } = actions.payload;
            state = state.filter(stateData => stateData.id !== id);
            return [...state];
        }

        case types.user.LOGOUT_USER: {
            return initialState;
        }

        default: {
            return state;
        }
    }
};
export default popup;
