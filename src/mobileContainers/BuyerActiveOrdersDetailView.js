import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import OrderDetailsView from '../mobileComponents/OrderDetailsView'
import { updateOrderDetails } from "../redux-store/actions/orderActions";
import { onOrderStatusUpdate } from "../utils/mobileFunctions";
import stringConstants from "../constants/mobileStringConstants";


class BuyerActiveOrdersDetailView extends React.Component {

    constructor(props) {
        super(props);
        this.getOrderDetails = this.getOrderDetails.bind(this);
        this.onOrderStatusUpdatePress = this.onOrderStatusUpdatePress.bind(this);
    }

    onOrderStatusUpdatePress({ recordId, newStatus }) {
        const { userToken, navigation, updateOrderDetails } = this.props;
        onOrderStatusUpdate({ navigation, recordId, newStatus, updateOrderDetails, isDetailView: true, userToken })
    }

    getOrderDetails() {
        const { orderDetails } = this.props;
        const finalDetails = [
            {
                label: stringConstants.nameFieldTitle,
                value: get(orderDetails, 'vendor_id.shop_name')
            },
        ];
        if (get(orderDetails, 'from_location.name')) {
            finalDetails.push({
                label: stringConstants.addressFieldTitle,
                value: get(orderDetails, 'from_location.name')
            })
        }
        finalDetails.push({
            label: stringConstants.mobileNumberFieldTitle,
            value: get(orderDetails, 'vendor_id.phone_no')
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
                orderDetails={this.getOrderDetails()}
                isLoading={isAppLoading}
                onOrderStatusUpdatePress={this.onOrderStatusUpdatePress}
                data={orderDetails}
                navigation={navigation}
            />
        }
        return null;
    }
}

export default connect((state = {}, ownProps = {}) => ({
    orderDetails: state.order.orderDetails,
    userToken: state.users.userToken,
    isAppLoading: state.users.isAppLoading,
}), { updateOrderDetails })(BuyerActiveOrdersDetailView)