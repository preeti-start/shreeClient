import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors, fontStyle, fontSizes } from "../mobileTheme";
import stringConstants from "../constants/mobileStringConstants";
import { Loader } from "./AppComponents/index";
import { appLoadingTypes } from "../constants/index";

export default class SplashScreen extends React.Component {
    render() {
        return <LinearGradient
            colors={ [colors.PRIMARY_COLOR_1, colors.PRIMARY_COLOR_SHADE_1] }
            style={ styles.container }>
            <View style={ {
                flexDirection: "row",
                alignItems: 'center',
            } }>
                <Text style={ styles.mainText }>
                    { stringConstants.appName.slice(0, 1) }
                </Text>
                <Text style={ styles.subText }>
                    { stringConstants.appName.slice(1, stringConstants.appName.length) }
                </Text>
            </View>
            <Text style={ [styles.subText, { fontSize: fontSizes.size17 }] }>
                { stringConstants.appTagLine }
            </Text>
            <View style={ { width: 300, height: 50 } }>
                <Loader spinnerType={ appLoadingTypes.specificComponentLoading }/>
            </View>

        </LinearGradient>
    }
}
const styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // flexDirection: "row",
    },
    mainText: { ...fontStyle, color: colors.WHITE, fontSize: fontSizes.size70 },
    subText: { ...fontStyle, color: colors.WHITE, fontSize: fontSizes.size30 },
});