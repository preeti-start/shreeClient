import React from 'react';
import get from 'lodash/get';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '../mobileContainers/Header';
import AppDashboard from './AppDashboard';
import { isImgUrlExists } from '../utils/functions';
import { renderLoadingView } from '../utils/mobileFunctions';
import ListContainer from "../mobileContainers/ListContainer";
import stringConstants from "../constants/mobileStringConstants";
import { useAdminLocationForDelivery } from "../constants";
import { colors, fonts, fontStyle, sizes, fontSizes } from "../mobileTheme";

const vendorImgDim = 30;

export default class ShopsList extends React.Component {

    renderOrderTypeBlock(isHomeDelAvailable) {
        return <View style={styles.deliveryBlock}>
            <Text style={styles.deliveryBlockText}>
                {isHomeDelAvailable ? stringConstants.homeDeliveryShopTypeTitle : stringConstants.pickupShopTypeTitle}
            </Text>
        </View>
    }

    render() {

        const {
            shopsList, navigation, searchByFields, onFiltersSelect, onSortByValueChange,
            loadMore, shopListLoading, onSearchClick, onShopClick, sortByOptions
        } = this.props;
        const isInitialLoadingState = (shopsList === undefined);

        return <AppDashboard
            headerView={(props) => <Header
                animationProps={{ ...props }}
                searchKeyLabel={stringConstants.unitNameFieldTitle}
                onSearchClick={onSearchClick}
                title={stringConstants.homePageSubTitle}
                navigation={navigation}
                showMenuButton={true}
            />}
            detailView={({ scrollY }) => <ListContainer
                isListLoading={shopListLoading}
                scrollY={scrollY}
                showIcon={!isInitialLoadingState}
                onRowClick={onShopClick}
                rowStyle={{ marginHorizontal: 2 }}
                sortable={true}
                sortByOptions={sortByOptions}
                renderDefaultWhileLoading={false}
                onSortByValueChange={onSortByValueChange}
                onFiltersSelect={onFiltersSelect}
                searchByFields={searchByFields}
                loadMore={loadMore}
                numColumns={2}
                sections={[
                    { data: [shopsList], key: undefined },
                ]}
                renderScene={({ rowData }) => {

                    const isProfileImg = isImgUrlExists({ data: rowData, fieldName: 'profile_img' });
                    const isShopImg = isImgUrlExists({ data: rowData, fieldName: 'shop_img' });

                    return <TouchableOpacity
                        onPress={_ => onShopClick({ rowData })}
                        style={[styles.shopCardContainer, { backgroundColor: isInitialLoadingState ? 'transparent' : colors.WHITE, }]}>

                        <View style={styles.shopDetailContainer}>

                            {!isInitialLoadingState &&
                            <Text
                                style={styles.unitCategoryText}>{rowData && rowData.shop_category_id && rowData.shop_category_id.name}</Text>}
                            {!isInitialLoadingState &&
                            <Text style={styles.unitNameText}>{rowData && rowData.shop_name}</Text>}

                            {isInitialLoadingState && renderLoadingView({ width: "medium", height: "small" })}
                            {isInitialLoadingState && renderLoadingView({})}

                            {!isInitialLoadingState && rowData && !useAdminLocationForDelivery &&
                            this.renderOrderTypeBlock(get(rowData, 'is_home_delivery_active', false))}

                        </View>


                        <View style={styles.unitImgContainer}>
                            {isShopImg &&
                            <Image style={styles.unitImgStyle} source={{ uri: isShopImg }}/>}
                            {!isShopImg && !isInitialLoadingState &&
                            <MaterialCommunityIcons name={'store'} color={colors.WHITE} size={70}/>}
                        </View>

                        <View style={styles.vendorDetailContainer}>
                            <View style={styles.vendorImgContainer}>
                                {isProfileImg &&
                                <Image style={styles.vendorImgStyle} source={{ uri: isProfileImg }}/>}
                                {!isProfileImg && !isInitialLoadingState &&
                                <FontAwesomeIcon name={'user'} color={colors.BLACK_SHADE_5} size={vendorImgDim}/>}
                            </View>
                            <View style={styles.vendorDataContainer}>
                                {!isInitialLoadingState &&
                                <Text style={styles.vendorNameText}>{rowData && rowData.name}</Text>}
                                {!isInitialLoadingState &&
                                <Text style={styles.vendorNumberText}>{rowData && rowData.phone_no}</Text>}
                                {isInitialLoadingState && renderLoadingView({ height: "small" })}
                                {isInitialLoadingState && renderLoadingView({ width: "medium", height: "small" })}
                            </View>
                        </View>

                    </TouchableOpacity>
                }}
            />}
        />
    }
}
const styles = StyleSheet.create({
    unitNameText: {
        color: colors.BLACK_SHADE_60,
        fontSize: fontSizes.size20,
        fontFamily: fonts.MeriendaBold,
    },
    deliveryBlockText: {
        color: colors.BLACK_SHADE_60,
        fontSize: fontSizes.size8,
        fontFamily: fonts.MeriendaBold,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: colors.PRIMARY_BG_COLOR_2,
    },
    deliveryBlock: {
        alignItems: 'flex-start',
        marginTop: 10
    },
    unitCategoryText: {
        ...fontStyle,
        color: colors.BLACK_SHADE_20,
        fontSize: fontSizes.size10,
    },
    vendorNameText: {
        color: colors.BLACK_SHADE_20,
        fontSize: fontSizes.size10,
        fontFamily: fonts.MeriendaBold
    },
    vendorNumberText: {
        ...fontStyle,
        color: colors.BLACK_SHADE_20,
        fontSize: fontSizes.size10,
    },
    unitNumberText: {
        ...fontStyle,
        color: colors.BLACK_SHADE_20,
        fontSize: fontSizes.size10,
    },
    unitImgContainer: {
        width: "100%",
        height: 150,
        overflow: "hidden",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: colors.BLACK_SHADE_5,
    },
    unitImgStyle: { width: "100%", borderRadius: 20, height: "100%", resizeMode: 'stretch' },
    vendorImgStyle: { width: "100%", borderRadius: 5, height: "100%" },
    vendorDataContainer: { flex: 1 },
    vendorImgContainer: {
        width: vendorImgDim,
        height: vendorImgDim,
        marginRight: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shopCardContainer: {
        paddingTop: 5,
        flex: 1
    },
    shopDetailContainer: { flex: 1, marginBottom: 10, justifyContent: 'center' },
    vendorDetailContainer: { marginTop: 20, flexDirection: "row", alignItems: "center" },
});
