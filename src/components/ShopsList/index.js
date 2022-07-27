import React, { Component } from 'react';
import get from 'lodash/get';

import './index.css'
import { fieldTypes, useAdminLocationForDelivery } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import ShopItemFilters from "../ShopItemFilters";
import InfiniteScroller from "../AppCompLibrary/InfiniteScroller";
import Loader from "../Loaders";
import NoResultFound from "../NotFound/noResultFound";
import AppHeader from "../../containers/AppHeader";

export default class ShopsList extends Component {
    constructor(props) {
        super(props);
        this.renderCategoryBlock = this.renderCategoryBlock.bind(this);
        this.getFilterOptions = this.getFilterOptions.bind(this);
    }

    renderShop({ shopData }) {
        const { onShopClick } = this.props;
        const shopImage = shopData && shopData.shop_img && shopData.shop_img.url;
        return <div
            className="shop-list-shop-details-container"
            onClick={_ => onShopClick({ rowData: shopData })}>
            <div className={"shop-img-container"}>
                {!shopImage && <svg className="shop-list-shop-icon" viewBox="0 0 489 489">
                    <use xlinkHref="#shop-icon"/>
                </svg>}
                {shopImage &&
                <img className="shop-list-shop-img"
                     src={shopImage}/>}
            </div>
            {shopData.shop_name && <div className="shop-list-shop-name">{shopData.shop_name}</div>}
            <div className="shop-list-sub-details">{shopData && shopData.shop_number}</div>
            {shopData && shopData.shop_category_id && shopData.shop_category_id.name &&
            <div className="shop-list-sub-details">{shopData.shop_category_id.name}</div>}
            {get(shopData, 'phone_no') &&
            <div className="shop-list-sub-details">{shopData.phone_no}</div>}
            {shopData && shopData.hasOwnProperty("is_home_delivery_active") && shopData.is_home_delivery_active &&
            <div className="shop-list-sub-details">{appStringConstants.shopsListHomeDeliveryEnabledTitle}</div>}
            {shopData && shopData.hasOwnProperty("is_home_delivery_active") && !shopData.is_home_delivery_active &&
            <div className="shop-list-sub-details">{appStringConstants.shopsListPickupEnabledTitle}</div>}
        </div>
    }


    getFilterOptions() {
        const {
            onShopNameFilterSearch,
            shopNameFilterVal, onShopNameFilterValChange,
            toggleHomeDeliveryActiveFilterClick, isHomeDeliveryActiveFilter,
        } = this.props;
        const finalFilterOptions = [];
        if (useAdminLocationForDelivery) {
            finalFilterOptions.push({
                value: isHomeDeliveryActiveFilter,
                label: appStringConstants.filterByHomeDeliveryActiveLabel,
                type: fieldTypes.checkbox,
                onClick: toggleHomeDeliveryActiveFilterClick
            })
        }
        finalFilterOptions.push({
            value: shopNameFilterVal,
            placeholder: appStringConstants.nameFieldPlaceholder,
            label: appStringConstants.filterByShopNameLabel,
            type: fieldTypes.string,
            onClick: onShopNameFilterSearch,
            onChange: onShopNameFilterValChange
        });
        return finalFilterOptions
    }

    renderCategoryBlock({ category, isActive = false }) {
        const { onCategoryClick } = this.props;
        return <div onClick={_ => onCategoryClick(category._id)}
                    className={`shop-list-category ${isActive ? 'active' : ''}`}>{category.name}</div>
    }

    renderShopCategories() {
        const { shopCategoriesList, activeShopCategory } = this.props;
        if (shopCategoriesList) {
            return <div className="category-container">
                {this.renderCategoryBlock({
                    isActive: activeShopCategory === undefined,
                    category: { name: appStringConstants.dropDownFirstOption }
                })}
                {shopCategoriesList.map(category => this.renderCategoryBlock({
                    isActive: activeShopCategory === category._id,
                    category
                }))}
            </div>
        }
        return null;
    }

    render() {
        const {
            shopsList, loadMore, isLoadingMore, isLoading, sortByDistance, sortByShopName,
            onSortByShopNameClick, onSortByDistanceClick, isDataLoading
        } = this.props;

        return <div className="shop-list-dashboard">
            <AppHeader showCompositionsButton={false} showShopNow={false}/>
            <div className="shop-list-body">
                <ShopItemFilters
                    filterOptions={this.getFilterOptions({})}
                    sortOptions={[
                        {
                            label: appStringConstants.sortByDistanceLabel,
                            isActive: sortByDistance,
                            onClick: onSortByDistanceClick
                        },
                        {
                            label: appStringConstants.sortByShopNameLabel,
                            isActive: sortByShopName,
                            onClick: onSortByShopNameClick
                        }
                    ]}
                />
                <div style={{ overflow: "auto", flex: 1, height: "100%" }} id="shop-list-container">
                    {this.renderShopCategories()}
                    {!isLoading && !isLoadingMore && shopsList && shopsList.length === 0 &&
                    <NoResultFound/>}
                    <InfiniteScroller
                        isLoading={isDataLoading}
                        scrollableTarget={'shop-list-container'}
                        loadMore={loadMore}>
                        <div className="shop-list-container">
                            {isLoading && [{}, {}, {}, {}, {}, {}, {}, {}, {}].map(shopData => this.renderShop({ shopData }))}
                            {!isLoading && shopsList && shopsList.map(shopData => this.renderShop({ shopData }))}
                        </div>
                    </InfiniteScroller>
                    {isLoadingMore &&
                    <div className="shop-list-loader-container"><Loader isCircularLoader={true}/></div>}
                </div>
            </div>
        </div>
    }
}

