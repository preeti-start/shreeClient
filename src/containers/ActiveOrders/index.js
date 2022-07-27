import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { getVendorsListForFilter, getBuyersListForFilter } from '../../redux-store/actions/userActions'
import { getActiveOrdersList, updateOrderDetails } from '../../redux-store/actions/orderActions'
import { getDateVal } from '../../utils/functions'
import DatePicker from "../DatePicker";
import Table from "../../components/AppCompLibrary/Table";
import { appButtonType, orderStatus, orderTypes, roles, sortingOption } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/AppCompLibrary/Button";
import InfiniteScroller from "../../components/AppCompLibrary/InfiniteScroller";
import PopUp from "../../components/Popup";
import Input from "../../components/AppCompLibrary/Input";
import SortBy from "../../components/AppCompLibrary/SortBy";
import StringSearchInput from "../../components/AppCompLibrary/StringSearchInput";

import './index.css';

const initialState = {
    sort: { _id: sortingOption }
};

class ActiveOrders extends React.Component {

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
            vendorsFilter: appStringConstants.dropDownFirstOption,
            buyersFilter: appStringConstants.dropDownFirstOption,
            isDataLoading: false,
            isOrderStatusUpdatePopupActive: undefined,
            dateFilter: { startDate, endDate }
        };
        this.onOrderNameFilterValueChange = this.onOrderNameFilterValueChange.bind(this);
        this.onSortOptionSelect = this.onSortOptionSelect.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.getOrdersList = this.getOrdersList.bind(this);
        this.updateOrderStatus = this.updateOrderStatus.bind(this);
        this.toggleOrderStatusUpdatePopup = this.toggleOrderStatusUpdatePopup.bind(this);
        this.onFiltersChange = this.onFiltersChange.bind(this);
        this.getFinalFilterSortOptions = this.getFinalFilterSortOptions.bind(this);
        this.headerRightView = this.headerRightView.bind(this);
        this.headerBottomView = this.headerBottomView.bind(this);
    }

    toggleOrderStatusUpdatePopup(props) {
        this.setState(prevState => ({
            isOrderStatusUpdatePopupActive: prevState.isOrderStatusUpdatePopupActive === undefined ? {
                active: true,
                orderDetails: props && props.orderDetails,
                newStatus: props && props.newStatus,
            } : undefined
        }))
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
        this.getOrdersList({ filter, skipCount, sort, startDate, endDate });
    }


    onFiltersChange(value, key) {
        if (value && value.value) {
            this.setState(_ => ({ [key]: value.value }), _ => {
                this.getFinalFilterSortOptions({});
            });
        }
    }

    getOrdersList({ skipCount = 0, filter = {}, sort = {}, startDate, endDate }) {
        const { userDetails, userToken, vendorDetails, buyerDetails, getActiveOrdersList } = this.props;
        let finalFilter = (userDetails.role === roles.vendor) ? { "vendor_id._id": vendorDetails._id } : (userDetails.role === roles.buyer ? { "buyer_id._id": buyerDetails._id } : {});
        if (filter) finalFilter = { ...finalFilter, ...filter };
        if (((userDetails.role === roles.admin) || (userDetails.role === roles.vendor && vendorDetails && vendorDetails._id) ||
            (userDetails.role === roles.buyer && buyerDetails && buyerDetails._id)) &&
            userDetails && userToken && userDetails.role && getActiveOrdersList) {
            this.setState({ isDataLoading: true });
            getActiveOrdersList({
                userToken,
                sort,
                filter: finalFilter,
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

    onOrderNameFilterValueChange(val) {
        this.setState({
            orderNmbrFilter: val
        })
    }

    loadMore() {
        const { activeOrdersListData } = this.props;
        if (activeOrdersListData && activeOrdersListData.data && activeOrdersListData.pagination &&
            activeOrdersListData.data.length < activeOrdersListData.pagination.total_records) {
            this.getFinalFilterSortOptions({ skipCount: activeOrdersListData.data.length });
        }
    }

    componentDidMount() {
        const { getVendorsListForFilter, allVendors, getBuyersListForFilter, allBuyers, userToken } = this.props;
        !allVendors && getVendorsListForFilter && getVendorsListForFilter({ userToken });
        !allBuyers && getBuyersListForFilter && getBuyersListForFilter({ userToken });
        this.getFinalFilterSortOptions({});
    }

    updateOrderStatus() {
        const { isOrderStatusUpdatePopupActive } = this.state;
        const orderDetails = isOrderStatusUpdatePopupActive && isOrderStatusUpdatePopupActive.orderDetails;
        const newStatus = isOrderStatusUpdatePopupActive && isOrderStatusUpdatePopupActive.newStatus;
        const { updateOrderDetails, userToken } = this.props;
        if (isOrderStatusUpdatePopupActive) {
            this.setState(prevState => ({
                isOrderStatusUpdatePopupActive: {
                    ...prevState.isOrderStatusUpdatePopupActive,
                    isLoading: true,
                }
            }))
        }
        newStatus && userToken && orderDetails && orderDetails._id && updateOrderDetails && updateOrderDetails({
            orderId: orderDetails._id,
            updateJson: { status: newStatus },
            userToken,
            onSuccess: this.toggleOrderStatusUpdatePopup,
        })
    }

    getColsList() {
        const { userDetails } = this.props;
        const isAdmin = userDetails && userDetails.role && userDetails.role === roles.admin;
        const isVendor = userDetails && userDetails.role && userDetails.role === roles.vendor;
        const isBuyer = userDetails && userDetails.role && userDetails.role === roles.buyer;

        let finalColList = [
            { "label": appStringConstants.ordersListOrderNumberFieldTitle, width: 100, "field": "order_number" },
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
            { "label": appStringConstants.ordersListStatusFieldTitle, width: 100, "field": "status" },
            { "label": appStringConstants.ordersListOrderTypeFieldTitle, width: 100, "field": "order_type" },
        ];
        if (isAdmin || isVendor) {
            finalColList.push({
                width: 100,
                "label": appStringConstants.ordersListBuyerFieldTitle,
                Cell: _ => <div>{_ && _.buyer_id && _.buyer_id.name}</div>,
            })
        }
        if (isAdmin || isBuyer) {
            finalColList.push({
                width: 100,
                "label": appStringConstants.ordersListVendorFieldTitle,
                Cell: _ => <div>{get(_, 'vendor_id.shop_name', '')}</div>,
            })
        }

        finalColList = [
            ...finalColList,
            { "label": appStringConstants.ordersListTotalAmountFieldTitle, width: 100, "field": "total_amount" },
            {
                "label": appStringConstants.ordersListItemsFieldTitle,
                width: 100,
                Cell: _ => <div>{_ && _.items && _.items.length}</div>
            }
        ];
        if (isBuyer || isVendor) {
            finalColList.push({
                width: isVendor ? 400 : 200,
                Cell: orderVal => <div className="active-orders-list-actions">

                    {get(orderVal, 'status') === orderStatus.new && <Button
                        buttonType={appButtonType.type_2}
                        onClick={_ => this.toggleOrderStatusUpdatePopup({
                            newStatus: orderStatus.canceled,
                            orderDetails: orderVal
                        })}
                        title={appStringConstants.cancelOrderButtonTitle}/>}

                    {isVendor && get(orderVal, 'status') === orderStatus.new && <Button
                        onClick={_ => this.toggleOrderStatusUpdatePopup({
                            newStatus: orderStatus.confirmed,
                            orderDetails: orderVal
                        })}
                        title={appStringConstants.confirmOrderButtonTitle}/>}

                    {isVendor && get(orderVal, 'status') === orderStatus.confirmed && <Button
                        onClick={_ => this.toggleOrderStatusUpdatePopup({
                            newStatus: orderStatus.packed,
                            orderDetails: orderVal
                        })}
                        title={appStringConstants.packOrderButtonTitle}/>}

                    {isVendor && get(orderVal, 'order_type') === orderTypes.home_delivery && get(orderVal, 'status') === orderStatus.packed &&
                    <Button
                        onClick={_ => this.toggleOrderStatusUpdatePopup({
                            newStatus: orderStatus.out_for_delivery,
                            orderDetails: orderVal
                        })}
                        title={appStringConstants.orderOutForDeliveryButtonTitle}/>}

                    {isVendor && ((get(orderVal, 'status') === orderStatus.packed &&
                        get(orderVal, 'order_type') === orderTypes.pick_up) || (get(orderVal, 'status') === orderStatus.out_for_delivery)) &&
                    <Button
                        onClick={_ => this.toggleOrderStatusUpdatePopup({
                            newStatus: orderStatus.completed,
                            orderDetails: orderVal
                        })}
                        title={appStringConstants.orderCompletedButtonTitle}/>}

                </div>,
            })
        }
        return finalColList;
    }

    onSortOptionSelect({ sort }) {
        const finalSort = sort ? sort : initialState.sort;
        this.setState({ sort: finalSort }, _ => {
            this.getFinalFilterSortOptions({})
        });
    }

    headerRightView() {

        const { orderNmbrFilter, dateFilter } = this.state;

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
            buyersFilter, vendorsFilter,
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

    render() {

        const { activeOrdersListData } = this.props;
        const { isOrderStatusUpdatePopupActive, isDataLoading } = this.state;

        return <div className="active-orders-list-container">
            <PageHeader
                title={appStringConstants.ordersListMenuTitle}
                rightView={this.headerRightView}
                bottomView={this.headerBottomView}
            />

            {isOrderStatusUpdatePopupActive && isOrderStatusUpdatePopupActive.active &&
            <PopUp
                onClose={this.toggleOrderStatusUpdatePopup}
                footerActions={_ => <Button
                    isLoading={isOrderStatusUpdatePopupActive && isOrderStatusUpdatePopupActive.isLoading}
                    onClick={this.updateOrderStatus}
                    title={appStringConstants.updateButtonTitle}/>}
                renderScene={_ =>
                    <div>{appStringConstants.orderStatusUpdatePopupText(isOrderStatusUpdatePopupActive.newStatus)}</div>}
            />}
            <InfiniteScroller
                isLoading={isDataLoading}
                scrollableTarget={'dashboard'}
                loadMore={this.loadMore}>
                <Table
                    data={[{
                        isLoading: activeOrdersListData && activeOrdersListData.isLoading && !activeOrdersListData.data,
                        isLoadingMore: activeOrdersListData && activeOrdersListData.isLoading && activeOrdersListData.data,
                        data: activeOrdersListData && activeOrdersListData.data
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
    activeOrdersListData: state.order.activeOrdersListData,
    buyerDetails: state.users.buyerDetails,
    allVendors: state.users.allVendors,
    allBuyers: state.users.allBuyers,
    vendorDetails: state.users.vendorDetails,
}), { getActiveOrdersList, getBuyersListForFilter, getVendorsListForFilter, updateOrderDetails })(ActiveOrders)