import React from 'react';
import { connect } from 'react-redux';
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { delStoreDetails } from "./utils/mobileStore";
import { createDrawerNavigator } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack'

import { getStoreDetails } from '../src/utils/mobileStore'
import {
    Home, ShopsList,
    ShopItemsListView,
    BuyerProfile,
    VendorDashboard, BuyerActiveOrdersDetailView, VendorActiveOrdersDetailView,
    VendorActiveOrdersList, BuyerActiveOrdersList, BuyersOrderHistory,
    SignupForm, VendorsOrderHistory,
    ContactUs, ItemDetailView,
    OTPRegistration, CartList, CartDetailView, PlaceOrderView, VendorItemFeaturesList,
    VendorProfile, VendorItemInsertForm, VendorItemCategoriesList, VendorItemsList,
    PhoneNoRegistration, AppSideMenu, BuyerSideMenu, VendorSideMenu, AboutUs
} from './mobileContainers';
import { SplashScreen } from './mobileComponents';
import { appRoutes, roles } from './constants';
import { getUserDetails } from '../src/redux-store/actions/userActions'

const LoginStackRoutes = createAppContainer(createStackNavigator({
    [appRoutes.AppRoutes.childRoutes.Login.childRoutes.PhoneNoRegistration.route]: {
        screen: PhoneNoRegistration,
        route: [appRoutes.AppRoutes.childRoutes.Login.childRoutes.PhoneNoRegistration.route]
    },
    [appRoutes.AppRoutes.childRoutes.Login.childRoutes.SignupForm.route]: {
        screen: SignupForm,
        route: [appRoutes.AppRoutes.childRoutes.Login.childRoutes.SignupForm.route]
    },
    [appRoutes.AppRoutes.childRoutes.Login.childRoutes.OTPRegistrationForm.route]: {
        screen: OTPRegistration,
        route: [appRoutes.AppRoutes.childRoutes.Login.childRoutes.OTPRegistrationForm.route]
    },
}, {
    headerMode: 'none'
}));


const AppHomeStackRoutes = createAppContainer(createStackNavigator({
    [appRoutes.AppRoutes.childRoutes.Home.childRoutes.Home.route]: {
        screen: Home,
        route: [appRoutes.AppRoutes.childRoutes.Home.childRoutes.Home.route]
    },
    [appRoutes.AppRoutes.childRoutes.Home.childRoutes.ShopsListView.route]: {
        screen: ShopsList,
        route: [appRoutes.AppRoutes.childRoutes.Home.childRoutes.ShopsListView.route]
    },
    [appRoutes.AppRoutes.childRoutes.Home.childRoutes.ItemsListView.route]: {
        screen: ShopItemsListView,
        route: [appRoutes.AppRoutes.childRoutes.Home.childRoutes.ItemsListView.route]
    },
    [appRoutes.AppRoutes.childRoutes.Home.childRoutes.ItemDetailView.route]: {
        screen: ItemDetailView,
        route: [appRoutes.AppRoutes.childRoutes.Home.childRoutes.ItemDetailView.route]
    },
}, {
    headerMode: 'none'
}));


const BuyerHomeStackRoutes = createAppContainer(createStackNavigator({
    [appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.Home.route]: {
        screen: Home,
        route: [appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.Home.route]
    },
    [appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ShopsListView.route]: {
        screen: ShopsList,
        route: [appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ShopsListView.route]
    },
    [appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ItemsListView.route]: {
        screen: ShopItemsListView,
        route: [appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ItemsListView.route]
    },
    [appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ItemDetailView.route]: {
        screen: ItemDetailView,
        route: [appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ItemDetailView.route]
    },
}, {
    headerMode: 'none'
}));


const BuyerCartStackRoutes = createAppContainer(createStackNavigator({
    [appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.CartList.route]: {
        screen: CartList,
        route: [appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.CartList.route]
    },
    [appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.CartDetailView.route]: {
        screen: CartDetailView,
        route: [appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.CartDetailView.route]
    },
    [appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.PlaceOrderView.route]: {
        screen: PlaceOrderView,
        route: [appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.childRoutes.PlaceOrderView.route]
    },
}, {
    headerMode: 'none'
}));

const VendorActiveOrdersStackRoutes = createAppContainer(createStackNavigator({
    [appRoutes.VendorRoutes.childRoutes.VendorActiveOrders.childRoutes.VendorActiveOrdersList.route]: {
        screen: VendorActiveOrdersList,
        route: [appRoutes.VendorRoutes.childRoutes.VendorActiveOrders.childRoutes.VendorActiveOrdersList.route]
    },
    [appRoutes.VendorRoutes.childRoutes.VendorActiveOrders.childRoutes.VendorActiveOrdersDetailView.route]: {
        screen: VendorActiveOrdersDetailView,
        route: [appRoutes.VendorRoutes.childRoutes.VendorActiveOrders.childRoutes.VendorActiveOrdersDetailView.route]
    },
}, {
    headerMode: 'none'
}));
const BuyerActiveOrdersStackRoutes = createAppContainer(createStackNavigator({
    [appRoutes.BuyerRoutes.childRoutes.BuyerActiveOrders.childRoutes.BuyerActiveOrdersList.route]: {
        screen: BuyerActiveOrdersList,
        route: [appRoutes.BuyerRoutes.childRoutes.BuyerActiveOrders.childRoutes.BuyerActiveOrdersList.route]
    },
    [appRoutes.BuyerRoutes.childRoutes.BuyerActiveOrders.childRoutes.BuyerActiveOrdersDetailView.route]: {
        screen: BuyerActiveOrdersDetailView,
        route: [appRoutes.BuyerRoutes.childRoutes.BuyerActiveOrders.childRoutes.BuyerActiveOrdersDetailView.route]
    },
}, {
    headerMode: 'none'
}));

