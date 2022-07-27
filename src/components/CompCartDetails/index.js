import React from 'react';

import { OrderAmountSummary } from "../OrderAmountSummary";
import appStringConstants from "../../constants/appStringConstants";

import styles from './index.module.scss';

export default class CompCartDetailsView extends React.Component {

    render() {

        const { totalAmount, isPlaceOrderInProgress, onPlaceOrderClick, sections } = this.props;

        return <div className={styles['container']}>
            <div className={styles['left-section']}>
                <div className={styles['title']}>
                    {appStringConstants.viewItemDetailsButtonTitle}
                </div>
                {sections && Object.keys(sections).map(sectionId => {
                    const data = sections[sectionId];
                    return <div className={styles['data-container']}>
                        <img
                            src={data.img}
                            className={styles['data-img']}
                        />
                        <div>{data.title}</div>
                        <div>{`${appStringConstants.currencySymbol} ${data.price}`}</div>
                    </div>
                })}
            </div>
            <div className={styles['right-section']}>
                <OrderAmountSummary
                    isViewLoading={false}
                    isPlaceOrderInProgress={isPlaceOrderInProgress}
                    onPlaceOrderClick={onPlaceOrderClick}
                    dataObject={{
                        title: appStringConstants.orderAmountSummaryTitle,
                        data: [{
                            title: appStringConstants.orderAmountTotalAmountString,
                            value: `${appStringConstants.currencySymbol} ${totalAmount}`
                        }]
                    }}
                />
            </div>
        </div>
    }
}
