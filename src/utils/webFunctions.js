import get from "lodash/get";
import React from "react";

import history from "./history";
import { validAppRoutes } from "../constants";
import appStringConstants from "../constants/appStringConstants";
import { getOrderType } from "./functions";

export const onShopNowClick = _ => {
    history.push(validAppRoutes.shopsList)
};
export const onContactUsClick = _ => {
    history.push(validAppRoutes.contactUs)
};
export const onHomeClick = _ => {
    history.push(validAppRoutes.home)
};
export const onAboutUsClick = _ => {
    history.push(validAppRoutes.aboutUs)
};

export const onShopCompositionsClick = _ => {
    history.push(validAppRoutes.compositions)
};

export const getDataObjectfromOrderJson = ({ orderJson }) => {
    const data = [{
        title: appStringConstants.ordersListOrderTypeFieldTitle,
        value: getOrderType(orderJson)
    }];
    if (get(orderJson, 'total_items_amount')) {
        data.push({
            title: appStringConstants.orderAmountItemsString,
            value: orderJson.items.length
        })
    }
    if (get(orderJson, 'total_items_amount')) {
        data.push({
            title: appStringConstants.orderAmountItemsAmountString,
            value: `${appStringConstants.currencySymbol} ${orderJson.total_items_amount}`
        })
    }
    if (orderJson && orderJson.hasOwnProperty('delivery_amount')) {
        data.push({
            title: appStringConstants.orderAmountDeliveryAmountString,
            value: `${appStringConstants.currencySymbol} ${orderJson.delivery_amount}`
        })
    }
    if (get(orderJson, 'total_amount')) {
        data.push({
            title: appStringConstants.orderAmountTotalAmountString,
            value: `${appStringConstants.currencySymbol} ${orderJson.total_amount}`
        })
    }
    if (orderJson) {
        return {
            title: appStringConstants.orderAmountSummaryTitle,
            notes: orderJson.notes,
            data
        }
    }
};

export const getFinalPrizeString = ({ data, quantity, showPrize = true, showNetPrize = false }) => {

    if (data && data.per_item_price && data.measuring_unit_id && data.measuring_unit_id.short_name) {
        let finalPrize = data.per_item_price;
        if (data.discount) {
            finalPrize = ((finalPrize / 100) * (100 - data.discount));
        }
        const hasDiscount = get(data, 'discount', 0) > 0;

        return <div>
            {showPrize && <div
                style={{
                    fontSize: "10px",
                }}>
                {appStringConstants.itemPerUnitPriceStringOnItemListAndDetailView(
                    finalPrize,
                    data.measuring_unit_id.short_name,
                    appStringConstants.currencySymbol
                )}
            </div>}
            {showPrize && hasDiscount && <div
                style={{
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    fontSize: "10px",
                }}>
                {appStringConstants.itemPerUnitPriceStringOnItemListAndDetailView(
                    data.per_item_price,
                    data.measuring_unit_id.short_name,
                    appStringConstants.currencySymbol
                )}
            </div>}
            {showPrize && hasDiscount && <div style={{
                fontSize: '8px',
                color: 'orange'
            }}>
                {appStringConstants.itemPriceDiscountString(data.discount)}
            </div>}
            {showNetPrize && <div
                style={{ paddingTop: 10, color: 'green', fontSize: '12px' }}>
                {appStringConstants.itemTotalPriceStringOnItemListAndDetailView((finalPrize * quantity), appStringConstants.currencySymbol)}
            </div>}
        </div>
    }
    return null;
};
