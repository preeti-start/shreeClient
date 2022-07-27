import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from "react-native-animatable";

import { Button } from './index';
import stringConstants from '../constants/mobileStringConstants';
import Header from "../mobileContainers/Header";
import AppDashboard from "./AppDashboard";
import { buttonTypes, placeOrderStages } from '../constants/index';
import OrderSummeryBlock from "./OrderSummeryBlock";

import { colors, fonts, fontStyle, sizes, fontSizes } from '../mobileTheme';

const leftMargin = 50;
const circleDim = 36;
const addressCircleDim = 14;

const getCircleBgColor = (isActive, isDone) => isActive ? colors.PRIMARY_COLOR_3 :
    (isDone ? colors.PRIMARY_COLOR_4 : colors.BLACK_SHADE_20);

export default class PlaceOrderView extends React.Component {

    constructor(props) {
        super(props);
        this.renderAddressBlock = this.renderAddressBlock.bind(this);
        this.renderOrderDetailsBlock = this.renderOrderDetailsBlock.bind(this);
    }


    renderOrderDetailsBlock() {

        const { orderJson, onPlaceOrderClick } = this.props;

        return <View style={styles.lastBlock}>
            <View style={styles.orderSummaryBlock}>
                <OrderSummeryBlock
                    containerStyle={{
                        paddingTop: 10,
                    }}
                    totalAmount={orderJson && orderJson.total_amount}
                    prizeSummaryList={[
                        {
                            title: stringConstants.totalItemsCostTitle,
                            value: orderJson && orderJson.total_items_amount
                        },
                        {
                            title: stringConstants.addNewDistanceSlabPopupDeliveryAmntTitle,
                            value: orderJson && orderJson.delivery_amount
                        },
                    ]}
                />
            </View>
            {orderJson && <Animatable.View
                animation="zoomIn"
                style={styles.placeOrderButtonContainer}>
                <Button
                    style={styles.placeOrderButtonStyle}
                    title={stringConstants.placeOrderButtonTitle}
                    onPress={onPlaceOrderClick}
                />
            </Animatable.View>}
        </View>
    }

    renderAddressBlock() {

        const {
            onAddNewAddressPress, onDeliverHereClick,
            onAddressRowClick, addressArray,
            orderStage, selectedAddress, activeAddressIndex,
        } = this.props;

        return <View style={styles.middleBlock}>
            <View style={[styles.statusLine, {
                backgroundColor: orderStage ===
                placeOrderStages[0] ? colors.PRIMARY_COLOR_3 : colors.PRIMARY_COLOR_1
            }]}/>
            {orderStage === placeOrderStages[0] && <View style={styles.addressContainer}>
                {addressArray && addressArray.length > 0 && addressArray.map((addressVal, addressIndex) =>
                    <View style={styles.addressRow}
                          key={`${addressIndex}_address`}>
                        <TouchableOpacity onPress={_ => onAddressRowClick(addressIndex)}
                                          style={styles.addressBlock}>
                            <View
                                style={[styles.addressCircle, {
                                    borderColor: addressIndex === activeAddressIndex ?
                                        colors.PRIMARY_COLOR_2 : colors.BLACK_SHADE_40,
                                    backgroundColor: colors.TRANSPARENT
                                }]}>
                                <View
                                    style={[styles.innerAddressCircle, {
                                        backgroundColor: addressIndex === activeAddressIndex ?
                                            colors.PRIMARY_COLOR_2 : colors.TRANSPARENT
                                    }]}/>
                            </View>
                            <View style={styles.addressDetails}>
                                <Text style={styles.addressTitleText}>
                                    {addressVal && addressVal.name}
                                </Text>
                                <Text style={styles.address}>
                                    {addressVal && `${addressVal.address}`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {addressIndex === activeAddressIndex &&
                        <View style={styles.addAddressContainer}>
                            <Button
                                width={100}
                                textStyle={{ fontSize: fontSizes.size12 }}
                                height={30}
                                title={stringConstants.deliverHereButtonTitle}
                                onPress={_ => onDeliverHereClick(addressVal)}
                            />
                        </View>}
                    </View>)}
                <Text style={styles.addAddressText}
                      onPress={onAddNewAddressPress}>{stringConstants.addNewAddressButtonTitle}</Text>
            </View>}

            {selectedAddress && selectedAddress.name &&
            <Text style={styles.selectedAddressText}>{selectedAddress.name}</Text>}

        </View>
    }


    renderCircle({ label, backgroundColor }) {

        return <View style={[styles.titleRow, { marginTop: 20 }]}>
            <View
                style={[styles.titleCircle, { backgroundColor }]}/>
            <Text style={styles.titleText}>{label}</Text>
        </View>
    }

    render() {

        const {
            isAppLoading, orderStage, navigation, isHomeDeliveryActive
        } = this.props;

        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                navigation={navigation}
                title={stringConstants.placeOrderTitle}
                showBackButton={true}
            />}
            detailView={_ => {

                return <Animatable.View animation="slideInRight" style={styles.container}>

                    {isHomeDeliveryActive && this.renderCircle({
                        label: stringConstants.addressConfirmationSectionTitle,
                        backgroundColor: getCircleBgColor(orderStage === placeOrderStages[0],
                            orderStage === placeOrderStages[1])
                    })}

                    {isHomeDeliveryActive && this.renderAddressBlock()}

                    {this.renderCircle({
                        label: stringConstants.amountConfirmationSectionTitle,
                        backgroundColor: getCircleBgColor(orderStage === placeOrderStages[1], false)
                    })}

                    {orderStage === placeOrderStages[1] && this.renderOrderDetailsBlock()}

                </Animatable.View>
            }}
            isDashboardLoading={isAppLoading}
        />

    }
}

