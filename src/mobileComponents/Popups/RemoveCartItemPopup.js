import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { Button } from '../../mobileComponents/index';
import appStringConstants from "../../constants/mobileStringConstants";
import images from "../../mobileAssets/images";

import { colors, fontSizes, fonts, fontStyle } from "../../mobileTheme";
import { buttonTypes } from "../../constants";


export default class RemoveCartItemPopup extends React.Component {

    static defaultProps = {
        isLoading: false,
    };

    render() {
        const { onOkPress, onCancelPress, isLoading } = this.props;
        return <View style={styles.container}>
            <Image source={images.confuseSmily} style={styles.imageContainer}/>
            <Text style={styles.description}>
                {appStringConstants.cartItemDeleteConfirmation}
            </Text>
            <View style={styles.footerContainer}>
                <Button
                    textStyle={styles.buttonTextStyle}
                    style={styles.buttonStyle}
                    title={appStringConstants.cancelButton}
                    isLoading={isLoading}
                    onPress={onCancelPress}
                    height={30}
                    buttonType={buttonTypes.secondary}
                />
                <Button
                    isLoading={isLoading}
                    height={30}
                    textStyle={styles.buttonTextStyle}
                    style={styles.buttonStyle}
                    title={appStringConstants.okButton}
                    onPress={onOkPress}
                    buttonType={buttonTypes.secondary}
                />
            </View>
        </View>
    }
}
const styles = StyleSheet.create({
    buttonTextStyle: { fontSize: fontSizes.size15 },
    buttonStyle: {
        marginLeft: 10,
        elevation: 0,
        padding: 5,
        paddingHorizontal: 15,
        width: 100,
        borderWidth: 0
    },
    container: { padding: 15, paddingTop: 50, position: 'relative' },
    imageContainer: { left: '40%', top: -40, position: 'absolute', resizeMode: 'stretch', width: 80, height: 70 },
    description: { paddingBottom: 20, ...fontStyle, fontSize: fontSizes.size12, color: colors.BLACK_SHADE_40 },
    footerContainer: { justifyContent: 'flex-end', flexDirection: 'row' },
});
