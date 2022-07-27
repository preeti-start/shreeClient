import React from 'react';
import get from 'lodash/get';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Text } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";

import { showSelectImageLink } from "../../../utils/functions";
import { colors, fontStyle, fonts, sizes } from "../../../mobileTheme";
import { selectPhotoTapped } from "../../../utils/mobileFunctions";
import { actionsOnImage } from "../../../constants";
import stringConstants from "../../../constants/mobileStringConstants";
import { PopUp } from "../index";
import ZoomImages from "../../Popups/ZoomImages";

const imgContainerDim = 60;

export default class ImgInputField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOptionPopupActive: false,
            zoomImg: undefined,
            isZoomImagePopupActive: false
        };
        this.removePhotoTapped = this.removePhotoTapped.bind(this);
        this.onOptionSelect = this.onOptionSelect.bind(this);
        this.toggleOptionPopup = this.toggleOptionPopup.bind(this);
        this.renderSelectPhoto = this.renderSelectPhoto.bind(this);
        this.toggleZoomImagePopup = this.toggleZoomImagePopup.bind(this);
    }

    toggleOptionPopup() {
        this.setState(prevState => ({ isOptionPopupActive: !prevState.isOptionPopupActive }))
    }

    toggleZoomImagePopup(prop) {
        this.setState(prevState => ({
            zoomImg: get(prop, 'img'),
            isZoomImagePopupActive: !prevState.isZoomImagePopupActive
        }))
    }

    onOptionSelect(option) {
        const { fieldData } = this.props;
        const multiple = get(fieldData, 'multiple', false);
        option.multiple = multiple;
        this.toggleOptionPopup();
        selectPhotoTapped(option).then(val => {
            fieldData.onFieldClick && fieldData.onFieldClick({
                val,
                fieldDef: fieldData,
            });
        })
    }

    renderSelectPhoto() {
        return <TouchableOpacity
            onPress={this.toggleOptionPopup}
            style={styles.imgSelectButton}>
            <Entypo style={{ opacity: 0.5 }} name={"camera"} color={colors.BLACK_SHADE_5} size={30}/>
        </TouchableOpacity>
    }

    renderImageVal({ removePhotoTapped, imgIndex, imgData }) {
        return <TouchableOpacity onPress={_ => this.toggleZoomImagePopup({ img: imgData })}>
            <ImageBackground
                imageStyle={{ resizeMode: 'stretch' }}
                key={`${imgIndex}_image`} source={{ uri: imgData.url }}
                style={styles.imgContainer}
            >
                <TouchableOpacity onPress={removePhotoTapped} style={styles.crossIconContainer}>
                    <Entypo name={"cross"} color={colors.WHITE} size={15}/>
                </TouchableOpacity>
            </ImageBackground>
        </TouchableOpacity>
    }

    removePhotoTapped({ imgData }) {
        const { fieldData } = this.props;
        fieldData.onFieldClick && fieldData.onFieldClick({
            val: imgData,
            actionType: actionsOnImage.del,
            fieldDef: fieldData,
        })
    }

    render() {

        const { isOptionPopupActive, isZoomImagePopupActive, zoomImg } = this.state;
        const { fieldData } = this.props;
        const gotImgFieldValue = fieldData.hasOwnProperty("value") && fieldData.value !== undefined && fieldData.value !== null
            && typeof fieldData.value === "object";
        const isMultipleTypeField = fieldData && fieldData.multiple && fieldData.multiple === true;

        return <View
            style={styles.imgFieldContainer}>

            {fieldData.hasOwnProperty("value") && isMultipleTypeField && fieldData.value &&
            Array.isArray(fieldData.value) && fieldData.value.length > 0 &&
            fieldData.value.map((imgData, imgIndex) => this.renderImageVal({
                imgData,
                imgIndex,
                removePhotoTapped: _ => this.removePhotoTapped({
                    imgData,
                })
            }))}

            {!isMultipleTypeField && gotImgFieldValue &&
            this.renderImageVal({
                imgData: fieldData.value,
                removePhotoTapped: _ => this.removePhotoTapped({
                    imgData: fieldData.value,
                })
            })}

            {showSelectImageLink({
                multiple: fieldData.multiple,
                value: fieldData.value,
                maxLimit: fieldData.maxLimit
            }) && this.renderSelectPhoto()}

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

            <PopUp
                // title={stringConstants.chooseImgOptionsTitle}
                // animationType={'none'}
                // viewAnimation={'fadeInUp'}
                containerStyle={{
                    // justifyContent: 'flex-end',
                    padding: 0,
                    backgroundColor: colors.BLACK_SHADE_60,
                    paddingHorizontal: 0,
                }}
                isPopUpActive={isZoomImagePopupActive}
                onCrossPress={this.toggleZoomImagePopup}
                popupView={_ => <ZoomImages
                    onCrossPress={this.toggleZoomImagePopup}
                    images={[zoomImg]}
                />}
            />

        </View>
    }

}

const styles = StyleSheet.create({
    imgFieldContainer: { flexDirection: "row", marginVertical: 10, flexWrap: "wrap" },
    optionsText: {
        paddingVertical: 20,
        paddingLeft: 20,
        ...fontStyle,
        color: colors.BLACK_SHADE_80,
        fontFamily: fonts.MeriendaBold,
    },
    crossIconContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.PRIMARY_COLOR_2,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9,
    },
    imgContainer: {
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden',
        borderColor: colors.BLACK_SHADE_60,
        borderRadius: sizes.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        width: imgContainerDim,
        height: imgContainerDim
    },
    imgSelectButton: {
        backgroundColor: colors.WHITE,
        borderRadius: sizes.borderRadius,
        borderColor: colors.BLACK_SHADE_60,
        borderWidth: 1,
        width: imgContainerDim,
        height: imgContainerDim,
        alignItems: "center",
        justifyContent: "center",
    }
});