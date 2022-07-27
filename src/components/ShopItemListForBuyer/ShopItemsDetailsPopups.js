import React from 'react';

import Button from "../AppCompLibrary/Button";
import appStringConstants from "../../constants/appStringConstants";
import intersection from "lodash/intersection";
import ItemQuantitySelector from "../ItemQuantitySelector";
import { getItemCartId } from "../../utils/functions";

import './index.css';
import { getFinalPrizeString } from "../../utils/webFunctions";

export default class ShopItemsDetailsPopups extends React.Component {


    render() {

        const {
            isLoading, itemDetails, selectedQuantity, onViewCartPress, onQuantityButtonPress,
            cartItemIds, relatedItemVersions, onAddToCartPress, onItemVersionClick
        } = this.props;

        const activeItems = (relatedItemVersions && relatedItemVersions.activeItems) ? relatedItemVersions.activeItems : [];
        const featuresMapping = relatedItemVersions && relatedItemVersions.features;
        const itemCartId = getItemCartId({ relatedItemVersions, cartItemIds, itemDetails });

        return <div>
            <div className="shop-item-quantity-header">
                <div>
                    <div className="shop-item-quantity-title">
                        {itemDetails && itemDetails.name}</div>
                    <div
                        className="">
                        {getFinalPrizeString({
                            showNetPrize: !itemCartId,
                            data: itemDetails,
                            quantity: selectedQuantity
                        })}
                    </div>
                </div>
                {!itemCartId && <ItemQuantitySelector
                    onUpdateItemQuantityPress={onQuantityButtonPress}
                    value={`${selectedQuantity} ${itemDetails && itemDetails.measuring_unit_id && itemDetails.measuring_unit_id.short_name}`}
                />}
            </div>
            <div
                className="shop-item-quantity-images">{itemDetails && itemDetails.item_images && itemDetails.item_images.map((imgData, imgIndex) =>
                <img className="shop-item-img-list-style" key={`item_img_${imgIndex}`} src={imgData.url}/>
            )}
            </div>

            {relatedItemVersions && relatedItemVersions.features && Object.keys(relatedItemVersions.features).length > 0 &&
            <div>
                {Object.keys(featuresMapping).map(feature => <div>
                    <div>
                        <div>
                            {featuresMapping[feature].feature && `Select ${featuresMapping[feature].feature.name}`}
                        </div>
                        <div className="shop-item-feature-container">
                            {Object.keys(featuresMapping[feature].options).length > 0 && Object.keys(featuresMapping[feature].options).map(option => {
                                const isItemActive = featuresMapping[feature].options[option].relatedItemIds &&
                                    intersection(featuresMapping[feature].options[option].relatedItemIds, activeItems).length > 0;
                                const isFeatureSelected = featuresMapping[feature].options[option].isSelected;
                                return <div style={{
                                    opacity: isItemActive ? 1 : 0.3,
                                    borderColor: isFeatureSelected ? 'red' : 'black'
                                }}
                                            className="shop-item-feature-box">
                                    <div
                                        onClick={isItemActive ? _ => onItemVersionClick({
                                            featureId: feature,
                                            option
                                        }) : undefined}
                                    >
                                        <div style={{ color: isFeatureSelected ? 'red' : 'black' }}>
                                            {featuresMapping[feature].options[option] && featuresMapping[feature].options[option].name}
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>

                </div>)}
            </div>}


            <div className="shop-item-quantity-button">
                {!itemCartId && <Button
                    isLoading={isLoading}
                    onClick={onAddToCartPress}
                    title={appStringConstants.addButtonTitle}/>}
                {itemCartId && <Button
                    isLoading={isLoading}
                    onClick={_ => onViewCartPress({ cartId: itemCartId })}
                    title={appStringConstants.viewCartButtonTitle}/>}
            </div>
        </div>
    }
}


