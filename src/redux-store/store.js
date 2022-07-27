import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers';
import middlewares from './middlewares';

const initialState = {};

export const store = createStore(
    reducers, initialState,
    applyMiddleware(thunk, ...middlewares)
);
