export const getShopListFinalFilter = ({ activeShopCategory, shopNameFilterVal, isHomeDeliveryActiveFilter }) => {
    const finalFilter = {};
    if (isHomeDeliveryActiveFilter) finalFilter["is_home_delivery_active"] = isHomeDeliveryActiveFilter;
    if (activeShopCategory) finalFilter["shop_category_id"] = { _id: activeShopCategory };
    if (shopNameFilterVal && shopNameFilterVal.length > 0) {
        finalFilter["shop_name"] = { $regex: shopNameFilterVal }
    }
    return finalFilter
};