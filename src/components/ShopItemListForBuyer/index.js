import React from 'react';

import './index.css'
import Button from '../AppCompLibrary/Button';
import { appButtonType, fieldTypes, maxItemsStockToBlockUser } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import InfiniteScroller from "../AppCompLibrary/InfiniteScroller";
import Table from "../AppCompLibrary/Table";
import ShopItemFilters from "../ShopItemFilters";
import AppHeader from "../../containers/AppHeader";
import { getFinalPrizeString } from "../../utils/webFunctions";

export default class ShopItemListForBuyer extends React.Component {


    render() {

        const {
            shopItemsList, onItemNameFilterSearch, itemCategoryFilterValue, itemNameFilterVal, itemCategoriesList,
            loadMore, onCategoryChange, onViewDetailsPress, onItemNameFilterValChange, onSortByPriceClick, sortByPrice,
            onSortByItemNameClick, isLoadingMore, sortByItemName, shopName, isLoading, isDataLoading,
        } = this.props;

        const fieldsList = [
            {
                width: 100,
                label: appStringConstants.nameFieldTitle,
                field: "name"
            },
            {
                width: 100,
                label: appStringConstants.priceFieldTitle,
                field: "per_item_price",
                Cell: rowVal =>
                    <div>
                        {getFinalPrizeString({ data: rowVal })}
                    </div>
            },
            // {
            //     width: 150,
            //     label: appStringConstants.itemsListImagesFieldTitle,
            //     Cell: rowVal => <div>{rowVal && rowVal.item_images && rowVal.item_images.map((imgData, imgIndex) =>
            //         <img className="shop-item-img-list-style" key={`item_img_${imgIndex}`} src={imgData.url}/>
            //     )}</div>,
            //     field: "item_images"
            // },
            {
                width: 150,
                Cell: rowVal => {

                    const outOfStock = rowVal && rowVal.maintain_stock && rowVal.maintain_stock === true && rowVal.hasOwnProperty("quantity") && rowVal.quantity < maxItemsStockToBlockUser;
                    const allowNegativeStock = rowVal && rowVal.hasOwnProperty("allow_negative_stock") && rowVal.allow_negative_stock === true;

                    return <div>
                        {!allowNegativeStock && outOfStock &&
                        <div>{appStringConstants.outOfStockNotification}</div>}
                        {!allowNegativeStock && rowVal && rowVal.maintain_stock && rowVal.maintain_stock === true && rowVal.hasOwnProperty("quantity") && rowVal.quantity >= maxItemsStockToBlockUser && rowVal.quantity < (maxItemsStockToBlockUser * 3) &&
                        <div>{appStringConstants.lessStockLeftNotification(rowVal.quantity)}</div>}
                    </div>
                }
            },
            {
                width: 100,
                Cell: rowVal => {

                    const outOfStock = rowVal && rowVal.maintain_stock && rowVal.maintain_stock === true && rowVal.hasOwnProperty("quantity") && rowVal.quantity < maxItemsStockToBlockUser;
                    const allowNegativeStock = rowVal && rowVal.hasOwnProperty("allow_negative_stock") && rowVal.allow_negative_stock === true;

                    return <Button buttonType={appButtonType.type_2}
                                   onClick={_ => onViewDetailsPress({ rowData: rowVal })}
                                   title={appStringConstants.viewItemDetailsButtonTitle}/>
                }
            }
        ];

        return <div className="shop-item-container">
            <AppHeader showCompositionsButton={false} showShopNow={false}/>
            <div className="shop-item-list-container">
                <ShopItemFilters
                    filterOptions={[
                        {
                            value: itemNameFilterVal,
                            placeholder: appStringConstants.nameFieldPlaceholder,
                            label: appStringConstants.filterByItemNameLabel,
                            type: fieldTypes.string,
                            onClick: onItemNameFilterSearch,
                            onChange: onItemNameFilterValChange
                        },
                        {
                            type: fieldTypes.dropdown,
                            dropDownLabelKey: "name",
                            dropDownValueKey: "_id",
                            dropDownOptions: itemCategoriesList,
                            onDropDownSelect: onCategoryChange,
                            inputValue: itemCategoryFilterValue,
                            activeDropDownItemIndex: itemCategoryFilterValue,
                            label: appStringConstants.itemsListCategoryFieldTitle,
                        }
                    ]}
                    sortOptions={[
                        {
                            label: appStringConstants.sortByPriceLabel,
                            isActive: sortByPrice,
                            onClick: onSortByPriceClick
                        },
                        {
                            label: appStringConstants.sortByItemNameLabel,
                            isActive: sortByItemName,
                            onClick: onSortByItemNameClick
                        }
                    ]}
                />
                <div id="shop-item-list" className="shop-items-list">
                    <InfiniteScroller
                        isLoading={isDataLoading}
                        scrollableTarget={'shop-item-list'}
                        loadMore={loadMore}>
                        <Table
                            data={[{
                                isLoadingMore,
                                isLoading,
                                title: !isLoading && `${appStringConstants.shopItemsListTitle(shopName ? shopName : appStringConstants.nameMissingLabel)}`,
                                data: shopItemsList
                            }]}
                            columns={fieldsList}
                        />
                    </InfiniteScroller>
                </div>

            </div>
        </div>


    }
}
