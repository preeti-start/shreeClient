import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

import { colors, sizes, fontSizes, fontStyle, fonts } from '../../mobileTheme';

export default class InputBox extends React.Component {

    static defaultProps = {
        style: {},
        containerStyle: {},
        getRef: _ => {
        },
        errorText: '',
        secureTextEntry: false,
    };

    render() {

        const {
            value, secureTextEntry, getRef, containerStyle, style, keyboardType,
            maxLength, onChangeText, placeholder, errorText
        } = this.props;
        // errorText todo : this error functionality is pending over the text input side
        const hasError = this.props.hasOwnProperty('errorText') && errorText.length > 0;

        return <View style={{ ...containerStyle }}>
            <TextInput
                secureTextEntry={secureTextEntry}
                ref={ref => getRef(ref)}
                keyboardType={keyboardType}
                maxLength={maxLength}
                placeholder={placeholder}
                style={[styles.inputStyle, {
                    ...style,
                    borderColor: hasError ? colors.PRIMARY_COLOR_2 : colors.BLACK_SHADE_5
                }]}
                value={value}
                onChangeText={onChangeText}
            />
            {hasError &&
            <Text style={styles.errorTextStyle}>{errorText}</Text>}
        </View>
    }
};
const styles = StyleSheet.create({
    inputStyle: {
        ...fontStyle,
        paddingLeft: 10,
        borderWidth: 1,
        height: 60,
        backgroundColor: colors.WHITE,
        borderRadius: sizes.borderRadius,
    },
    errorTextStyle: {
        fontSize: fontSizes.size10,
        marginVertical: 5,
        marginHorizontal: 5,
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.PRIMARY_COLOR_2
    }
});