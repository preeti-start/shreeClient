import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { ToastAndroid } from "react-native";

import { VendorDashboardComp } from "../mobileComponents/index";
import { getVendorDashboardData, getVendorSummaryData } from '../redux-store/actions/userActions';
import { appRoutes, userNotifications } from "../constants";
import { updateVendorDetails } from "../redux-store/actions/userActions";

class VendorDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.onItemCardClick = this.onItemCardClick.bind(this);
        this.onAddItemClick = this.onAddItemClick.bind(this);
        this.onToggleSwitch = this.onToggleSwitch.bind(this);
    }

    onToggleSwitch(isActive) {
        const { updateVendorDetails, vendorDetails, userToken } = this.props;
        userToken && get(vendorDetails, "_id") && updateVendorDetails({
            isMobile: true,
            userToken,
            vendorId: vendorDetails._id,
            is_active: isActive,
            onSuccess: _ => {
                ToastAndroid.show(userNotifications.msgOnShopStatusUpdate, ToastAndroid.SHORT);
            }
        })
    }

    componentDidMount() {

        const { getVendorDashboardData, getVendorSummaryData, vendorDetails, userToken } = this.props;
        const vendorId = get(vendorDetails, "_id");

        if (vendorDetails && vendorId) {
            getVendorDashboardData({
                vendorId,
                userToken
            });
            // todo : this should be removed from here -- currently here as sidemenu CompDidmount is not being called with view switch
            getVendorSummaryData({
                vendorId,
                userToken
            })
        }
    }

    onAddItemClick() {
        const { navigation } = this.props;
        navigation && navigation.navigate(appRoutes.VendorRoutes.childRoutes.VendorItems.childRoutes.VendorItemsList.route)
    }

    onItemCardClick() {
        const { navigation } = this.props;
        navigation && navigation.navigate(appRoutes.VendorRoutes.childRoutes.VendorsOrderHistory.route)
    }

    render() {
        const { isAppLoading, vendorDashboardData, vendorDetails, navigation } = this.props;

        return <VendorDashboardComp
            isShopActive={get(vendorDetails, 'is_active')}
            onItemCardClick={this.onItemCardClick}
            onToggleSwitch={this.onToggleSwitch}
            onAddItemClick={this.onAddItemClick}
            vendorDashboardData={vendorDashboardData}
            navigation={navigation}
            isAppLoading={isAppLoading}
        />

    }
}

export default connect((state = {}, ownProps = {}) => ({
    isAppLoading: state.users.isAppLoading,
    vendorDashboardData: state.users.vendorDashboardData,
    vendorDetails: state.users.vendorDetails,
    userToken: state.users.userToken,
}), { getVendorDashboardData, getVendorSummaryData, updateVendorDetails })(VendorDashboard)
