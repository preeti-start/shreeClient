import React from 'react';
import { connect } from 'react-redux';

import { getCartsList } from '../../redux-store/actions/cartActions'
import { getCompCartsList } from '../../redux-store/actions/compositionActions'
import { roles, validAppRoutes } from "../../constants";
import history from "../../utils/history";
import CartsComp from "../../components/Carts";

class Carts extends React.Component {

    constructor(props) {
        super(props);
        this.onTabClick = this.onTabClick.bind(this);
        this.onItemsCartRowClick = this.onItemsCartRowClick.bind(this);
        this.onPlaceOrderPress = this.onPlaceOrderPress.bind(this);
    }


    componentDidMount() {
        const { userDetails, userToken, getCartsList, buyerDetails } = this.props;
        userDetails && userToken && userDetails.role && ((userDetails.role === roles.buyer &&
            buyerDetails && buyerDetails._id) || userDetails.role === roles.admin) && getCartsList && getCartsList({
            userToken,
            userId: userDetails.role === roles.buyer ? buyerDetails._id : undefined,
        })
    }

    onPlaceOrderPress({ event, rowData }) {
        event.stopPropagation();
        rowData && rowData._id && history.push(validAppRoutes.buyerPlaceOrderView.replace(":cartId",
            rowData._id));
    }

    onItemsCartRowClick(val) {
        history.push(validAppRoutes.itemCartDetailView.replace(":cartId", val._id))
    }

    onTabClick(index) {
        if (index === 0) {
            history.push(validAppRoutes.itemCartList)
        } else {
            history.push(validAppRoutes.compCartList)
        }
    }

    render() {

        const { cartsList, isAppLoading, userDetails } = this.props;

        return <CartsComp
            onPlaceOrderPress={this.onPlaceOrderPress}
            onTabClick={this.onTabClick}
            activeTabIndex={0}
            isAppLoading={isAppLoading}
            userDetails={userDetails}
            listData={cartsList}
            onItemsCartRowClick={this.onItemsCartRowClick}
        />
    }
}

export default connect(state => ({
    userToken: state.users.userToken,
    isAppLoading: state.users.isAppLoading,
    userDetails: state.users.userDetails,
    cartsList: state.cart.cartsList,
    buyerDetails: state.users.buyerDetails,
}), { getCartsList, getCompCartsList })(Carts)