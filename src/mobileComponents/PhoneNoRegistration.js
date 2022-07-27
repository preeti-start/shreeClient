import React from 'react';
import { View, StyleSheet } from 'react-native';

import stringConstants from '../constants/mobileStringConstants';
import { InputBox } from './AppComponents/index';
import { UserRegistrationComponent } from './index';
import images from '../mobileAssets/images/index';

export default class PhoneNoRegistration extends React.Component {


    render() {
        const { onPhoneNoChange, onForgotPasswordClick, isAppLoading, errorString, phone_no, onProceedClick } = this.props;
        return <UserRegistrationComponent
            imgContainerStyle={{ width: 120, height: 120 }}
            isAppLoading={isAppLoading}
            buttonString={stringConstants.proceedButton}
            onButtonClick={onProceedClick}
            footerAction={{
                title: stringConstants.forgotPasswordActionTitle,
                align: 'flex-end',
                onPress: onForgotPasswordClick
            }}
            imgUrl={images.welcomeSmily}
            renderFromView={({ isVisible }) => <View style={styles.container}>
                <InputBox
                    style={{ borderWidth: 0, borderBottomWidth: 1 }}
                    keyboardType='numeric'
                    placeholder={stringConstants.placeholderTextForPhoneNoRegistration}
                    errorText={errorString}
                    onChangeText={onPhoneNoChange}
                    value={phone_no}
                />
            </View>}
        />;

    }
}

const styles = StyleSheet.create({
    container: { paddingVertical: 20, justifyContent: "center", width: "100%" }
});