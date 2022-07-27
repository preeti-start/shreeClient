import React, { Component } from 'react';
import { Provider } from 'react-redux'

import { store } from "./redux-store/store";
import AppRouter from './containers/Router';


class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppRouter/>
            </Provider>
        );
    }
}

export default App;
