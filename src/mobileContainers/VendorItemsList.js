import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { View } from "react-native";

import { getItems, removeItem, updateItemsStatus } from '../redux-store/actions/itemActions';
import { appRoutes, fieldTypes, defaultValForSortAndFilters } from "../constants/index";
import { PopUp, VendorItemsListComp, UpdateItemStatusPopup } from "../mobileComponents/index";
import stringConstants from "../constants/mobileStringConstants";
import appStringConstants from "../constants/appStringConstants";
import { getItemCategories } from '../redux-store/actions/itemCategoryActions'
import { getMeasuringUnits } from '../redux-store/actions/measuringUnitsActions'

class ItemsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFilters: defaultValForSortAndFilters.searchFilters,
            searchByName: defaultValForSortAndFilters.searchByName,
            sortByVal: defaultValForSortAndFilters.sortByVal,
            isUpdateItemStatusPopupActive: false,
            activeOptionIndex: undefined,
            selectedItemIds: [],
        };
        this.onListFiltersSelect = this.onListFiltersSelect.bind(this);
        this.onSortByValueChange = this.onSortByValueChange.bind(this);
        this.onSearchByNameClick = this.onSearchByNameClick.bind(this);
        this.onRemoveItemsClick = this.onRemoveItemsClick.bind(this);
        this.getItemsList = this.getItemsList.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.toggleUpdateItemStatusPopup = this.toggleUpdateItemStatusPopup.bind(this);
        this.setItemUpdateStatus = this.setItemUpdateStatus.bind(this);
        this.onUpdateItemsClick = this.onUpdateItemsClick.bind(this);
        this.onInsertItemClick = this.onInsertItemClick.bind(this);
        this.onViewItemClick = this.onViewItemClick.bind(this);
    }

    loadMore() {
        const { itemListData } = this.props;

        if (itemListData && itemListData.data && itemListData.pagination &&
            itemListData.data.length < itemListData.pagination.total_records) {
            this.getItemsList({ skipCount: itemListData.data.length });
        }
    }

    onViewItemClick({ rowData }) {
        const { navigation } = this.props;
        if (rowData.per_item_price) {
            rowData.per_item_price = rowData.per_item_price.toString()
        }
        if (rowData.discount) {
            rowData.discount = rowData.discount.toString()
        }
        if (rowData.set_count) {
            rowData.set_count = rowData.set_count.toString()
        }
        if (rowData.category_id && rowData.category_id._id) {
            rowData.category_id = rowData.category_id._id
        }
        if (rowData.measuring_unit_id && rowData.measuring_unit_id._id) {
            rowData.measuring_unit_id = rowData.measuring_unit_id._id
        }
        if (rowData.item_features && rowData.item_features.length > 0) {
            for (const featureIndex in rowData.item_features) {
                if (rowData.item_features[featureIndex] && rowData.item_features[featureIndex].feature_id &&
                    rowData.item_features[featureIndex].feature_id._id) {
                    rowData.item_features[featureIndex] = {
                        ...rowData.item_features[featureIndex],
                        feature_id: rowData.item_features[featureIndex].feature_id._id,
                    }
                }
            }
        }
        navigation.push(appRoutes.VendorRoutes.childRoutes.VendorItems.childRoutes.VendorItemsInsertForm.route, { formData: rowData })
    }

    getItemsList({ skipCount = 0 }) {
        const { searchByName, searchFilters, sortByVal } = this.state;
        const { getItems, userToken, vendorDetails } = this.props;
        const finalFilter = { ...searchFilters };
        if (searchByName && searchByName.length > 0) {
            finalFilter['name'] = { $regex: searchByName }
        }
        userToken && vendorDetails && vendorDetails._id && getItems && getItems({
            userToken,
            userId: vendorDetails._id,
            skipCount,
            filters: finalFilter,
            sortBy: sortByVal,
            isMobile: true,
        })
    }

    setItemUpdateStatus({ option, index }) {
        this.setState({ activeOptionIndex: index });
    }

    toggleUpdateItemStatusPopup(data) {
        this.setState(prevState => ({
            selectedItemIds: data && data.selectedItemIds ? data.selectedItemIds : [],
            onSelectedItemActionSuccess: data && data.onSuccess,
            isUpdateItemStatusPopupActive: !prevState.isUpdateItemStatusPopupActive
        }))
    }

    componentDidMount() {
        const {
            userToken, measuringUnitsList, getMeasuringUnits,
            itemCategoriesList, vendorDetails, getItemCategories
        } = this.props;
        if (!itemCategoriesList && userToken && vendorDetails) {
            getItemCategories({
                userToken,
                isMobile: true,
                vendorId: vendorDetails._id
            });
        }
        !measuringUnitsList && getMeasuringUnits({
            userToken
        });
        this.getItemsList({});
    }

    onInsertItemClick() {
        const { navigation } = this.props;
        navigation.push(appRoutes.VendorRoutes.childRoutes.VendorItems.childRoutes.VendorItemsInsertForm.route)
    }

    onUpdateItemsClick() {
        const { activeOptionIndex, selectedItemIds, onSelectedItemActionSuccess } = this.state;
        const { updateItemsStatus, userToken } = this.props;
        userToken && activeOptionIndex !== undefined && updateItemsStatus && updateItemsStatus({
            status: (activeOptionIndex === 0),
            userToken,
            selectedItemIds,
            onSuccess: _ => {
                this.toggleUpdateItemStatusPopup();
                onSelectedItemActionSuccess();
            },
        })
    }


    onRemoveItemsClick({ selectedItemIds }) {
        const { removeItem } = this.props;
        selectedItemIds && removeItem({
            itemIds: selectedItemIds
        })
    }

    onSortByValueChange({ val }) {
        this.setState({ sortByVal: val ? { [val]: 1 } : undefined }, _ => this.getItemsList({}));
    }

    onSearchByNameClick({ value }) {
        this.setState({ searchByName: value }, _ => this.getItemsList({}));
    }

    onListFiltersSelect({ filterData }) {
        const finalFilters = { ...filterData };
        if (finalFilters.category_id) {
            finalFilters.category_id = { _id: finalFilters.category_id };
        }
        if (finalFilters.measuring_unit_id) {
            finalFilters.measuring_unit_id = { _id: finalFilters.measuring_unit_id };
        }
        this.setState({ searchFilters: finalFilters }, _ => this.getItemsList({}))
    }

    render() {

        const { itemListData, isAppLoading, navigation, measuringUnitsList, itemCategoriesList } = this.props;
        const { isUpdateItemStatusPopupActive } = this.state;

        return <View style={{ flex: 1 }}>
            <VendorItemsListComp
                onFiltersSelect={this.onListFiltersSelect}
                searchByFields={[
                    {
                        fields: [
                            {
                                type: fieldTypes.boolean,
                                title: stringConstants.itemFormIsItemActiveFieldLabel,
                                name: 'is_active',
                            },
                            {
                                type: fieldTypes.fk,
                                displayKey: 'name',
                                valueKey: '_id',
                                placeholder: stringConstants.itemFormCategoryFieldLabel,
                                dataArray: itemCategoriesList,
                                name: 'category_id',
                            },
                            {
                                type: fieldTypes.fk,
                                displayKey: 'name',
                                valueKey: '_id',
                                placeholder: stringConstants.itemFormMeasuringUnitFieldLabel,
                                dataArray: measuringUnitsList,
                                name: 'measuring_unit_id',
                            },
                        ]
                    }
                ]}
                sortByOptions={[
                    { _id: 'name', name: stringConstants.nameFieldTitle },
                    { _id: 'per_item_price', name: stringConstants.itemFormPriceFieldLabel }
                ]}
                onSortByValueChange={this.onSortByValueChange}
                onSearchClick={this.onSearchByNameClick}
                onRemoveItemsClick={this.onRemoveItemsClick}
                loadMore={this.loadMore}
                toggleUpdateItemStatusPopup={this.toggleUpdateItemStatusPopup}
                headerActions={[
                    {
                        title: stringConstants.updateItemsStatusTitle,
                        showOnItemSelect: true,
                        onClick: this.toggleUpdateItemStatusPopup
                    }
                ]}
                rowActions={[
                    {
                        title: stringConstants.viewDetailsButtonTitle,
                        onPress: this.onViewItemClick,
                    }
                ]}
                isAppLoading={isAppLoading}
                onInsertItemClick={this.onInsertItemClick}
                navigation={navigation}
                isListLoading={get(itemListData, 'isLoading')}
                vendorItemsList={itemListData && itemListData.data}
            />
            <PopUp
                title={appStringConstants.uploadItemStatusPopupTitle}
                style={{ height: 220 }}
                isPopUpActive={isUpdateItemStatusPopupActive}
                onCrossPress={this.toggleUpdateItemStatusPopup}
                popupView={_ => <UpdateItemStatusPopup
                    onUpdateItemsClick={this.onUpdateItemsClick}
                    setItemUpdateStatus={this.setItemUpdateStatus}
                    options={[
                        {
                            title: stringConstants.activeItemButtontitle,
                            id: 0,
                        },
                        {
                            title: stringConstants.inActiveItemButtontitle,
                            id: 1,
                        }
                    ]}
                />}
            />
        </View>
    }
}


export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    vendorDetails: state.users.vendorDetails,
    isAppLoading: state.users.isAppLoading,
    itemListData: state.items.itemListData,
    measuringUnitsList: state.measuringUnits.measuringUnitsList,
    itemCategoriesList: state.itemCategories.itemCategoriesList,
}), { updateItemsStatus, getItemCategories, getMeasuringUnits, getItems, removeItem })(ItemsList)

