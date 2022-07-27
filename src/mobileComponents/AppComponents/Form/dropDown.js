import React from 'react';
import get from 'lodash/get';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { Dropdown } from 'react-native-material-dropdown';

import InputField from './inputField';
import { colors, sizes, fontSizes, fonts } from '../../../mobileTheme';

const defaultHeight = sizes.inputBoxHeight;

export default class DropDown extends React.Component {
    static defaultProps = {
        displayKey: '',
        options: [],
        backgroundColor: undefined,
        multiple: false,
        fontSize: fontSizes.size14,
    };

    constructor(props) {
        super(props);
        this.getDisplayVal = this.getDisplayVal.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    onChangeText(data) {
        const { valueKey, fieldDef, fieldName, value, onFieldClick, multiple, resetOnSelect } = this.props;
        const currentVal = data[valueKey];
        let val = "";
        if (multiple) {
            if (value && value.indexOf(currentVal) > -1) {
                val = [...value.filter(_ => (_ !== currentVal))]
            } else {
                val = value ? [...value, currentVal] : [currentVal]
            }
        } else {
            val = data[valueKey]
        }
        valueKey && onFieldClick && onFieldClick({ fieldDef, val, fieldName, resetOnSelect });
    }

    getDisplayVal() {
        const { optionsMapping, value, displayKey, multiple } = this.props;
        let displayVal = '';
        if (multiple) {
            for (const valCount in value) {
                displayVal += `${displayVal.length > 0 ? ', ' : ''}${get(optionsMapping, `${value[valCount]}.${displayKey}`)}`
            }
        } else {
            displayVal = optionsMapping && optionsMapping[value] && optionsMapping[value][displayKey];
        }
        return displayVal
    }

    render() {
        const { displayKey, error, mode, fontSize, backgroundColor, placeholder, options, height } = this.props;


        return <View style={styles.container}>
            <TouchableOpacity
                style={styles.inputFieldContainer}
                onPress={_ => {
                }}>
                <InputField
                    mode={mode}
                    style={{ fontSize, height, backgroundColor }}
                    error={error}
                    placeholder={placeholder}
                    value={this.getDisplayVal()}
                />
            </TouchableOpacity>
            {/* <Dropdown
                labelExtractor={(item, index) => item[displayKey]}
                valueExtractor={(item, index) => item}
                onChangeText={this.onChangeText}
                renderBase={_ => <View
                    style={[styles.renderBaseStyle, { height: height ? (height + 10) : (defaultHeight + 10) }]}/>}
                data={options}


                // <----------------this was already commented ------------->
                // dropdownPosition={0}
                // containerStyle={{
                // opacity: 0,
                // backgroundColor: 'green',
                //}}
                // baseColor={'blue'}
                // textColor={'red'}
                // dropdownOffset={{ top: 0, left: 0 }}
                // dropdownMargins={{ min: 8, max: 16 }}
                // style={}
                // labelTextStyle={{ color: 'red', fontFamily: fonts.MeriendaBold }}
                // pickerStyle={{ fontFamily: fonts.MeriendaBold, color: 'red' }}
                // itemTextStyle={{ fontFamily: fonts.MeriendaBold, color: 'red' }}
                // label=''
            /> */}
        </View>
    }
}
const styles = StyleSheet.create({
    container: { position: 'relative', minWidth: 100, justifyContent: 'flex-end' },
    inputFieldContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
    renderBaseStyle: { opacity: 0 },
});