import React from 'react';
import get from 'lodash/get';

import PageHeader from "../PageHeader";
import appStringConstants from "../../constants/appStringConstants";
import Button from "../AppCompLibrary/Button";
import Table from "../AppCompLibrary/Table";
import NoResultFound from "../NotFound/noResultFound";
import { showShopNowButton } from "../../utils/functions";
import { onShopNowClick, onShopCompositionsClick } from "../../utils/webFunctions";
import { appButtonType, roles } from "../../constants";

import './index.css';

const tabs = [{ label: "Items" }, { label: "Compositions" }];

export default class Carts extends React.Component {

    constructor(props) {
        super(props);
        this.getItemCartFieldsList = this.getItemCartFieldsList.bind(this);
        this.getCompCartFieldsList = this.getCompCartFieldsList.bind(this);
    }

    getItemCartFieldsList() {

        const { userDetails, onPlaceOrderPress } = this.props;
        const isAdmin = userDetails && userDetails.role && userDetails.role === roles.admin;

        let fieldList = [
            {
                "label": appStringConstants.cartListVendorNameFieldTitle,
                "Cell": dataVal => <div>
                    {dataVal && dataVal.vendor_id && dataVal.vendor_id.name}</div>
            },
        ];
        if (isAdmin) {
            fieldList.push({
                "label": appStringConstants.cartListBuyerNameFieldTitle,
                "Cell": dataVal => <div>
                    {dataVal && dataVal.buyer_id && dataVal.buyer_id.name}</div>
            })
        }
        fieldList = [
            ...fieldList,
            {
                "label": appStringConstants.cartListItemsFieldTitle,
                "Cell": dataVal => <div>
                    {dataVal && dataVal.items && dataVal.items.length}</div>
            }
        ];
        if (!isAdmin) {
            fieldList.push({
                "label": "",
                "Cell": rowData => <Button buttonType={appButtonType.type_2}
                                           onClick={event => onPlaceOrderPress({ event, rowData })}
                                           title={appStringConstants.placeOrderButtonTitle}/>
            })
        }
        return fieldList;
    }

    getCompCartFieldsList() {

        const { userDetails, onPlaceOrderPress } = this.props;
        const isAdmin = userDetails && userDetails.role && userDetails.role === roles.admin;

        let fieldList = [
            {
                "label": appStringConstants.nameFieldPlaceholder,
                "Cell": dataVal => <div>
                    {get(dataVal, 'composition.title')}</div>
            },
        ];
        if (isAdmin) {
            fieldList.push({
                "label": appStringConstants.cartListBuyerNameFieldTitle,
                "Cell": dataVal => <div>
                    {dataVal && dataVal.buyer_id && dataVal.buyer_id.name}</div>
            })
        }
        return fieldList;
    }

    render() {

        const {
            listData, isAppLoading, onTabClick,
            activeTabIndex, userDetails, onItemsCartRowClick, onCompCartRowClick
        } = this.props;

        return <div className="cart-list-container">
            <PageHeader
                title={appStringConstants.cartListMenuTitle}
            />
            <div className="tab-container">
                {tabs.map((data, index) => <div
                    onClick={_ => onTabClick(index)}
                    className={`tab-data ${index === activeTabIndex ? 'active' : ''}`}>
                    {data.label}
                </div>)}
            </div>
            {activeTabIndex === 0 && <Table
                noDataComponent={_ => <NoResultFound
                    imgUrl={"/empty-cart.png"}
                    renderLabel={showShopNowButton({ userDetails }) ? _ => <Button
                        title={appStringConstants.shopNowButtonTitle} onClick={onShopNowClick}/> : _ => {
                    }}/>}
                onRowClick={onItemsCartRowClick}
                data={[{ isLoading: isAppLoading, data: listData }]}
                columns={this.getItemCartFieldsList()}
            />}
            {activeTabIndex === 1 && <Table
                noDataComponent={_ => <NoResultFound
                    imgUrl={"/empty-cart.png"}
                    renderLabel={showShopNowButton({ userDetails }) ? _ => <Button
                        title={appStringConstants.compositionsButtonTitle} onClick={onShopCompositionsClick}/> : _ => {
                    }}/>}
                onRowClick={onCompCartRowClick}
                data={[{ isLoading: isAppLoading, data: listData }]}
                columns={this.getCompCartFieldsList()}
            />}
        </div>
    }
}