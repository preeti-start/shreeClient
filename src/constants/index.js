import appStringConstants from "./appStringConstants";
import React from "react";

export const dbnames = {
    "Users": "Users",
    "Buyers": "Buyers",
    "Vendors": "Vendors",
    "Items": "Items",
    "MeasuringUnits": "MeasuringUnits",
    "ShopCategories": "ShopCategories",
    "ItemCategories": "ItemCategories",
    "ItemFeatures": "ItemFeatures",
    "Compositions": "Compositions",
    "ItemsCart": "ItemsCart",
    "CompCart": "CompCart",
    "Orders": "Orders",
};

export const useAdminLocationForDelivery = false;
export const defaultValForSortAndFilters = {
    searchByName: '',
    searchFilters: {},
    sortByVal: { _id: -1 },
};

export const maxItemsStockToBlockUser = 5;
export const AWSImageBuckets = {
    "shop_categories": 'shopCategories',
    "vendor_profile": 'vendors',
    "buyer_profile": 'buyers',
    "item_images": 'items',
    "shop_images": 'shops',
};
export const sortingOption = 1;
export const placeOrderStages = [
    "address_details",
    "amount_details",
];
export const validAppRoutes = {
    "home": "/",
    "login": "/login",
    "usersList": "/user",
    "measuringUnit": "/admin/:userId/measuring_units",
    "shopCategories": "/admin/:userId/shopCategories",
    "contactUs": "/contact-us",
    "aboutUs": "/about-us",
    "buyersList": "/buyer",
    "buyerProfile": "/buyer/:userId/home",
    "buyerPlaceOrderView": "/placeOrder/:cartId",
    "itemCartDetailView": "/itemCart/:cartId",
    "compCartDetailView": "/compCart/:cartId",
    "shopsList": "/shops",
    "createComposition": "/compositions/:compId",
    "compositions": "/compositions",
    "shopItems": "/shop/:shopId/items",
    // "shopItemDetailViewForBuyer": "/buyer/:userId/shop/:shopId/item/:itemId",
    // "cartListForBuyers": "/buyer/:userId/cart",
    // "cartDetailsViewForBuyer": "/buyer/:userId/cart/:cartId",
    "vendorsList": "/vendor",
    "ordersList": "/orders",
    "orderHistoryList": "/order_history",
    "itemCartList": "/itemCart",
    "compCartList": "/compCart",
    "vendorProfile": "/vendor/:userId/home",
    "itemCategories": "/:userId/item_categories",
    "items": "/:userId/items",
};

export const orderTypes = {
    'pick_up': "Pick Up",
    "home_delivery": "Home Delivery",
};
export const orderStatus = {
    'new': 'New',
    'confirmed': 'Confirmed',
    'packed': 'Packed',
    'out_for_delivery': 'Out For Delivery',
    'completed': 'Completed',
    'canceled': 'Canceled',
};
export const completedOrderStatus = [orderStatus.completed, orderStatus.canceled];

export const itemStatus = {
    active: { _id: "active", name: "Active" },
    in_active: {
        _id: "in_active",
        name: "InActive"
    }
};

export const fieldTypes = {
    default: "string",
    string: "string",
    number: "number",
    location: "location",
    fk: "fk",
    boolean: "boolean",
    date: "date",
    image: "image",
    file: "file",
    textarea: "textarea",
    password: "password",
    dropdown: "dropdown",
    checkbox: "checkbox",
    object: "object",
};

export const roles = {
    "admin": "admin",
    "buyer": "buyer",
    "vendor": "vendor",
};


export const buttonTypes = {
    primary: "primary",
    secondary: "secondary",
    inactive: "inactive",
};
export const appLoadingTypes = {
    fullAppLoading: "fullAppLoading",
    specificComponentLoading: "specificComponentLoading",
};

export const actionsOnImage = { "del": "del", "insert": "insert" };


