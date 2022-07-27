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
        this.onCompCartRowClick = this.onCompCartRowClick.bind(this);
        this.onPlaceOrderPress = this.onPlaceOrderPress.bind(this);
    }


    componentDidMount() {
        const { userDetails, userToken, getCompCartsList, buyerDetails } = this.props;
        userDetails && userToken && userDetails.role && ((userDetails.role === roles.buyer &&
            buyerDetails && buyerDetails._id) || userDetails.role === roles.admin) && getCompCartsList && getCompCartsList({
            userToken,
            userId: userDetails.role === roles.buyer ? buyerDetails._id : undefined,
        })
    }


    onPlaceOrderPress({ event, rowData }) {


    }

    onCompCartRowClick(val) {
        history.push(validAppRoutes.compCartDetailView.replace(":cartId", val._id))
    }

    onTabClick(index) {
        if (index === 0) {
            history.push(validAppRoutes.itemCartList)
        } else {
            history.push(validAppRoutes.compCartList)
        }
    }

    render() {

        const { isAppLoading, compCartsList, userDetails } = this.props;

        return <CartsComp
            onPlaceOrderPress={this.onPlaceOrderPress}
            onTabClick={this.onTabClick}
            activeTabIndex={1}
            isAppLoading={isAppLoading}
            userDetails={userDetails}
            listData={compCartsList}
            onCompCartRowClick={this.onCompCartRowClick}
        />
    }
}

export default connect(state => ({
    userToken: state.users.userToken,
    isAppLoading: state.users.isAppLoading,
    userDetails: state.users.userDetails,
    compCartsList: state.compositions.compCartsList,
    buyerDetails: state.users.buyerDetails,
}), { getCartsList, getCompCartsList })(Carts)