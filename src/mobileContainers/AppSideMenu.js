import React from 'react';
import { connect } from 'react-redux';
import AntDesign from "react-native-vector-icons/AntDesign";
import EntypoIcons from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { getAppSummaryData } from '../redux-store/actions/userActions';
import { SideMenu } from '../mobileComponents/index'
import stringConstants from '../constants/mobileStringConstants'
import { appRoutes } from '../constants/index'
import { colors } from "../mobileTheme";


class AppSideMenu extends React.Component {

    componentDidMount() {
        const { getAppSummaryData } = this.props;
        getAppSummaryData && getAppSummaryData()
    }

    render() {

        const { navigation, appSummaryData } = this.props;
        const appStats = [];
        if (appSummaryData && appSummaryData.data && appSummaryData.data.length > 0) {
            for (const sideMenu in appSummaryData.data) {
                if (appSummaryData.data.hasOwnProperty(sideMenu)) {
                    appStats.push(appSummaryData.data[sideMenu])
                }
            }
        }

        return <SideMenu
            navigation={navigation}
            onMenuItemClick={this.onMenuItemClick}
            title={stringConstants.appName}
            userStats={appStats}
            menuList={[
                {
                    title: stringConstants.homeMenuTitle,
                    route: appRoutes.AppRoutes.childRoutes.Home.childRoutes.ShopsListView.route,
                    icon: <EntypoIcons name={"home"} color={colors.WHITE} size={20}/>,
                },
                {
                    title: stringConstants.loginMenuTitle,
                    route: appRoutes.AppRoutes.childRoutes.Login.childRoutes.PhoneNoRegistration.route,
                    icon: <AntDesign name={"login"} color={colors.WHITE} size={20}/>,
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
                }
            ]}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    appSummaryData: state.users.appSummaryData,
}), { getAppSummaryData })(AppSideMenu)
