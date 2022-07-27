import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { getOrderHistoryList } from '../../redux-store/actions/orderActions'
import { getVendorsListForFilter, getBuyersListForFilter } from '../../redux-store/actions/userActions'
import Table from "../../components/AppCompLibrary/Table";
import { orderStatus, orderTypes, sortingOption, roles } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import PageHeader from "../../components/PageHeader";
import InfiniteScroller from "../../components/AppCompLibrary/InfiniteScroller";
import { getDateVal } from "../../utils/functions";
import SortBy from "../../components/AppCompLibrary/SortBy";
import StringSearchInput from "../../components/AppCompLibrary/StringSearchInput";
import Input from "../../components/AppCompLibrary/Input";
import DatePicker from "../DatePicker";

import './index.css';

const initialState = {
    sort: { _id: sortingOption }
};


class OrderHistory extends React.Component {

    constructor(props) {
        super(props);
        const startDate = new Date();
        const endDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        endDate.setDate(endDate.getDate() + 7);
        this.state = {
            sort: initialState.sort,
            orderNmbrFilter: '',
            orderStatusFilter: appStringConstants.dropDownFirstOption,
            deliveryStatusFilter: appStringConstants.dropDownFirstOption,
            isDataLoading: false,
            vendorsFilter: appStringConstants.dropDownFirstOption,
            buyersFilter: appStringConstants.dropDownFirstOption,
            dateFilter: { startDate, endDate }
        };
        this.headerRightView = this.headerRightView.bind(this);
        this.headerBottomView = this.headerBottomView.bind(this);
        this.onFiltersChange = this.onFiltersChange.bind(this);
        this.getFinalFilterSortOptions = this.getFinalFilterSortOptions.bind(this);
        this.getCompleteOrderList = this.getCompleteOrderList.bind(this);
        this.onOrderNameFilterValueChange = this.onOrderNameFilterValueChange.bind(this);
        this.onSortOptionSelect = this.onSortOptionSelect.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    onSortOptionSelect({ sort }) {
        const finalSort = sort ? sort : initialState.sort;
        this.setState({ sort: finalSort }, _ => {
            this.getFinalFilterSortOptions({})
        });
    }


    onOrderNameFilterValueChange(val) {
        this.setState({
            orderNmbrFilter: val
        })
    }

    headerRightView() {

        const {
            dateFilter, orderNmbrFilter,
        } = this.state;

        const options = [
            <div className="table-header-option">
                <StringSearchInput
                    onClick={this.getFinalFilterSortOptions}
                    onChange={this.onOrderNameFilterValueChange}
                    placeholder={appStringConstants.ordersListOrderNumberFieldTitle}
                    value={orderNmbrFilter}
                />
            </div>,
            <div className="table-header-option">
                <SortBy
                    onClick={this.onSortOptionSelect}
                    options={[
                        { label: appStringConstants.ordersListDateFieldTitle, id: 'date' },
                        { label: appStringConstants.amountFieldPlaceholder, id: 'total_amount' }
                    ]}
                />
            </div>,
            <div
                className="table-header-option">
                <DatePicker
                    onDateSelect={val => this.onFiltersChange({ value: val }, 'dateFilter')}
                    startDate={dateFilter.startDate}
                    endDate={dateFilter.endDate}
                />
            </div>
        ];

        return options;

    }

    headerBottomView() {

        const { allVendors, userDetails, allBuyers } = this.props;
        const {
            buyersFilter, dateFilter, vendorsFilter, orderNmbrFilter,
            deliveryStatusFilter, orderStatusFilter
        } = this.state;

        const options = [
            <div className="table-header-option">
                <Input
                    showDropDown={true}
                    dropDownLabelKey={'name'}
                    dropDownValueKey={'name'}
                    dropDownOptions={[
                        { name: appStringConstants.dropDownFirstOption },
                        { name: orderStatus.new },
                        { name: orderStatus.confirmed },
                        { name: orderStatus.packed },
                        { name: orderStatus.out_for_delivery }]}
                    onDropDownSelect={val => this.onFiltersChange(val, 'orderStatusFilter')}
                    inputValue={orderStatusFilter}
                    activeDropDownItemIndex={orderStatusFilter}
                    label={appStringConstants.ordersListStatusFieldTitle}
                />
            </div>,
            <div className="table-header-option">
                <Input
                    showDropDown={true}
                    dropDownLabelKey={'label'}
                    dropDownValueKey={'name'}
                    dropDownOptions={[{
                        name: appStringConstants.dropDownFirstOption,
                        label: appStringConstants.dropDownFirstOption
                    }, {
                        name: orderTypes.pick_up,
                        label: orderTypes.pick_up
                    }, {
                        name: orderTypes.home_delivery,
                        label: orderTypes.home_delivery
                    }]}
                    onDropDownSelect={val => this.onFiltersChange(val, 'deliveryStatusFilter')}
                    inputValue={deliveryStatusFilter}
                    activeDropDownItemIndex={deliveryStatusFilter}
                    label={appStringConstants.ordersListOrderTypeFieldTitle}
                />
            </div>
        ];
        if (userDetails.role === roles.admin || userDetails.role === roles.buyer) options.push(<div
            className="table-header-option">
            <Input
                showDropDown={true}
                dropDownLabelKey={'shop_name'}
                dropDownValueKey={'_id'}
                dropDownOptions={allVendors}
                onDropDownSelect={val => this.onFiltersChange(val, 'vendorsFilter')}
                inputValue={vendorsFilter}
                activeDropDownItemIndex={vendorsFilter}
                label={appStringConstants.ordersListVendorFieldTitle}
            />
        </div>);
        if (userDetails.role === roles.admin || userDetails.role === roles.vendor) options.push(<div
            className="table-header-option">
            <Input
                showDropDown={true}
                dropDownLabelKey={'name'}
                dropDownValueKey={'_id'}
                dropDownOptions={allBuyers}
                onDropDownSelect={val => this.onFiltersChange(val, 'buyersFilter')}
                inputValue={buyersFilter}
                activeDropDownItemIndex={buyersFilter}
                label={appStringConstants.ordersListBuyerFieldTitle}
            />
        </div>);

        return options;
    }

    getFinalFilterSortOptions({ skipCount }) {
        const {
            orderStatusFilter, orderNmbrFilter, dateFilter, sort,
            deliveryStatusFilter, buyersFilter, vendorsFilter
        } = this.state;
        const { startDate, endDate } = dateFilter;
        let filter = {};
        if (orderNmbrFilter && orderNmbrFilter.length > 0) filter['order_number'] = { $regex: orderNmbrFilter };
        if (deliveryStatusFilter && deliveryStatusFilter !== appStringConstants.dropDownFirstOption) filter['order_type'] = deliveryStatusFilter;
        if (orderStatusFilter && orderStatusFilter !== appStringConstants.dropDownFirstOption) filter['status'] = orderStatusFilter;
        if (vendorsFilter && vendorsFilter !== appStringConstants.dropDownFirstOption) filter['vendor_id._id'] = vendorsFilter;
        if (buyersFilter && buyersFilter !== appStringConstants.dropDownFirstOption) filter['buyer_id._id'] = buyersFilter;
        this.getCompleteOrderList({ filter, skipCount, sort, startDate, endDate });
    }

    onFiltersChange(value, key) {
        if (value && value.value) {
            this.setState(_ => ({ [key]: value.value }), _ => {
                this.getFinalFilterSortOptions({});
            });
        }
    }

    getCompleteOrderList({ skipCount = 0, filter = {}, sort = {}, startDate, endDate }) {
        const { userDetails, vendorDetails, userToken, buyerDetails, getOrderHistoryList } = this.props;
        let finalFilter = (userDetails.role === roles.vendor) ? { "vendor_id._id": vendorDetails._id } :
            (userDetails.role === roles.buyer ? { "buyer_id._id": buyerDetails._id } : {});
        if (filter) finalFilter = { ...finalFilter, ...filter };
        if (((userDetails.role === roles.admin) || (userDetails.role === roles.vendor && vendorDetails &&
            vendorDetails._id) || (userDetails.role === roles.buyer && buyerDetails && buyerDetails._id)) &&
            userDetails && userToken && userDetails.role && getOrderHistoryList) {
            this.setState({ isDataLoading: true });
            getOrderHistoryList({
                userToken,
                filter: finalFilter,
                sort,
                skipCount, startDate, endDate,
                onSuccess: _ => {
                    this.setState({ isDataLoading: false });
                },
                onError: _ => {
                    this.setState({ isDataLoading: false });
                }
            })
        }
    }

    componentDidMount() {
        const { getVendorsListForFilter, allBuyers, allVendors, getBuyersListForFilter, userToken } = this.props;
        !allVendors && getVendorsListForFilter && getVendorsListForFilter({ userToken });
        !allBuyers && getBuyersListForFilter && getBuyersListForFilter({ userToken });
        this.getFinalFilterSortOptions({});
    }

    loadMore() {
        const { ordersHistoryListData } = this.props;
        if (ordersHistoryListData && ordersHistoryListData.data && ordersHistoryListData.pagination &&
            ordersHistoryListData.data.length < ordersHistoryListData.pagination.total_records) {
            this.getFinalFilterSortOptions({ skipCount: ordersHistoryListData.data.length });
        }
    }

    getColsList() {
        const { userDetails } = this.props;
        const isAdmin = userDetails && userDetails.role && userDetails.role === roles.admin;
        const isVendor = userDetails && userDetails.role && userDetails.role === roles.vendor;
        const isBuyer = userDetails && userDetails.role && userDetails.role === roles.buyer;
        let finalColList = [
            { "label": appStringConstants.ordersListOrderNumberFieldTitle, "field": "order_number" },
            {
                "label": appStringConstants.ordersListDateFieldTitle,
                width: 100,
                Cell: rowVal => <div>{getDateVal({ date: rowVal.date })}</div>
            },
            {
                "label": appStringConstants.ordersListTimeFieldTitle,
                width: 100,
                Cell: rowVal => <div>{getDateVal({ date: rowVal.date, format: "hh:mm A" })}</div>
            },
            { "label": appStringConstants.ordersListStatusFieldTitle, "field": "status" },
            { "label": appStringConstants.ordersListOrderTypeFieldTitle, "field": "order_type" },
        ];
        if (isAdmin || isVendor) {
            finalColList.push({
                "label": appStringConstants.ordersListBuyerFieldTitle,
                Cell: _ => <div>{_ && _.buyer_id && _.buyer_id.name}</div>,
            })
        }
        if (isAdmin || isBuyer) {
            finalColList.push({
                "label": appStringConstants.ordersListVendorFieldTitle,
                Cell: _ => <div>{get(_, 'vendor_id.shop_name', '')}</div>,
            })
        }
        finalColList = [
            ...finalColList,
            { "label": appStringConstants.ordersListTotalAmountFieldTitle, "field": "total_amount" },
            {
                "label": appStringConstants.ordersListItemsFieldTitle,
                Cell: _ => <div>{_ && _.items && _.items.length}</div>
            }
        ];
        return finalColList
    }

    render() {

        const { ordersHistoryListData } = this.props;
        const { isDataLoading } = this.state;

        return <div className="order-history-list-container">
            <PageHeader
                title={appStringConstants.orderHistoryListMenuTitle}
                rightView={this.headerRightView}
                bottomView={this.headerBottomView}
            />
            <InfiniteScroller
                isLoading={isDataLoading}
                scrollableTarget={'dashboard'}
                loadMore={this.loadMore}>
                <Table
                    data={[{
                        isLoadingMore: ordersHistoryListData && ordersHistoryListData.isLoading && ordersHistoryListData.data,
                        isLoading: ordersHistoryListData && ordersHistoryListData.isLoading && !ordersHistoryListData.data,
                        data: ordersHistoryListData && ordersHistoryListData.data
                    }]}
                    columns={this.getColsList()}
                />
            </InfiniteScroller>

        </div>


    }


}

export default connect(state => ({
    userToken: state.users.userToken,
    userDetails: state.users.userDetails,
    ordersHistoryListData: state.order.ordersHistoryListData,
    buyerDetails: state.users.buyerDetails,
    vendorDetails: state.users.vendorDetails,
    allVendors: state.users.allVendors,
    allBuyers: state.users.allBuyers,
}), { getVendorsListForFilter, getBuyersListForFilter, getOrderHistoryList })(OrderHistory)