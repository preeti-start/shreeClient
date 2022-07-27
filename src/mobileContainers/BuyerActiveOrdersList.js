import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { OrdersList } from '../mobileComponents/index';
import { getActiveOrdersList, updateOrderDetails, setOrderDetails } from '../redux-store/actions/orderActions';
import { getVendorsListForFilter, getBuyersListForFilter } from '../redux-store/actions/userActions'
import {
    appRoutes, defaultValForSortAndFilters
} from "../constants";
import { onOrderStatusUpdate } from "../utils/mobileFunctions";
import stringConstants from "../constants/mobileStringConstants";
import appStringConstants from "../constants/appStringConstants";


class BuyerActiveOrdersList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sortByVal: defaultValForSortAndFilters.sortByVal,
            searchFilters: defaultValForSortAndFilters.searchFilters,
            searchByName: defaultValForSortAndFilters.searchByName,
        };
        this.onSortByValueChange = this.onSortByValueChange.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.getListData = this.getListData.bind(this);
        this.onCancelOrderPress = this.onCancelOrderPress.bind(this);
        this.getFinalFilter = this.getFinalFilter.bind(this);
        this.onListFiltersSelect = this.onListFiltersSelect.bind(this);
    }

    componentDidMount() {
        const { getVendorsListForFilter, allVendors, getBuyersListForFilter, allBuyers, userToken } = this.props;
        this.getListData({});
        !allVendors && getVendorsListForFilter({ userToken });
        !allBuyers && getBuyersListForFilter({ userToken });
    }

    onSortByValueChange({ val }) {
        this.setState({ sortByVal: val ? { [val]: -1 } : undefined }, _ => this.getListData({}));
    }

    onSearchClick({ value }) {
        this.setState({ searchByName: value }, _ => this.getListData({}));
    }

    onCancelOrderPress({ recordId, newStatus }) {

        const { userToken, navigation, updateOrderDetails } = this.props;
        onOrderStatusUpdate({ recordId, navigation, newStatus, updateOrderDetails, userToken });
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

    getListData({ skipCount = 0 }) {
        const { sortByVal } = this.state;
        const { getActiveOrdersList, userToken, buyerDetails } = this.props;
        get(buyerDetails, '_id') && userToken && getActiveOrdersList({
            skipCount,
            isMobile: true,
            userToken,
            sort: sortByVal,
            filter: { ...this.getFinalFilter(), "buyer_id._id": buyerDetails._id }
        })
    }


    loadMore() {
        const { activeOrdersListData } = this.props;
        if (activeOrdersListData && activeOrdersListData.data && activeOrdersListData.pagination &&
            activeOrdersListData.data.length < activeOrdersListData.pagination.total_records) {
            this.getListData({ skipCount: activeOrdersListData.data.length });
        }
    }

    onRowClick({ rowData }) {
        const { navigation, setOrderDetails } = this.props;
        setOrderDetails({ data: rowData });
        navigation && navigation.navigate(appRoutes.BuyerRoutes.childRoutes.BuyerActiveOrders.childRoutes.BuyerActiveOrdersDetailView.route,
            { orderId: rowData._id })
    }

    onListFiltersSelect({ filterData }) {
        this.setState({ searchFilters: { ...filterData } }, _ => this.getListData({}))
    }

    render() {
        const { activeOrdersListData, navigation, allVendors = [], allBuyers = [] } = this.props;
        return <OrdersList
            onSortByValueChange={this.onSortByValueChange}
            onFiltersSelect={this.onListFiltersSelect}
            allBuyers={allBuyers}
            allVendors={allVendors}
            onRowClick={this.onRowClick}
            onSearchClick={this.onSearchClick}
            isBuyer={true}
            loadMore={this.loadMore}
            onOrderStatusUpdatePress={this.onCancelOrderPress}
            navigation={navigation}
            isListLoading={get(activeOrdersListData, 'isLoading')}
            data={activeOrdersListData && activeOrdersListData.data}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    activeOrdersListData: state.order.activeOrdersListData,
    userToken: state.users.userToken,
    buyerDetails: state.users.buyerDetails,
    allVendors: state.users.allVendors,
    allBuyers: state.users.allBuyers,
}), {
    getVendorsListForFilter, getBuyersListForFilter,
    getActiveOrdersList, setOrderDetails, updateOrderDetails
})(BuyerActiveOrdersList)