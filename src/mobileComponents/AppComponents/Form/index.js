import React, { Component } from 'react';
import {
    StyleSheet,
    View, ScrollView, Text
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import DatePicker from 'react-native-datepicker';
import * as Animatable from "react-native-animatable";
import get from "lodash/get";

import TextInput from './inputField';
import DropDown from './dropDown';
import { colors, sizes, fontSizes, fonts } from '../../../mobileTheme';
import { fieldTypes } from '../../../constants/index';
import { getDropdownFieldValueKeyMapping } from '../../../utils/functions';
import Button from "../Button";
import StringMultiField from "./stringMultiField";
import ImgInputField from "./imgInputField";
import ObjMultiField from "./objMultiField";
import LocField from "./locField";
import SwitchComp from "../Switch";
import appStringConstants from "../../../constants/mobileStringConstants";


export default class FormComp extends Component {
    static defaultProps = {
        inputBoxBgColor: colors.WHITE,
        containerStyle: {},
        clickActionsStyle: {},
        fieldsContainerStyle: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            dateFieldVal: props.dateFieldVal,
        };
        this.renderLocationField = this.renderLocationField.bind(this);
        this.renderFkField = this.renderFkField.bind(this);
        this.renderDateField = this.renderDateField.bind(this);
        this.renderBooleanField = this.renderBooleanField.bind(this);
        this.onSearchLocClick = this.onSearchLocClick.bind(this);
        this.renderStringField = this.renderStringField.bind(this);
    }

    openSearchModal({ onFieldClick, fieldDef, fieldName }) {
        RNGooglePlaces.openPlacePickerModal()
            .then((place) => {
                // console.log(place);
                if (place.address && place.name && place.longitude && place.latitude) {
                    const val = {
                        coordinates: [place.longitude, place.latitude],
                        address: place.address,
                        name: place.name,
                    };
                    onFieldClick && onFieldClick({
                        val: (!fieldDef.multiple ? val : (fieldDef.value ? [...fieldDef.value, val] : [val])),
                        fieldName,
                        fieldDef
                    });
                } else {
                    alert(appStringConstants.invalidAddressAlert)
                }

                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }

    onSearchLocClick({ fieldData }) {
        if (fieldData.onFieldClick) {
            this.openSearchModal({
                onFieldClick: fieldData.onFieldClick,
                fieldName: fieldData.name,
                fieldDef: fieldData,
            })
        }
    }

    renderLocationField({ fieldData }) {
        const { errorJson } = this.props;
        return <LocField
            fieldData={fieldData}
            error={fieldData && fieldData.name && errorJson && errorJson[fieldData.name]}
            onPress={_ => this.onSearchLocClick({ fieldData })}
            placeholder={fieldData.placeholder}
            value={fieldData.value && fieldData.value}
        />
    }

    renderDateField({ fieldData }) {
        let { inputBoxBgColor } = this.props;

        return <View style={styles.commonFieldContainer}>
            <View
                style={[styles.dateInputStyle, { backgroundColor: inputBoxBgColor }]}>
                <DatePicker
                    showIcon={false}
                    date={fieldData.value}
                    // minDate={this.state.minDate}
                    // maxDate={this.state.maxDate}
                    mode="date"
                    placeholder="select date"
                    format="DD/MM/YYYY"
                    // confirmBtnText="Confirm"
                    // cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            right: 5,
                            top: 4,
                            marginLeft: 0,
                        },
                        dateText: { fontSize: 15, color: colors.PRIMARY_COLOR_1 },
                        dateInput: {
                            // height:35,
                            // backgroundColor: colors.PRIMARY_COLOR_1,
                            // marginLeft: 36,
                            borderWidth: 0,
                            // borderColor: colors.PRIMARY_COLOR_1
                        },
                    }}
                    onDateChange={(date) => {
                        // alert(date)
                        if (fieldData.onFieldClick) {
                            fieldData.onFieldClick({
                                val: date,
                                fieldName: fieldData.name,
                                fieldDef: fieldData
                            });
                        }
                    }}
                />
            </View>
        </View>
    }

    renderFkField({ fieldData }) {
        let { errorJson } = this.props;
        let { name, dataArray = [], displayKey, resetOnSelect, onFieldClick, multiple, valueKey, value, placeholder } = fieldData;
        return <View style={styles.commonFieldContainer}>
            <DropDown
                fieldDef={fieldData}
                error={name && errorJson && errorJson[name]}
                placeholder={placeholder}
                value={value}
                multiple={multiple}
                valueKey={valueKey}
                displayKey={displayKey}
                options={dataArray}
                fieldName={name}
                optionsMapping={getDropdownFieldValueKeyMapping({ options: dataArray, valueKey })}
                onFieldClick={onFieldClick}
                resetOnSelect={resetOnSelect}
            />
        </View>
    }

    renderBooleanField({ fieldData }) {
        return <View style={styles.booleanFieldContainer}>
            <SwitchComp
                onValueChange={(val) => {
                    if (fieldData.onFieldClick) {
                        fieldData.onFieldClick({
                            resetOnSelect: fieldData.resetOnSelect,
                            val,
                            fieldDef: fieldData,
                            fieldName: fieldData.name
                        });
                    }
                }}
                value={fieldData.value}/>
        </View>
    }

    renderTextInput({
                        hasError, selectionColor, multiline, underlineColorAndroid,
                        placeholderTextColor, placeholder, keyboardType, value, onChangeText, fieldData
                    }) {
        return <TextInput
            error={hasError}
            selectionColor={selectionColor}
            value={value}
            keyboardType={keyboardType}
            underlineColorAndroid={underlineColorAndroid}
            multiline={multiline}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            onChangeText={onChangeText}
            {...fieldData.props}
        />
    }

    renderStringField({ fieldData }) {
        let { errorJson, inputBoxBgColor } = this.props;
        const isMultipleField = fieldData.multiple;
        const hasError = fieldData.name && errorJson && errorJson[fieldData.name];
        const selectionColor = colors.PRIMARY_COLOR_1;
        const keyboardType = (fieldData.type === fieldTypes.number ? "numeric" : "default");
        const placeholder = fieldData.placeholder;
        const placeholderTextColor = colors.PRIMARY_COLOR_1;
        const underlineColorAndroid = "transparent";
        const multiline = fieldData.multiline ? fieldData.multiline : false;

        return <View style={styles.commonFieldContainer}>

            {isMultipleField && <StringMultiField
                hasError={hasError}
                selectionColor={selectionColor}
                keyboardType={keyboardType}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                underlineColorAndroid={underlineColorAndroid}
                multiline={multiline}
                fieldData={fieldData}
            />}

            {!isMultipleField && this.renderTextInput({
                hasError: hasError,
                selectionColor: selectionColor,
                keyboardType: keyboardType,
                placeholder: placeholder,
                placeholderTextColor: placeholderTextColor,
                underlineColorAndroid: underlineColorAndroid,
                multiline: multiline,
                value: fieldData.value,
                onChangeText: val => {
                    if (fieldData.onFieldClick) {
                        fieldData.onFieldClick({
                            resetOnSelect: fieldData.resetOnSelect,
                            val,
                            fieldName: fieldData.name,
                            fieldDef: fieldData,
                        });
                    }
                },
                fieldData
            })}
        </View>
    }

    renderFieldGroups() {
        let { fieldsContainerStyle, errorJson, fieldGroups, formData } = this.props;

        return <View style={[styles.fieldsContainerStyle, { ...fieldsContainerStyle }]}>

            {fieldGroups.map((fieldGroupData, fieldGroupindex) => {
                let fields = fieldGroupData.fields;

                return <Animatable.View animation="" key={fieldGroupindex} style={styles.fieldGroupContainer}>

                    {fieldGroupData && fieldGroupData.title &&
                    <View style={styles.fieldGrpTitleContainer}>
                        <Text style={styles.fieldGrpTitle}>{fieldGroupData.title}</Text>
                    </View>}

                    {fields && fields.length > 0 && fields.map((fieldData, index) => {

                        if (!fieldData.type) {
                            fieldData.type = fieldTypes.string
                        }
                        const isObjectMultiField = fieldData && fieldData.type && fieldData.type === fieldTypes.object && fieldData.multiple === true;
                        const hasRenderView = fieldData && fieldData.hasOwnProperty('renderView');

                        return <View key={index} style={styles.inputContainerStyle}>


                            {hasRenderView && fieldData.renderView({
                                formData,
                                fieldName: fieldData.name,
                                onFieldClick: fieldData.onFieldClick,
                            })}

                            {!hasRenderView && !isObjectMultiField && <View style={styles.formContainer}>

                                {fieldData && fieldData.title && <Text style={styles.labelStyle}>
                                    {fieldData.title}
                                </Text>}

                                <View style={styles.fieldsContainer}>

                                    {fieldData && fieldData.type && (fieldData.type === fieldTypes.string || fieldData.type === fieldTypes.number) &&
                                    this.renderStringField({ fieldData })}

                                    {fieldData && fieldData.type && fieldData.type === fieldTypes.location && this.renderLocationField({ fieldData })}

                                    {fieldData && fieldData.type && fieldData.type === fieldTypes.boolean && this.renderBooleanField({ fieldData })}

                                    {fieldData && fieldData.type && fieldData.type === fieldTypes.fk && this.renderFkField({ fieldData })}

                                    {fieldData && fieldData.type && fieldData.type === fieldTypes.date && this.renderDateField({ fieldData })}

                                </View>

                            </View>}

                            {!hasRenderView && isObjectMultiField &&
                            <ObjMultiField
                                error={fieldData && fieldData.name && errorJson && errorJson[fieldData.name]}
                                labelStyle={styles.labelStyle}
                                fieldData={fieldData}
                                showDelOption={get(fieldData, 'showDelOption')}
                                showInsertOption={get(fieldData, 'showInsertOption')}
                            />}

                            {!hasRenderView && fieldData && fieldData.type && fieldData.type === fieldTypes.image &&
                            <ImgInputField
                                fieldData={fieldData}
                            />}

                        </View>;
                    })}
                </Animatable.View>;
            })}
        </View>
    }

    render() {

        let { containerStyle, clickActions, fieldGroups, clickActionsStyle, header, footer } = this.props;
        const actionsMargin = 5;

        return <View style={styles.container}>
            <ScrollView
                style={[styles.scrollViewStyle, containerStyle]}
                keyboardShouldPersistTaps={"always"}
            >

                {header && header()}

                {fieldGroups && fieldGroups.length > 0 && this.renderFieldGroups()}

                {footer && footer()}

                {clickActions && clickActions.length > 0 &&
                <View style={[styles.clickActionsContainer, clickActionsStyle]}>
                    {clickActions.map((actionData, index) => {
                        actionData.style = actionData.style ? actionData.style : {};
                        return <View
                            style={{ marginLeft: index > 0 ? actionsMargin : 0, flex: 1 }}>
                            <Button
                                textStyle={actionData.textStyle}
                                buttonType={actionData.buttonType}
                                isLoading={actionData.isLoading}
                                style={{
                                    ...actionData.style,
                                    width: '100%',
                                }}
                                title={actionData && actionData.title}
                                onPress={actionData.onClick}
                            />
                        </View>
                    })}
                </View>}

            </ScrollView>

        </View>;
    }
}


const styles = StyleSheet.create({
    container: { backgroundColor: colors.WHITE },
    scrollViewStyle: {
        padding: 15,
    },
    labelStyle: {
        fontFamily: fonts.MeriendaBold,
        paddingTop: 2,
        flex: 1,
        color: colors.BLACK_SHADE_60,
        fontSize: fontSizes.size14,
    },
    dateInputStyle: {
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.PRIMARY_COLOR_1,
        flex: 2.5,
        height: sizes.inputBoxHeight,
        borderRadius: sizes.borderRadius,
    },
    fieldsContainer: { flex: 1, marginBottom: 15 },
    formContainer: { flex: 1, flexDirection: "row" },
    commonFieldContainer: { flex: 2.5 },
    booleanFieldContainer: { alignItems: 'flex-end' },
    fieldsContainerStyle: {
        flex: 1,
    },
    fieldGrpTitle: {
        color: colors.PRIMARY_COLOR_1,
        fontFamily: fonts.MeriendaBold,
    },
    fieldGrpTitleContainer: { paddingTop: 10, paddingBottom: 10 },
    fieldGroupContainer: { marginBottom: 5, flex: 1 },
    clickActionsContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        justifyContent: 'center',
    },
    inputContainerStyle: { flex: 1 },

});
