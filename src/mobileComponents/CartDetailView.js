import React from 'react';
import get from 'lodash/get';
import { View, Image, ScrollView, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from "react-native-animatable";
import Fontisto from "react-native-vector-icons/Fontisto";
import EntypoIcon from "react-native-vector-icons/Entypo";

import { Button } from "./AppComponents/index";
import Header from "../mobileContainers/Header";
import stringConstants from "../constants/mobileStringConstants";
import { quantitySelectorAlignments } from "../constants";
import AppDashboard from "./AppDashboard";
import { getFinalPrizeString } from "../utils/mobileFunctions";
import { colors, fonts, fontStyle, sizes, fontSizes } from "../mobileTheme";
import ItemQuantitySelector from "./ItemQuantitySelector";
import OrderSummeryBlock from "../mobileComponents/OrderSummeryBlock";
import { getOrderType } from "../utils/functions";


const { width } = Dimensions.get('window');
const imgWidth = 100;

export default class CartDetailView extends React.Component {
    constructor(props) {
        super(props);
        this.renderItemBlockingScreen = this.renderItemBlockingScreen.bind(this);
    }

    renderItemBlockingScreen({ itemVal, itemIndex }) {

        const { onIncButtonPress } = this.props;
        return <View style={styles.blockingContainer}>
            <TouchableOpacity onPress={_ => onIncButtonPress({ incBy: -itemVal.quantity, itemIndex, itemVal })}
                              style={styles.blockingButton}>
                <EntypoIcon name={"cross"} color={colors.WHITE} size={20}/>
            </TouchableOpacity>
            <Text style={styles.blockingText}>{stringConstants.cartItemMissingText}</Text>
        </View>

    }

    render() {
        const { cartDetails, navigation, isUpdateItemQtyInProgress, isAppLoading, onIncButtonPress, onPlaceOrderClick } = this.props;
        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                showCartIcon={false}
                navigation={navigation}
                title={cartDetails && cartDetails.vendor_id && cartDetails.vendor_id.shop_name}
                showBackButton={true}
            />}
            detailView={_ => <View style={styles.container}>
                <View style={styles.topContainer}>
                    {cartDetails && cartDetails.items && cartDetails.items.length > 0 &&
                    <ScrollView style={styles.scrollViewContainer}>
                        {cartDetails.items.map((itemVal, itemIndex) => {
                            const itemImgUrl = get(itemVal, `item_id.item_images.${0}.url`);

                            return <Animatable.View
                                animation={itemIndex % 2 === 0 ? "slideInLeft" : "slideInRight"}
                                style={styles.rowContainer}
                                key={`${itemIndex}_item`}>
                                <View style={styles.row}>
                                    {!get(itemVal, 'item_id.is_active', false) && this.renderItemBlockingScreen({
                                        itemIndex,
                                        itemVal
                                    })}
                                    <View style={styles.imgContainer}>
                                        {itemImgUrl &&
                                        <Image
                                            style={styles.img}
                                            source={{ uri: itemImgUrl }}
                                        />}
                                        {!itemImgUrl &&
                                        <Fontisto style={{ opacity: 0.2 }} name={"photograph"}
                                                  color={colors.BLACK_SHADE_5}
                                                  size={70}/>}
                                    </View>
                                    <View style={{ flex: 1, paddingLeft: 10 }}>
                                        <Text
                                            style={styles.itemName}>
                                            {itemVal && itemVal.item_id && itemVal.item_id.name}
                                        </Text>
                                        {getFinalPrizeString({
                                            data: itemVal.item_id,
                                            showNetPrize: true,
                                            quantity: itemVal.quantity
                                        })}
                                        {itemVal && itemVal.features && itemVal.features.length > 0 && itemVal.features.map(feature =>
                                            <Text
                                                style={styles.rowSubData}>
                                                {`${feature.name} - ${feature.option}`}
                                            </Text>)}

                                    </View>

                                    <ItemQuantitySelector
                                        setCount={get(itemVal, 'item_id.set_count')}
                                        isLoading={isUpdateItemQtyInProgress}
                                        alignment={quantitySelectorAlignments.vertical}
                                        onButtonPress={({ incBy }) => onIncButtonPress({ incBy, itemIndex, itemVal })}
                                        title={`${get(itemVal, 'quantity')}`}
                                    />
                                </View>
                                <View style={styles.actionRow}>
                                    <Text onPress={_ => onIncButtonPress({
                                        incBy: -itemVal.quantity,
                                        itemIndex,
                                        itemVal
                                    })}
                                          style={styles.actionStyle}>
                                        {stringConstants.removeItemButtonText}
                                    </Text>
                                </View>
                            </Animatable.View>
                        })}
                    </ScrollView>}

                    <OrderSummeryBlock
                        containerStyle={styles.summaryContainer}
                        title={stringConstants.orderSummaryBlockTitle}
                        totalAmount={cartDetails && Number(Number(cartDetails.delivery_amount) + Number(cartDetails.total_items_amount))}
                        notes={cartDetails && cartDetails.notes}
                        prizeSummaryList={[
                            {
                                title: stringConstants.viewCartItemMessage({}),
                                value: cartDetails && getOrderType(cartDetails)
                            },
                            {
                                title: stringConstants.totalItemsCountTitle,
                                value: cartDetails && cartDetails.items && cartDetails.items.length
                            },
                            {
                                title: stringConstants.totalItemsCostTitle,
                                value: cartDetails && cartDetails.total_items_amount
                            },
                            {
                                title: stringConstants.deliveryChargesTitle,
                                value: cartDetails && cartDetails.delivery_amount
                            },
                        ]}/>

                </View>
                <Animatable.View
                    animation={"slideInUp"}
                    style={styles.buttonContainer}>
                    <Button
                        style={{ width: width - 20, height: 50 }}
                        title={stringConstants.placeOrderButtonText}
                        onPress={onPlaceOrderClick}
                    />
                </Animatable.View>
            </View>}
            isDashboardLoading={isAppLoading}
        />

    }
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    row: {
        padding: 10,
        flexDirection: "row",
        paddingTop: 15
    },
    rowContainer: {
        position: 'relative',
        marginBottom: 5,
        borderRadius: 3,
        backgroundColor: colors.WHITE,
        elevation: 2,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        paddingRight: 15,
        paddingBottom: 10
    },
    blockingButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: colors.PRIMARY_COLOR_2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blockingContainer: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: colors.BLACK_SHADE_10
    },
    actionRow: {
        alignItems: 'flex-end'
    },
    blockingText: {
        ...fontStyle,
        color: colors.PRIMARY_COLOR_2,
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size15
    },
    imgContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: imgWidth
    },
    img: {
        resizeMode: 'stretch',
        height: 80,
        width: imgWidth,
        borderRadius: 5
    },
    scrollViewContainer: { flex: 1, paddingHorizontal: 10 },
    topContainer: { flex: 1 },
    summaryContainer: { borderWidth: 1, padding: 10, margin: 10, backgroundColor: colors.WHITE },
    actionStyle: {
        ...fontStyle,
        color: colors.PRIMARY_COLOR_3,
        fontSize: fontSizes.size12,
        fontFamily: fonts.MeriendaBold
    },
    itemName: { ...fontStyle, fontFamily: fonts.MeriendaBold },
    buttonContainer: { alignItems: "center", justifyContent: "center", paddingBottom: 10 },
    rowSubData: { ...fontStyle, color: colors.BLACK_SHADE_20, fontSize: fontSizes.size10 },
});
