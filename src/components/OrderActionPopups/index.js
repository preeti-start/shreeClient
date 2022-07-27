import React from 'react';

import appStringConstants from '../../constants/appStringConstants'

import './index.scss'

export const OrderSuccessPopup = <div
    className="order-status-popup-bg">
    <div className="order-status-popup-body">
        <img className="order-status-popup-img" src="/success_img.png"/>
        <div>{appStringConstants.orderSuccessfullyPlacedString}</div>
    </div>
</div>;

export const OrderFailurePopup = <div
    className="order-status-popup-bg">
    <div className="order-status-popup-body">
        <img className="order-status-popup-img" src="/failure_img.png"/>
        <div>{appStringConstants.orderPlacementErrorString}</div>
    </div>
</div>;