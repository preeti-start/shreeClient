import React, { Component } from 'react';
import get from "lodash/get";
import { View, StyleSheet, Text } from 'react-native';

import FormContainer from "../mobileContainers/FormContainer";
import { isImgUrlExists } from "../utils/functions";
import { profileHeader, selectPhotoTapped } from "../utils/mobileFunctions";
import stringConstants from "../constants/mobileStringConstants";
import { PopUp } from "./AppComponents";
import { colors, fonts, fontStyle } from "../mobileTheme";

export default class BuyerProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOptionPopupActive: false,
            onImageSelect: undefined
        };
        this.toggleOptionPopup = this.toggleOptionPopup.bind(this);
        this.onOptionSelect = this.onOptionSelect.bind(this);
        this.renderFormHeader = this.renderFormHeader.bind(this);
    }

    toggleOptionPopup(prop) {
        this.setState(prevState => ({
            onImageSelect: prop && prop.onImageSelect,
            isOptionPopupActive: !prevState.isOptionPopupActive
        }))
    }

    renderFormHeader({ formData, onClick, onImageSelect }) {

        const {
            onSaveClick, buyerDetails,
        } = this.props;

        return profileHeader({
            onClick,
            onSavePress: onSaveClick,
            phone_no: get(buyerDetails, 'phone_no'),
            onProfileImgClick: this.toggleOptionPopup,
            formData,
            imgUrl: isImgUrlExists({ data: formData, fieldName: "profile_img" }),
            onImageSelect
        });

    }

    onOptionSelect(option) {
        const { onImageSelect } = this.state;
        this.toggleOptionPopup();
        selectPhotoTapped(option).then(val => {
            const {
                headerProfileField,
            } = this.props;
            onImageSelect && onImageSelect({ val, fieldDef: headerProfileField })
        });

    }

    render() {

        const {
            fieldGroups, formData
        } = this.props;
        const { isOptionPopupActive } = this.state;

        return <View style={styles.container}>
            <FormContainer
                fieldsContainerStyle={{ paddingHorizontal: 15 }}
                containerStyle={{ padding: 0 }}
                header={this.renderFormHeader}
                formData={formData}
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
    optionsText: {
        paddingVertical: 20,
        paddingLeft: 20,
        ...fontStyle,
        color: colors.BLACK_SHADE_80,
        fontFamily: fonts.MeriendaBold,
    },
});