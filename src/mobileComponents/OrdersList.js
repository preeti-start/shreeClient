import React from 'react';
import get from 'lodash/get';
import { View, Text, StyleSheet } from 'react-native';

import stringConstants from "../constants/mobileStringConstants";
import { fieldTypes, orderStatus, orderTypes } from "../constants/index";
import { getDateVal } from "../utils/functions";
import { colors, fonts, fontStyle, sizes, fontSizes } from "../mobileTheme";
import AppDashboard from "./AppDashboard";
import ListContainer from "../mobileContainers/ListContainer";
import Header from "../mobileContainers/Header";
import ActionButtons from "./ActionButtons";
import OrderStatusCircles from "./OrderStatusCircles";

export default class OrdersList extends React.Component {

    static defaultProps = {
        isVendor: false,
        isOrderHistory: false,
        showOrderStatus: false,
        isBuyer: false,
        showStatusCircles: true
    };

    constructor(props) {
        super(props);
        this.getSearchByFields = this.getSearchByFields.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
    }

    onSearchClick({ value }) {
        const { onSearchClick } = this.props;
        onSearchClick({ value })
    }

    getSearchByFields() {
        const { isVendor, isOrderHistory, isBuyer, allVendors, allBuyers } = this.props;
        let finalOrderStatus = [
            { name: orderStatus.new },
            { name: orderStatus.confirmed },
            { name: orderStatus.packed },
            { name: orderStatus.out_for_delivery }
        ];
        const fields = [
            {
                type: fieldTypes.fk,
                displayKey: 'name',
                valueKey: 'name',
                placeholder: stringConstants.orderTypeFilter,
                dataArray: [
                    { name: orderTypes.home_delivery },
                    { name: orderTypes.pick_up },
                ],
                name: 'order_type',
            }
        ];
        if (isOrderHistory) {
            finalOrderStatus = [
                { name: orderStatus.canceled },
                { name: orderStatus.completed },
            ]
        }
        fields.push({
            type: fieldTypes.fk,
            displayKey: 'name',
            valueKey: 'name',
            placeholder: stringConstants.orderStatusFilter,
            dataArray: finalOrderStatus,
            name: 'status',
        });

        if (isVendor) {
            fields.push({
                type: fieldTypes.fk,
                displayKey: 'name',
                valueKey: '_id',
                placeholder: stringConstants.signupFormUserRolesTabBuyerTitle,
                dataArray: allBuyers,
                name: 'buyer_id',
            });
        }
        if (isBuyer) {
            fields.push({
                type: fieldTypes.fk,
                displayKey: 'shop_name',
                valueKey: '_id',
                placeholder: stringConstants.signupFormUserRolesTabVendorTitle,
                dataArray: allVendors,
                name: 'vendor_id',
            });
        }
        return [{ fields }]
    }

    renderOrderDetails({ rowData }) {

        const { isBuyer, showOrderStatus, isVendor } = this.props;

        return <View style={styles.rowDataContainer}>
            <View style={styles.mainInfoContainer}>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.orderIdText}>
                        {rowData.order_number}
                    </Text>
                    {showOrderStatus && <View
                        style={[styles.statusBg, {
                            backgroundColor: rowData.status === orderStatus.completed ?
                                colors.PRIMARY_BG_COLOR_2 : colors.BLACK_SHADE_10
                        }]}>
                        <Text style={[styles.orderStatusText]}>{rowData.status}</Text>
                    </View>}
                </View>

                {isVendor && get(rowData, 'buyer_id.name') &&
                <Text
                    style={styles.detailsText}>{get(rowData, 'buyer_id.name')}</Text>}

                {isVendor && rowData && rowData.to_location && rowData.to_location.hasOwnProperty('name') &&
                <Text
                    style={styles.subDetailsText}>{rowData.to_location.name}</Text>}

                {isBuyer && rowData && rowData.vendor_id && rowData.vendor_id.hasOwnProperty('shop_name') &&
                <Text
                    style={styles.subDetailsText}>{rowData.vendor_id.shop_name}</Text>}

                <Text
                    style={styles.subDetailsText}>{`${stringConstants.currencySymbol} ${rowData && rowData.total_amount}`}</Text>
            </View>

            <View style={styles.sideInfoContainer}>
                <Text
                    style={[styles.subDetailsText, {
                        fontSize: fontSizes.size12,
                        color: colors.BLACK_SHADE_80
                    }]}>
                    {getDateVal({ date: rowData.date })}
                </Text>
                <Text style={styles.subDetailsText}>
                    {rowData.order_type}
                </Text>
            </View>
        </View>
    }

    render() {

        const {
            data, navigation, isListLoading, isVendor, onFiltersSelect,
            onOrderStatusUpdatePress, onRowClick, onSortByValueChange, showStatusCircles, loadMore,
        } = this.props;


        return <AppDashboard
            headerView={props => <Header
                navigation={navigation}
                animationProps={{ ...props }}
                searchKeyLabel={stringConstants.orderNumberFilter}
                onSearchClick={this.onSearchClick}
                title={stringConstants.activeOrderPageTitle}
                showMenuButton={true}
            />}
            detailView={({ scrollY }) => <View style={styles.container}>
                <ListContainer
                    isListLoading={isListLoading}
                    sortable={true}
                    sortByOptions={[
                        { _id: 'date', name: stringConstants.dateSortOptionTitle },
                        { _id: 'total_amount', name: stringConstants.totalChargesTitle },
                    ]}
                    onSortByValueChange={onSortByValueChange}
                    scrollY={scrollY}
                    searchByFields={this.getSearchByFields()}
                    onFiltersSelect={onFiltersSelect}
                    onRowClick={onRowClick}
                    loadMore={loadMore}
                    sections={[
                        { data: [data], key: undefined },
                    ]}
                    renderScene={({ rowData }) => {

                        return <View>

                            {this.renderOrderDetails({ rowData })}

                            {showStatusCircles && <OrderStatusCircles
                                status={rowData.status}
                                orderType={rowData.order_type}
                            />}

                            <ActionButtons
                                rowData={rowData}
                                isVendor={isVendor}
                                onOrderStatusUpdatePress={onOrderStatusUpdatePress}
                            />

                        </View>
                    }}
                />
            </View>
            }
        />
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    rowDataContainer: {
        flexDirection: "row"
    },
    orderStatusText: {
        ...fontStyle,
        fontSize: fontSizes.size8,
        color: colors.BLACK_SHADE_80
    },
    statusBg: {
        marginLeft: 10,
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: sizes.borderRadius,
    },
    subDetailsText: {
        ...fontStyle,
        fontSize: fontSizes.size10,
        color: colors.BLACK_SHADE_20,
    },
    detailsText: {
        ...fontStyle,
        fontSize: fontSizes.size10,
        color: colors.BLACK_SHADE_80,
    },
    orderIdText: {
        ...fontStyle,
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size15,
        color: colors.PRIMARY_COLOR_1,
    },
    sideInfoContainer: {},
    mainInfoContainer: {
        flex: 1
    },
});