export const appRoutes = {
    'AppRoutes': {
        route: 'AppRoutes',
        childRoutes: {
            'Login': {
                route: 'Login',
                childRoutes: {
                    'OTPRegistrationForm': {
                        route: 'OTPRegistrationForm'
                    },
                    'SignupForm': {
                        route: 'SignupForm'
                    },
                    'PhoneNoRegistration': {
                        route: 'PhoneNoRegistration'
                    }
                }
            },
            'Home': {
                route: 'AppHomeView',
                childRoutes: {
                    'Home': {
                        route: 'AppHomeView'
                    },
                    'ShopsListView': {
                        route: 'AppShopsListView'
                    },
                    'ItemsListView': {
                        route: 'AppItemsListView'
                    },
                    'ItemDetailView': {
                        route: 'AppItemDetailView'
                    }
                }
            },
            'AboutUs': {
                route: 'AppAboutUs'
            },
            'ContactUs': {
                route: 'AppContactUs'
            },

        }
    },
    'BuyerRoutes': {
        route: 'BuyerRoutes',
        childRoutes: {
            'Home': {
                route: 'BuyerHome',
                childRoutes: {
                    'Home': {
                        route: 'BuyerHomeView'
                    },
                    'ShopsListView': {
                        route: 'BuyerShopsListView'
                    },
                    'ItemsListView': {
                        route: 'BuyerItemsListView'
                    },
                    'ItemDetailView': {
                        route: 'BuyerItemDetailView'
                    }
                }
            },
            'Profile': {
                route: 'BuyerProfile'
            },
            'BuyerCartRoutes': {
                route: 'BuyerCartRoutes',
                childRoutes: {
                    'CartList': { route: "CartList" },
                    'PlaceOrderView': { route: "PlaceOrderView" },
                    'CartDetailView': { route: "CartDetailView" },
                }
            },
            'BuyerActiveOrders': {
                route: "BuyerActiveOrders",
                childRoutes: {
                    'BuyerActiveOrdersList': { route: "BuyerActiveOrdersList" },
                    'BuyerActiveOrdersDetailView': { route: "BuyerActiveOrdersDetailView" },
                }
            },
            'BuyersOrderHistory': { route: "BuyersOrderHistory" }
        }
    },
    'VendorRoutes': {
        route: 'VendorRoutes',
        childRoutes: {
            'Home': {
                route: 'VendorHome'
            },
            'Profile': {
                route: 'VendorProfile'
            },
            'VendorItems': {
                route: 'VendorItems',
                childRoutes: {
                    "VendorItemsList": {
                        route: "VendorItemsList"
                    },
                    "VendorItemsInsertForm": {
                        route: "VendorItemsInsertForm"
                    },
                }
            },
            'VendorItemCategories': {
                route: 'VendorItemCategories'
            },
            'VendorItemFeatures': {
                route: 'VendorItemFeatures'
            },
            'VendorActiveOrders': {
                route: "VendorActiveOrders",
                childRoutes: {
                    'VendorActiveOrdersList': { route: "VendorActiveOrdersList" },
                    'VendorActiveOrdersDetailView': { route: "VendorActiveOrdersDetailView" },
                }
            },
            'VendorsOrderHistory': { route: "VendorsOrderHistory" }
        }
    }
};


export const serverURL = "http://192.168.1.85:3002"; //sahil
// export const serverURL = "http://192.168.60.213:3002";
// export const serverURL = "http://ec2-13-127-130-99.ap-south-1.compute.amazonaws.com:3002";

export const meridians = ['AM', 'PM'];

