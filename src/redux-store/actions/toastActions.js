import types from './types';

export function addToasts(payload) {
    return {
        type: types.toasts.ADD_TOASTS,
        payload,
    }
}

export function removeToasts(payload) {
    return {
        type: types.toasts.REMOVE_TOASTS,
        payload,
    }
}