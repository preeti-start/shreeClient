import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import TextInput from './inputField';
import { colors, fontStyle, fontSizes, sizes, fonts } from '../../../mobileTheme';
import stringConstants from '../../../constants/mobileStringConstants';
import EntypoIcon from "react-native-vector-icons/Entypo";

const initialState = {
    inputVal: ''
};

export default class StringMultiField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVal: initialState.inputVal,
        };
        this.onAddClick = this.onAddClick.bind(this);
        this.renderTextInput = this.renderTextInput.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onDelClick = this.onDelClick.bind(this);
    }

    onAddClick() {
        const { inputVal } = this.state;
        const { fieldData } = this.props;
        if (inputVal.length > 0 && fieldData && fieldData.onFieldClick) {
            fieldData.onFieldClick({
                val: fieldData.value ? [...fieldData.value, inputVal] : [inputVal],
                fieldName: fieldData.name
            });
            this.setState({ inputVal: initialState.inputVal })
        }
    }

    onValueChange(val) {
        this.setState({ inputVal: val })
    }

    renderTextInput({
                        hasError, selectionColor, multiline, underlineColorAndroid,
                        placeholderTextColor, placeholder, keyboardType
                    }) {
        const { inputVal } = this.state;
        return <TextInput
            error={hasError}
            selectionColor={selectionColor}
            keyboardType={keyboardType}
            underlineColorAndroid={underlineColorAndroid}
            multiline={multiline}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            value={inputVal}
            onChangeText={this.onValueChange}
        />
    }

    onDelClick({ dataIndex }) {
        const { fieldData } = this.props;
        if (fieldData && fieldData.onFieldClick) {
            fieldData.onFieldClick({
                val: [...fieldData.value.filter((val, index) => index !== dataIndex)],
                fieldName: fieldData.name
            })
        }
    }

    render() {
        const {
            selectionColor, multiline, underlineColorAndroid,
            placeholderTextColor, hasError, placeholder, keyboardType, fieldData
        } = this.props;

        return <View>
            <View style={styles.inputBoxContainer}>
                <View style={styles.inputBox}>
                    {this.renderTextInput({
                        hasError,
                        selectionColor,
                        multiline,
                        underlineColorAndroid,
                        placeholderTextColor,
                        placeholder,
                        keyboardType
                    })}
                </View>
                <TouchableOpacity onPress={this.onAddClick} style={styles.addButton}>
                    <Text style={styles.addButtonTitle}>{stringConstants.addButton}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.optionsContainer}>
                {fieldData && fieldData.value && fieldData.value.length > 0 && fieldData.value.map((val, index) =>
                    <TouchableOpacity style={styles.optionBox}>
                        <Text style={styles.optionsStyle}>{val}</Text>
                        <TouchableOpacity
                            onPress={_ => this.onDelClick({ dataIndex: index })}
                            style={styles.optionCross}>
                            <EntypoIcon name={"cross"} color={colors.BLACK_SHADE_60} size={17}/>
                        </TouchableOpacity>
                    </TouchableOpacity>)}
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    optionBox: {
        borderRadius: sizes.borderRadius,
        borderColor: colors.BLACK_SHADE_60,
        padding: 5,
        borderWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginRight: 10,
    },
    inputBoxContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    inputBox: { flex: 1 },
    optionCross: {
        marginLeft: 15,
    },
    optionsStyle: { ...fontStyle, fontSize: fontSizes.size12, color: colors.BLACK_SHADE_60 },
    addButtonTitle: {
        ...fontStyle,
        fontSize: fontSizes.size12,
        fontFamily: fonts.MeriendaBold,
        color: colors.WHITE,
    },
    optionsContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    addButton: {
        ...fontStyle,
        borderRadius: sizes.borderRadius,
        backgroundColor: colors.PRIMARY_COLOR_1,
        color: colors.WHITE,
        fontFamily: fonts.MeriendaBold,
        justifyContent: 'center',
        paddingHorizontal: 20,
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 5,
    }
});