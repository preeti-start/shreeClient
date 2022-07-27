import React from 'react';
import get from 'lodash/get';

import PageHeader from "../PageHeader";
import appStringConstants from "../../constants/appStringConstants";
import { getFinalPrizeString, getDataObjectfromOrderJson } from "../../utils/webFunctions";
import { OrderAmountSummary } from "../OrderAmountSummary";
import ItemQuantitySelector from "../ItemQuantitySelector";

import './index.css';
import styles from './index.module.scss'

export default class CartDetails extends React.Component {

    constructor(props) {
        super(props);
        this.renderItemBlockingScreen = this.renderItemBlockingScreen.bind(this);
        this.renderCrossAction = this.renderCrossAction.bind(this);
    }

    renderItemBlockingScreen() {

        return <div className={styles['blocking-container']}>
            <div>{appStringConstants.itemNotAvailableTitle}</div>
        </div>

    }

    renderCrossAction({ itemData, itemIndex }) {

        const { onUpdateCartItemQuantityClick } = this.props;

        return <div className={styles['remove-item-button']} onClick={_ => onUpdateCartItemQuantityClick({
            incBy: -itemData.quantity,
            itemQuantity: itemData.quantity,
            itemIndex,
            itemId: itemData.item_id._id
        })}>
            <svg className={styles['remove-icon']} viewBox="0 0 24 24">
                <use xlinkHref="#close_icon"/>
            </svg>
        </div>

    }

    render() {

        const { cartDetails, isAdmin, isUpdateItemQtyInProgress, onPlaceOrderClick, onUpdateCartItemQuantityClick } = this.props;

        return <div className="cart-details-container">
            <PageHeader
                title={<div>
                    {appStringConstants.cartListMenuTitle}
                </div>}
            />
            <div className="cart-details-view-container">
                <div className="cart-detail-items-list-container">
                    <div className="cart-detail-items-list">
                        {cartDetails && cartDetails.items && cartDetails.items.length > 0 && cartDetails.items.map((itemData, itemIndex) =>
                            <div className="cart-items-row">
                                <div className="cart-items-details">
                                    <div>{itemData && itemData.item_id && itemData.item_id.name}</div>
                                    <div
                                        className="cart-items-subdetails">
                                        {getFinalPrizeString({
                                            data: itemData.item_id,
                                            quantity: itemData.quantity,
                                            showNetPrize: true
                                        })}
                                        {itemData && itemData.features && itemData.features.length > 0 && itemData.features.map(feature =>
                                            <div
                                                style={{}}>
                                                {`${feature.name} - ${feature.option}`}
                                            </div>)}
                                    </div>
                                </div>
                                {!isAdmin && <ItemQuantitySelector
                                    isLoading={isUpdateItemQtyInProgress}
                                    onUpdateItemQuantityPress={({ incBy }) => onUpdateCartItemQuantityClick({
                                        incBy,
                                        itemQuantity: itemData.quantity,
                                        itemIndex,
                                        itemId: itemData.item_id._id
                                    })}
                                    value={`${itemData && itemData.quantity} ${itemData && itemData.item_id && itemData.item_id.measuring_unit_id && itemData.item_id.measuring_unit_id.short_name}`}
                                />}
                                {!get(itemData, 'item_id.is_active', false) && this.renderItemBlockingScreen()}
                                {!isAdmin && this.renderCrossAction({
                                    itemData,
                                    itemIndex
                                })}
                            </div>)}
                    </div>
                </div>
                <div className="cart-detail-amount-summary-container">
                    <OrderAmountSummary
                        showPlaceOrderButton={!isAdmin}
                        onPlaceOrderClick={onPlaceOrderClick}
                        dataObject={getDataObjectfromOrderJson({ orderJson: cartDetails })}
                    />
                </div>
            </div>
        </div>

    }
}
