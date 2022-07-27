import React from 'react';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';

import { SideMenu } from '../mobileComponents/index'
import stringConstants from "../constants/mobileStringConstants";
import { appRoutes } from "../constants/index";
import { logoutUser } from '../redux-store/actions/userActions';
import { getVendorSummaryData } from '../redux-store/actions/userActions';
import { colors } from "../mobileTheme";
import { isImgUrlExists } from "../utils/functions";


class VendorSideMenu extends React.Component {


    componentDidMount() {
        const { getVendorSummaryData, vendorDetails, userToken } = this.props;
        vendorDetails && vendorDetails._id && getVendorSummaryData && getVendorSummaryData({
            vendorId: vendorDetails._id,
            userToken
        })
    }


    render() {

        const { navigation, userToken, logoutUser, vendorDetails, vendorSummaryData } = this.props;
        const userStats = [];
        if (vendorSummaryData && vendorSummaryData.data && vendorSummaryData.data.length > 0) {
            for (const sideMenu in vendorSummaryData.data) {
                if (vendorSummaryData.data.hasOwnProperty(sideMenu)) {
                    userStats.push(vendorSummaryData.data[sideMenu])
                }
            }
        }
        return <SideMenu
            navigation={navigation}
            logoutUser={logoutUser}
            userToken={userToken}
            profileLink={appRoutes.VendorRoutes.childRoutes.Home.route}
            title={vendorDetails && vendorDetails.shop_name ? vendorDetails.shop_name : stringConstants.stringForSideMenuIfUserNameNotExistsAfterLogin}
            imgUrl={isImgUrlExists({ data: vendorDetails, fieldName: "shop_img" })}
            userStats={userStats}
            menuList={[
                {
                    title: stringConstants.dashboardMenuTitle,
                    route: appRoutes.VendorRoutes.childRoutes.Home.route,
                    icon: <EntypoIcons name={"home"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.profileMenuTitle,
                    route: appRoutes.VendorRoutes.childRoutes.Profile.route,
                    icon: <MaterialCommunityIcons name={"account-details"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.vendorItemCategoriesMenuTitle,
                    route: appRoutes.VendorRoutes.childRoutes.VendorItemCategories.route,
                    icon: <FontAwesomeIcons name={"sitemap"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.vendorItemFeaturesMenuTitle,
                    route: appRoutes.VendorRoutes.childRoutes.VendorItemFeatures.route,
                    icon: <FontAwesomeIcons name={"th-list"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.vendorItemsMenuTitle,
                    route: appRoutes.VendorRoutes.childRoutes.VendorItems.route,
                    icon: <FontAwesomeIcons name={"th-list"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.ordersMenuTitle,
                    route: appRoutes.VendorRoutes.childRoutes.VendorActiveOrders.childRoutes.VendorActiveOrdersList.route,
                    icon: <Octicons name={"list-unordered"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.orderHistoryMenuTitle,
                    route: appRoutes.VendorRoutes.childRoutes.VendorsOrderHistory.route,
                    icon: <Octicons name={"list-unordered"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.aboutUsMenuTitle,
                    route: appRoutes.AppRoutes.childRoutes.AboutUs.route,
                    icon: <MaterialCommunityIcons name={"account-card-details-outline"} color={colors.WHITE}
                                                  size={20}/>,
                },
                {
                    title: stringConstants.contactUsMenuTitle,
                    route: appRoutes.AppRoutes.childRoutes.ContactUs.route,
                    icon: <Feather name={"phone-call"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.logoutMenuTitle,
                    route: appRoutes.AppRoutes.route,
                    icon: <MaterialCommunityIcons name={"logout"} color={colors.WHITE} size={20}/>,
                }
            ]}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    vendorSummaryData: state.users.vendorSummaryData,
    vendorDetails: state.users.vendorDetails,
    userToken: state.users.userToken,
}), { logoutUser, getVendorSummaryData })(VendorSideMenu)
