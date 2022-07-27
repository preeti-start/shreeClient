import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import OrderDetailsView from '../mobileComponents/OrderDetailsView'
import { onOrderStatusUpdate } from "../utils/mobileFunctions";
import { updateOrderDetails } from "../redux-store/actions/orderActions";
import stringConstants from "../constants/mobileStringConstants";

class VendorActiveOrdersDetailView extends React.Component {

    constructor(props) {
        super(props);
        this.getOrderDetails = this.getOrderDetails.bind(this);
        this.onOrderStatusUpdatePress = this.onOrderStatusUpdatePress.bind(this);
    }

    onOrderStatusUpdatePress({ recordId, newStatus }) {
        const { userToken, navigation, updateOrderDetails } = this.props;
        onOrderStatusUpdate({
            recordId,
            newStatus,
            updateOrderDetails,
            userToken,
            isDetailView: true,
            navigation,
        })
    }

    getOrderDetails() {
        const { orderDetails } = this.props;
        const finalDetails = [
            {
                label: stringConstants.nameFieldTitle,
                value: get(orderDetails, 'buyer_id.name')
            },
        ];
        if (get(orderDetails, 'to_location.name')) {
            finalDetails.push({
                label: stringConstants.addressFieldTitle,
                value: get(orderDetails, 'to_location.name')
            })
        }
        finalDetails.push({
            label: stringConstants.mobileNumberFieldTitle,
            value: get(orderDetails, 'buyer_id.phone_no')
        });
        const deliveryAmt = get(orderDetails, 'delivery_amount', 0);
        if (deliveryAmt > 0) {
            finalDetails.push({
                label: stringConstants.addNewDistanceSlabPopupDeliveryAmntTitle,
                value: `${stringConstants.currencySymbol} ${deliveryAmt}`
            })
        }
        return finalDetails
    }

    render() {

        const { navigation, isAppLoading, orderDetails } = this.props;

        if (orderDetails) {
            return <OrderDetailsView
                data={orderDetails}
                isVendor={true}
                orderDetails={this.getOrderDetails()}
                isLoading={isAppLoading}
                onOrderStatusUpdatePress={this.onOrderStatusUpdatePress}
                navigation={navigation}
            />
        }
        return null;
    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    orderDetails: state.order.orderDetails,
    isAppLoading: state.users.isAppLoading,
}), { updateOrderDetails })(VendorActiveOrdersDetailView)