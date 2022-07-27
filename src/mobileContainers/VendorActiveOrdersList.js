import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { onOrderStatusUpdate } from '../utils/mobileFunctions';
import { appRoutes, defaultValForSortAndFilters } from '../constants/index';
import { OrdersList } from '../mobileComponents/index';
import { getActiveOrdersList, updateOrderDetails, setOrderDetails } from '../redux-store/actions/orderActions';
import { getVendorsListForFilter, getBuyersListForFilter } from '../redux-store/actions/userActions'
import appStringConstants from "../constants/appStringConstants";


class VendorActiveOrdersList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sortByVal: defaultValForSortAndFilters.sortByVal,
            searchFilters: defaultValForSortAndFilters.searchFilters,
            searchByName: defaultValForSortAndFilters.searchByName,
        };
        this.getFinalFilter = this.getFinalFilter.bind(this);
        this.onListFiltersSelect = this.onListFiltersSelect.bind(this);
        this.onSortByValueChange = this.onSortByValueChange.bind(this);
        this.onOrderStatusUpdatePress = this.onOrderStatusUpdatePress.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.getListData = this.getListData.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
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

    onRowClick({ rowData }) {
        const { navigation, setOrderDetails } = this.props;
        setOrderDetails({ data: rowData });
        navigation && navigation.navigate(appRoutes.VendorRoutes.childRoutes.VendorActiveOrders.childRoutes.VendorActiveOrdersDetailView.route,
            { orderId: rowData._id })
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

    getListData({ skipCount = 0 }) {
        const { sortByVal } = this.state;
        const { getActiveOrdersList, userToken, vendorDetails } = this.props;
        vendorDetails && vendorDetails._id && userToken && getActiveOrdersList && getActiveOrdersList({
            isMobile: true,
            skipCount,
            userToken,
            sort: sortByVal,
            filter: { ...this.getFinalFilter(), "vendor_id._id": vendorDetails._id }
        })
    }

    loadMore() {
        const { activeOrdersListData } = this.props;
        if (activeOrdersListData && activeOrdersListData.data && activeOrdersListData.pagination &&
            activeOrdersListData.data.length < activeOrdersListData.pagination.total_records) {
            this.getListData({ skipCount: activeOrdersListData.data.length });
        }
    }

    onOrderStatusUpdatePress({ recordId, newStatus }) {
        const { userToken, navigation, updateOrderDetails } = this.props;
        onOrderStatusUpdate({
            navigation,
            recordId, newStatus, updateOrderDetails, userToken
        })
    }

    onSortByValueChange({ val }) {
        this.setState({ sortByVal: val ? { [val]: -1 } : undefined }, _ => this.getListData({}));
    }

    onSearchClick({ value }) {
        this.setState({ searchByName: value }, _ => this.getListData({}));
    }

    render() {

        const { activeOrdersListData, allBuyers, allVendors, navigation } = this.props;

        return <OrdersList
            onSortByValueChange={this.onSortByValueChange}
            onSearchClick={this.onSearchClick}
            onFiltersSelect={this.onListFiltersSelect}
            allBuyers={allBuyers}
            allVendors={allVendors}
            onRowClick={this.onRowClick}
            getListData={this.getListData}
            loadMore={this.loadMore}
            onOrderStatusUpdatePress={this.onOrderStatusUpdatePress}
            isVendor={true}
            navigation={navigation}
            isListLoading={get(activeOrdersListData, 'isLoading')}
            data={activeOrdersListData && activeOrdersListData.data}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    activeOrdersListData: state.order.activeOrdersListData,
    userToken: state.users.userToken,
    vendorDetails: state.users.vendorDetails,
    allVendors: state.users.allVendors,
    allBuyers: state.users.allBuyers,
}), {
    getActiveOrdersList,
    updateOrderDetails,
    getVendorsListForFilter,
    getBuyersListForFilter,
    setOrderDetails
})(VendorActiveOrdersList)