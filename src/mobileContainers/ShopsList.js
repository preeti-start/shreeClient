import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import {
    getShopsList, clearShopsList
} from "../redux-store/actions/shopActions";
import { getShopCategories } from "../redux-store/actions/shopCategoryActions";
import { appRoutes, defaultValForSortAndFilters } from "../constants/index";
import { ShopsListComp } from "../mobileComponents/index";
import stringConstants from "../constants/mobileStringConstants";

class ShopsList extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            sortByVal: defaultValForSortAndFilters.sortByVal,
            searchByName: defaultValForSortAndFilters.searchByName,
            searchFilters: this.getFinalFilter({ currentFilter: defaultValForSortAndFilters.searchFilters }),
        };

        this.getFinalFilter = this.getFinalFilter.bind(this);
        this.onSortByValueChange = this.onSortByValueChange.bind(this);
        this.onListFiltersSelect = this.onListFiltersSelect.bind(this);
        this.getListData = this.getListData.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onShopClick = this.onShopClick.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this.getListData({});
        const { getShopCategories } = this.props;
        getShopCategories({ isMobile: true, authenticateUser: false })
    }

    componentWillUnmount() {
        const { clearShopsList } = this.props;
        clearShopsList();
    }

    getFinalFilter({ currentFilter = {} }) {
        const { navigation } = this.props;
        const finalFilter = { ...currentFilter };
        const shopCategory = get(navigation, 'state.params.shop_category_id');
        if (shopCategory) {
            finalFilter['shop_category_id'] = { _id: shopCategory }
        }
        return finalFilter
    }

    getListData({ skipCount = 0 }) {
        const { searchByName, searchFilters, sortByVal } = this.state;
        const finalFilter = { ...searchFilters };
        if (searchByName && searchByName.length > 0) {
            finalFilter['shop_name'] = { $regex: searchByName }
        }
        const { getShopsList } = this.props;
        getShopsList({ skipCount, filters: finalFilter, sortByShopName: (sortByVal ? true : false) });
    }

    onSortByValueChange({ val }) {
        this.setState({ sortByVal: val ? { [val]: -1 } : undefined }, _ => this.getListData({}));
    }

    loadMore() {
        const { shopsListData } = this.props;
        if (shopsListData && shopsListData.data && shopsListData.pagination && shopsListData.data.length < shopsListData.pagination.total_records) {
            this.getListData({ skipCount: shopsListData.data.length });
        }
    }

    onListFiltersSelect({ filterData }) {
        const finalFilters = { ...filterData };
        // if (finalFilters.shop_category_id) {
        //     finalFilters.shop_category_id = { _id: finalFilters.shop_category_id };
        // }
        if (finalFilters.name) {
            finalFilters.name = { $regex: finalFilters.name };
        }
        if (finalFilters.shop_number) {
            finalFilters.shop_number = { $regex: finalFilters.shop_number };
        }
        this.setState({ searchFilters: this.getFinalFilter({ currentFilter: finalFilters }) }, _ => this.getListData({}))
    }

    onShopClick({ rowData }) {

        const { navigation, buyerDetails, userToken } = this.props;

        if (rowData && rowData._id && navigation) {
            if (userToken && buyerDetails) {
                navigation.push(appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ItemsListView.route, {
                    vendorId: rowData._id,
                    vendorDetails: rowData,
                });
            } else {
                navigation.push(appRoutes.AppRoutes.childRoutes.Home.childRoutes.ItemsListView.route, {
                    vendorId: rowData._id,
                    vendorDetails: rowData,
                });
            }
        }
    }

    onSearchClick({ value }) {
        this.setState({ searchByName: value }, _ => this.getListData({}));
    }

    render() {

        const { shopsListData, navigation, shopCategoriesList } = this.props;
        return <ShopsListComp
            onSortByValueChange={this.onSortByValueChange}
            onFiltersSelect={this.onListFiltersSelect}
            sortByOptions={[
                { _id: 'shop_name', name: stringConstants.unitNameFieldTitle },
            ]}
            searchByFields={[
                {
                    fields: [
                        {
                            placeholder: stringConstants.signupFormUserRolesTabVendorTitle,
                            name: 'name',
                        },
                        {
                            placeholder: stringConstants.unitNumberFieldTitle,
                            name: "shop_number",
                        },
                        // {
                        //     type: fieldTypes.fk,
                        //     displayKey: 'name',
                        //     valueKey: '_id',
                        //     placeholder: stringConstants.unitCategoryFieldTitle,
                        //     dataArray: shopCategoriesList,
                        //     name: 'shop_category_id',
                        // },
                        // {
                        //     type: fieldTypes.boolean,
                        //     title: stringConstants.isHomeDeliveryActiveFieldTitle,
                        //     name: 'is_home_delivery_active',
                        // },
                    ]
                }
            ]}
            onSearchClick={this.onSearchClick}
            loadMore={this.loadMore}
            getListData={this.getListData}
            navigation={navigation}
            shopListLoading={shopsListData && shopsListData.isLoading}
            onShopClick={this.onShopClick}
            shopsList={shopsListData && shopsListData.data}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    shopsListData: state.shop.shopsListData,
    buyerDetails: state.users.buyerDetails,
    userToken: state.users.userToken,
    shopCategoriesList: state.shopCategories.shopCategoriesList,
}), { clearShopsList, getShopCategories, getShopsList })(ShopsList)