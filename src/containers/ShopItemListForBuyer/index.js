import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux'

import { getItemCategories } from "../../redux-store/actions/itemCategoryActions";
import {
    getShopItems,
    clearShopItems,
    updateItemFeatureSelection,
    getItemDetail, clearItemDetail, getRelatedItemFeatures
} from "../../redux-store/actions/itemActions";
import { getShopName } from "../../redux-store/actions/shopActions";
import { addItemToUserCart } from "../../redux-store/actions/cartActions";
import ShopItemListForBuyerComp from "../../components/ShopItemListForBuyer";
import AskUserLoginPopup from "../../components/ShopItemListForBuyer/AskUserLoginPopup";
import PopUp from "../../components/Popup";
import { validAppRoutes } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import { onAddToCartPress } from "../../utils/functions";
import SelectItemDetails from "../../hocComponents/SelectItemDetails";
import ShopItemsDetailsPopupsComp from "../../components/ShopItemListForBuyer/ShopItemsDetailsPopups";

class ShopItemListForBuyer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            itemBeingAddedToCart: false,
            sortByItemName: false,
            isDataLoading: false,
            itemCategoryFilterValue: appStringConstants.dropDownFirstOption,
            sortByPrice: false,
            itemNameFilterVal: '',
            isUserLoginAlertPopupActive: false,
            isAskItemQuantityPopupActive: false
        };
        this.onViewCartPress = this.onViewCartPress.bind(this);
        this.onAddToCartPress = this.onAddToCartPress.bind(this);
        this.toggleAskItemQuantityPopup = this.toggleAskItemQuantityPopup.bind(this);
        this.onLoginAlertPopupOkButtonClick = this.onLoginAlertPopupOkButtonClick.bind(this);
        this.toggleUserLoginAlertPopup = this.toggleUserLoginAlertPopup.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.onItemNameFilterSearch = this.onItemNameFilterSearch.bind(this);
        this.onSortByPriceClick = this.onSortByPriceClick.bind(this);
        this.onViewDetailsPress = this.onViewDetailsPress.bind(this);
        this.onItemNameFilterValChange = this.onItemNameFilterValChange.bind(this);
        this.getItemsList = this.getItemsList.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onSortByItemNameClick = this.onSortByItemNameClick.bind(this);

        // if got itemDetails then open popup
        const itemDetails = get(props, 'location.state.itemDetailsToBeAdded');
        if (itemDetails) {
            props.history.replace(validAppRoutes.shopItems.replace(':shopId', get(props.match, 'params.shopId')));
            setTimeout(_ => this.toggleAskItemQuantityPopup({
                itemDetails,
                quantity: get(props, 'location.state.quantity')
            }), 0)
        }

    }

    onItemNameFilterSearch() {
        this.getItemsList({});
    }

    onCategoryChange(value) {
        this.setState(_ => ({
            itemCategoryFilterValue: value.value,
        }), _ => {
            this.getItemsList({});
        })
    }

    onItemNameFilterValChange(val) {
        this.setState({
            itemNameFilterVal: val
        })
    }

    toggleUserLoginAlertPopup(props) {
        this.setState(prevState => ({
            isUserLoginAlertPopupActive: !prevState.isUserLoginAlertPopupActive,
            itemDetailsToBeAdded: get(props, 'itemDetails'),
            itemCountToBeAdded: get(props, 'quantity'),
        }))
    }

    toggleAskItemQuantityPopup(props) {
        const itemDetails = get(props, 'itemDetails');
        const quantity = get(props, 'quantity');
        const { isAskItemQuantityPopupActive } = this.state;
        this.setState(prevState => ({
            isAskItemQuantityPopupActive: !prevState.isAskItemQuantityPopupActive
        }));
        if (itemDetails) {
            if (!isAskItemQuantityPopupActive) {
                this.ItemDetailsComp = SelectItemDetails(ShopItemsDetailsPopupsComp, {
                    onViewCartPress: this.onViewCartPress,
                    quantity,
                    onAddToCartPress: data => this.onAddToCartPress({ ...data, itemDetails }),
                    itemId: itemDetails._id
                });
            }
        }
    }

    onAddToCartPress({ quantity, itemDetails, itemId, features }) {
        const { buyerDetails, userToken, match, addItemToUserCart } = this.props;
        if (get(match, 'params.shopId') && itemId) {
            this.setState({ itemBeingAddedToCart: true });
            onAddToCartPress({
                addItemToUserCart,
                buyerId: get(buyerDetails, "_id"),
                vendorId: match.params.shopId,
                quantity,
                itemId,
                userToken,
                features,
                onSuccess: _ => {
                    this.setState({ itemBeingAddedToCart: false });
                    this.toggleAskItemQuantityPopup();
                },
                callForLogin: _ => {
                    this.toggleUserLoginAlertPopup({ itemDetails, quantity });
                    this.toggleAskItemQuantityPopup();
                },
            });
        }
    }

    onViewDetailsPress({ rowData }) {
        this.toggleAskItemQuantityPopup({ itemDetails: rowData });
    }

    getItemsList({ skipCount = 0 }) {
        const { getShopItems, match } = this.props;
        const { itemNameFilterVal, itemCategoryFilterValue, sortByPrice, sortByItemName } = this.state;
        let sort = {};
        if (sortByItemName) {
            sort = { name: 1 }
        }
        if (sortByPrice) {
            sort = { per_item_price: 1 }
        }
        const getItemListFinalFilter = ({ itemNameFilterVal, itemCategoryFilterValue }) => {
            const finalFilter = {};
            if (itemNameFilterVal && itemNameFilterVal.length > 0) {
                finalFilter["name"] = { $regex: itemNameFilterVal }
            }
            if (itemCategoryFilterValue && itemCategoryFilterValue !== appStringConstants.dropDownFirstOption) {
                finalFilter["category_id._id"] = itemCategoryFilterValue;
            }
            return finalFilter
        };
        if (match && match.params && match.params.shopId && getShopItems) {
            this.setState({ isDataLoading: true });
            getShopItems({
                filter: {
                    ...getItemListFinalFilter({
                        itemNameFilterVal,
                        itemCategoryFilterValue
                    })
                },
                sort,
                shopId: match.params.shopId,
                skipCount,
                onSuccess: _ => {
                    this.setState({ isDataLoading: false });
                },
                onError: _ => {
                    this.setState({ isDataLoading: false });
                }
            })
        }
    }

    loadMore() {
        const { shopItemsListData } = this.props;
        if (shopItemsListData && shopItemsListData.data && shopItemsListData.pagination &&
            shopItemsListData.data.length < shopItemsListData.pagination.total_records) {
            this.getItemsList({ skipCount: shopItemsListData.data.length });
        }
    }

    onLoginAlertPopupOkButtonClick() {
        const { history, match } = this.props;
        const { itemDetailsToBeAdded, itemCountToBeAdded } = this.state;
        this.toggleUserLoginAlertPopup();
        history.push(validAppRoutes.login, {
            navigationDetails: {
                path: validAppRoutes.shopItems.replace(':shopId', match.params.shopId),
                itemDetailsToBeAdded,
                quantity: itemCountToBeAdded
            }
        });
    }

    componentDidMount() {
        const { getShopName, match, getItemCategories } = this.props;
        match.params && match.params.shopId && getItemCategories && getItemCategories({
            authenticateUser: false,
            vendorId: match.params.shopId
        });
        match.params && match.params.shopId && getShopName && getShopName({ shopId: match.params.shopId });
        this.getItemsList({});
    }

    componentWillUnmount() {
        const { clearShopItems } = this.props;
        clearShopItems && clearShopItems({})
    }

    onSortByPriceClick() {
        this.setState({
            sortByPrice: true,
            sortByItemName: false,
        }, _ => this.getItemsList({}));
    }

    onSortByItemNameClick() {
        this.setState({
            sortByPrice: false,
            sortByItemName: true,
        }, _ => this.getItemsList({}));

    }

    onViewCartPress({ cartId }) {
        const { history } = this.props;
        cartId && history && history.push(validAppRoutes.itemCartDetailView.replace(":cartId", cartId));
    }

    render() {

        const { shopItemsListData, itemCategoriesList, shopName, cartItemIds } = this.props;
        const {
            isUserLoginAlertPopupActive, itemNameFilterVal, sortByPrice, itemCategoryFilterValue,
            sortByItemName, isAskItemQuantityPopupActive, isDataLoading
        } = this.state;


        return <div style={{ display: "flex", overflow: "hidden", height: "100%" }}>
            <ShopItemListForBuyerComp
                isDataLoading={isDataLoading}
                itemCategoryFilterValue={itemCategoryFilterValue}
                onCategoryChange={this.onCategoryChange}
                itemCategoriesList={itemCategoriesList ? [{
                    _id: appStringConstants.dropDownFirstOption,
                    name: appStringConstants.dropDownFirstOption
                }, ...itemCategoriesList] : []}
                onViewCartPress={this.onViewCartPress}
                cartItemIds={cartItemIds}
                shopName={shopName}
                isLoading={shopItemsListData && shopItemsListData.isLoading && !shopItemsListData.data}
                isLoadingMore={shopItemsListData && shopItemsListData.isLoading && shopItemsListData.data}
                sortByItemName={sortByItemName}
                onSortByItemNameClick={this.onSortByItemNameClick}
                sortByPrice={sortByPrice}
                onSortByPriceClick={this.onSortByPriceClick}
                onItemNameFilterValChange={this.onItemNameFilterValChange}
                onItemNameFilterSearch={this.onItemNameFilterSearch}
                itemNameFilterVal={itemNameFilterVal}
                loadMore={this.loadMore}
                onViewDetailsPress={this.onViewDetailsPress}
                shopItemsList={shopItemsListData && shopItemsListData.data}
            />

            {isAskItemQuantityPopupActive && this.ItemDetailsComp &&
            <PopUp
                title={appStringConstants.itemQuantityWhileAddToCartPopupTitle}
                onClose={this.toggleAskItemQuantityPopup}
                renderScene={_ => <this.ItemDetailsComp/>}
            />}

            {isUserLoginAlertPopupActive &&
            <PopUp
                title={appStringConstants.userNotLoginAlertPopupTitle}
                onClose={this.toggleUserLoginAlertPopup}
                renderScene={_ => (<AskUserLoginPopup onOkClick={this.onLoginAlertPopupOkButtonClick}/>
                )}
            />}

        </div>


    }
}

export default connect(state => ({
    cartItemIds: state.cart.cartItemIds,
    userToken: state.users.userToken,
    relatedItemVersions: state.items.relatedItemVersions,
    shopItemsListData: state.items.shopItemsListData,
    buyerDetails: state.users.buyerDetails,
    shopName: state.shop.shopName,
    itemCategoriesList: state.itemCategories.itemCategoriesList,
    itemDetails: state.items.itemDetails,
    isAppLoading: state.users.isAppLoading,
}), {
    clearShopItems,
    getItemCategories,
    getShopName,
    getShopItems,
    getItemDetail,
    clearItemDetail,
    updateItemFeatureSelection,
    getRelatedItemFeatures,
    addItemToUserCart
})(ShopItemListForBuyer)
