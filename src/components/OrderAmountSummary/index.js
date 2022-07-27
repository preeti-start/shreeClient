import React from 'react';
import get from 'lodash/get';

import Button from '../AppCompLibrary/Button'
import appStringConstants from '../../constants/appStringConstants'
import { loadingComp } from "../AppCompLibrary/ListPreLoader/LoadingData";
import { getOrderType } from "../../utils/functions";

import './index.css';


const renderSeperator = <div className="order-amount-seperator"/>;

const renderAmountRow = ({ isViewLoading, title, value }) => <div className="order-amount-row">
    <div className="order-amount-title">
        {!isViewLoading && title}
        {isViewLoading && <div>{loadingComp()}</div>}
    </div>
    <div>
        {!isViewLoading && value}
        {isViewLoading && <div>{loadingComp()}</div>}
    </div>
</div>;

export const OrderAmountSummary = ({ isViewLoading,showPlaceOrderButton=true, onPlaceOrderClick, isPlaceOrderInProgress, dataObject = {} }) =>
    <div
        className="order-amount-details">
        {!isViewLoading && <div>{dataObject.title}</div>}
        {isViewLoading && <div>{loadingComp()}</div>}
        {renderSeperator}
        {get(dataObject, 'data', []).map(data => renderAmountRow({
            isViewLoading,
            title: data.title,
            value: data.value
        }))}
        {dataObject.notes && <div className="order-amount-change-msg">{dataObject.notes}</div>}
        {showPlaceOrderButton && !isViewLoading && <Button isLoading={isPlaceOrderInProgress} onClick={onPlaceOrderClick}
                                   title={appStringConstants.orderStagesPlaceOrderTitle}/>}
    </div>;

