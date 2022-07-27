import React from 'react';
import { connect } from 'react-redux';
import RNGooglePlaces from 'react-native-google-places';
import { View } from "react-native";

import { PlaceOrderViewComp, PopUp } from '../mobileComponents/index';
import { appRoutes, placeOrderStages, useAdminLocationForDelivery } from '../constants/index';
import { updateBuyerDetails } from '../redux-store/actions/userActions';
import { getOrderJson, createOrder } from '../redux-store/actions/orderActions';
import PlaceOrderStatusPopup from "../mobileComponents/Popups/PlaceOrderStatusPopup";
import appStringConstants from "../constants/mobileStringConstants";
import { getOrderData } from "../utils/functions";
import get from "lodash/get";

class PlaceOrderView extends React.Component {

    constructor(props) {
        super(props);
        const isHomeDeliveryActive = useAdminLocationForDelivery || get(props, 'cartDetails.vendor_id.is_home_delivery_active', false);
        this.state = {
            excludeShopTimings: false,
            orderTimingPopupActive: false,
            orderPlacementSuccessPopupActive: false,
            orderPlacementFailedPopupActive: false,
            activeAddressIndex: 0,
            orderJson: get(props, 'navigation.state.params.orderJson'),
            isHomeDeliveryActive,
            orderStage: isHomeDeliveryActive ? placeOrderStages[0] : placeOrderStages[1],
            selectedAddress: undefined,
        };
        this.onOrderTimingOkClick = this.onOrderTimingOkClick.bind(this);
        this.onPlaceOrderSuccessOkPress = this.onPlaceOrderSuccessOkPress.bind(this);
        this.toggleTimingPopupModal = this.toggleTimingPopupModal.bind(this);
        this.onAddressRowClick = this.onAddressRowClick.bind(this);
        this.onAddNewAddressPress = this.onAddNewAddressPress.bind(this);
        this.onDeliverHereClick = this.onDeliverHereClick.bind(this);
        this.onPlaceOrderClick = this.onPlaceOrderClick.bind(this);
        this.toggleOrderPlacementSuccessModal = this.toggleOrderPlacementSuccessModal.bind(this);
        this.toggleOrderPlacementFailureModal = this.toggleOrderPlacementFailureModal.bind(this);
        this.setOrderJson = this.setOrderJson.bind(this);
    }

    toggleOrderPlacementSuccessModal() {
        this.setState(prevState => ({ orderPlacementSuccessPopupActive: !prevState.orderPlacementSuccessPopupActive }))
    }

    toggleTimingPopupModal() {
        this.setState(prevState => ({ orderTimingPopupActive: !prevState.orderTimingPopupActive }))
    }

    toggleOrderPlacementFailureModal() {
        this.setState(prevState => ({ orderPlacementFailedPopupActive: !prevState.orderPlacementFailedPopupActive }))
    }

    onPlaceOrderClick() {
        const { orderJson, excludeShopTimings } = this.state;
        // alert(JSON.stringify({ excludeShopTimings }))
        const { createOrder, buyerDetails, userToken, cartDetails, navigation } = this.props;
        cartDetails && cartDetails._id && orderJson && userToken && createOrder && createOrder({
            cartId: cartDetails._id,
            navigation,
            excludeShopTimings,
            onShopNotOpen: this.toggleTimingPopupModal,
            isMobile: true,
            userToken,
            orderJson,
            buyerId: buyerDetails && buyerDetails._id,
            onError: this.toggleOrderPlacementFailureModal,
            onSuccess: this.toggleOrderPlacementSuccessModal
        })
    }

    setOrderJson({ toLocation }) {

        const { getOrderJson, userToken, cartDetails, buyerDetails } = this.props;
        getOrderData({
            cartDetails,
            isMobile: true,
            userToken,
            getOrderJson,
            toLocation: toLocation ? toLocation : get(buyerDetails, `location.0`),
            onSuccess: ({ data }) => {
                this.setState({ orderJson: data })
            }
        });

    }

