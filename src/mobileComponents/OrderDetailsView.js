import React from 'react';
import get from 'lodash/get';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import * as Animatable from "react-native-animatable";

import Header from "../mobileContainers/Header";
import stringConstants from "../constants/mobileStringConstants";
import AppDashboard from "./AppDashboard";
import OrderStatusCircles from "./OrderStatusCircles";
import ActionButtons from "./ActionButtons";
import { colors, fonts, fontStyle, sizes, fontSizes } from "../mobileTheme";
import { getFinalPrizeString } from "../utils/mobileFunctions";
import { buttonTypes } from "../constants";
import { Button } from "./AppComponents";

const horizontalPadding = 10;

export default class OrderDetailsView extends React.Component {

    static defaultProps = {
        isVendor: false,
        orderDetails: [],
    };

    renderDetailRow({ label, value }) {
        return <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>{label}</Text>
            <Text style={styles.detailsValue}>{value}</Text>
        </View>
    }

    itemList({ items }) {
        return <View style={styles.itemsContainer}>

            <View style={styles.summaryTitleBlock}>
                <Text style={styles.summaryTitle}>
                    {stringConstants.orderDetailsBlockTitle(items.length)}
                </Text>
            </View>

            <ScrollView>
                {items && items.length > 0 && items.map((item, index) => {
                    const quantity = get(item, 'quantity', 1);
                    return <View
                        style={[styles.itemsRow, { borderBottomWidth: ((index + 1) !== items.length) ? 1 : 0 }]}>
                        <View style={styles.rowLeftSection}>

                            <Text style={styles.itemMainDetail}>
                                {item && item.item_id && item.item_id.name}
                            </Text>

                            {getFinalPrizeString({ data: item.item_id, quantity, showNetPrize: true })}

                        </View>

                        <View style={styles.rowRightSection}>
                            <Text style={styles.detailsValue}>
                                {`${stringConstants.totalTitle} - ${quantity} ${get(item, 'item_id.measuring_unit_id.short_name')}`}
                            </Text>
                            {get(item, 'features', []).map(feature => <Text style={styles.detailsValue}>
                                {`${get(feature, 'name')} - ${get(feature, 'option')}`}
                            </Text>)}
                        </View>

                    </View>
                })}
            </ScrollView>

        </View>
    }

    render() {

        const { navigation, isVendor, orderDetails, onOrderStatusUpdatePress, data, isLoading } = this.props;

        return <AppDashboard
            isDashboardLoading={isLoading}
            headerView={props => <Header
                animationProps={{ ...props }}
                navigation={navigation}
                showBackButton={true}
                title={stringConstants.orderDetailsPageTitle}
            />}
            detailView={_ => <View style={styles.container}>
                {data.status && <OrderStatusCircles
                    status={data.status}
                    orderType={data.order_type}
                />}
                <Animatable.View
                    animation="fadeInRight"
                    style={styles.centralBlock}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            {data && stringConstants.orderNumberTitle(data.order_number)}
                        </Text>
                    </View>
                    {orderDetails.length > 0 && orderDetails.map(detail => this.renderDetailRow(detail))}
                    {data && data.items && data.items.length > 0 && this.itemList({ items: data.items })}
                </Animatable.View>
                <Animatable.View
                    animation="zoomIn"
                    style={styles.footer}>
                    <ActionButtons
                        renderView={({ buttonsList }) => {
                            return buttonsList.map((buttonData, index) => <View
                                style={{
                                    flex: 1,
                                }}>
                                <Button
                                    buttonType={(index === (buttonsList.length - 1)) ? buttonTypes.primary : buttonTypes.secondary}
                                    title={buttonData.title}
                                    style={{ width: '100%' }}
                                    textStyle={styles.buttonTextStyle}
                                    onPress={buttonData.onPress}
                                />
                            </View>)
                        }}
                        buttonStyle={{ paddingVertical: 12, width: '100%' }}
                        rowData={data}
                        isVendor={isVendor}
                        onOrderStatusUpdatePress={onOrderStatusUpdatePress}
                    />
                </Animatable.View>
            </View>
            }
        />
    }
}

const styles = StyleSheet.create({
    centralBlock: {
        borderRadius: sizes.borderRadius,
        margin: horizontalPadding,
        padding: horizontalPadding,
        backgroundColor: colors.WHITE,
        borderWidth: 1,
        flex: 1,
        borderColor: colors.BLACK_SHADE_10
    },
    buttonTextStyle: {
        fontSize: fontSizes.size14
    },
    header: {
        backgroundColor: colors.PRIMARY_COLOR_1,
        padding: horizontalPadding,
        marginBottom: 10,
        justifyContent: 'center'
    },
    summaryTitleBlock: {
        paddingVertical: horizontalPadding,
        borderBottomWidth: 1,
        borderBottomColor: colors.BLACK_SHADE_20
    },
    detailsRow: {
        flexDirection: 'row',
        paddingBottom: 5
    },
    summaryTitle: {
        ...fontStyle,
        fontFamily: fonts.MeriendaBold,
    },
    itemsRow: {
        paddingVertical: 5,
        flexDirection: 'row',
        borderBottomColor: colors.BLACK_SHADE_10
    },
    rowLeftSection: {
        flex: 1
    },
    itemMainDetail: {
        ...fontStyle,
        fontFamily: fonts.MeriendaBold,
    },
    itemSubDetail: {
        ...fontStyle,
        fontSize: fontSizes.size12,
        color: colors.BLACK_SHADE_40,
    },
    itemsContainer: {
        flex: 1
    },
    detailsValue: {
        ...fontStyle,
        fontSize: fontSizes.size10,
        color: colors.BLACK_SHADE_10,
    },
    detailsLabel: {
        flex: 1,
        ...fontStyle,
        fontSize: fontSizes.size10,
    },
    rowRightSection: {},
    headerTitle: {
        ...fontStyle,
        color: colors.WHITE,
        fontFamily: fonts.MeriendaBold,
    },
    container: { flex: 1, backgroundColor: colors.WHITE },
    footer: {
        padding: horizontalPadding,
        paddingTop: 0
    }
});