import React from 'react';

import './index.css';
import OrderAddress from './OrderAddress';
import { OrderAmountSummary } from '../OrderAmountSummary';
import appStringConstants from "../../constants/appStringConstants";
import PageHeader from "../PageHeader";
import { loadingComp } from "../AppCompLibrary/ListPreLoader/LoadingData";
import { getDataObjectfromOrderJson } from "../../utils/webFunctions";


export const PlaceOrderViewComp = ({
                                       activeAddressIndex, isViewLoading, shopName, orderJson, toggleAddressPopUp,
                                       onPlaceOrderClick, isPlaceOrderInProgress, isHomeDeliveryActive,
                                       addressArray, onAddressRowClick
                                   }) => {


    return <div>
        <PageHeader
            title={isViewLoading ? <div>{loadingComp()}</div> : <div>
                {shopName}
                {orderJson && orderJson.order_type && <div
                    className="place-order-view-order-header-subdata-text">
                    {`${appStringConstants.ordersListOrderTypeFieldTitle} : ${orderJson.order_type}`}
                </div>}
            </div>}
        />
        <div className="place-order-view-container">
            {isHomeDeliveryActive && <div className="place-order-view-address-select-container">
                <div className="order-stage-container">
                    <div className="order-stage">
                        <div className="order-stage-circle active"/>
                        <div className="order-stage-text">{appStringConstants.orderStagesAddressDetailsTitle}</div>
                    </div>
                    <div className="order-stage-seperator"/>
                    <div className="order-stage">
                        <div className="order-stage-circle"/>
                        <div className="order-stage-text">{appStringConstants.orderStagesPlaceOrderTitle}</div>
                    </div>
                </div>
                <OrderAddress
                    activeAddressIndex={activeAddressIndex}
                    toggleAddressPopUp={toggleAddressPopUp}
                    addressArray={addressArray}
                    onAddressRowClick={onAddressRowClick}
                />
            </div>}
            <div className="place-order-view-amount-details-container">
                <OrderAmountSummary
                    isViewLoading={isViewLoading}
                    isPlaceOrderInProgress={isPlaceOrderInProgress}
                    onPlaceOrderClick={onPlaceOrderClick}
                    dataObject={getDataObjectfromOrderJson({ orderJson })}
                />
            </div>
        </div>
    </div>
};