export const timesArray = [
    { key: '0:00', label: `12 ${meridians[0]}` },
    { key: '0:30', label: `12:30 ${meridians[0]}` },
    { key: '1:00', label: `1 ${meridians[0]}` },
    { key: '1:30', label: `1:30 ${meridians[0]}` },
    { key: '2:00', label: `2 ${meridians[0]}` },
    { key: '2:30', label: `2:30 ${meridians[0]}` },
    { key: '3:00', label: `3 ${meridians[0]}` },
    { key: '3:30', label: `3:30 ${meridians[0]}` },
    { key: '4:00', label: `4 ${meridians[0]}` },
    { key: '4:30', label: `4:30 ${meridians[0]}` },
    { key: '5:00', label: `5 ${meridians[0]}` },
    { key: '5:30', label: `5:30 ${meridians[0]}` },
    { key: '6:00', label: `6 ${meridians[0]}` },
    { key: '6:30', label: `6:30 ${meridians[0]}` },
    { key: '7:00', label: `7 ${meridians[0]}` },
    { key: '7:30', label: `7:30 ${meridians[0]}` },
    { key: '8:00', label: `8 ${meridians[0]}` },
    { key: '8:30', label: `8:30 ${meridians[0]}` },
    { key: '9:00', label: `9 ${meridians[0]}` },
    { key: '9:30', label: `9:30 ${meridians[0]}` },
    { key: '10:00', label: `10 ${meridians[0]}` },
    { key: '10:30', label: `10:30 ${meridians[0]}` },
    { key: '11:00', label: `11 ${meridians[0]}` },
    { key: '11:30', label: `11:30 ${meridians[0]}` },
    { key: '12:00', label: `12 ${meridians[1]}` },
    { key: '12:30', label: `12:30 ${meridians[1]}` },
    { key: '13:00', label: `1 ${meridians[1]}` },
    { key: '13:30', label: `1:30 ${meridians[1]}` },
    { key: '14:00', label: `2 ${meridians[1]}` },
    { key: '14:30', label: `2:30 ${meridians[1]}` },
    { key: '15:00', label: `3 ${meridians[1]}` },
    { key: '15:30', label: `3:30 ${meridians[1]}` },
    { key: '16:00', label: `4 ${meridians[1]}` },
    { key: '16:30', label: `4:30 ${meridians[1]}` },
    { key: '17:00', label: `5 ${meridians[1]}` },
    { key: '17:30', label: `5:30 ${meridians[1]}` },
    { key: '18:00', label: `6 ${meridians[1]}` },
    { key: '18:30', label: `6:30 ${meridians[1]}` },
    { key: '19:00', label: `7 ${meridians[1]}` },
    { key: '19:30', label: `7:30 ${meridians[1]}` },
    { key: '20:00', label: `8 ${meridians[1]}` },
    { key: '20:30', label: `8:30 ${meridians[1]}` },
    { key: '21:00', label: `9 ${meridians[1]}` },
    { key: '21:30', label: `9:30 ${meridians[1]}` },
    { key: '22:00', label: `10 ${meridians[1]}` },
    { key: '22:30', label: `10:30 ${meridians[1]}` },
    { key: '23:00', label: `11 ${meridians[1]}` },
    { key: '23:30', label: `11:30 ${meridians[1]}` },
];

export const defaultPageCount = 10;
export const maxItemImageCount = 3;
export const itemsRequiredList = {
    "name": 1,
    "discount": 1,
    "set_count": 1,
    "item_code": 1,
    "description": 1,
    "category_id._id": 1,
    "category_id.name": 1,
    "measuring_unit_id._id": 1,
    "measuring_unit_id.short_name": 1,
    "measuring_unit_id.name": 1,
    "vendor_id._id": 1,
    "vendor_id.name": 1,
    "vendor_id.shop_name": 1,
    "item_images": 1,
    "per_item_price": 1,
    "is_active": 1,
    "item_features.feature_id._id": 1,
    "item_features.feature_id.name": 1,
    "item_features.options": 1,
};
export const appButtonType = {
    'type_1': 'GREEN',
    'type_2': 'WHITE',
    'type_3': 'RED',
    'type_4': 'RED_BORDERED',
    'type_5': 'GREEN_BORDERED',
};

export const DIRECTION_LTR = 'ltr';

export const TOOLTIP_DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right',
    TOP: 'top',
    BOTTOM: 'bottom',
};


