import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { PlaceOrderViewComp } from '../../components/PlaceOrderView';
import { addToasts } from '../../redux-store/actions/toastActions';
import { updateBuyerDetails } from '../../redux-store/actions/userActions';
import { getCartDetail } from '../../redux-store/actions/cartActions';
import { getOrderJson, createOrder } from '../../redux-store/actions/orderActions';
import PopUp from "../../components/Popup";
import Button from "../../components/AppCompLibrary/Button";
import appStringConstants from "../../constants/appStringConstants";
import FormContainer from "../Form";
import { getOrderData } from "../../utils/functions";
import { fieldTypes, useAdminLocationForDelivery } from "../../constants";
import history from "../../utils/history";

import './index.css';
import { OrderFailurePopup, OrderSuccessPopup } from "../../components/OrderActionPopups";

class PlaceOrderView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeAddressIndex: 0,
            isPlaceOrderInProgress: false,
            isAddressPopupActive: false,
            isAskForAddressPopUpActive: false,
        };
        this.toggleAddressPopUp = this.toggleAddressPopUp.bind(this);
        this.onAddressRowClick = this.onAddressRowClick.bind(this);
        this.onAddNewAddressPress = this.onAddNewAddressPress.bind(this);
        this.onPlaceOrderClick = this.onPlaceOrderClick.bind(this);
        this.onCartDetailsLoad = this.onCartDetailsLoad.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
        this.toggleAskForAddressPopUp = this.toggleAskForAddressPopUp.bind(this);
        this.setOrderJson = this.setOrderJson.bind(this);
    }

    toggleAskForAddressPopUp() {
        this.setState(prevState => ({ isAskForAddressPopUpActive: !prevState.isAskForAddressPopUpActive }))
    }

    toggleAddressPopUp() {
        this.setState(prevState => ({ isAddressPopupActive: !prevState.isAddressPopupActive }))
    }

    placeOrder() {

        const { createOrder, addToasts, buyerDetails, orderJson, userToken, cartDetails } = this.props;
        this.setState({ isPlaceOrderInProgress: true });

        cartDetails && cartDetails._id && orderJson && userToken && createOrder && createOrder({
            cartId: cartDetails._id,
            history,
            userToken,
            orderJson,
            buyerId: buyerDetails && buyerDetails._id,
            onError: _ => {
                this.setState({ isPlaceOrderInProgress: false });
                addToasts({
                    id: 'order_placed',
                    renderScene: OrderFailurePopup,
                });
            },
            onSuccess: _ => {
                this.setState({ isPlaceOrderInProgress: false });
                addToasts({
                    id: 'order_failed',
                    renderScene: OrderSuccessPopup,
                });
            },
        })
    }

    onPlaceOrderClick() {
        const { buyerDetails } = this.props;
        const { isHomeDeliveryActive } = this.state;
        if (isHomeDeliveryActive) {
            if (get(buyerDetails, 'location', []).length > 0) {
                this.placeOrder();
            } else {
                this.toggleAskForAddressPopUp();
            }
        } else {
            this.placeOrder();
        }
    }

    setOrderJson({ toLocation }) {
        const { getOrderJson, userToken, cartDetails } = this.props;
        getOrderData({
            cartDetails,
            toLocation,
            userToken,
            getOrderJson
        });
    }

    onCartDetailsLoad({ callGetOrderJson = true }) {
        const { cartDetails, buyerDetails } = this.props;
        const isHomeDeliveryActive = useAdminLocationForDelivery || (get(cartDetails, 'vendor_id.is_home_delivery_active', false));
        this.setState({
            isHomeDeliveryActive,
        });
        callGetOrderJson && this.setOrderJson({ toLocation: get(buyerDetails, `location.0`) });
    }

    componentDidMount() {
        const { match, cartDetails, userToken, orderJson, getCartDetail } = this.props;
        if (cartDetails) {
            this.onCartDetailsLoad({ callGetOrderJson: !orderJson });
        } else {
            get(match, 'params.cartId') && userToken && getCartDetail && getCartDetail({
                cartId: match.params.cartId,
                onSuccess: _ => {
                    this.onCartDetailsLoad({});
                },
                userToken
            })
        }
    }

    onAddressRowClick(index) {
        const { buyerDetails } = this.props;
        this.setState({
            activeAddressIndex: index,
        });
        this.setOrderJson({ toLocation: buyerDetails.location[index] });
    }

    onAddNewAddressPress({ formData }) {
        const { location } = formData;
        const { userToken, buyerDetails, updateBuyerDetails } = this.props;
        userToken && buyerDetails && buyerDetails._id && updateBuyerDetails && updateBuyerDetails({
            userToken,
            buyerId: buyerDetails._id,
            location: buyerDetails.location ? [...buyerDetails.location, location] : [location],
        });
        this.toggleAddressPopUp();
    }


    render() {


        const { orderJson, buyerDetails, cartDetails } = this.props;
        const gotCompleteData = orderJson && cartDetails;
        const { isPlaceOrderInProgress, isAddressPopupActive, activeAddressIndex, isAskForAddressPopUpActive, isHomeDeliveryActive } = this.state;

        return <div>
            {isAskForAddressPopUpActive && <PopUp
                footerActions={_ => <Button onClick={this.toggleAskForAddressPopUp}
                                            title={appStringConstants.okButtonTitle}/>}
                title={appStringConstants.addressDetailsMissingWhilePlaceOrderPopUpTitle}
                onClose={this.toggleAskForAddressPopUp}
                renderScene={_ => <div>{appStringConstants.addressDetailsMissingWhilePlaceOrderPopUpText}</div>}
            />}
            {isAddressPopupActive &&
            <PopUp
                title={appStringConstants.addNewAddressPopupTitle}
                onClose={this.toggleAddressPopUp}
                renderScene={_ => <div className="add-address-popup">
                    <FormContainer
                        fieldGroups={
                            [
                                {
                                    fields: [
                                        {
                                            type: fieldTypes.location,
                                            isMandatory: true,
                                            field: "location",
                                            label: appStringConstants.locationFieldPlaceholder,
                                            placeholder: appStringConstants.locationFieldPlaceholder,
                                        },
                                    ]
                                },
                            ]}
                        clickActions={[
                            { title: appStringConstants.addButtonTitle, onClick: this.onAddNewAddressPress }
                        ]}
                    />
                </div>}
            />}

            <PlaceOrderViewComp
                activeAddressIndex={activeAddressIndex}
                isViewLoading={!gotCompleteData}
                shopName={get(cartDetails, 'vendor_id.shop_name')}
                isPlaceOrderInProgress={isPlaceOrderInProgress}
                toggleAddressPopUp={this.toggleAddressPopUp}
                addressArray={buyerDetails.location}
                onAddressRowClick={this.onAddressRowClick}
                onPlaceOrderClick={this.onPlaceOrderClick}
                isHomeDeliveryActive={isHomeDeliveryActive}
                orderJson={!gotCompleteData ? {
                    items: [{}, {}, {}],
                    total_amount: 0,
                    delivery_amount: 0,
                    total_items_amount: 0,
                } : orderJson}
            />
        </div>;

    }
}

export default connect((state = {}, ownProps = {}) => ({
    buyerDetails: state.users.buyerDetails,
    cartDetails: state.cart.cartDetails.data,
    orderJson: state.order.orderJson,
    userToken: state.users.userToken,
}), { updateBuyerDetails, addToasts, getOrderJson, createOrder, getCartDetail })(PlaceOrderView)
