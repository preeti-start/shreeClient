import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { createOrder } from '../../redux-store/actions/orderActions';
import { getCompCartDetail } from '../../redux-store/actions/compositionActions';
import CompCartDetailsComp from '../../components/CompCartDetails';
import { OrderSuccessPopup, OrderFailurePopup } from '../../components/OrderActionPopups';
import history from "../../utils/history";
import { dbnames, orderTypes } from "../../constants";
import { addToasts } from "../../redux-store/actions/toastActions";


class CompCartDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isPlaceOrderInProgress: false
        };
        this.onPlaceOrderClick = this.onPlaceOrderClick.bind(this);
    }

    componentDidMount() {
        const { match, userToken, getCompCartDetail } = this.props;
        if (match && match.params && match.params.cartId && userToken && getCompCartDetail) {
            getCompCartDetail({
                cartId: match.params.cartId,
                userToken
            })
        }
    }

    onPlaceOrderClick() {

        const { createOrder, buyerDetails, addToasts, compCartDetails, userToken } = this.props;

        if (compCartDetails && compCartDetails._id && userToken && createOrder) {
            this.setState({ isPlaceOrderInProgress: true });
            createOrder({
                cartId: compCartDetails._id,
                history,
                orderFrom: dbnames.CompCart,
                userToken,
                orderJson: { ...compCartDetails, order_type: orderTypes.pick_up, _id: undefined },
                buyerId: buyerDetails && buyerDetails._id,
                onSuccess: _ => {
                    this.setState({ isPlaceOrderInProgress: false });
                    addToasts({
                        id: 'order_placed',
                        renderScene: OrderSuccessPopup,
                    });
                },
                onError: _ => {
                    this.setState({ isPlaceOrderInProgress: false });
                    addToasts({
                        id: 'order_failed',
                        renderScene: OrderFailurePopup,
                    });
                },
            })
        }

    }

    render() {

        const { compCartDetails } = this.props;
        const { isPlaceOrderInProgress } = this.state;

        return <CompCartDetailsComp
            isPlaceOrderInProgress={isPlaceOrderInProgress}
            onPlaceOrderClick={this.onPlaceOrderClick}
            totalAmount={get(compCartDetails, 'total_comp_amount')}
            sections={get(compCartDetails, 'composition.sections')}
        />

    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    buyerDetails: state.users.buyerDetails,
    compCartDetails: state.compositions.compCartDetails.data,
}), { addToasts, getCompCartDetail, createOrder })(CompCartDetails)
