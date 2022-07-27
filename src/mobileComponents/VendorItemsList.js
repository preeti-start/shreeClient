import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { dbnames } from '../constants'
import { Button } from "./AppComponents/index";
import ImageCards from "./ImageCards";
import ListContainer from "../mobileContainers/ListContainer";
import Header from "../mobileContainers/Header";
import stringConstants from "../constants/mobileStringConstants";
import AppDashboard from "./AppDashboard";
import { isImgUrlExists } from "../utils/functions";
import { getFinalPrizeString } from "../utils/mobileFunctions";
import { colors, sizes, fontStyle, fontSizes, fonts } from "../mobileTheme";


export default class ItemsList extends React.Component {

    renderItemImage({ rowData }) {

        const isItemImgExists = rowData && rowData.item_images && rowData.item_images.length > 0 && isImgUrlExists({
            data: { img: rowData.item_images[0] },
            fieldName: "img"
        });

        return <ImageCards
            isItemImgExists={isItemImgExists}
        />
    }

    render() {
        const {
            vendorItemsList, rowActions, onRemoveItemsClick, onSearchClick, sortByOptions, onFiltersSelect,
            loadMore, headerActions, isListLoading, searchByFields, navigation, onInsertItemClick, onSortByValueChange
        } = this.props;

        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                searchKeyLabel={stringConstants.nameFieldTitle}
                onSearchClick={onSearchClick}
                navigation={navigation}
                title={stringConstants.itemsPageTitle}
                showMenuButton={true}
            />}
            detailView={({ scrollY }) => <View style={styles.container}>
                <ListContainer
                    isListLoading={isListLoading}
                    scrollY={scrollY}
                    onFiltersSelect={onFiltersSelect}
                    searchByFields={searchByFields}
                    sortable={true}
                    sortByOptions={sortByOptions}
                    onSortByValueChange={onSortByValueChange}
                    collection={dbnames.Items}
                    onRemoveItemsClick={onRemoveItemsClick}
                    showMultiDelAction={true}
                    loadMore={loadMore}
                    enableSelectItem={true}
                    sections={[
                        { data: [vendorItemsList], key: undefined },
                    ]}
                    rowActions={rowActions}
                    headerActions={headerActions}
                    renderScene={({ rowData, index }) => <View style={styles.itemRow}>
                        {this.renderItemImage({ rowData, index })}
                        <View style={styles.itemDetails}>
                            <View style={styles.itemTitleRow}>
                                <Text style={styles.itemDetailText}>
                                    {rowData && rowData.name}
                                </Text>
                                {rowData.hasOwnProperty('is_active') && rowData.is_active === true &&
                                <View style={styles.itemStatusContainer}>
                                    <Text style={styles.itemStatusText}>{stringConstants.itemIsActiveLabel}</Text>
                                </View>}
                            </View>
                            {rowData && rowData.category_id && <Text
                                style={styles.itemSubDetailText}>
                                {rowData.category_id.name}
                            </Text>}
                            {getFinalPrizeString({ data: rowData })}
                        </View>
                    </View>}
                />
                <Button
                    ifFloating={true}
                    title={stringConstants.addButtonSymbol}
                    textStyle={styles.buttonStyle}
                    onPress={onInsertItemClick}
                />
            </View>}
            // isDashboardLoading={isAppLoading}
        />
    }
}


const styles = StyleSheet.create({
    itemStatusContainer: {
        backgroundColor: colors.PRIMARY_COLOR_3,
        marginLeft: 10,
        padding: 4,
        paddingHorizontal: 7,
        borderRadius: sizes.borderRadius
    },
    itemTitleRow: { flexDirection: 'row' },
    buttonStyle: { fontSize: fontSizes.size25 },
    itemStatusText: {
        fontFamily: fonts.MeriendaOneRegular,
        fontSize: fontSizes.size8,
        color: colors.BLACK_SHADE_60
    },
    container: { flex: 1 },
    itemRow: { flexDirection: "row", paddingVertical: 10 },
    itemDetails: { flex: 1 },
    itemImgRow: { flexDirection: "row" },
    itemDetailText: {
        fontFamily: fonts.MeriendaBold, fontSize: fontSizes.size15, color: colors.BLACK
    },
    itemSubDetailText: {
        ...fontStyle,
        fontSize: fontSizes.size10, color: colors.BLACK_SHADE_20
    },
});
