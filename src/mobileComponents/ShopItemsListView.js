import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Fontisto from "react-native-vector-icons/Fontisto"

import ListContainer from "../mobileContainers/ListContainer";
import stringConstants from "../constants/mobileStringConstants";
import { dbnames, maxItemsStockToBlockUser } from "../constants/index";
import Header from "../mobileContainers/Header";
import { colors, fonts, fontSizes, sizes } from "../mobileTheme";
import AppDashboard from "./AppDashboard";
import { isImgUrlExists } from "../utils/functions";
import { renderLoadingView, getFinalPrizeString } from "../utils/mobileFunctions";

export default class ShopItemsListView extends React.Component {


    render() {

        const {
            navigation, vendorDetails, loadMore,
            onShowDetailPress, onFiltersSelect, searchByFields, vendorItemsList,
            itemListLoading, onSearchClick, sortByOptions, onSortByValueChange
        } = this.props;
        const isInitialLoadingState = (vendorItemsList === undefined);

        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                showMenuButton={true}
                searchKeyLabel={stringConstants.nameFieldTitle}
                onSearchClick={onSearchClick}
                title={vendorDetails && vendorDetails.shop_name && stringConstants.itemsPageSubTitle(vendorDetails.shop_name)}
                navigation={navigation}
            />}
            detailView={({ scrollY }) => <ListContainer
                isListLoading={itemListLoading}
                iconStyle={{ paddingLeft: 15, paddingTop: 10 }}
                showIcon={!isInitialLoadingState}
                iconName={"info"}
                scrollY={scrollY}
                numColumns={2}
                searchByFields={searchByFields}
                onFiltersSelect={onFiltersSelect}
                sortable={true}
                onRowClick={onShowDetailPress}
                onSortByValueChange={onSortByValueChange}
                sortByOptions={sortByOptions}
                collection={dbnames.Items}
                loadMore={loadMore}
                renderDefaultWhileLoading={false}
                sections={[
                    { data: [vendorItemsList], key: undefined },
                ]}
                renderScene={({ rowData }) => {

                    const outOfStock = rowData && rowData.maintain_stock && rowData.maintain_stock === true &&
                        rowData.hasOwnProperty("quantity") && rowData.quantity < maxItemsStockToBlockUser;
                    const allowNegativeStock = rowData && rowData.hasOwnProperty("allow_negative_stock") && rowData.allow_negative_stock === true;
                    const isItemImgExists = rowData && rowData.item_images && rowData.item_images.length > 0 && isImgUrlExists({
                        data: { img: rowData.item_images[0] },
                        fieldName: "img"
                    });

                    return <View style={styles.rowStyle}>
                        <View style={styles.rowTopSection}>

                            {isInitialLoadingState && renderLoadingView({ width: "medium", height: "small" })}

                            {!isInitialLoadingState &&
                            <Text
                                style={styles.categoryText}>{rowData && rowData.category_id && rowData.category_id.name}</Text>}

                            {!isInitialLoadingState &&
                            <Text style={styles.itemNameText}>{rowData && rowData.name}</Text>}

                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                {!isInitialLoadingState && isItemImgExists &&
                                <Image source={{ uri: isItemImgExists }}
                                       style={styles.imgStyle}/>}
                                {!isInitialLoadingState && !isItemImgExists &&
                                <View style={styles.imgStyle}>
                                    <Fontisto style={{ opacity: 0.2 }} name={"photograph"} color={colors.BLACK_SHADE_5}
                                              size={70}/>
                                </View>}

                                {isInitialLoadingState &&
                                <View style={[styles.imgStyle, {
                                    width: '90%',
                                    height: 130,
                                    backgroundColor: colors.BLACK_SHADE_5,
                                    marginBottom: 5
                                }]}/>}
                            </View>

                            {!isInitialLoadingState && <View style={styles.rowBottomSection}>
                                {getFinalPrizeString({ data: rowData })}
                            </View>}
                            {isInitialLoadingState && renderLoadingView({})}
                            {isInitialLoadingState && renderLoadingView({ width: "medium", height: "small" })}

                        </View>

                        {!allowNegativeStock && outOfStock &&
                        <Text>{stringConstants.outOfStockNotification}</Text>}

                        {!allowNegativeStock && rowData && rowData.maintain_stock && rowData.maintain_stock === true && rowData.hasOwnProperty("quantity") &&
                        rowData.quantity >= maxItemsStockToBlockUser && rowData.quantity < (maxItemsStockToBlockUser * 3) &&
                        <Text>{stringConstants.lessStockLeftNotification(rowData.quantity)}</Text>}

                    </View>
                }
                }
            />}
            // isDashboardLoading={!isInitialLoadingState && itemListLoading}
        />
    }
};

const styles = StyleSheet.create({
    imgStyle: {
        resizeMode: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 150,
        borderRadius: 20
    },
    rowBottomSection: { marginTop: 10 },
    buttonTextStyle: { fontSize: fontSizes.size12 },
    itemImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 5,
        backgroundColor: colors.BLACK_SHADE_60,
    },
    buttonStyle: { height: 30, borderRadius: sizes.borderRadius, width: undefined, paddingHorizontal: 10 },
    buttonRight: { marginLeft: 15 },
    rowTopSection: { flex: 1 },
    rowActionSection: { flexDirection: "row", marginTop: 10, justifyContent: "flex-end" },
    itemImage: {
        width: "100%",
        height: "100%",
        borderRadius: sizes.borderRadius,
    },
    categoryText: {
        marginTop: 5,
        fontSize: fontSizes.size12,
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.BLACK_SHADE_10
    },
    itemNameText: {
        marginBottom: 5,
        fontSize: fontSizes.size20,
        fontFamily: fonts.MeriendaBold,
        color: colors.BLACK_SHADE_80
    },
    rowStyle: { flex: 1 },
});
