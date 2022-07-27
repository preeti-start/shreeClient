import React from "react";
import get from "lodash/get";
import { Alert, Text, ToastAndroid, StyleSheet, View } from "react-native";
import { NavigationActions } from "react-navigation";
import q from "q";
import ImagePicker from 'react-native-image-crop-picker';
import * as Animatable from "react-native-animatable";

import { colors, fontSizes, fonts, fontStyle } from '../mobileTheme';
import { onAddToCartPress } from './functions';
import stringConstants from "../constants/mobileStringConstants";
import { appRoutes, orderStatus, userNotifications } from "../constants";
import { Button } from "../mobileComponents/AppComponents";
import ProfileImg from "../mobileComponents/ProfileImg";


export const profileHeader = ({ imgUrl, onProfileImgClick, phone_no, shop_number, onClick, formData, onSavePress, onImageSelect }) => {
    return <View>
        <ProfileImg onProfileImgClick={_ => onProfileImgClick({ onImageSelect })}
                    imgUrl={imgUrl}
        />
        <View style={styles.formTitleContainer}>

            <View style={styles.formTitleSeperator}/>

            <View style={styles.formTitleDataContainer}>
                {shop_number && <Text
                    style={styles.formTitleMainData}>
                    {shop_number}
                </Text>}
                {phone_no && <Text style={styles.formTitleSubData}>
                    {phone_no}
                </Text>}
            </View>

            <View style={styles.formTitleButtonContainer}>
                <Button
                    textStyle={{ fontSize: fontSizes.size12 }}
                    style={{ height: 40, width: 100 }}
                    title={stringConstants.saveButtonTitle}
                    onPress={_ => onClick(_ => {
                        onSavePress({ formData })
                    })}
                />
            </View>

        </View>
    </View>
};

export const getFinalPrizeString = ({ data, quantity, showPrize = true, showNetPrize = false }) => {

    if (data && data.per_item_price && data.measuring_unit_id && data.measuring_unit_id.short_name) {
        let finalPrize = data.per_item_price;
        if (data.discount) {
            finalPrize = (finalPrize / 100) * (100 - data.discount);
        }
        const hasDiscount = get(data, 'discount', 0) > 0;

        return <View>
            {showPrize && <Text
                style={{
                    fontSize: fontSizes.size10,
                    fontFamily: fonts.MeriendaOneRegular,
                    color: colors.BLACK_SHADE_80
                }}>
                {stringConstants.itemPerUnitPriceStringOnItemListAndDetailView(
                    finalPrize,
                    data.measuring_unit_id.short_name,
                    stringConstants.currencySymbol
                )}
            </Text>}
            {showPrize && hasDiscount && <Text
                style={{
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    fontSize: fontSizes.size10,
                    fontFamily: fonts.MeriendaOneRegular,
                    color: colors.BLACK_SHADE_20
                }}>
                {stringConstants.itemPerUnitPriceStringOnItemListAndDetailView(
                    data.per_item_price,
                    data.measuring_unit_id.short_name,
                    stringConstants.currencySymbol
                )}
            </Text>}
            {showPrize && hasDiscount && <Text style={{
                fontSize: fontSizes.size8,
                fontFamily: fonts.MeriendaOneRegular,
                color: colors.PRIMARY_COLOR_3
            }}>
                {stringConstants.itemPriceDiscountString(data.discount)}
            </Text>}
            {showNetPrize && <Text
                style={{ ...fontStyle, paddingTop: 10, color: colors.PRIMARY_COLOR_4, fontSize: fontSizes.size12 }}>
                {stringConstants.itemTotalPriceStringOnItemListAndDetailView(Number(finalPrize * quantity).toFixed(2), stringConstants.currencySymbol)}
            </Text>}
        </View>
    }
    return null;
};

const updateOrderStatus = ({ isDetailView = false, navigation, updateOrderDetails, userToken, newStatus, recordId }) => {
    recordId && userToken && updateOrderDetails && updateOrderDetails({
        orderId: recordId,
        isMobile: true,
        userToken,
        updateJson: { status: newStatus },
        onSuccess: _ => {
            if (isDetailView && navigation && newStatus === orderStatus.completed || newStatus === orderStatus.canceled) {
                navigation.goBack();
            }
            ToastAndroid.show(userNotifications.orderStatusUpdateSuccess, ToastAndroid.SHORT);
        }
    })
};

