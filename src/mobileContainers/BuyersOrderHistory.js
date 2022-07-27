import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { getOrderHistoryList } from '../redux-store/actions/orderActions';
import { OrdersList } from "../mobileComponents/index";
import { defaultValForSortAndFilters } from "../constants";
import appStringConstants from "../constants/appStringConstants";
import { getVendorsListForFilter, getBuyersListForFilter } from '../redux-store/actions/userActions'

class BuyersOrderHistory extends React.Component {

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
        this.getListData = this.getListData.bind(this);
        this.loadMore = this.loadMore.bind(this);
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

    getFinalFilter() {
        const { searchByName, searchFilters } = this.state;
        const filter = { ...searchFilters };
        if (searchFilters.vendor_id) {
            if (searchFilters.vendor_id !== appStringConstants.dropDownFirstOption) {
                filter['vendor_id._id'] = searchFilters.vendor_id;
            }
            delete filter.vendor_id;
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


    getListData({ skipCount = 0 }) {
        const { sortByVal } = this.state;
        const { getOrderHistoryList, userToken, buyerDetails } = this.props;
        buyerDetails && buyerDetails._id && userToken && getOrderHistoryList && getOrderHistoryList({
            skipCount,
            userToken,
            sort: sortByVal,
            filter: {
                ...this.getFinalFilter(), "buyer_id._id": buyerDetails._id,
            }
        })
    }

    loadMore() {
        const { ordersHistoryListData } = this.props;
        if (ordersHistoryListData && ordersHistoryListData.data && ordersHistoryListData.pagination &&
            ordersHistoryListData.data.length < ordersHistoryListData.pagination.total_records) {
            this.getListData({ skipCount: ordersHistoryListData.data.length });
        }
    }

    render() {
        const { navigation, allBuyers, allVendors, ordersHistoryListData } = this.props;
        return <OrdersList
            onSortByValueChange={this.onSortByValueChange}
            onSearchClick={this.onSearchClick}
            onFiltersSelect={this.onListFiltersSelect}
            allBuyers={allBuyers}
            allVendors={allVendors}
            isOrderHistory={true}
            showOrderStatus={true}
            isBuyer={true}
            showStatusCircles={false}
            getListData={this.getListData}
            loadMore={this.loadMore}
            navigation={navigation}
            isListLoading={get(ordersHistoryListData, 'isLoading')}
            data={ordersHistoryListData && ordersHistoryListData.data}
        />

    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    buyerDetails: state.users.buyerDetails,
    allVendors: state.users.allVendors,
    allBuyers: state.users.allBuyers,
    ordersHistoryListData: state.order.ordersHistoryListData,
}), { getOrderHistoryList, getVendorsListForFilter, getBuyersListForFilter })(BuyersOrderHistory)