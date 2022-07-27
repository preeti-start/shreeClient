import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import { colors, fontSizes } from '../mobileTheme';
import { Form, Button } from './index';
import LoadingComp from "./Loading/index";

export default class AppFormHolder extends React.Component {


    render() {
        const { formFieldsGroups, isAppLoading, onBackPress, submitButton, errorJson, headerTitle } = this.props;
        return <View style={{ flex: 1 }}>

            {isAppLoading && <LoadingComp/>}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        overflow: 'hidden',
        borderRadius: 5,
        marginTop: -20,
        height: 50,
        width: '80%',
        paddingLeft: '30%',
    },
    titleContainer: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingLeft: 30,
        flexDirection: 'row',
    },
    titleText: {
        paddingLeft: 40,
        fontSize: fontSizes.size30,
        color: colors.WHITE_SHADE_90,
    },
    formContainer: {
        marginTop: 83,
        width: '95%',
        flex: 4,
        backgroundColor: colors.WHITE_SHADE_80,
        borderRadius: 5,
        paddingLeft: 10,
        paddingTop: 10,
    },
    bgColorBackground: {
        flex: 1,
        width: "100%",
        paddingBottom: 5,
        alignItems: 'center',
    }
});