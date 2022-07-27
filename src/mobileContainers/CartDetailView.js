import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { getOrderJson } from '../redux-store/actions/orderActions';
import { getCartDetail, updateCartItemQuantity, clearCartDetails } from '../redux-store/actions/cartActions';
import { CartDetailViewComp, PopUp } from "../mobileComponents/index";
import RemoveCartItemPopup from "../mobileComponents/Popups/RemoveCartItemPopup";
import { appRoutes } from "../constants/index";
import { getOrderData } from "../utils/functions";
import get from "lodash/get";

class CartDetailView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRemoveItemPopupActive: false,
            isUpdateItemQtyInProgress: false,
        };
        this.toggleRemoveCartItemPopup = this.toggleRemoveCartItemPopup.bind(this);
        this.onPlaceOrderClick = this.onPlaceOrderClick.bind(this);
        this.onIncButtonPress = this.onIncButtonPress.bind(this);
        this.onItemQuantityChange = this.onItemQuantityChange.bind(this);
    }

    componentDidMount() {
        const { getCartDetail, userToken, navigation } = this.props;
        const { cartId } = navigation.state.params;
        cartId && getCartDetail && getCartDetail({
            isMobile: true,
            userToken,
            cartId,
        })
    }

    onIncButtonPress({ itemVal, itemIndex, incBy }) {
        const { cartDetails } = this.props;
        itemVal.item_id && itemVal.item_id._id && cartDetails._id && this.onItemQuantityChange({
            incBy,
            itemIndex,
            itemId: itemVal.item_id._id,
            quantity: itemVal.quantity,
            cartId: cartDetails._id
        })
    }

    callUpdateCartItemQuantity({ buyerDetails, navigation, incBy, onSuccess, itemIndex, userToken, cartId, itemId, updateCartItemQuantity }) {
        buyerDetails && buyerDetails._id && userToken && updateCartItemQuantity && updateCartItemQuantity({
            incBy,
            itemIndex,
            navigation,
            isMobile: true,
            itemId,
            cartId,
            userToken,
            buyerId: buyerDetails._id,
            onSuccess
        })
    }

    toggleRemoveCartItemPopup(data) {
        this.setState(prevState => ({
            onRemoveItemConfirmationClick: data && data.onRemoveItemConfirmationClick,
            isRemoveItemPopupActive: !prevState.isRemoveItemPopupActive
        }));
    }

    onItemQuantityChange({ quantity, itemId, incBy, itemIndex, cartId }) {

        const { updateCartItemQuantity, navigation, buyerDetails, userToken } = this.props;

        if ((quantity + incBy) <= 0) {
            this.toggleRemoveCartItemPopup({
                onRemoveItemConfirmationClick: _ => {
                    this.setState({ isUpdateItemQtyInProgress: true });
                    this.callUpdateCartItemQuantity({
                        incBy,
                        itemIndex,
                        navigation,
                        buyerDetails,
                        userToken,
                        cartId,
                        itemId,
                        updateCartItemQuantity,
                        onSuccess: _ => {
                            this.setState({ isUpdateItemQtyInProgress: false });
                            this.toggleRemoveCartItemPopup();
                        }
                    })
                }
            });

        } else {
            this.setState({ isUpdateItemQtyInProgress: true });
            this.callUpdateCartItemQuantity({
                incBy,
                userToken,
                buyerDetails,
                itemIndex,
                navigation,
                cartId,
                itemId,
                updateCartItemQuantity,
                onSuccess: _ => {
                    this.setState({ isUpdateItemQtyInProgress: false });
                }
            })
        }
    }

    onPlaceOrderClick() {

        const { getOrderJson, navigation, userToken, cartDetails, buyerDetails } = this.props;
        getOrderData({
            cartDetails,
            isMobile: true,
            userToken,
            getOrderJson,
            toLocation: get(buyerDetails, `location.0`),
            onSuccess: ({ data }) => {
                navigation.push(appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.PlaceOrderView.route, { orderJson: data })
            }
        });

    }

    componentWillUnmount() {
        const { clearCartDetails } = this.props;
        clearCartDetails();
    }

    render() {

        const { cartDetails, navigation } = this.props;
        const { isRemoveItemPopupActive, isUpdateItemQtyInProgress, onRemoveItemConfirmationClick } = this.state;

        return <View style={{ flex: 1 }}>
            <CartDetailViewComp
                onIncButtonPress={this.onIncButtonPress}
                isUpdateItemQtyInProgress={isUpdateItemQtyInProgress}
                navigation={navigation}
                onPlaceOrderClick={this.onPlaceOrderClick}
                cartDetails={cartDetails}
            />
            {isRemoveItemPopupActive &&
            <PopUp
                style={{ width: '90%' }}
                onCrossPress={this.toggleRemoveCartItemPopup}
                isPopUpActive={isRemoveItemPopupActive}
                popupView={_ => <RemoveCartItemPopup
                    isLoading={isUpdateItemQtyInProgress}
                    onOkPress={onRemoveItemConfirmationClick}
                    onCancelPress={this.toggleRemoveCartItemPopup}
                />}
            />}
        </View>
    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    buyerDetails: state.users.buyerDetails,
    cartDetails: state.cart.cartDetails.data,
}), { getOrderJson, clearCartDetails, getCartDetail, updateCartItemQuantity })(CartDetailView);
