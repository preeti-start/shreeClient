import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { getCartDetail, updateCartItemQuantity } from '../../redux-store/actions/cartActions'
import { getOrderJson } from '../../redux-store/actions/orderActions'
import CartDetailsComp from '../../components/CartDetails'
import PopUp from "../../components/Popup";
import Button from "../../components/AppCompLibrary/Button";
import appStringConstants from "../../constants/appStringConstants";
import history from "../../utils/history";
import { roles, validAppRoutes } from "../../constants";
import { getOrderData } from "../../utils/functions";

class CartDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdateItemQtyInProgress: false,
            itemRemoveConfirmationPopUpActive: false,
        };
        this.updateItemQuantity = this.updateItemQuantity.bind(this);
        this.onRemoveItemConfirmationClick = this.onRemoveItemConfirmationClick.bind(this);
        this.toggleItemRemoveConfirmationPopUp = this.toggleItemRemoveConfirmationPopUp.bind(this);
        this.onPlaceOrderPress = this.onPlaceOrderPress.bind(this);
        this.onUpdateCartItemQuantityClick = this.onUpdateCartItemQuantityClick.bind(this);
    }

    toggleItemRemoveConfirmationPopUp(props) {
        this.setState(prevState => ({
            itemDetails: props && props.itemDetails,
            toggleItemRemoveConfirmationPopUp: !prevState.toggleItemRemoveConfirmationPopUp
        }))
    }

    componentDidMount() {
        const { match, userToken, getCartDetail } = this.props;
        match && match.params && match.params.cartId && userToken && getCartDetail && getCartDetail({
            cartId: match.params.cartId,
            userToken
        })
    }

    updateItemQuantity({ incBy, buyerId, itemIndex, itemId, onSuccess }) {
        const { updateCartItemQuantity, cartDetails, userToken } = this.props;
        this.setState({ isUpdateItemQtyInProgress: true });
        cartDetails && cartDetails._id && userToken && updateCartItemQuantity && updateCartItemQuantity({
            userToken,
            history,
            cartId: cartDetails._id,
            incBy,
            itemIndex,
            itemId,
            onSuccess: _ => {
                this.setState({ isUpdateItemQtyInProgress: false });
                onSuccess && onSuccess();
            },
            buyerId,
        })
    }

    onRemoveItemConfirmationClick() {
        const { itemDetails } = this.state;
        const { buyerDetails } = this.props;
        this.toggleItemRemoveConfirmationPopUp();
        itemDetails && this.updateItemQuantity({
            ...itemDetails,
            buyerId: buyerDetails._id,
        })
    }

    onUpdateCartItemQuantityClick({ incBy, itemQuantity, itemIndex, itemId }) {
        const { buyerDetails } = this.props;
        if (incBy + itemQuantity <= 0) {
            this.toggleItemRemoveConfirmationPopUp({ itemDetails: { incBy, itemIndex, itemId } });
        } else {
            this.updateItemQuantity({ buyerId: buyerDetails._id, incBy, itemIndex, itemId })
        }
    }

    onPlaceOrderPress() {
        const { cartDetails, getOrderJson, userToken, buyerDetails } = this.props;
        if (get(cartDetails, '_id')) {
            getOrderData({
                cartDetails,
                toLocation: get(buyerDetails, `location.0`),
                userToken,
                getOrderJson,
                onSuccess: _ => history.push(validAppRoutes.buyerPlaceOrderView.replace(":cartId", cartDetails._id))
            });
        }
    }

    render() {
        const { toggleItemRemoveConfirmationPopUp, isUpdateItemQtyInProgress } = this.state;
        const { cartDetails, userDetails } = this.props;
        return <div style={{ height: "100%" }}>
            {toggleItemRemoveConfirmationPopUp && <PopUp
                footerActions={_ => <Button onClick={this.onRemoveItemConfirmationClick}
                                            title={appStringConstants.removeButtonTitle}/>}
                title={appStringConstants.itemRemoveFromCartConfirmationPopUpTitle}
                onClose={this.toggleItemRemoveConfirmationPopUp}
                renderScene={_ => <div>{appStringConstants.itemRemoveFromCartConfirmationPopUpText}</div>}
            />}
            <CartDetailsComp
                isAdmin={get(userDetails, 'role') === roles.admin}
                isUpdateItemQtyInProgress={isUpdateItemQtyInProgress}
                onPlaceOrderClick={this.onPlaceOrderPress}
                onUpdateCartItemQuantityClick={this.onUpdateCartItemQuantityClick}
                cartDetails={cartDetails}
            />
        </div>
    }
}

export default connect((state = {}, ownProps = {}) => ({
    cartDetails: state.cart.cartDetails.data,
    userDetails: state.users.userDetails,
    userToken: state.users.userToken,
    buyerDetails: state.users.buyerDetails,
}), { getCartDetail, getOrderJson, updateCartItemQuantity })(CartDetails)
