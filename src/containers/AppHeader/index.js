import React from 'react';
import { connect } from 'react-redux';

import { logoutUser } from '../../redux-store/actions/userActions'
import history from '../../utils/history'
import { showShopNowButton, showViewCompositionsButton, showLocMissingNotification } from '../../utils/functions'
import AppHeaderComp from '../../components/AppHeader';
import { validAppRoutes, roles, } from "../../constants";

class AppHeader extends React.Component {

    static defaultProps = {
        showCompositionsButton: true,
        showShopNow: true,
    };

    constructor(props) {
        super(props);
        this.onCartIconClick = this.onCartIconClick.bind(this);
        this.onLoginLinkClick = this.onLoginLinkClick.bind(this);
        this.onLogoutClick = this.onLogoutClick.bind(this);
        this.onUserNameClick = this.onUserNameClick.bind(this);
    }

    onCartIconClick() {
        history.push(validAppRoutes.itemCartList);
    }

    onLoginLinkClick() {
        history.push(validAppRoutes.login);
    }

    onUserNameClick() {
        const { userDetails } = this.props;
        let moveToRoute = undefined;
        if (userDetails && userDetails.role && userDetails._id) {
            if (userDetails.role === roles.buyer) {
                moveToRoute = validAppRoutes.buyerProfile
            } else if (userDetails.role === roles.vendor) {
                moveToRoute = validAppRoutes.vendorProfile
            } else if (userDetails.role === roles.admin) {
                moveToRoute = validAppRoutes.shopCategories
            }
            moveToRoute && history.push(moveToRoute.replace(":userId", userDetails._id));
        }
    }

    onLogoutClick() {
        const { userToken, logoutUser } = this.props;
        logoutUser && logoutUser({ userToken, history });
    }

    render() {
        const {
            totalCartItemsCount, userDetails, showContactUsIcon,
            buyerDetails, vendorDetails, showShopNow, showCompositionsButton, lightHeader, showAboutUsIcon
        } = this.props;
        let userData = undefined;
        if (userDetails && userDetails.role) {
            if (userDetails.role === roles.admin) {
                userData = userDetails;
            } else if (userDetails.role === roles.vendor && vendorDetails) {
                userData = vendorDetails;
            } else if (userDetails.role === roles.buyer && buyerDetails) {
                userData = buyerDetails;
            }
        }
        return <AppHeaderComp
            showAboutUsIcon={showAboutUsIcon}
            showContactUsIcon={showContactUsIcon}
            lightHeader={lightHeader}
            showShopNowLink={showShopNowButton({ isVisible: showShopNow, userDetails })}
            showCompositionsButton={showViewCompositionsButton({ isVisible: showCompositionsButton, userDetails })}
            onLoginLinkClick={this.onLoginLinkClick}
            onLogoutClick={this.onLogoutClick}
            onUserNameClick={this.onUserNameClick}
            showLocMissingNotification={showLocMissingNotification({ userDetails, vendorDetails })}
            showCartIcon={userDetails && userDetails.role && userDetails.role === roles.buyer}
            onCartIconClick={this.onCartIconClick}
            totalCartItemsCount={totalCartItemsCount}
            userData={userData}
        />
    }
}

export default connect(state => ({
    totalCartItemsCount: state.cart.totalCartItemsCount,
    userToken: state.users.userToken,
    userDetails: state.users.userDetails,
    vendorDetails: state.users.vendorDetails,
    buyerDetails: state.users.buyerDetails,
}), { logoutUser })(AppHeader);
