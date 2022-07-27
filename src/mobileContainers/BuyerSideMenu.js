import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import EntypoIcons from "react-native-vector-icons/Entypo";
import Feather from 'react-native-vector-icons/Feather';
import Octicons from "react-native-vector-icons/Octicons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { SideMenu } from '../mobileComponents/index'
import stringConstants from "../constants/mobileStringConstants";
import { appRoutes } from "../constants/index";
import { getBuyerSummaryData } from '../redux-store/actions/userActions';
import { logoutUser } from '../redux-store/actions/userActions';
import { colors } from "../mobileTheme";
import { isImgUrlExists } from "../utils/functions";


class BuyerSideMenu extends React.Component {

    componentDidMount() {
        const { getBuyerSummaryData, userToken, buyerDetails } = this.props;
        get(buyerDetails, "_id") && getBuyerSummaryData && getBuyerSummaryData({
            userToken,
            buyerId: get(buyerDetails, "_id")
        })
    }

    render() {
        const { buyerSummaryData, logoutUser, userToken, navigation, buyerDetails } = this.props;
        const userStats = [];
        if (buyerSummaryData && buyerSummaryData.data && buyerSummaryData.data.length > 0) {
            for (const sideMenu in buyerSummaryData.data) {
                if (buyerSummaryData.data.hasOwnProperty(sideMenu)) {
                    userStats.push(buyerSummaryData.data[sideMenu])
                }
            }
        }

        return <SideMenu
            userToken={userToken}
            logoutUser={logoutUser}
            navigation={navigation}
            profileLink={appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.Home.route}
            title={buyerDetails && buyerDetails.name ? buyerDetails.name : stringConstants.stringForSideMenuIfUserNameNotExistsAfterLogin}
            imgUrl={isImgUrlExists({ data: buyerDetails, fieldName: "profile_img" })}
            userStats={userStats}
            menuList={[
                {
                    title: stringConstants.homeMenuTitle,
                    route: appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.Home.route,
                    icon: <EntypoIcons name={"home"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.profileMenuTitle,
                    route: appRoutes.BuyerRoutes.childRoutes.Profile.route,
                    icon: <MaterialCommunityIcons name={"account-details"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.ordersMenuTitle,
                    route: appRoutes.BuyerRoutes.childRoutes.BuyerActiveOrders.childRoutes.BuyerActiveOrdersList.route,
                    icon: <Octicons name={"list-unordered"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.orderHistoryMenuTitle,
                    route: appRoutes.BuyerRoutes.childRoutes.BuyersOrderHistory.route,
                    icon: <Octicons name={"list-unordered"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.cartMenuTitle,
                    route: appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.CartList.route,
                    icon: <MaterialCommunityIcons name={"cart"} size={20}
                                                  color={colors.WHITE}/>,
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
    userToken: state.users.userToken,
    buyerSummaryData: state.users.buyerSummaryData,
    buyerDetails: state.users.buyerDetails,
}), { logoutUser, getBuyerSummaryData })(BuyerSideMenu)
