import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Button } from "./AppComponents/index";
import ListContainer from "../mobileContainers/ListContainer";
import stringConstants from "../constants/mobileStringConstants";
import { getOrderType } from "../../src/utils/functions";
import AppDashboard from "./AppDashboard";
import Header from "../mobileContainers/Header";
import { colors, fonts, fontSizes } from "../mobileTheme";


export default class CartList extends React.Component {


    render() {
        const { cartsList, navigation, onViewItemClick, isAppLoading } = this.props;
        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                showCartIcon={false}
                navigation={navigation}
                title={stringConstants.cartPageTitle}
                showMenuButton={true}
            />}
            detailView={({ scrollY }) => <View style={styles.container}>
                <ListContainer
                    scrollY={scrollY}
                    listAnimation={'flipInX'}
                    showAnimation={false}
                    sections={[
                        { data: [cartsList], key: undefined },
                    ]}
                    renderScene={({ rowData }) => <View style={styles.rowContainer}>
                        <View style={styles.cartDataBox}>
                            <View style={{
                                flexDirection: "row",
                                width: "100%",
                                marginTop: -25,
                                alignItems: "center"
                            }}>
                                <View style={{
                                    height: 1,
                                    marginRight: 5,
                                    backgroundColor: colors.BLACK_SHADE_80,
                                    width: 20
                                }}/>
                                <Text
                                    style={styles.shopNameText}>{rowData && rowData.vendor_id && rowData.vendor_id.shop_name}</Text>
                                <View style={{
                                    height: 1,
                                    marginLeft: 5,
                                    flex: 1,
                                    backgroundColor: colors.BLACK_SHADE_80
                                }}/>
                            </View>
                            <View style={styles.rowDetails}>
                                <View style={styles.rowLeftSection}>
                                    {rowData && rowData.items && <View style={styles.itemsCountContainer}>
                                        <Text
                                            style={styles.itemCountNumberText}>
                                            {rowData.items.length}
                                        </Text>
                                        <Text
                                            style={styles.itemCountText}>
                                            {stringConstants.itemsCountText(rowData.items.length)}
                                        </Text>
                                    </View>}
                                    <Text
                                        style={styles.orderTypeText}>
                                        {stringConstants.viewCartItemMessage({
                                            order_type: getOrderType(rowData)
                                        })}
                                    </Text>
                                </View>
                                <View style={styles.rowRightSection}>
                                    <Button
                                        textStyle={{ fontSize: fontSizes.size14 }}
                                        style={{ height: 40, width: 100, borderRadius: 5 }}
                                        title={stringConstants.cartListViewItemsButtonText}
                                        onPress={_ => onViewItemClick({ cartId: rowData._id })}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>}
                />
            </View>}
            isDashboardLoading={isAppLoading}
        />
    }
}

const styles = StyleSheet.create({
    rowDetails: { flexDirection: "row", paddingVertical: 10 },
    container: { padding: 10, flex: 1 },
    rowContainer: { marginVertical: 20 },
    itemCountNumberText: {
        color: colors.PRIMARY_COLOR_3,
        fontSize: fontSizes.size30,
        fontFamily: fonts.MeriendaBold
    },
    rowLeftSection: { flex: 1 },
    rowRightSection: { justifyContent: "flex-end" },
    itemsCountContainer: { flexDirection: "row", alignItems: 'flex-end' },
    orderTypeText: {
        marginBottom: 5,
        color: colors.BLACK_SHADE_40,
        fontSize: fontSizes.size10,
        fontFamily: fonts.MeriendaOneRegular
    },
    itemCountText: {
        paddingLeft: 15,
        marginBottom: 5,
        color: colors.BLACK_SHADE_60,
        fontSize: fontSizes.size15,
        fontFamily: fonts.MeriendaOneRegular
    },
    shopNameText: {
        color: colors.BLACK_SHADE_80,
        fontSize: fontSizes.size20,
        fontFamily: fonts.MeriendaBold
    },
    cartDataBox: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BLACK_SHADE_60,
        borderTopWidth: 0,
        padding: 10
    }
});
