import React, { Component } from 'react';
import { View, StyleSheet } from "react-native";

import { colors } from "../../mobileTheme";
import { appLoadingTypes } from "../../constants/index";

const Spinner = require('react-native-spinkit');


export default class Loader extends Component {

    static defaultProps = {
        spinnerType: appLoadingTypes.fullAppLoading,
        spinnerColor: colors.WHITE,
    };

    render() {

        const { spinnerType, spinnerColor } = this.props;

        return <View
            style={[spinnerType === appLoadingTypes.fullAppLoading ? styles.spinnerTypeContainer : styles.compLoadingContainer]}>
            <Spinner style={styles.spinnerStyle}
                     isVisible={true}
                     size={spinnerType === appLoadingTypes.fullAppLoading ? 150 : 50}
                     type={'ThreeBounce'}
                     color={spinnerColor}
            />
        </View>
    }
};

const styles = StyleSheet.create({
    spinnerTypeContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.BLACK_SHADE_40,
        alignItems: "center",
        justifyContent: "center"
    },
    compLoadingContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    spinnerStyle: {},
});