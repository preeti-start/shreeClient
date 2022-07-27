import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from "react-navigation";


import { Header as HeaderComp } from '../mobileComponents';
import { showLocMissingNotification } from "../utils/functions";
import { appRoutes, roles } from "../constants";


class Header extends Component {

    constructor(props) {
        super(props);
        this.onBackClick = this.onBackClick.bind(this);
        this.onCartClick = this.onCartClick.bind(this);
        this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
    }

    static defaultProps = {
        subTitle: undefined,
        showMenuButton: false,
        showCartIcon: true,
        showBackButton: false,
        totalCartItemsCount: 0,
    };

    onBackClick() {
        const { navigation } = this.props;
        navigation && navigation.goBack();
    }

    onMenuButtonClick() {
        const { navigation } = this.props;
        navigation && navigation.openDrawer();
    }

    onCartClick() {
        const { navigation } = this.props;
        const navigateAction = NavigationActions.navigate({
            routeName: appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.CartList.route
        });
        navigation && navigation.dispatch(navigateAction);
    }

    render() {

        const {
            title, vendorDetails, animationProps, userDetails, renderTitle, totalCartItemsCount, searchKeyLabel, subTitle,
            showMenuButton, titleTextStyle, headerStyle, showBackButton, onSearchClick, showCartIcon
        } = this.props;

        return <HeaderComp
            animationProps={animationProps}
            subTitle={subTitle}
            renderTitle={renderTitle}
            headerStyle={headerStyle}
            titleTextStyle={titleTextStyle}
            searchKeyLabel={searchKeyLabel}
            onSearchClick={onSearchClick}
            onCartClick={this.onCartClick}
            showCartIcon={userDetails && userDetails.role && userDetails.role === roles.buyer && showCartIcon}
            showLocMissingNotification={showLocMissingNotification({ userDetails, vendorDetails })}
            showBackButton={showBackButton}
            title={title}
            totalCartItemsCount={totalCartItemsCount}
            onMenuButtonClick={this.onMenuButtonClick}
            showMenuButton={showMenuButton}
            onBackClick={this.onBackClick}
        />;


    }
}

export default connect((state = {}, ownProps = {}) => ({
    userDetails: state.users.userDetails,
    vendorDetails: state.users.vendorDetails,
    totalCartItemsCount: state.cart.totalCartItemsCount,
}), {})(Header)
