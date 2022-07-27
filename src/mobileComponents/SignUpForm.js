import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { roles, buttonTypes } from '../constants/index';
import stringConstants from '../constants/mobileStringConstants';
import { Button, InputBox } from './AppComponents/index';
import UserRegistrationComponent from './UserRegistrationComponent';
import images from "../mobileAssets/images/index";
import { fontSizes, sizes, colors, fonts } from "../mobileTheme";

export default class SignUpForm extends React.Component {


    render() {

        const { onInputFieldChange, isAppLoading, onRoleChange, shop_name, role, errorString, name, onProceedClick } = this.props;

        return <UserRegistrationComponent
            middleContainerFlex={2}
            isAppLoading={isAppLoading}
            buttonString={stringConstants.proceedButton}
            onButtonClick={onProceedClick}
            imgUrl={images.doneSmily}
            imgContainerStyle={{ width: 105 }}
            renderFromView={({ isVisible }) => <View style={styles.container}>
                {isVisible && <View style={styles.welcomelineContainer}>
                    <Text
                        style={styles.welcomelineText}>{stringConstants.signupPageWelcomeLine(stringConstants.appName)}</Text>
                </View>}
                <View style={styles.buttonContainer}>
                    <View style={styles.roleSelectionSection}>
                        <Button
                            textStyle={{
                                fontSize: fontSizes.size14,
                            }}
                            style={styles.buttonStyle}
                            title={stringConstants.signupFormUserRolesTabBuyerTitle}
                            buttonType={role === roles.buyer ? buttonTypes.primary : buttonTypes.secondary}
                            onPress={_ => onRoleChange(roles.buyer)}
                        />
                    </View>
                    <View style={styles.roleSelectionSection}>
                        <Button
                            textStyle={{
                                fontSize: fontSizes.size14,
                            }}
                            style={styles.buttonStyle}
                            title={stringConstants.signupFormUserRolesTabVendorTitle}
                            buttonType={role === roles.vendor ? buttonTypes.primary : buttonTypes.secondary}
                            onPress={_ => onRoleChange(roles.vendor)}
                        />
                    </View>
                </View>
                <InputBox
                    placeholder={stringConstants.nameFieldTitle}
                    errorText={errorString}
                    onChangeText={val => onInputFieldChange({ val, key: 'name' })}
                    value={name}
                />
                {role === roles.vendor && <InputBox
                    containerStyle={{ marginTop: 10 }}
                    placeholder={stringConstants.unitNameFieldTitle}
                    errorText={errorString}
                    onChangeText={val => onInputFieldChange({ val, key: 'shop_name' })}
                    value={shop_name}
                />}

            </View>}/>;

    }
}

const styles = StyleSheet.create({
    welcomelineContainer: { width: "100%", alignItems: "center", paddingVertical: 5 },
    welcomelineText: { color: colors.PRIMARY_COLOR_1, fontFamily: fonts.MeriendaBold, fontSize: fontSizes.size14 },
    buttonContainer: {
        flexDirection: "row",
        paddingBottom: 5,
        justifyContent: "space-around"
    },
    buttonStyle: { width: 100, height: 35, borderRadius: sizes.borderRadius },
    container: { paddingVertical: 20, paddingHorizontal: 20, justifyContent: "center", width: "100%" },
    roleSelectionSection: { marginVertical: 10 }
});
