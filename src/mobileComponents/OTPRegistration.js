import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';

import stringConstants from '../constants/mobileStringConstants';
import UserRegistrationComponent from './UserRegistrationComponent';
import images from "../mobileAssets/images/index";
import { colors, fontSizes, fonts } from "../mobileTheme";

const otpArr = new Array(4).fill();

export default class OtpRegistration extends React.Component {

    render() {
        const {
            errorString, phone_no, onResendOtpClick, onTextClick,
            isAppLoading, onChangeText, otp, pointerIndex,
            otpResponseMessage, getInputBoxRef, onProceedClick
        } = this.props;

        return <UserRegistrationComponent
            isAppLoading={isAppLoading}
            footerAction={{
                title: stringConstants.resendOtpActionTitle,
                align: 'flex-start',
                onPress: onResendOtpClick
            }}
            buttonString={stringConstants.proceedButton}
            onButtonClick={onProceedClick}
            imgUrl={images.otpSmily}
            renderFromView={({ isVisible }) => <View style={styles.container}>

                <View style={[styles.enterOtplineContainer]}>
                    <Text
                        style={[styles.enterOtpText, { color: colors.BLACK_SHADE_40, fontSize: fontSizes.size17 }]}>
                        {phone_no}
                    </Text>
                    <Text
                        style={styles.enterOtpText}>
                        {`${otpResponseMessage}`}
                    </Text>
                </View>

                <View style={styles.otpBoxesContainer}>
                    <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>

                        <TextInput
                            // keyboardType='numeric'
                            onChangeText={onChangeText}
                            // ref={getInputBoxRef}
                            style={{ height: 20, width: 100 }}
                        // autoFocus={true}
                        />
                        {otpArr.map((_, index) => <Text onPress={_ => onTextClick({ index })}
                            style={[styles.otpBox, {
                                borderColor: (errorString || (pointerIndex === index)) ?
                                    colors.PRIMARY_COLOR_2 : colors.BLACK_SHADE_10
                            }]}
                            key={index}>
                            {otp.substr(index, 1)}
                        </Text>)}
                    </View>
                    {errorString && <Text
                        style={styles.errorText}>
                        {errorString}
                    </Text>}
                </View>


            </View>} />;

    }
}

const styles = StyleSheet.create({
    otpBoxesContainer: {
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
        marginTop: 5,
    },
    otpBox: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 2,
        fontFamily: fonts.MeriendaOneRegular,
        fontSize: fontSizes.size14,
        color: colors.BLACK_SHADE_60,
        height: 40,
        width: 40,
        textAlign: 'center'
    },
    enterOtplineContainer: { marginLeft: 10, opacity: 0.8, width: "100%" },
    enterOtpText: {
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.PRIMARY_COLOR_1,
        fontSize: fontSizes.size10
    },
    errorText: {
        marginTop: 5,
        marginLeft: 10,
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.PRIMARY_COLOR_2,
        fontSize: fontSizes.size10,
        textAlign: 'center'
    },
    inputBoxContainer: { flex: 1, margin: 5 },
    container: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    }
});