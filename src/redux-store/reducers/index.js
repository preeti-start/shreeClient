import toasts from './toastReducer';
import users from './userReducers';
import items from './itemReducers';
import order from './orderReducers';
import measuringUnits from './measuringUnitsReducers';
import shopCategories from './shopCategoryReducers';
import cart from './cartsReducers';
import shop from './shopReducers';
import itemFeature from './itemFeatureReducers';
import itemCategories from './itemCategoryReducers';
import compositions from './compositionReducers';
import { combineReducers } from 'redux';

export default combineReducers({
    users,
    toasts,
    order,
    cart,
    shop,
    shopCategories,
    measuringUnits,
    itemFeature,
    itemCategories,
    items,
    compositions
})
