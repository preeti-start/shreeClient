import React from 'react';
import { connect } from 'react-redux';

import { getShopItems, clearShopItems } from '../redux-store/actions/itemActions';
import { addItemToUserCart } from '../redux-store/actions/cartActions';
import { getItemCategories } from '../redux-store/actions/itemCategoryActions';
import { ShopItemsListViewComp } from "../mobileComponents/index";
import { appRoutes, defaultValForSortAndFilters, fieldTypes } from "../constants/index";
import stringConstants from "../constants/mobileStringConstants";

class ShopItemsListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchFilters: defaultValForSortAndFilters.searchFilters,
            sortByVal: defaultValForSortAndFilters.sortByVal,
            searchByName: defaultValForSortAndFilters.searchByName
        };
        this.onListFiltersSelect = this.onListFiltersSelect.bind(this);
        this.onSortByValueChange = this.onSortByValueChange.bind(this);
        this.onShowDetailPress = this.onShowDetailPress.bind(this);
        this.getItemsList = this.getItemsList.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
    }

    componentDidMount() {
        const { getItemCategories } = this.props;
        const { vendorId } = this.props.navigation.state.params;
        getItemCategories({
            isMobile: true,
            authenticateUser: false,
            vendorId,
        });
        this.getItemsList({});
    }

    getItemsList({ skipCount = 0 }) {
        const { vendorId } = this.props.navigation.state.params;
        const { searchByName, searchFilters, sortByVal } = this.state;
        const { getShopItems } = this.props;
        const finalFilter = { ...searchFilters };
        if (searchByName && searchByName.length > 0) {
            finalFilter['name'] = { $regex: searchByName }
        }
        vendorId && getShopItems && getShopItems({
            shopId: vendorId,
            filter: finalFilter,
            skipCount,
            sort: sortByVal,
            isMobile: true,
        })
    }

    onSortByValueChange({ val }) {
        this.setState({ sortByVal: val ? { [val]: 1 } : undefined }, _ => this.getItemsList({}));
    }

    onShowDetailPress({ rowData }) {

        const { navigation, userToken, buyerDetails } = this.props;

        if (rowData && rowData._id && navigation) {
            if (userToken && buyerDetails) {
                navigation.push(appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ItemDetailView.route, {
                    itemId: rowData._id,
                });
            } else {
                navigation.push(appRoutes.AppRoutes.childRoutes.Home.childRoutes.ItemDetailView.route, {
                    itemId: rowData._id,
                });
            }
        }
    }

    onSearchClick({ value }) {
        this.setState({ searchByName: value }, _ => this.getItemsList({}));

    }


    loadMore() {
        const { shopItemsListData } = this.props;
        if (shopItemsListData && shopItemsListData.data && shopItemsListData.pagination &&
            shopItemsListData.data.length < shopItemsListData.pagination.total_records) {
            this.getItemsList({ skipCount: shopItemsListData.data.length });
        }
    }

    onListFiltersSelect({ filterData }) {
        const finalFilters = { ...filterData };
        if (finalFilters.category_id) {
            finalFilters.category_id = { _id: finalFilters.category_id };
        }
        this.setState({ searchFilters: finalFilters }, _ => this.getItemsList({}))
    }

    componentWillUnmount() {
        const { clearShopItems } = this.props;
        clearShopItems();
    }

    render() {

        const { shopItemsListData, itemCategoriesList, navigation } = this.props;
        const { vendorDetails } = this.props.navigation.state.params;

        return <ShopItemsListViewComp
            searchByFields={[
                {
                    fields: [
                        {
                            type: fieldTypes.fk,
                            displayKey: 'name',
                            valueKey: '_id',
                            placeholder: stringConstants.itemFormCategoryFieldLabel,
                            dataArray: itemCategoriesList,
                            name: 'category_id',
                        },
                    ]
                }
            ]}
            onFiltersSelect={this.onListFiltersSelect}
            sortByOptions={[
                { _id: 'name', name: stringConstants.nameFieldTitle },
                { _id: 'per_item_price', name: stringConstants.itemFormPriceFieldLabel }
            ]}
            onSortByValueChange={this.onSortByValueChange}
            onSearchClick={this.onSearchClick}
            loadMore={this.loadMore}
            getListData={this.getItemsList}
            navigation={navigation}
            onShowDetailPress={this.onShowDetailPress}
            vendorDetails={vendorDetails}
            itemListLoading={shopItemsListData && shopItemsListData.isLoading}
            vendorItemsList={shopItemsListData && shopItemsListData.data}
        />

    }
}

export default connect((state = {}, ownProps = {}) => ({
    buyerDetails: state.users.buyerDetails,
    userToken: state.users.userToken,
    shopItemsListData: state.items.shopItemsListData,
    itemCategoriesList: state.itemCategories.itemCategoriesList,
}), {
    getShopItems, clearShopItems, addItemToUserCart, getItemCategories
})(ShopItemsListView)