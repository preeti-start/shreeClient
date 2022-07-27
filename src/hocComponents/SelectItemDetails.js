import React from 'react';
import get from 'lodash/get';
import { compose } from "redux";
import { connect } from "react-redux";
import {
    clearItemDetail,
    getItemDetail,
    getRelatedItemFeatures,
    updateItemFeatureSelection
} from "../redux-store/actions/itemActions";


function one(Comp, props) {
    class ItemDetailView extends React.Component {

        constructor(propss) {
            super(propss);
            this.state = {
                selectedQuantity: props.quantity ? props.quantity : 1
            };
            this.onItemVersionClick = this.onItemVersionClick.bind(this);
            this.onAddToCartPress = this.onAddToCartPress.bind(this);
            this.onQuantityButtonPress = this.onQuantityButtonPress.bind(this);
        }

        componentDidMount() {

            const { itemId, quantity } = props;
            // const itemId='5e404d0a4ebd0867f86f0370';
            const { getItemDetail, isMobile, getRelatedItemFeatures } = this.props;
            getItemDetail && itemId && getItemDetail({
                itemId, isMobile, onSuccess: ({ data }) => {
                    if (!quantity && get(data, 'set_count', 0) > 1) {
                        this.setState({ selectedQuantity: get(data, 'set_count') })
                    }
                }
            });
            getRelatedItemFeatures && getRelatedItemFeatures({ isMobile, itemId });

        }

        componentWillUnmount() {
            const { clearItemDetail } = this.props;
            clearItemDetail();
        }

        onQuantityButtonPress({ incBy }) {
            const { selectedQuantity } = this.state;
            if (selectedQuantity + incBy >= 1) this.setState({ selectedQuantity: selectedQuantity + incBy })
        }


        onAddToCartPress({ itemDetails }) {

            const { relatedItemVersions } = this.props;
            const { selectedQuantity } = this.state;
            const { itemId, onAddToCartPress } = props;
            // const itemId='5e404d0a4ebd0867f86f0370';

            onAddToCartPress && onAddToCartPress({
                quantity: selectedQuantity,
                itemId,
                itemDetails,
                features: (relatedItemVersions && relatedItemVersions.features) ? { ...relatedItemVersions.features } : {},
            });

        }

        onItemVersionClick({ featureId, option }) {
            const { updateItemFeatureSelection, relatedItemVersions, isMobile } = this.props;
            relatedItemVersions && updateItemFeatureSelection({
                featureId,
                option,
                relatedItemVersions,
                isMobile
            })
        }

        render() {

            const { itemDetails, isAppLoading, cartItemIds, relatedItemVersions } = this.props;
            const { selectedQuantity } = this.state;

            return <Comp
                {...props}
                onItemVersionClick={this.onItemVersionClick}
                onQuantityButtonPress={this.onQuantityButtonPress}
                onAddToCartPress={this.onAddToCartPress}
                relatedItemVersions={relatedItemVersions}
                itemDetails={itemDetails}
                isAppLoading={isAppLoading}
                cartItemIds={cartItemIds}
                selectedQuantity={selectedQuantity}
            />

        }
    }

    return ItemDetailView

}

const composedHoc = compose(
    connect(state => ({
        relatedItemVersions: state.items.relatedItemVersions,
        itemDetails: state.items.itemDetails,
        isAppLoading: state.users.isAppLoading,
        cartItemIds: state.cart.cartItemIds,
    }), {
        getItemDetail,
        clearItemDetail,
        updateItemFeatureSelection,
        getRelatedItemFeatures,
    }),
    one
);

export default composedHoc;
