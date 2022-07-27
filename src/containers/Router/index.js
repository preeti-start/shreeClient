import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProtectedRoute from './ProtectedRoutes'
import PublicRoute from './PublicRoutes'
import { validAppRoutes } from '../../constants'
import { Switch, Route } from 'react-router-dom';
import VendorProfile from '../VendorProfile';
import Login from '../Login';
import Compositions from '../Compositions';
import CompCartDetails from '../CompCartDetails';
import SVGIcons from '../../SVGIcons';
import ContactUs from '../ContactUs';
import AboutUs from '../AboutUs';
import Loader from '../../components/Loaders';
import history from '../../utils/history'
import { Router } from 'react-router-dom';
import CartDetails from "../CartDetails";
import CreateComposition from "../CreateComposition";
import BuyersList from "../BuyersList";
import VendorsList from "../VendorsList";
import ActiveOrders from "../ActiveOrders";
import OrderHistory from "../OrderHistory";
import ItemCarts from "../ItemCarts";
import CompCarts from "../CompCarts";
import BuyerProfile from "../BuyerProfile";
import ItemCategories from "../ItemCategories";
import ShopsList from "../ShopsList";
import Home from "../Home";
import Items from "../Items";
import ShopItemListForBuyer from "../ShopItemListForBuyer";
import ShopCategories from "../ShopCategories";
import PageNotFound from "../../components/NotFound";
import MeasuringUnits from "../MeasuringUnits";
import PlaceOrderView from "../PlaceOrderView";
import Toast from "../../components/Toast";
import {
    getUserDetails,
} from "../../redux-store/actions/userActions";
import { removeToasts } from "../../redux-store/actions/toastActions";
import { getItemFromPersistentStore } from "../../utils/Persist";


class AppRouter extends Component {
    renderToasts() {
        const { toasts, removeToasts } = this.props;
        if (toasts && toasts.length > 0) {
            return <div>{toasts.map(toast_data => (
                <Toast
                    {...toast_data}
                    key={toast_data.id}
                    removeToasts={removeToasts}
                />
            ))}</div>;
        }
        return null;
    }

    componentDidMount() {
        const { getUserDetails } = this.props;
        const userDetails = getItemFromPersistentStore('user');
        userDetails && userDetails._id && getUserDetails && getUserDetails({
            userToken: userDetails.token,
            userId: userDetails._id,
            history,
        });
    }

    render() {
        return (
            <Router history={history}>
                <div className="appContainer">
                    <SVGIcons/>
                    {this.props.isAppLoading && this.props.isAppLoading === true && <Loader/>}
                    {this.renderToasts()}
                    <Switch>
                        <PublicRoute exact path={"/"} component={Home}/>
                        <PublicRoute path={validAppRoutes.login} component={Login}/>
                        <PublicRoute path={validAppRoutes.contactUs} component={ContactUs}/>
                        <PublicRoute path={validAppRoutes.aboutUs} component={AboutUs}/>
                        <PublicRoute exact path={validAppRoutes.compositions} component={Compositions}/>
                        <PublicRoute path={validAppRoutes.shopsList} component={ShopsList}/>
                        <PublicRoute path={validAppRoutes.shopItems} component={ShopItemListForBuyer}/>
                        <ProtectedRoute exact path={validAppRoutes.createComposition} component={CreateComposition}/>
                        <ProtectedRoute exact path={validAppRoutes.buyerPlaceOrderView} component={PlaceOrderView}/>
                        <ProtectedRoute exact path={validAppRoutes.buyersList} component={BuyersList}/>
                        <ProtectedRoute exact path={validAppRoutes.vendorsList} component={VendorsList}/>
                        <ProtectedRoute exact path={validAppRoutes.ordersList} component={ActiveOrders}/>
                        <ProtectedRoute exact path={validAppRoutes.orderHistoryList} component={OrderHistory}/>
                        <ProtectedRoute exact path={validAppRoutes.itemCartDetailView} component={CartDetails}/>
                        <ProtectedRoute exact path={validAppRoutes.compCartDetailView} component={CompCartDetails}/>
                        <ProtectedRoute exact path={validAppRoutes.itemCartList} component={ItemCarts}/>
                        <ProtectedRoute exact path={validAppRoutes.compCartList} component={CompCarts}/>
                        <ProtectedRoute exact path={validAppRoutes.buyerProfile} component={BuyerProfile}/>
                        <ProtectedRoute exact path={validAppRoutes.vendorProfile} component={VendorProfile}/>
                        <ProtectedRoute exact path={validAppRoutes.measuringUnit} component={MeasuringUnits}/>
                        <ProtectedRoute exact path={validAppRoutes.shopCategories} component={ShopCategories}/>
                        <ProtectedRoute exact path={validAppRoutes.itemCategories} component={ItemCategories}/>
                        <ProtectedRoute exact path={validAppRoutes.items} component={Items}/>
                        <Route component={PageNotFound} path="*"/>
                    </Switch>
                </div>
            </Router>

        );
    }
}

export default connect(state => ({
    'isAppLoading': state.users && state.users.isAppLoading,
    'toasts': state.toasts,
}), { removeToasts, getUserDetails })(AppRouter);
