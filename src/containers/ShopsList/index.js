import React, { Component } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { getShopsList, clearShopsList } from '../../redux-store/actions/shopActions';
import { getShopCategories } from '../../redux-store/actions/shopCategoryActions';
import ShopsListComp from '../../components/ShopsList';
import LocationAlert from '../../components/ShopsList/locationAlert';
import history from "../../utils/history";
import { validAppRoutes } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import PopUp from "../../components/Popup";
import Button from "../../components/AppCompLibrary/Button";
import { getShopListFinalFilter } from "./helperFunctions";

class ShopsList extends Component {
    constructor(props) {
        super(props);
        const categoryId = get(props, 'location.state.categoryId');
        this.state = {
            activeShopCategory: categoryId,
            shopNameFilterVal: '',
            isHomeDeliveryActiveFilter: false,
            isDataLoading: false,
            sortByLat: undefined,
            sortByLng: undefined,
            sortByDistance: false,
            sortByShopName: false,
            isLocationAlertActive: false,
        };
        this.loadMore = this.loadMore.bind(this);
        this.onCategoryClick = this.onCategoryClick.bind(this);
        this.onShopNameFilterSearch = this.onShopNameFilterSearch.bind(this);
        this.onLocationAlertOkClick = this.onLocationAlertOkClick.bind(this);
        this.onSortByDistanceClick = this.onSortByDistanceClick.bind(this);
        this.onSortByShopNameClick = this.onSortByShopNameClick.bind(this);
        this.getAllShopsData = this.getAllShopsData.bind(this);
        this.onShopClick = this.onShopClick.bind(this);
        this.toggleLocationAlert = this.toggleLocationAlert.bind(this);
        this.toggleHomeDeliveryActiveFilterClick = this.toggleHomeDeliveryActiveFilterClick.bind(this);
        this.onShopNameFilterValChange = this.onShopNameFilterValChange.bind(this);

        if (categoryId) {
            // this has been done to remove categoryId from current url instance
            props.history.replace(validAppRoutes.shopsList);
        }

    }

    onShopNameFilterValChange(val) {
        this.setState({
            shopNameFilterVal: val
        })
    }

    toggleHomeDeliveryActiveFilterClick() {
        this.getAllShopsData();
        this.setState(prevState => ({ isHomeDeliveryActiveFilter: !prevState.isHomeDeliveryActiveFilter }))
    }

    loadMore() {
        const { shopsListData } = this.props;
        if (shopsListData && shopsListData.data && shopsListData.pagination && shopsListData.data.length < shopsListData.pagination.total_records) {
            this.getAllShopsData({ skipCount: shopsListData.data.length });
        }
    }

    getAllShopsData(prop) {

        const { getShopsList } = this.props;
        const {
            shopNameFilterVal, activeShopCategory, sortByShopName, sortByDistance,
            sortByLat, sortByLng, isHomeDeliveryActiveFilter
        } = this.state;
        const filters = getShopListFinalFilter({
            activeShopCategory,
            shopNameFilterVal,
            isHomeDeliveryActiveFilter
        });
        this.setState({ isDataLoading: true });
        getShopsList({
            skipCount: get(prop, 'skipCount', 0),
            filters,
            sortByShopName,
            sortByDistance,
            lat: sortByLat,
            lng: sortByLng,
            onSuccess: _ => {
                this.setState({ isDataLoading: false });
            },
            onError: _ => {
                this.setState({ isDataLoading: false });
            }
        });
    }

    componentWillUnmount() {
        const { clearShopsList } = this.props;
        clearShopsList();
    }

    componentDidMount() {
        const { getShopCategories } = this.props;
        getShopCategories({ authenticateUser: false });
        this.getAllShopsData()
    }

    onShopClick({ rowData }) {
        rowData && rowData._id && history.push(validAppRoutes.shopItems.replace(':shopId', rowData._id));
    }

    onSortByShopNameClick() {
        this.setState({
            sortByDistance: false,
            sortByLat: undefined,
            sortByLng: undefined,
            sortByShopName: true,
        }, this.getAllShopsData);
    }

    toggleLocationAlert() {
        this.setState(prevState => ({ isLocationAlertActive: !prevState.isLocationAlertActive }))
    }

    onSortByDistanceClick() {
        const { buyerDetails } = this.props;
        // todo : recheck this logic as buyer location is now array
        if (get(buyerDetails, `location.0.coordinates`)) {
            const buyerAddress = get(buyerDetails, `location.0.coordinates`);
            this.setState({
                sortByDistance: true,
                sortByLng: buyerAddress[0],
                sortByLat: buyerAddress[1],
                sortByShopName: false,
            }, _ => this.getAllShopsData({}));
        } else {
            this.toggleLocationAlert();
        }
    }

    onLocationAlertOkClick() {
        const { userDetails } = this.props;
        this.toggleLocationAlert();
        userDetails && userDetails._id && history.push(validAppRoutes.buyerProfile.replace(":userId", userDetails._id))
    }


    onShopNameFilterSearch() {
        this.getAllShopsData()
    }

    onCategoryClick(categoryId) {
        this.setState({ activeShopCategory: categoryId }, this.getAllShopsData)
    }

    render() {

        const {
            sortByDistance, shopNameFilterVal, isLocationAlertActive,
            isHomeDeliveryActiveFilter, sortByShopName, isDataLoading, activeShopCategory
        } = this.state;
        const { shopsListData, shopCategoriesList } = this.props;

        return <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
            {isLocationAlertActive &&
            <PopUp
                title={appStringConstants.buyerLocationMissingPopupTitle}
                onClose={this.toggleLocationAlert}
                footerActions={_ => <Button onClick={this.onLocationAlertOkClick}
                                            title={appStringConstants.okButtonTitle}/>}
                renderScene={_ => <LocationAlert/>}
            />}
            <ShopsListComp
                onCategoryClick={this.onCategoryClick}
                shopCategoriesList={shopCategoriesList}
                isDataLoading={isDataLoading}
                activeShopCategory={activeShopCategory}
                loadMore={this.loadMore}
                isLoading={shopsListData && shopsListData.isLoading && !shopsListData.data}
                isLoadingMore={shopsListData && shopsListData.isLoading && shopsListData.data}
                onShopNameFilterSearch={this.onShopNameFilterSearch}
                onShopNameFilterValChange={this.onShopNameFilterValChange}
                shopNameFilterVal={shopNameFilterVal}
                isHomeDeliveryActiveFilter={isHomeDeliveryActiveFilter}
                toggleHomeDeliveryActiveFilterClick={this.toggleHomeDeliveryActiveFilterClick}
                sortByShopName={sortByShopName}
                sortByDistance={sortByDistance}
                onSortByDistanceClick={this.onSortByDistanceClick}
                onSortByShopNameClick={this.onSortByShopNameClick}
                onShopClick={this.onShopClick}
                shopsList={shopsListData && shopsListData.data}
            />
        </div>
    }
}

export default connect((state = {}, ownProps = {}) => ({
    shopsListData: state.shop.shopsListData,
    userDetails: state.users.userDetails,
    buyerDetails: state.users.buyerDetails,
    shopCategoriesList: state.shopCategories.shopCategoriesList,
}), { getShopsList, clearShopsList, getShopCategories })(ShopsList)