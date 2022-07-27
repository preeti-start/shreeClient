export default {

    appTitle: "Street Cart",
    appDescription: [
        "1.Stay home and connect with the market . you are too pretty to have to look for a parking spot :)",
        "2.Stay home and connect with the market . you are too pretty to have to look for a parking spot :)",
        "3.Stay home and connect with the market . you are too pretty to have to look for a parking spot :)"
    ],

    usersListPhoneNumberFieldTitle: "Phone Number",
    buyersListPhoneNumberFieldTitle: "Phone Number",
    buyersListProfileImageFieldTitle: "Profile Image",

    // ----------------------------- cart strings ----------------------------- //

    cartListVendorNameFieldTitle: "Vendor",
    cartListBuyerNameFieldTitle: "Buyer",
    cartListTotalItemsAmountFieldTitle: "Total Item's Amount",
    cartListDeliveryAmountFieldTitle: "Delivery Amount",
    cartListItemsFieldTitle: "Items",
    placeOrderButtonTitle: "Place Order",
    itemSuccessfullyAddedToCartSuccessAlter: "Item successfully added to cart",
    itemRemoveFromCartConfirmationPopUpText: "Are you sure you want to remove this item ?",
    itemRemoveFromCartConfirmationPopUpTitle: "Remove Item",
    itemTotalPriceStringOnItemListAndDetailView: (itemPrice, currencySymbol) => `Total - ${currencySymbol} ${itemPrice}`,
    itemPerUnitPriceStringOnItemListAndDetailView: (itemPrice, itemBaseUnit, currencySymbol) => `${currencySymbol} ${itemPrice} / ${itemBaseUnit}`,
    itemPriceDiscountString: (discount) => `${discount} % Off`,

    // ----------------------------- place order strings ----------------------------- //

    addressDetailsMissingWhilePlaceOrderPopUpText: "Please select delivery address details to continue",
    addressDetailsMissingWhilePlaceOrderPopUpTitle: "Missing Address Details",
    orderStagesAddressDetailsTitle: "Address Confirmation",
    orderStagesPlaceOrderTitle: "Place Order",
    orderAmountSummaryTitle: "Order Summary",
    addNewAddressPopupTitle: "Enter new order",
    addNewAddressButtonTitle: "+ Add new address",
    orderAmountItemsString: "Items",
    orderAmountItemsAmountString: "Item's amount",
    orderAmountDeliveryAmountString: "Delivery amount",
    orderAmountTotalAmountString: "Total Amount",
    orderSuccessfullyPlacedString: "Order successfully placed",
    orderPlacementErrorString: "Sorry Order can’t be placed due to some error",

    // ----------------------------- order strings ----------------------------- //

    ordersListVendorFieldTitle: "Vendor",
    ordersListBuyerFieldTitle: "Buyer",
    ordersListTotalAmountFieldTitle: "Total Amount",
    ordersListDateFieldTitle: "Date",
    ordersListTimeFieldTitle: "Time",
    ordersListOrderNumberFieldTitle: "Order ID",
    updateVendorStatusPopupTitle: "Update Status",
    ordersListStatusFieldTitle: "Status",
    ordersListOrderTypeFieldTitle: "Order Type",
    ordersListItemsFieldTitle: "Items",
    cancelOrderButtonTitle: "Cancel Order",
    confirmOrderButtonTitle: "Confirm",
    packOrderButtonTitle: "Packed",
    orderOutForDeliveryButtonTitle: "Out For Delivery",
    orderCompletedButtonTitle: "Completed",
    orderStatusUpdatePopupText: status => `Are you sure you want to update order status to ${status}`,

    // ----------------------------- home page strings ----------------------------- //
    homeScreenLoginButtonTitle: "Login",
    viewAllCategoriesButton: "View All Categories",
    viewAllShopsButton: "View All Shops",
    nearbyShopsBlockTitle: "Nearby Shops",
    categoriesBlockTitle: "Featured Categories",
    topRatedBlockTitle: "Top rated shops",
    newShopsBlockTitle: "New Shops",
    viewCompositionsButtonTitle: "View Compositions",
    goalsSectionTitle: "Our Goals",
    // ----------------------------- vendor's list strings ----------------------------- //

    markVendorActiveButtonTitle: "Mark Active",

    // ----------------------------- app Header strings ----------------------------- //

    headerAboutUsButtonTitle: "About Us",
    homeTitle: "Excellent Shops With Quality Products",
    homeSubTitle: "Shop best products from your nearby shops",//TODO:needs exact string
    shopNowButtonTitle: "Shop Now",
    compositionsButtonTitle: "Compositions",
    headerContactUsButtonTitle: "Contact Us",
    stringForLocMissingWhileServingHomeDelivery: "Please enter your location details if you support home delivery",

    // ----------------------------- left Nav strings ----------------------------- //

    shopsMenuTitle: "Home",
    profileMenuTitle: "Profile",
    usersListMenuTitle: "Users",
    vendorsListMenuTitle: "Vendors",
    buyersListMenuTitle: "Buyers",
    ordersListMenuTitle: "Active Orders",
    orderHistoryListMenuTitle: "Order History",
    cartListMenuTitle: "Cart",
    measuringUnitsMenuTitle: "Measuring Units",
    shopCategoriesMenuTitle: "Shop Categories",
    logoutMenuTitle: "Logout",
    itemsMenuTitle: "Items",
    itemCategoriesMenuTitle: "Item Categories",

    // ----------------------------- shop category page strings ----------------------------- //

    updateShopCategoryPopupTitle: "Update Shop Category",
    addShopCategoryPopupTitle: "Enter Shop Category Details",
    delShopCategoryPopupTitle: "Remove Shop Category",
    delShopCategoryPopupText: "Are you sure that you want to remove this shop category ?",

    // ----------------------------- about us page strings ----------------------------- //


    // ----------------------------- contact us page strings ----------------------------- //

    contactUsPageButtonClick: "Contact Us",
    contactUsPageEmailIdInputPlaceholder: "Email Id",
    contactUsPageMsgInputPlaceholder: "Message",
    contactUsFormTitle: "Enter Details",


    // ----------------------------- measuring unit page strings ----------------------------- //

    addMeasuringUnitPopupTitle: "Enter Measuring Unit Details",
    addMeasuringUnitShortNameFieldPlaceHolder: "Short Name",
    measuringUnitShortNameFieldTitle: "Short Name",
    delMeasuringUnitPopupTitle: "Remove Measuring Unit",
    delMeasuringUnitPopupText: "Are you sure that you want to remove this measuring unit ?",
    updateMeasuringUnitPageTitle: "Update Measuring Unit",

    // ----------------------------- login page strings ----------------------------- //

    loginPageLoginButtonTitle: "Login",
    loginPagePhoneNumberBoxPlaceholder: "Enter Phone Number",
    loginPagePasswordBoxPlaceholder: "Enter Password",

    // ----------------------------- item's page strings ----------------------------- //


    itemsPageTitle: "Items",
    updateItemStatusButtonTitle: "Update Status",
    updateItemStatusPopupTitle: "Select Status",
    updateItemStatusFieldTitle: "Status",
    addItemButtonTitle: "Add Item",
    outOfStockNotification: "Out of stock",
    lessStockLeftNotification: quantity => `Hurry ${quantity} item's left`,
    viewItemDetailsButtonTitle: "View Details",
    viewCartButtonTitle: "View Cart",
    addItemToCartButtonTitle: "Add To Cart",
    itemQuantityWhileAddToCartPopupTitle: "Select Item Quantity",
    userNotLoginAlertPopupTitle: "You are not login",
    userNotLoginAlertPopupDesc: "Please login as a buyer to proceed",
    itemAddEditPopupPriceFieldPlaceholder: "Per Item Price",
    itemAddEditPopupAllowNegativeStockCheckboxTitle: "Allow Negative Stock",
    itemAddEditPopupIsActiveCheckboxTitle: "Is Active",
    itemAddEditPopupMaintainStockCheckboxTitle: "Maintain Stock",
    itemAddEditPopupDiscountFieldTitle: "Discount",
    itemAddEditPopupQuantityFieldTitle: "Quantity",
    itemAddEditPopupMeasuringUnitFieldLabel: "Measuring Unit",
    delItemPopupContent: "Are you sure you want to delete this item ?",
    bulkUploadPopupTitle: "Bulk upload",
    bulkUploadFileFieldPlaceholder: "Upload Item File",
    bulkUploadUploadButtonClick: "Upload",
    bulkUploadItemSampleFileDownloadTitle: "Download Sample File",
    uploadBulkButtonTitle: "Upload in bulk",
    uploadItemStatusPopupTitle: "Upload item Status",
    addEditItemPopupTitle: "Add/Update Item",
    itemsListDiscountFieldTitle: "Discount",
    itemsListPriceFieldTitle: "Per Item Prize",
    itemsListIsActiveFieldTitle: "Is Active",
    itemsListMeasuringUnitFieldTitle: "Measuring Unit",
    itemsListImagesFieldTitle: "Item Images",
    itemsListVendorFieldTitle: "Vendor",
    itemsListCategoryFieldTitle: "Category",
    sortByPriceLabel: "Price",
    sortByItemNameLabel: "Item Name",
    filterByItemNameLabel: "Item Name",
    shopItemsListTitle: shopName => `${shopName}'s Items`,

    // ----------------------------- vendor's/shop's page strings ----------------------------- //

    vendorProfileShopNameFieldPlaceholder: "Shop Name",
    vendorListIsAuthorizedFieldTitle: "Is Authorized",
    vendorListIsActiveFieldTitle: "Is Active",
    shopIsRecommendedFieldTitle: "Recommend",
    shopListShopCategoryFieldTitle: "Shop Category",
    vendorListIsHomeDeliveryActiveFieldTitle: "Is Home Delivery Active",
    vendorProfileImagePlaceholder: "Profile Image",
    shopImagePlaceholder: "Shop Image",
    vendorProfileShopCategoryFieldTitle: "Shop Category",
    vendorProfileIsActiveFieldTitle: "Is Active",
    vendorProfileIsHomeDeliveryActiveFieldTitle: "Is Home Delivery Active",
    vendorProfileDeliveryAmtSlabsTitle: "Delivery Charges",
    vendorProfileAddNewDeliveryAmtSlab: "Add Charges",
    vendorProfileDeliveryAmtSlabFromDistance: "From Distance",
    vendorProfileDeliveryAmtSlabToDistance: "To Distance",
    vendorProfileDeliveryAmtSlabMinOrderAmount: "Min Order Amount",
    vendorProfileDeliveryAmtSlabDeliveryAmount: "Delivery Amount",
    vendorsListPhoneNumberFieldTitle: "Phone Number",
    vendorsListProfileImgFieldTitle: "Profile Image",
    shopsListPickupEnabledTitle: "Pickup",
    shopNameFieldTitle: "Shop Name",
    shopNumberFieldTitle: "Shop Number",
    shopsListHomeDeliveryEnabledTitle: "Home Delivery",

    // ----------------------------- item category strings ----------------------------- //

    itemCategoryPageTitle: "Item Categories",
    categoryImgTitle: "Category Image",
    itemCategoryFieldTitle: "Item Category",
    updateItemCategoryPageTitle: "Update Item Categories",
    itemCategoryListVendorFieldTitle: "Vendor",
    addItemCategoryPopupTitle: "Enter Category Name",
    delItemCategoryPopupTitle: "Remove Item Category",
    delItemCategoryPopupText: "Are you sure that you want to remove this item category ?",

    // ----------------------------- shops list page strings ----------------------------- //
    filterByShopNameLabel: "Shop Name",
    sortByShopNameLabel: "Shop Name",
    filterByHomeDeliveryActiveLabel: "Home Delivery Active",
    sortByDistanceLabel: "Distance",
    buyerLocationMissingPopupTitle: "Location Details Empty",
    buyerLocationMissingPopupText: "Please enter your location details",

    // ----------------------------- composition strings ----------------------------- //
    createCompositionTitle: title => `Create Your Outfit - ${title}`,
    // ----------------------------- common strings ----------------------------- //

    removeItemsPopupTitle: "Remove items",
    invalidAddressAlert: 'Address is not valid',
    updatePopupTitle: "Update Details",
    removeItemsPopupDescription: "Are you sure you want to delete all these items ?",
    selectOptionsPopupTitle: fieldTitle => `Select ${fieldTitle}`,
    formFieldMandatoryError: fieldName => `${fieldName} is Mandatory`,
    dropDownGenericPlaceholder: "Select",
    dropDownFirstOption: "All",
    nameMissingLabel: "Unknown",
    noResultFoundLabel: "No Result Found",
    sortByButtonLabel: "Sort By",
    clearButtonTitle: "Clear",
    clearFiltersButtonTitle: "Clear Filters",
    filterApplyButtonTitle: "Apply",
    filtersTitle: "Filters",
    nameFieldTitle: "Name",
    descFieldTitle: "Description",
    priceFieldTitle: "Price",
    itemNotAvailableTitle: "Not available right now",
    nameFieldPlaceholder: "Name",
    amountFieldPlaceholder: "Amount",
    fileFieldPlaceholder: "Upload File",
    imageFieldPlaceholder: "Upload Image",
    locationFieldPlaceholder: "Location",
    addNewListItemButtonText: "Add New",
    addButtonTitle: "Add",
    cancelButtonTitle: "Cancel",
    okButtonTitle: "Ok",
    currencySymbol: "Rs",
    activeOptionLabel: "Active",
    inActiveOptionLabel: "In Active",
    removeButtonTitle: "Remove",
    updateButtonTitle: "Update",
    delButtonTitle: "Delete",
    saveButtonTitle: "Save",
    fileMaxLimitIndicationLine: count => `${count} files left`,
}