export const selectPhotoTapped = props => {
    const d = q.defer();
    let openOption = 'openCamera';
    let cropping = false;
    const multiple = get(props, 'multiple', false);
    if (get(props, 'openPicker', false)) {
        openOption = 'openPicker';
        cropping = true
    }

    ImagePicker[openOption]({
        multiple,
        // width: 300,
        // height: 400,
        cropping
    }).then(res => {
        // alert(JSON.stringify(res));
        let finalRes;
        if (Array.isArray(res)) {
            finalRes = [];
            for (const count in res) {
                finalRes.push({
                    fileName: get(res[count], 'path', '').split("/").pop(),
                    type: res[count].mime,
                    uri: res[count].path,
                })
            }
        } else {
            finalRes = {
                fileName: get(res, 'path', '').split("/").pop(),
                type: res.mime,
                uri: res.path,
            }
        }
        d.resolve(finalRes)
    });

    return d.promise;
};


export const onSideMenuItemsClick = ({ delStoreDetails, userToken, menuItem, navigation, logoutUser }) => {
    if (userToken && logoutUser && menuItem && menuItem.title === stringConstants.logoutMenuTitle) {
        logoutUser({ delStoreDetails, userToken, isMobile: true });
    }
    const navigateAction = NavigationActions.navigate({
        routeName: menuItem.route
    });
    navigation.dispatch(navigateAction);
};

const xyz = {
    from: {
        opacity: 0,
    },
    to: {
        opacity: 0.5,
    },
};
export const renderLoadingView = ({ width = "large", height = 'large' }) => {
    return <View
        style={{
            marginVertical: 5,
            borderRadius: 2,
            width: width === 'large' ? "100%" : (width === "medium" ? "60%" : "30%"),
            height: (height === 'small' ? 12 : 15),
            backgroundColor: colors.BLACK_SHADE_10,
        }}>
        <Animatable.View
            style={{ backgroundColor: colors.WHITE, width: "100%", height: "100%" }}
            animation={xyz}
            iterationCount={'infinite'}
        />
    </View>
};

export const addToCartPress = ({ features = {}, isMobile, navigationDetails, buyerId, addItemToUserCart, vendorId, quantity, itemId, userToken, navigation }) => {
    onAddToCartPress({
        buyerId,
        addItemToUserCart,
        vendorId,
        quantity,
        itemId,
        userToken,
        isMobile,
        features,
        onSuccess: _ => {
            navigation && navigation.navigate(appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.route)
        },
        callForLogin: _ => {
            Alert.alert(
                stringConstants.alertForUserToLoginWhenHeClicksOnAddToCart,
                '',
                [
                    {
                        text: stringConstants.cancelButton,
                        onPress: () => {
                        }
                    },
                    {
                        text: stringConstants.okButton,
                        onPress: _ => {
                            navigation.navigate(appRoutes.AppRoutes.childRoutes.Login.childRoutes.PhoneNoRegistration.route, { navigationDetails })
                        }
                    },
                ],
                { cancelable: false }
            )
        },
    });
};


export const onOrderStatusUpdate = ({ isDetailView, navigation, updateOrderDetails, userToken, newStatus, recordId }) => {
    if (newStatus === orderStatus.canceled) {
        Alert.alert(
            stringConstants.cancelOrderConfirmation,
            '',
            [
                {
                    text: stringConstants.okButton,
                    onPress: _ => {
                        updateOrderStatus({
                            updateOrderDetails,
                            navigation,
                            isDetailView,
                            userToken,
                            recordId,
                            newStatus
                        })
                    }
                },
                {
                    text: stringConstants.cancelButton,
                    onPress: _ => {
                    }
                },
            ],
            { cancelable: false }
        )
    } else {
        updateOrderStatus({ updateOrderDetails, navigation, isDetailView, userToken, recordId, newStatus })
    }
};
const styles = StyleSheet.create({
    formTitleContainer: {
        marginHorizontal: 15,
        position: 'relative',
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formTitleDataContainer: {
        position: 'absolute',
        top: -6,
        left: 0,
    },
    formTitleSeperator: {
        flex: 1,
        height: 1,
        backgroundColor: colors.BLACK_SHADE_5,
    },
    formTitleMainData: {
        color: colors.PRIMARY_COLOR_1,
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size20
    },
    formTitleButtonContainer: { marginLeft: 5 },
    formTitleSubData: {
        color: colors.PRIMARY_COLOR_1,
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size12,
        opacity: 0.7
    },
});