    onAddressRowClick(index) {
        const { buyerDetails } = this.props;
        this.setState({
            activeAddressIndex: index,
        });
        this.setOrderJson({ toLocation: buyerDetails.location[index] });
    }

    onAddNewAddressPress() {
        const { userToken, buyerDetails, updateBuyerDetails } = this.props;
        RNGooglePlaces.openPlacePickerModal()
            .then((place) => {
                if (place.address && place.name && place.longitude && place.latitude) {
                    const addrVal = {
                        coordinates: [place.longitude, place.latitude],
                        address: place.address,
                        name: place.name,
                    };
                    userToken && buyerDetails && buyerDetails._id && updateBuyerDetails && updateBuyerDetails({
                        userToken,
                        buyerId: buyerDetails._id,
                        location: buyerDetails.location ? [...buyerDetails.location, addrVal] : [addrVal],
                    })
                } else {
                    alert(appStringConstants.invalidAddressAlert)
                }

                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            }).catch(error => console.log(error.message));  // error is a Javascript Error object
    }

    onDeliverHereClick(address) {
        this.setState({
            selectedAddress: address,
            orderStage: placeOrderStages[1],
        })
    }

    onPlaceOrderSuccessOkPress() {
        const { navigation } = this.props;
        this.toggleOrderPlacementSuccessModal();
        navigation.navigate(appRoutes.BuyerRoutes.childRoutes.BuyerActiveOrders.route);
    }

    onOrderTimingOkClick() {
        this.toggleTimingPopupModal();
        this.setState({ excludeShopTimings: true }, this.onPlaceOrderClick);
    }

    render() {

        const { isAppLoading, navigation, buyerDetails } = this.props;
        const {
            orderStage, activeAddressIndex, selectedAddress, orderPlacementSuccessPopupActive,
            orderPlacementFailedPopupActive, isHomeDeliveryActive, orderJson, orderTimingPopupActive
        } = this.state;

        return <View style={{ flex: 1 }}>
            <PlaceOrderViewComp
                activeAddressIndex={activeAddressIndex}
                selectedAddress={selectedAddress}
                navigation={navigation}
                isAppLoading={isAppLoading}
                onAddNewAddressPress={this.onAddNewAddressPress}
                onDeliverHereClick={this.onDeliverHereClick}
                onAddressRowClick={this.onAddressRowClick}
                onPlaceOrderClick={this.onPlaceOrderClick}
                addressArray={buyerDetails.location}
                orderStage={orderStage}
                isHomeDeliveryActive={isHomeDeliveryActive}
                orderJson={orderJson}
            />
            {orderPlacementSuccessPopupActive &&
            <PopUp
                style={{ width: '90%' }}
                isPopUpActive={orderPlacementSuccessPopupActive}
                popupView={_ => <PlaceOrderStatusPopup
                    description={appStringConstants.orderPlacedSuccessMsg}
                    onOkPress={this.onPlaceOrderSuccessOkPress}
                />}
            />}
            {orderPlacementFailedPopupActive &&
            <PopUp
                style={{ width: '90%' }}
                isPopUpActive={orderPlacementFailedPopupActive}
                popupView={_ => <PlaceOrderStatusPopup
                    hasFailed={true}
                    description={appStringConstants.orderPlacedFailedMsg}
                    onOkPress={this.toggleOrderPlacementFailureModal}
                />}
            />}
            {orderTimingPopupActive &&
            <PopUp
                style={{ width: '90%' }}
                isPopUpActive={orderTimingPopupActive}
                popupView={_ => <PlaceOrderStatusPopup
                    isQuestion={true}
                    description={appStringConstants.shopClosedMsg}
                    onOkPress={this.onOrderTimingOkClick}
                />}
            />}
        </View>;

    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    buyerDetails: state.users.buyerDetails,
    cartDetails: state.cart.cartDetails.data,
    isAppLoading: state.users.isAppLoading,
}), { getOrderJson, updateBuyerDetails, createOrder })(PlaceOrderView)
