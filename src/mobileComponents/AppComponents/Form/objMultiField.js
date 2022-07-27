import React from 'react';
import get from 'lodash/get';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import stringConstants from "../../../constants/mobileStringConstants";
import PopUp from "../../AppComponents/PopUp";
import FormContainer from "../../../mobileContainers/FormContainer";
import { colors, fontStyle, sizes, fonts, fontSizes } from "../../../mobileTheme";
import appStringConstants from "../../../constants/appStringConstants";
import { Label } from "native-base";
import { fieldTypes } from "../../../constants";

const editColId = 'edit_row';
const delColId = 'del_row';

export default class ObjMultiField extends React.Component {

    static defaultProps = {
        showInsertOption: true,
        showDelOption: true
    };

    constructor(props) {
        super(props);
        this.getFinalTableFields = this.getFinalTableFields.bind(this);
        this.onDelClick = this.onDelClick.bind(this);
        this.onInsertClick = this.onInsertClick.bind(this);
        this.onUpdateClick = this.onUpdateClick.bind(this);
        this.renderRowValue = this.renderRowValue.bind(this);
        this.toggleInsertModal = this.toggleInsertModal.bind(this);
        this.toggleUpdateModal = this.toggleUpdateModal.bind(this);
        this.state = {
            isUpdateModalActive: false,
            isInsertModalActive: false
        }
    }

    toggleUpdateModal(data) {
        this.setState(prevState => ({
            updatedRowData: data && data.data,
            updatedRowIndex: data && data.rowIndex,
            isUpdateModalActive: !prevState.isUpdateModalActive
        }))
    }

    toggleInsertModal() {
        this.setState(prevState => ({
            isInsertModalActive: !prevState.isInsertModalActive
        }))
    }

    onDelClick({ rowIndex }) {
        const { fieldData } = this.props;
        const value = fieldData.value.filter((val, index) => ((index + 1) !== rowIndex));
        if (fieldData.onFieldClick) {
            fieldData.onFieldClick({
                val: value,
                fieldDef: fieldData,
                fieldName: fieldData.name,
            });
        }
    }

    renderRowValue({ finalTableFieldValueMap, index, item }) {
        if (finalTableFieldValueMap && finalTableFieldValueMap.fields && finalTableFieldValueMap.fields.length > 0) {
            const finalRowStyle = [styles.rowContainer];
            if (index === 0) {
                finalRowStyle.push(styles.titleRowContainer);
            }
            return <View style={finalRowStyle}>
                {finalTableFieldValueMap.fields.map((fieldVal) => {
                    const finalValueStyle = [styles.colValue];
                    if (index === 0) {
                        finalValueStyle.push(styles.titleColValue);
                    } else if (fieldVal.style) {
                        // alert(JSON.stringify(item))
                        finalValueStyle.push(fieldVal.style({ data: item }))
                    }
                    if (fieldVal.name === editColId) {
                        return <View style={styles.actionCol}>
                            {index !== 0 && this.getActionButton({
                                isSubAction: true,
                                iconName: 'edit',
                                onPress: _ => this.toggleUpdateModal({ rowIndex: index, data: item })
                            })}
                        </View>
                    } else if (fieldVal.name === delColId) {
                        return <View style={styles.actionCol}>
                            {index !== 0 && this.getActionButton({
                                isSubAction: true,
                                iconName: 'cross',
                                title: stringConstants.crossButtonSymbol,
                                onPress: _ => this.onDelClick({ rowIndex: index })
                            })}
                        </View>
                    } else {
                        let finalDisplayVal = item[fieldVal.name];
                        if (finalDisplayVal && fieldVal.type === fieldTypes.fk &&
                            fieldVal.dataArray && fieldVal.displayKey && fieldVal.valueKey) {

                            // TODO: this iteration because of .filter can be further optimised
                            const valObj = fieldVal.dataArray.filter(listItem =>
                                listItem[fieldVal.valueKey] === finalDisplayVal);

                            finalDisplayVal = (valObj && valObj.length > 0) ? valObj[0][fieldVal.displayKey] : finalDisplayVal;
                        } else if (fieldVal.type === fieldTypes.boolean) {
                            if (index !== 0 && get(item, `${fieldVal.name}`, false)) {
                                finalDisplayVal = JSON.stringify(get(item, `${fieldVal.name}`, false))
                            }
                        } else if (fieldVal.type === fieldTypes.string && fieldVal.multiple &&
                            finalDisplayVal && Array.isArray(finalDisplayVal) && finalDisplayVal.length > 0) {
                            finalDisplayVal = finalDisplayVal.join(', ')
                        }
                        return <View style={[styles.valueCol, { flex: fieldVal.width }]}>
                            <Text style={finalValueStyle}>
                                {finalDisplayVal}
                            </Text>
                        </View>
                    }
                })}
            </View>
        }
        return null;
    }

    onUpdateClick({ formData }) {
        const { fieldData } = this.props;
        const { updatedRowIndex } = this.state;
        const value = fieldData.value.map((val, index) => ((index + 1) === updatedRowIndex) ? formData : val);
        if (fieldData.onFieldClick) {
            fieldData.onFieldClick({
                val: value,
                fieldDef: fieldData,
                fieldName: fieldData.name,
            });
            this.toggleUpdateModal();
        }
    }

