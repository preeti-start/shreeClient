import React, { Component } from 'react';
import get from 'lodash/get';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Entypo from "react-native-vector-icons/Entypo";

import FormContainer from "../../mobileContainers/FormContainer";
import stringConstants from "../../constants/mobileStringConstants";
import { useAdminLocationForDelivery } from "../../constants";
import { colors, fontSizes, fonts, fontStyle } from "../../mobileTheme";
import { selectPhotoTapped, profileHeader } from "../../utils/mobileFunctions";
import { isImgUrlExists } from "../../utils/functions";
import { PopUp } from "../AppComponents";

export default class VendorProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOptionPopupActive: false,
            onImageSelect: undefined
        };
        this.renderFormHeader = this.renderFormHeader.bind(this);
        this.renderExtraChargesSlab = this.renderExtraChargesSlab.bind(this);
        this.toggleOptionPopup = this.toggleOptionPopup.bind(this);
        this.onOptionSelect = this.onOptionSelect.bind(this);
    }

    toggleOptionPopup(prop) {
        this.setState(prevState => ({
            onImageSelect: prop && prop.onImageSelect,
            isOptionPopupActive: !prevState.isOptionPopupActive
        }))
    }

    renderColTitle({ title, index }) {
        return <Text key={`col_title_${index}`}
                     style={[styles.groupTitleText, styles.groupTitleSubText]}>
            {title}
        </Text>
    }

    renderColVal({ val, index }) {
        return <Text key={`col_val_${index}`} style={styles.grpRowText}>{val}</Text>
    }

    renderSlabRowIcon({
                          onPress = _ => {
                          }, icon, style = {}
                      }) {
        return <TouchableOpacity onPress={onPress} style={[styles.iconsContainer, { ...style }]}>
            {/*<Text style={styles.iconStyle}>{label}</Text>*/}
            {icon}
        </TouchableOpacity>
    }

    onOptionSelect(option) {
        const { onImageSelect } = this.state;
        setTimeout(_ => {
            this.toggleOptionPopup();
        }, 10);
        selectPhotoTapped(option).then(val => {
            const {
                headerProfileField,
            } = this.props;
            onImageSelect && onImageSelect({ val, fieldDef: headerProfileField })
        });

    }

    renderExtraChargesSlab() {
        const {
            toggleAddSlab, vendorDetails, onDelSlabPress,
        } = this.props;
        const { delivery_amount_slabs } = vendorDetails;

        return <View style={styles.extraChargesContainer}>
            <View style={styles.groupHeaderContainer}>
                <Text style={styles.groupTitleText}>
                    {stringConstants.distanceSlabGropupTitle}
                </Text>
                <TouchableOpacity onPress={toggleAddSlab} style={styles.iconsContainer}>
                    <Entypo name={'plus'} color={colors.BLACK_SHADE_80} size={13}/>
                </TouchableOpacity>
            </View>
            <View>
                <View style={styles.groupSubHeaderContainer}>
                    {[stringConstants.distanceSlabFromFieldTitle,
                        stringConstants.distanceSlabToFieldTitle,
                        stringConstants.distanceSlabMinOrderAmountFieldTitle,
                        stringConstants.distanceSlabAmountFieldTitle].map((title, index) => this.renderColTitle({
                        title,
                        index
                    }))}
                    {this.renderSlabRowIcon({ style: { borderColor: 'transparent' } })}
                </View>
                <View>
                    {delivery_amount_slabs && delivery_amount_slabs.length > 0 && delivery_amount_slabs.map((slabVal, slabIndex) =>
                        <View style={styles.groupRowContainer} key={`${slabIndex}_slab`}>
                            {slabVal && [slabVal.from_distance,
                                slabVal.to_distance,
                                slabVal.min_order_amount,
                                slabVal.delivery_amount].map((val, index) => this.renderColVal({ val, index }))}
                            {this.renderSlabRowIcon({
                                onPress: _ => onDelSlabPress(slabIndex),
                                icon: <Entypo name={'cross'} color={colors.BLACK_SHADE_80} size={13}/>
                            })}
                        </View>)}
                </View>
            </View>
        </View>
    }

    renderFormHeader({ onClick, formData, onImageSelect }) {
        const {
            onSavePress, vendorDetails,
        } = this.props;

        return profileHeader({
            onClick,
            onSavePress,
            shop_number: get(vendorDetails, 'shop_number'),
            phone_no: get(vendorDetails, 'phone_no'),
            vendorDetails,
            imgUrl: isImgUrlExists({ data: formData, fieldName: "shop_img" }),
            onProfileImgClick: this.toggleOptionPopup,
            formData,
            onImageSelect
        });

    }

    render() {

        const {
            fieldGroups, formData, onFieldValChange
        } = this.props;
        const { isOptionPopupActive } = this.state;

        return <View style={styles.container}>
            <FormContainer
                onFieldValChange={onFieldValChange}
                fieldsContainerStyle={{ paddingHorizontal: 15 }}
                containerStyle={{ padding: 0 }}
                header={this.renderFormHeader}
                formData={formData}
                footer={!useAdminLocationForDelivery && this.renderExtraChargesSlab}
                fieldGroups={fieldGroups}
            />
            <PopUp
                title={stringConstants.chooseImgOptionsTitle}
                // animationType={'none'}
                // viewAnimation={'fadeInUp'}
                containerStyle={{
                    // justifyContent: 'flex-end',
                    // padding: 0,
                    // paddingHorizontal: 0,
                }}
                isPopUpActive={isOptionPopupActive}
                onCrossPress={this.toggleOptionPopup}
                popupView={_ => <View>
                    <Text style={styles.optionsText}
                          onPress={_ => this.onOptionSelect({ openCamera: true })}>
                        {stringConstants.imgSelectCameraOption}
                    </Text>
                    <Text style={[styles.optionsText, { paddingTop: 0 }]}
                          onPress={_ => this.onOptionSelect({ openPicker: true })}>
                        {stringConstants.imgSelectGalleryOption}
                    </Text>
                </View>}
            />
        </View>
    }
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    grpRowText: {
        flex: 1,
        paddingVertical: 5,
        fontSize: fontSizes.size10,
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.BLACK_SHADE_40,
    },
    groupHeaderContainer: {
        flexDirection: "row",
        paddingVertical: 10,
        alignItems: 'center'
    },
    groupTitleSubText: {
        fontSize: fontSizes.size10,
        color: colors.BLACK_SHADE_80
    },
    optionsText: {
        paddingVertical: 20,
        paddingLeft: 20,
        ...fontStyle,
        color: colors.BLACK_SHADE_80,
        fontFamily: fonts.MeriendaBold,
    },
    groupRowContainer: {
        flexDirection: "row",
        padding: 5,
        marginTop: 2,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: colors.BLACK_SHADE_10
    },
    groupSubHeaderContainer: {
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor: colors.BLACK_SHADE_10,
        padding: 5,
        borderRadius: 4,
    },
    groupTitleText: {
        color: colors.BLACK_SHADE_60,
        flex: 1,
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size14
    },
    iconsContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.BLACK_SHADE_20,
    },
    iconStyle: { fontWeight: "bold", fontSize: fontSizes.size20, color: colors.WHITE },
    extraChargesContainer: { marginBottom: 50, paddingHorizontal: 15 },
});