export const notificationStatus = {
    '1': 'success',//green
    '2': 'error',//red
    '3': 'warning',//yellow
    '4': 'info',//blue
};
export const quantitySelectorAlignments = {
    'vertical': 'Vertical',
    'horizontal': 'Horizontal'
};
export const userNotifications = {
    "msgOfDocumentBuyingSuccess": "Documents has been successfully added to your bucket",
    "msgOnDocumentAddSuccess": "Document added successfully",
    "msgOnDocumentUpdateSuccess": "Document updated successfully",
    "msgOfDocumentDelSuccess": "Document deleted successfully",
    "orderStatusUpdateSuccess": "Status updated successfully",
    "msgOnProfileUpdateSuccess": "Details Successfully Updated",
    "msgOnShopStatusUpdate": "Shop Status Updated Successfully",
    "msgOnSignUpSuccess": "Registration Successful Please Login Now",
    "otpMissingWhileLogin": "Please enter Password",
    "phoneNumberMissingWhileLogin": "Please enter phone number",
};
export const sideMenuRoutes = [
    {
        visibleTo: [roles.admin],
        path: validAppRoutes.shopCategories,
        title: appStringConstants.shopCategoriesMenuTitle,
        icon: ({ className }) => <svg viewBox="0 0 512 512" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#shop-categories" />
        </svg>
    },
    {
        visibleTo: [roles.admin],
        path: validAppRoutes.measuringUnit,
        title: appStringConstants.measuringUnitsMenuTitle,
        icon: ({ className }) => <svg viewBox="0 0 612 612" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#measuring-units" />
        </svg>
    },
    {
        visibleTo: [roles.admin],
        path: validAppRoutes.vendorsList,
        title: appStringConstants.vendorsListMenuTitle,
        icon: ({ className }) => <svg viewBox="0 0 475 475" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#user-profile-icon" />
        </svg>
    },
    {
        visibleTo: [roles.admin],
        path: validAppRoutes.buyersList,
        title: appStringConstants.buyersListMenuTitle,
        icon: ({ className }) => <svg viewBox="0 0 475 475" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#user-profile-icon" />
        </svg>
    },
    {
        visibleTo: [roles.vendor],
        path: validAppRoutes.vendorProfile,
        title: appStringConstants.profileMenuTitle,
        icon: ({ className }) => <svg viewBox="0 0 299 299" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#user-icon" />
        </svg>
    },
    {
        visibleTo: [roles.vendor, roles.admin],
        path: validAppRoutes.itemCategories,
        title: appStringConstants.itemCategoriesMenuTitle,
        icon: ({ className }) => <svg viewBox="0 0 512 512" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#item-categories" />
        </svg>
    },
    {
        visibleTo: [roles.vendor, roles.admin],
        path: validAppRoutes.items,
        title: appStringConstants.itemsMenuTitle,
        icon: ({ className }) => <svg viewBox="0 0 512 512" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#items" />
        </svg>
    },
    {
        visibleTo: [roles.buyer],
        path: validAppRoutes.buyerProfile,
        title: appStringConstants.profileMenuTitle,
        icon: ({ className }) => <svg viewBox="0 0 299 299" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#user-icon" />
        </svg>
    },
    {
        visibleTo: [roles.buyer, roles.admin],
        path: validAppRoutes.itemCartList,
        title: appStringConstants.cartListMenuTitle,
        child_routes: [
            validAppRoutes.compCartList,
            validAppRoutes.buyerPlaceOrderView,
            validAppRoutes.compCartDetailView,
            validAppRoutes.itemCartDetailView,
        ],
        icon: ({ className }) => <svg viewBox="0 0 19.25 19.25" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#cart-icon" />
        </svg>
    },
    {
        visibleTo: [roles.vendor, roles.buyer, roles.admin],
        path: validAppRoutes.ordersList,
        title: appStringConstants.ordersListMenuTitle,
        icon: ({ className }) => <svg viewBox="0 0 512 512" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#orders-list" />
        </svg>
    },
    {
        visibleTo: [roles.vendor, roles.buyer, roles.admin],
        path: validAppRoutes.orderHistoryList,
        title: appStringConstants.orderHistoryListMenuTitle,
        icon: ({ className }) => <svg viewBox="0 0 512 512" className={`left-nav-profile-icon ${className}`}>
            <use xlinkHref="#orders-list" />
        </svg>
    },

];
