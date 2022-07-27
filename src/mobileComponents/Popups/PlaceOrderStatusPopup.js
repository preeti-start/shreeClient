import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { Button } from '../../mobileComponents/index';
import appStringConstants from "../../constants/mobileStringConstants";
import images from "../../mobileAssets/images";

import { colors, fontSizes, fonts, fontStyle } from "../../mobileTheme";
import { buttonTypes } from "../../constants";


export default class PlaceOrderStatusPopup extends React.Component {

    static defaultProps = {
        isQuestion: false,
        isLoading: false,
        hasFailed: false,
        description: '',
    };

    render() {

        const { onOkPress, isQuestion, hasFailed, description, isLoading } = this.props;

        return <View style={styles.container}>
            {hasFailed && <Image source={images.sadSmily} style={styles.imageContainer}/>}
            {!hasFailed && !isQuestion && <Image source={images.doneSmily} style={styles.imageContainer}/>}
            {isQuestion && <Image source={images.confuseSmily} style={styles.imageContainer}/>}
            <Text style={styles.description}>
                {description}
            </Text>
            <View style={styles.footerContainer}>
                <Button
                    buttonType={buttonTypes.secondary}
                    textStyle={styles.buttonTextStyle}
                    style={styles.buttonStyle}
                    isLoading={isLoading}
                    title={appStringConstants.okButton}
                    onPress={onOkPress}
                />
            </View>
        </View>
    }
}
const styles = StyleSheet.create({
    buttonTextStyle: { fontSize: fontSizes.size15 },
    buttonStyle: {
        marginRight: 20,
        elevation: 0,
        padding: 5,
        width: undefined,
        height: undefined,
        borderWidth: 0
    },
    container: { padding: 15, paddingTop: 50, position: 'relative' },
    imageContainer: { left: '40%', top: -40, position: 'absolute', resizeMode: 'stretch', width: 80, height: 70 },
    description: {
        paddingBottom: 20,
        ...fontStyle,
        fontSize: fontSizes.size12,
        color: colors.BLACK_SHADE_40
    },
    footerContainer: { justifyContent: 'flex-end', flexDirection: 'row' },
});