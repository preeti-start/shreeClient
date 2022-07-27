import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import ItemDetailViewComp from "../mobileComponents/ItemDetailView";
import { appRoutes } from "../constants/index";
import { addItemToUserCart } from "../redux-store/actions/cartActions";
import SelectItemDetails from "../hocComponents/SelectItemDetails";
import { addToCartPress } from "../utils/mobileFunctions";

class ItemDetailView extends React.Component {

    constructor(props) {
        super(props);
        this.onViewCartPress = this.onViewCartPress.bind(this);
        this.onAddToCartPress = this.onAddToCartPress.bind(this);
        this.ItemDetailsComp = SelectItemDetails(ItemDetailViewComp, {
            quantity: get(props, 'navigation.state.params.quantity'),
            onViewCartPress: this.onViewCartPress,
            onAddToCartPress: this.onAddToCartPress,
            itemId: get(props, 'navigation.state.params.itemId'),
            navigation: props.navigation
        });
    }


    onViewCartPress({ cartId }) {
        const { navigation } = this.props;
        cartId && navigation && navigation.navigate(appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.CartDetailView.route, { cartId })
    }

    onAddToCartPress({ quantity, itemId, features }) {
        const { navigation, buyerDetails, userToken, addItemToUserCart, itemDetails } = this.props;
        addToCartPress({
            isMobile: true,
            features,
            navigationDetails: {
                route: appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ItemDetailView.route,
                params: { itemId, quantity }
            },
            buyerId: buyerDetails && buyerDetails._id ? buyerDetails._id : undefined,
            addItemToUserCart,
            vendorId: get(itemDetails, 'vendor_id._id'),
            quantity,
            itemId,
            userToken,
            navigation
        })
    }


    render() {
        return <this.ItemDetailsComp/>
    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    itemDetails: state.items.itemDetails,
    buyerDetails: state.users.buyerDetails,
}), { addItemToUserCart })(ItemDetailView)
