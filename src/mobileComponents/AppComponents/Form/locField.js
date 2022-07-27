import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AntDesignIcon from "react-native-vector-icons/AntDesign";

import stringConstants from "../../../constants/mobileStringConstants";
import { colors, fontStyle, fonts, fontSizes, sizes } from "../../../mobileTheme";
import { Button } from "../index";
import { buttonTypes } from "../../../constants";


export default class LocField extends React.Component {

    constructor(props) {
        super(props);
        this.onRemoveAddressClick = this.onRemoveAddressClick.bind(this);
    }

    onRemoveAddressClick(index) {
        const { fieldData } = this.props;
        fieldData && fieldData.onFieldClick && fieldData.onFieldClick({
            val: (!fieldData.multiple ? null : [...fieldData.value.filter((addr, addrIndex) => addrIndex !== index)]),
            fieldName: fieldData.name,
            fieldDef: fieldData
        });
    }

    render() {

        const { onPress, fieldData, value, error, placeholder } = this.props;
        const finalValue = value ? (fieldData && fieldData.multiple ? value : [value]) : undefined;
        const showAddNewAddress = fieldData.multiple || !value;

        return <View style={styles.container}>
            <Text style={styles.title}>{placeholder}</Text>
            {finalValue && finalValue.length > 0 && finalValue.map((address, index) => <View
                style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, marginTop: 5 }}>
                    <Text style={styles.data}>{address && address.name}</Text>
                    <Text style={styles.subData}>{address && address.address}</Text>
                </View>
                <AntDesignIcon
                    onPress={_ => this.onRemoveAddressClick(index)}
                    name={"delete"}
                    size={15}
                    color={colors.BLACK_SHADE_60}
                />
            </View>)}
            <View style={{
                flexDirection: 'row'
            }}>
                {showAddNewAddress && <Button
                    buttonType={buttonTypes.secondary}
                    textStyle={{ fontSize: fontSizes.size12 }}
                    style={{
                        height: undefined,
                        borderWidth: 0,
                        backgroundColor: colors.TRANSPARENT,
                        paddingVertical: 2,
                        marginTop: 5,
                        elevation: 0,
                        width: undefined
                    }}
                    title={stringConstants.addNewAddressButtonTitle}
                    onPress={onPress}
                />}
            </View>

        </View>
    }
}

const styles = StyleSheet.create({
    touchBoxStyle: {
        height: sizes.inputBoxHeight,
    },
    data: {
        ...fontStyle,
        color: colors.BLACK_SHADE_60,
        fontSize: fontSizes.size10,
    },
    subData: {
        ...fontStyle,
        color: colors.BLACK_SHADE_10,
        fontSize: fontSizes.size8,
    },
    title: {
        marginBottom: 5,
        fontFamily: fonts.MeriendaBold,
        paddingTop: 2,
        flex: 1,
        color: colors.BLACK_SHADE_60,
        fontSize: fontSizes.size14,
    },
    container: {
        position: 'relative',
    }
});