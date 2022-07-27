import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { getOrderHistoryList } from '../redux-store/actions/orderActions';
import { OrdersList } from "../mobileComponents/index";
import { defaultValForSortAndFilters } from "../constants";
import appStringConstants from "../constants/appStringConstants";
import { getVendorsListForFilter, getBuyersListForFilter } from '../redux-store/actions/userActions'


class VendorsOrderHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortByVal: defaultValForSortAndFilters.sortByVal,
            searchFilters: defaultValForSortAndFilters.searchFilters,
            searchByName: defaultValForSortAndFilters.searchByName,
        };
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onListFiltersSelect = this.onListFiltersSelect.bind(this);
        this.onSortByValueChange = this.onSortByValueChange.bind(this);
        this.getFinalFilter = this.getFinalFilter.bind(this);
    }

    componentDidMount() {
        const { getVendorsListForFilter, allVendors, getBuyersListForFilter, allBuyers, userToken } = this.props;
        this.getListData({});
        !allVendors && getVendorsListForFilter({ userToken });
        !allBuyers && getBuyersListForFilter({ userToken });
    }

    onListFiltersSelect({ filterData }) {
        this.setState({ searchFilters: { ...filterData } }, _ => this.getListData({}))
    }

    getListData({ skipCount = 0 }) {
        const { sortByVal } = this.state;
        const { getOrderHistoryList, userToken, vendorDetails } = this.props;
        vendorDetails && vendorDetails._id && userToken && getOrderHistoryList && getOrderHistoryList({
            userToken,
            sort: sortByVal,
            filter: { ...this.getFinalFilter(), "vendor_id._id": vendorDetails._id },
            skipCount,
            isMobile: true,
        })
    }

    getFinalFilter() {
        const { searchByName, searchFilters } = this.state;
        const filter = { ...searchFilters };
        if (searchFilters.buyer_id) {
            if (searchFilters.buyer_id !== appStringConstants.dropDownFirstOption) {
                filter['buyer_id._id'] = searchFilters.buyer_id;
            }
            delete filter.buyer_id;
        }
        if (searchByName) {
            filter['order_number'] = { $regex: searchByName };
        }
        return filter;
    }

    onSortByValueChange({ val }) {
        this.setState({ sortByVal: val ? { [val]: -1 } : undefined }, _ => this.getListData({}));
    }

    onSearchClick({ value }) {
        this.setState({ searchByName: value }, _ => this.getListData({}));
    }

    render() {
        const { navigation, allBuyers, allVendors, isAppLoading, ordersHistoryListData } = this.props;
        return <OrdersList
            onSortByValueChange={this.onSortByValueChange}
            onSearchClick={this.onSearchClick}
            onFiltersSelect={this.onListFiltersSelect}
            allBuyers={allBuyers}
            allVendors={allVendors}
            showOrderStatus={true}
            isOrderHistory={true}
            showBuyerLoc={true}
            showStatusCircles={false}
            navigation={navigation}
            isAppLoading={isAppLoading}
            isListLoading={get(ordersHistoryListData, 'isLoading')}
            data={ordersHistoryListData && ordersHistoryListData.data}
        />

    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    vendorDetails: state.users.vendorDetails,
    isAppLoading: state.users.isAppLoading,
    allVendors: state.users.allVendors,
    allBuyers: state.users.allBuyers,
    ordersHistoryListData: state.order.ordersHistoryListData,
}), { getOrderHistoryList, getVendorsListForFilter, getBuyersListForFilter })(VendorsOrderHistory)