const AppRoutes = createAppContainer(createDrawerNavigator({
    [appRoutes.AppRoutes.childRoutes.Home.route]: AppHomeStackRoutes,
    [appRoutes.AppRoutes.childRoutes.AboutUs.route]: AboutUs,
    [appRoutes.AppRoutes.childRoutes.Login.route]: LoginStackRoutes,
    [appRoutes.AppRoutes.childRoutes.ContactUs.route]: ContactUs
},
    {
        drawerType: 'front',
        drawerBackgroundColor: "transparent",
        contentComponent: AppSideMenu,
        drawerWidth: 300
    }));

const BuyerRoutes = createAppContainer(createDrawerNavigator({
    [appRoutes.BuyerRoutes.childRoutes.Home.route]: BuyerHomeStackRoutes,
    [appRoutes.BuyerRoutes.childRoutes.BuyerCartRoutes.route]: BuyerCartStackRoutes,
    [appRoutes.BuyerRoutes.childRoutes.Profile.route]: BuyerProfile,
    [appRoutes.BuyerRoutes.childRoutes.BuyersOrderHistory.route]: BuyersOrderHistory,
    [appRoutes.BuyerRoutes.childRoutes.BuyerActiveOrders.route]: BuyerActiveOrdersStackRoutes,
    [appRoutes.AppRoutes.childRoutes.ContactUs.route]: ContactUs,
    [appRoutes.AppRoutes.childRoutes.AboutUs.route]: AboutUs,
},
    {
        drawerBackgroundColor: "transparent",
        contentComponent: BuyerSideMenu,
        drawerWidth: 300
    }));


const VendorItemsListStack = createAppContainer(createStackNavigator({
    [appRoutes.VendorRoutes.childRoutes.VendorItems.childRoutes.VendorItemsList.route]: {
        screen: VendorItemsList,
        route: [appRoutes.VendorRoutes.childRoutes.VendorItems.childRoutes.VendorItemsList.route]
    },
    [appRoutes.VendorRoutes.childRoutes.VendorItems.childRoutes.VendorItemsInsertForm.route]: {
        screen: VendorItemInsertForm,
        route: [appRoutes.VendorRoutes.childRoutes.VendorItems.childRoutes.VendorItemsInsertForm.route]
    },
}, {
    headerMode: 'none'
}));

const VendorRoutes = createAppContainer(createDrawerNavigator({
    [appRoutes.VendorRoutes.childRoutes.Profile.route]: VendorProfile,
    [appRoutes.VendorRoutes.childRoutes.Home.route]: VendorDashboard,
    [appRoutes.VendorRoutes.childRoutes.VendorItems.route]: VendorItemsListStack,
    [appRoutes.AppRoutes.childRoutes.AboutUs.route]: AboutUs,
    [appRoutes.VendorRoutes.childRoutes.VendorItemFeatures.route]: VendorItemFeaturesList,
    [appRoutes.VendorRoutes.childRoutes.VendorActiveOrders.route]: VendorActiveOrdersStackRoutes,
    [appRoutes.VendorRoutes.childRoutes.VendorsOrderHistory.route]: VendorsOrderHistory,
    [appRoutes.VendorRoutes.childRoutes.VendorItemCategories.route]: VendorItemCategoriesList,
    [appRoutes.AppRoutes.childRoutes.ContactUs.route]: ContactUs,
},
    {
        drawerBackgroundColor: "transparent",
        contentComponent: VendorSideMenu,
        drawerWidth: 300
    }));
const splashScreenMilliSec = 1000;

class Router extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initialRoute: undefined
        };
        this.redirectToAppRoutes = this.redirectToAppRoutes.bind(this);
        this.setInitialRoute = this.setInitialRoute.bind(this);

    }

    setInitialRoute({ data }) {
        if (data && data.role) {
            if (data.role === roles.vendor) {
                setTimeout(_ => {
                    this.setState({ initialRoute: appRoutes.VendorRoutes.route })
                }, splashScreenMilliSec)
            } else if (data.role === roles.buyer) {
                setTimeout(_ => {
                    this.setState({ initialRoute: appRoutes.BuyerRoutes.route })
                }, splashScreenMilliSec)
            } else {
                this.redirectToAppRoutes();
            }
        } else {
            this.redirectToAppRoutes();
        }
    }

    redirectToAppRoutes() {
        setTimeout(_ => {
            this.setState({ initialRoute: appRoutes.AppRoutes.route })
        }, splashScreenMilliSec)
    }

    componentDidMount() {

        const { getUserDetails } = this.props;
        getStoreDetails('userToken').then(userToken => {
            if (userToken) {
                getStoreDetails('userDetails').then(userDetails => {
                    // alert(JSON.stringify(userDetails))
                    if (userDetails && userDetails._id && getUserDetails) {
                        getUserDetails({
                            delStoreDetails,
                            onSuccess: this.setInitialRoute,
                            userId: userDetails._id,
                            userToken,
                            onError: this.redirectToAppRoutes,
                            isMobile: true,
                        });
                    }
                    else {
                        this.redirectToAppRoutes();
                    }
                })
            } else {
                this.redirectToAppRoutes();
            }
        })

    }

    render() {

        const { initialRoute } = this.state;

        const AppContainer = createAppContainer(createSwitchNavigator({
            [appRoutes.AppRoutes.route]: AppRoutes,
            [appRoutes.VendorRoutes.route]: VendorRoutes,
            [appRoutes.BuyerRoutes.route]: BuyerRoutes,
        }, { initialRouteName: initialRoute }));


        if (initialRoute) {
            return <AppContainer />;
        }
        return <SplashScreen />;
    }
}

export default connect((state = {}, ownProps = {}) => ({}), { getUserDetails })(Router)