const styles = StyleSheet.create({
    addAddressContainer: {
        width: "100%",
        marginLeft: addressCircleDim + 10,
        marginTop: 10,
    },
    middleBlock: {
        flexDirection: "row"
    },
    placeOrderButtonContainer: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderSummaryBlock: { flex: 1, marginLeft: leftMargin },
    placeOrderButtonStyle: { width: 300, height: 50 },
    addressCircle: {
        height: addressCircleDim,
        borderRadius: addressCircleDim / 2,
        width: addressCircleDim,
        borderWidth: 1,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerAddressCircle: {
        height: addressCircleDim - 6,
        width: addressCircleDim - 6,
        borderRadius: (addressCircleDim - 6) / 2,
    },
    lastBlock: { flex: 1 },
    addressBlock: {
        flexDirection: "row",
        // alignItems: "center"
    },
    statusLine: {
        width: 2,
        opacity: 0.5,
        marginTop: 20,
        marginLeft: ((circleDim / 2) - 2),
        marginRight: ((circleDim / 2) + 20),
    },
    addressRow: { marginTop: 10 },
    addressContainer: { flex: 1 },
    selectedAddressText: {
        fontFamily: fonts.MeriendaBold,
        marginVertical: 10,
        flexWrap: 'wrap', flex: 1,
        color: colors.BLACK_SHADE_20,
        fontSize: fontSizes.size10
    },
    addressDetails: {},
    container: { flex: 1, paddingHorizontal: 30, marginBottom: 20 },
    address: {
        paddingTop: 5,
        ...fontStyle,
        flexWrap: 'wrap',
        color: colors.BLACK_SHADE_20,
        fontSize: fontSizes.size10
    },
    addressTitleText: {
        ...fontStyle,
        color: colors.BLACK_SHADE_80,
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size12
    },
    addAddressText: {
        ...fontStyle,
        color: colors.BLACK_SHADE_80,
        marginTop: 15,
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size10
    },
    titleRow: { flexDirection: "row", alignItems: "center" },
    titleText: {
        ...fontStyle,
        fontSize: fontSizes.size15,
        fontFamily: fonts.MeriendaBold,
        color: colors.BLACK_SHADE_80
    },
    titleCircle: {
        // borderStyle: 'dotted',
        borderWidth: 3,
        borderColor: colors.BLACK_SHADE_10,
        marginRight: (leftMargin - circleDim),
        width: circleDim,
        height: circleDim,
        borderRadius: circleDim / 2
    }
});
