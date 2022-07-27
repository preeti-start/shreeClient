import React, { Component } from 'react';
import { Provider } from 'react-redux';

import Router from './src/mobileRouter';
import { store } from "./src/redux-store/store";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { colors, fontSizes, fonts } from './src/mobileTheme';
const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.PRIMARY_COLOR_1,
    },
    fonts: {
        regular: {
            fontFamily: fonts.MeriendaOneRegular
        }
    }
};

console.disableYellowBox = true;
export default class App extends Component {
    render() {

        return (<Provider store={store}>
            <PaperProvider theme={theme}>
                <Router />
            </PaperProvider>
        </Provider>);
    }
}