    onInsertClick({ formData }) {
        const { fieldData } = this.props;
        const value = fieldData.value ? fieldData.value : [];
        value.push(formData);
        if (fieldData.onFieldClick) {
            fieldData.onFieldClick({
                fieldDef: fieldData,
                val: value,
                fieldName: fieldData.name,
            });
            this.toggleInsertModal();
        }
    }

    renderInsertUpdateModal({ formData = undefined, isModalActive, fieldData, onClick, toggleModal }) {
        return <PopUp
            title={fieldData.renderTitle ? fieldData.renderTitle({ formData }) : appStringConstants.selectOptionsPopupTitle(fieldData.title)}
            isPopUpActive={isModalActive}
            onCrossPress={toggleModal}
            popupView={_ => <FormContainer
                formData={formData}
                clickActions={[
                    { title: appStringConstants.saveButtonTitle, onClick }
                ]}
                fieldGroups={[
                    {
                        fields: fieldData.fields.filter(field => get(field, 'showInForm', true))
                    }
                ]}
            />}
        />
    }

    getFinalTableFields({ fieldData }) {
        const { showDelOption } = this.props;
        const finalTableFieldValueMap = { fields: [], value: [] };
        if (fieldData && fieldData.fields && fieldData.fields.length > 0) {

            // field added for edit and del section
            finalTableFieldValueMap.fields = [...fieldData.fields, { name: editColId }];
            if (showDelOption) {
                finalTableFieldValueMap.fields.push({ name: delColId })
            }

            const headerKeysMapping = {};
            for (const fieldCount in fieldData.fields) {
                headerKeysMapping[fieldData.fields[fieldCount].name] = fieldData.fields[fieldCount].listTitle ?
                    fieldData.fields[fieldCount].listTitle : fieldData.fields[fieldCount].title
            }
            finalTableFieldValueMap.value.push(headerKeysMapping);
            if (fieldData.value) {
                finalTableFieldValueMap.value = [...finalTableFieldValueMap.value, ...fieldData.value]
            }
        }
        return finalTableFieldValueMap;
    }

    getActionButton({ title, iconName, isSubAction = false, renderTitle, onPress }) {
        return <TouchableOpacity onPress={onPress}
                                 style={[styles.multiObjectActionButton, (isSubAction ? styles.multiObjectSubActionButton : {})]}>
            <Entypo name={iconName} color={isSubAction ? colors.BLACK_SHADE_40 : colors.WHITE} size={10}/>
        </TouchableOpacity>
    }

    render() {

        const { isUpdateModalActive, isInsertModalActive, updatedRowData } = this.state;
        const { labelStyle, fieldData, error, showInsertOption } = this.props;
        const finalTableFieldValueMap = this.getFinalTableFields({ fieldData });
        return <View>
            {/* {fieldData && fieldData.title && <View style={styles.labelContainer}>
                <View style={styles.labelBox}>
                    <Label style={labelStyle}>
                        {fieldData.title}
                    </Label>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
                {showInsertOption && this.getActionButton({
                    iconName: 'plus',
                    title: stringConstants.addButtonSymbol, onPress: this.toggleInsertModal
                })}
            </View>} */}
            <FlatList
                data={finalTableFieldValueMap.value}
                renderItem={({ item, index }) => this.renderRowValue({ finalTableFieldValueMap, index, item })}
            />
            {this.renderInsertUpdateModal({
                isModalActive: isUpdateModalActive,
                onClick: this.onUpdateClick,
                fieldData,
                formData: updatedRowData,
                toggleModal: this.toggleUpdateModal,
            })}
            {this.renderInsertUpdateModal({
                isModalActive: isInsertModalActive,
                onClick: this.onInsertClick,
                fieldData,
                toggleModal: this.toggleInsertModal,
            })}
        </View>
    }
}


const styles = StyleSheet.create({
    actionCol: { width: 40, alignItems: 'center' },
    rowContainer: {
        borderRadius: sizes.borderRadius,
        paddingVertical: 10,
        flex: 1,
        borderWidth: 1,
        marginBottom: 2,
        borderColor: colors.BLACK_SHADE_5,
        display: 'flex',
        flexDirection: 'row'
    },
    titleRowContainer: {
        backgroundColor: colors.BLACK_SHADE_10
    },
    multiObjectActionButton: {
        width: 20,
        height: 20,
        backgroundColor: colors.PRIMARY_COLOR_1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    multiObjectSubActionButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.BLACK_SHADE_40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionContainer: {
        width: 20
    },
    labelContainer: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
    },
    valueCol: {
        paddingLeft: 5,
    },
    labelBox: { flex: 1 },
    errorText: { ...fontStyle, marginTop: 5, color: colors.PRIMARY_COLOR_2, fontSize: fontSizes.size8 },
    colValue: {
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.BLACK_SHADE_60,
        fontSize: fontSizes.size10
    },
    titleColValue: {
        fontFamily: fonts.MeriendaBold,
        color: colors.BLACK_SHADE_80,
    },
    modalContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    modalBg: {
        maxHeight: 300,
        padding: 10,
        borderRadius: sizes.borderRadius,
        backgroundColor: colors.PRIMARY_BG_COLOR_1
    },
    modalHeader: { flexDirection: "row", justifyContent: "flex-end" },
    modalCrossText: { fontSize: fontSizes.size20, fontWeight: "bold" },
});