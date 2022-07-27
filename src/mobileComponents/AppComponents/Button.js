import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import LinearGradient from "react-native-linear-gradient";

import { colors, fontSizes, sizes, fonts } from "../../mobileTheme";
import { buttonTypes, appLoadingTypes } from "../../constants/index";
import { Loader } from "./index";

const floatingButtonDim = sizes.buttonHeight;

export default class Button extends React.Component {

    static defaultProps = {
        width: 200,
        height: sizes.buttonHeight,
        buttonType: buttonTypes.primary,
        isLoading: false,
        ifFloating: false,
        buttonIcon: undefined,
        textStyle: {},
        style: {},
    };

    render() {

        const { title, buttonIcon, textStyle, ifFloating, style, isLoading, width, buttonType, height, onPress } = this.props;
        const borderColor = (buttonType === buttonTypes.primary || buttonType === buttonTypes.secondary) ? colors.PRIMARY_COLOR_1 : colors.BLACK_SHADE_20;

        return <TouchableOpacity
            style={[ifFloating ? styles.floatingButton : {}]}
            onPress={(!isLoading && buttonType !== buttonTypes.inactive) ? onPress : undefined}>
            <LinearGradient
                // start={{ x: 0, y: 1 }}
                // end={{ x: 1, y: 1 }}
                colors={[
                    !style.backgroundColor ? (buttonType === buttonTypes.primary ? colors.PRIMARY_COLOR_1 : (buttonType === buttonTypes.secondary ? colors.WHITE : colors.TRANSPARENT)) : style.backgroundColor,
                    !style.backgroundColor ? (buttonType === buttonTypes.primary ? colors.PRIMARY_COLOR_SHADE_1 : (buttonType === buttonTypes.secondary ? colors.WHITE : colors.TRANSPARENT)) : style.backgroundColor,
                    !style.backgroundColor ? (buttonType === buttonTypes.primary ? colors.PRIMARY_COLOR_SHADE_1 : (buttonType === buttonTypes.secondary ? colors.WHITE : colors.TRANSPARENT)) : style.backgroundColor,
                    !style.backgroundColor ? (buttonType === buttonTypes.primary ? colors.PRIMARY_COLOR_1 : (buttonType === buttonTypes.secondary ? colors.WHITE : colors.TRANSPARENT)) : style.backgroundColor,
                ]}
                style={[styles.buttonDiv, {
                    // borderWidth: 2,
                    backgroundColor: borderColor,
                    borderColor,
                    width,
                    height
                }, (ifFloating ? styles.floatingButton : {}), { ...style }]}
            >
                {buttonIcon && buttonIcon()}
                {!isLoading && <Text style={[styles.buttonText, {
                    color: buttonType === buttonTypes.primary ? colors.WHITE : (buttonType === buttonTypes.secondary ? colors.PRIMARY_COLOR_1 : colors.BLACK_SHADE_20),
                    ...textStyle,
                }]}>{title}</Text>}
                {(isLoading && buttonType !== buttonTypes.inactive) && <Loader
                    spinnerColor={buttonType === buttonTypes.primary ? colors.WHITE : (buttonType === buttonTypes.secondary ? colors.PRIMARY_COLOR_1 : colors.BLACK_SHADE_20)}
                    spinnerType={appLoadingTypes.specificComponentLoading}/>}
            </LinearGradient>
        </TouchableOpacity>;

    }
}
const styles = StyleSheet.create({
    floatingButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        width: floatingButtonDim,
        height: floatingButtonDim,
        borderRadius: floatingButtonDim / 2
    },
    buttonDiv: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: sizes.borderRadius,
        elevation: 1,
        shadowColor: colors.PRIMARY_COLOR_1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    buttonText: {
        fontSize: fontSizes.size17,
        fontFamily: fonts.MeriendaBold,
    },
});