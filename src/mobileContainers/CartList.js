import React from 'react';
import { connect } from 'react-redux';

import { getCartsList } from '../redux-store/actions/cartActions';
import { CartListComp } from "../mobileComponents/index";
import { appRoutes } from "../constants/index";

class CartList extends React.Component {

    constructor(props) {
        super(props);
        this.onViewItemClick = this.onViewItemClick.bind(this);
    }

    componentDidMount() {
        const { getCartsList, userToken, buyerDetails } = this.props;
        buyerDetails && buyerDetails._id && getCartsList && getCartsList({
            isMobile: true,
            userToken,
            userId: buyerDetails._id,
        })
    }

    onViewItemClick({ cartId }) {
        const { navigation } = this.props;
        navigation && navigation.navigate(appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.CartDetailView.route, { cartId })
    }

    render() {
        const { cartsList, navigation, isAppLoading } = this.props;

        return <CartListComp
            navigation={navigation}
            onViewItemClick={this.onViewItemClick}
            isAppLoading={isAppLoading}
            cartsList={cartsList}
        />;


    }
}

export default connect((state = {}, ownProps = {}) => ( {
    userToken: state.users.userToken,
    isAppLoading: state.users.isAppLoading,
    buyerDetails: state.users.buyerDetails,
    cartsList: state.cart.cartsList,
} ), { getCartsList })(CartList);
