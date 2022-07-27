export default {
    'appName': "Street Cart",
    'appTagLine': "Let's click and shop",
    'appFooterString': 'Version : 1',

    // ----------------------------- shop list strings ----------------------------- //

    'pickupShopTypeTitle': "Pickup Only",
    'homeDeliveryShopTypeTitle': "Home Delivery Available",

    // ----------------------------- home page strings ----------------------------- //

    'homeBuyNowButtonTitle': "Buy Now",
    'homeNearbyShopsBlockTitle': "NearBy Shops",
    'homeTopRatedShopsBlockTitle': "Top Rated",
    'homeTopRatedShopsBlockSubTitle': "Shop From Top Rated Shops",
    'homeNewArrivalsShopsBlockSubTitle': "Fresh arrivals with fresh items",
    'recommendedShopsBlockSubTitle': "New shops with top quality minimum prices items",
    'homeCategoriesBlockTitle': "Categories",
    'homeNewArrivalsBlockTitle': "New Arrivals",
    'recommendedShopsBlockTitle': "Recommended Shops",

    // ----------------------------- phone number registration page strings ----------------------------- //

    'placeholderTextForPhoneNoRegistration': "Enter Phone Number",
    'forgotPasswordActionTitle': "Forgot your Password ?",
    'phoneNumberMandatoryErrorWhileLogin': "Please Enter Valid Phone Number",
    'errorCaseIfUserOTPNotGenerated': "Something went wrong :(",
    'adminLoginErrorString': "Not a valid user",

    // ----------------------------- otp form strings ----------------------------- //

    'notifyUserToFillOtp': "Please enter Code",
    'resendOtpActionTitle': "Resend OTP ?",

    // ----------------------------- signup form strings ----------------------------- //

    'signupPageWelcomeLine': appName => `Welcome to ${appName} !!`,
    'signupFormUserRolesTabVendorTitle': "Vendor",
    'signupFormUserRolesTabBuyerTitle': "Buyer",

    // ----------------------------- order strings ----------------------------- //

    'orderPlacedSuccessMsg': "Order successfully placed",
    'shopClosedMsg': "Shop is not open, do you still want to place order ?",
    'orderPlacedFailedMsg': "Sorry Order can’t be placed due to some error",
    'orderNumberFilter': "Order Number",
    'orderStatusFilter': "Order Status",
    'orderTypeFilter': "Order Type",

    // ----------------------------- home strings ----------------------------- //

    'homePageSubTitle': "Shops",

    // ----------------------------- side menu strings ----------------------------- //

    'stringForSideMenuIfUserNameNotExistsAfterLogin': "Unknown",
    'profileMenuTitle': "Profile",
    'loginMenuTitle': "Login",
    'homeMenuTitle': "Home",
    'dashboardMenuTitle': "Dashboard",
    'ordersMenuTitle': "Orders",
    'orderHistoryMenuTitle': "Order History",
    'cartMenuTitle': "Cart",
    'aboutUsMenuTitle': "About Us",
    'contactUsMenuTitle': "Contact Us",
    'vendorItemsMenuTitle': "Items",
    'vendorItemCategoriesMenuTitle': "Item Categories",
    'vendorItemFeaturesMenuTitle': "Item Features",
    'logoutMenuTitle': "Logout",


    // ----------------------------- about us page strings ----------------------------- //

    'aboutUsPageTitle': "About Us",

    // ----------------------------- contact us page strings ----------------------------- //

    'contactUsPageTitle': "Contact Us",
    'contactUsMessageFieldTitle': "Message",
    'contactUsEmailIdFieldTitle': "Email Id",

    // ----------------------------- cart detail strings ----------------------------- //

    'orderSummaryBlockTitle': `Order Summary`,
    'cartItemDeleteConfirmation': 'Are you sure you want to delete this item ?',
    'viewCartItemMessage': ({ order_type }) => `Order type${order_type ? ` - ${order_type}` : ''}`,
    'totalItemsCostTitle': "Total Amount",
    'totalItemsCountTitle': "Total Items",
    'deliveryChargesTitle': "Total Delivery Amount",
    'totalChargesTitle': "Total Amount",
    'placeOrderButtonText': "Place Order",
    'removeItemButtonText': "Remove Item",

    // ----------------------------- dashboard strings ----------------------------- //

    'dashoardPageTitle': "Dashboard",
    'dashboardDataMissingNotifications': "Please enter active items details to start.",
    'dashoardGraphTitle': "Last 7 days Orders ( Dates )",
    'dashoardWelcomeMsg': "Welcome to the App",
    'dashoardGraphNoOrdersAvailableTitle': "No Orders Available",
    'dashoardOrderCountString': `Orders`,
    'dashboardOrderItemsQuantity': ({ quantity, unit }) => `Sale of ${quantity} ${unit}`,

    // ----------------------------- cart's strings ----------------------------- //

    'cartPageTitle': "Cart Item Details",
    'itemsCountText': count => `Item${count > 1 ? 's' : ''}`,
    'cartListViewItemsButtonText': "View Items",
    'cartItemMissingText': "Not available right now",

    // ----------------------------- active order page strings ----------------------------- //
    'activeOrderPageTitle': "Orders",
    'orderDetailsBlockTitle': count => `Order Summary ( ${count} items )`,
    'orderDetailsPageTitle': "Order Details",
    'confirmOrderButtonTitle': "Confirm Order",
    'cancelOrderButtonTitle': "Cancel Order",
    'packedOrderButtonTitle': "Packed",
    'outForDeliveryButtonTitle': "Out For Delivery",
    'completeOrderButtonTitle': "Complete",
    'cancelOrderConfirmation': 'Are you sure you want to cancel this Order ?',

    // ----------------------------- place order page strings ----------------------------- //

    'placeOrderAddressStageTitle': "Address Confirmation",
    'placeOrderAmountStageTitle': "Amount Confirmation",
    'placeOrderTitle': "Place Order",
    'placeOrderButtonTitle': "Place Order",
    'orderNumberTitle': odrNmbr => `Order Number : ${odrNmbr}`,
    'stringForLocMissingWhileServingHomeDelivery': "Please complete your profile for higher availability",
    'amountConfirmationSectionTitle': 'Amount Confirmation',
    'addressConfirmationSectionTitle': 'Address Confirmation',
    'addNewAddressButtonTitle': '+ Add new address',

    // ----------------------------- item category strings ----------------------------- //

    'enterNewItemCategoryPageTitle': "Enter Category Name",
    'itemCategoriesPageTitle': "Item Categories",

    // ----------------------------- item features strings ----------------------------- //

    'enterNewItemFeaturePageTitle': "Enter Feature Details",
    'itemFeaturesPageTitle': "Item Features",
    'itemIsSaleBasedTitle': "Is Selectable",
    'itemFeaturesOptionFieldTitle': "Options",

    // ----------------------------- item's strings ----------------------------- //

    'setCountLabel': 'Each set includes',
    'itemDeleteConfirmation': 'Are you sure you want to delete this item ?',
    'itemPerUnitPriceStringOnItemListAndDetailView': (itemPrice, itemBaseUnit, currencySymbol) => `${currencySymbol} ${itemPrice} / ${itemBaseUnit}`,
    'itemPriceDiscountString': discount => `${discount} % Off`,
    'itemTotalPriceStringOnItemListAndDetailView': (itemPrice, currencySymbol) => `Total - ${currencySymbol} ${itemPrice}`,
    'itemFormImagesFieldLabel': "Item Images",
    'itemDetailsBlockTitle': "Item Details",
    'shopTimingsBlockTitle': "Shop Timings",
    'updateTimingsBlockTitle':({day})=> `Update ${day} Timings`,
    'itemFeaturesTitle': cat => `Select ${cat}`,
    'itemVersionsBlockTitle': "Item Versions",
    'setCountFieldLabel': "Set Count",
    'itemFormPriceFieldLabel': "Price",
    'itemFormDiscountFieldLabel': "Discount %",
    'itemFormIsItemActiveFieldLabel': "Is Active",
    'itemFormQuantityFieldLabel': "Quantity",
    'descriptionFieldLabel': "Description",
    'itemCodeFieldLabel': "Item Code",
    'itemIsActiveLabel': "Active",
    'itemFormAllowNegativeStockFieldLabel': "Allow Negative Stock",
    'itemFormMainStockFieldLabel': "Maintain Stock",
    'itemFormMeasuringUnitFieldLabel': "Measuring Unit",
    'itemFormCategoryFieldLabel': "Category",
    'itemCategoryFieldLabel': "Item Category",
    'itemFormFeatureFieldLabel': "Feature",
    'itemFormFeatureOptionFieldLabel': "Options",
    'itemListAddToCartButtonTitle': "Add To Cart",
    'itemListViewCartButtonTitle': "View Cart",
    'alertForUserToLoginWhenHeClicksOnAddToCart': 'Please login to proceed',
    'itemsPageTitle': "Items",
    'updateItemsStatusTitle': "Update Status",
    'deleteItemsStatusTitle': "Delete Items",
    'itemDetailPageTitle': "Item Details",
    'activeItemButtontitle': "Active",
    'inActiveItemButtontitle': "InActive",
    'outOfStockNotification': "Out of stock",
    'sameFeatureTwiceNotSupportedNotice': `Same feature should not be selected twice`,
    'lessStockLeftNotification': quantity => `Hurry ${quantity} item's left`,
    'itemsPageSubTitle': shopNumber => `${shopNumber}`,

    // ----------------------------- vendor profile strings ----------------------------- //

    'addNewDistanceSlabPopupTitle': "Enter Slab Details",
    'addNewDistanceSlabPopupMinOrderAmntTitle': "Min Order Amount",
    'addNewDistanceSlabPopupDeliveryAmntTitle': "Delivery Amount",
    'addNewDistanceSlabPopupFromDistanceTitle': "From Distance",
    'addNewDistanceSlabPopupToDistanceTitle': "To Distance",
    'isActiveFieldTitle': "Is Active",
    'isHolidayFieldTitle': "Is Holiday",
    'dayNameFieldTitle': "Day",
    'shopStartTimeLabel': "Start Time",
    'shopEndTimeLabel': "End Time",
    'ownerProfileImgFieldTitle': "Owner Image",
    'isHomeDeliveryActiveFieldTitle': "Is Home Delivery Active",
    'unitCategoryFieldTitle': "Shop Category",
    'unitNameFieldTitle': "Shop Name",
    'ownerNameFieldTitle': "Owner Name",
    'unitNumberFieldTitle': "Shop Number",
    'distanceSlabFromFieldTitle': "From (Km)",
    'distanceSlabGropupTitle': "Distance Based Changes Slab",
    'distanceSlabToFieldTitle': "To (Km)",
    'distanceSlabMinOrderAmountFieldTitle': "Min Order Amount",
    'distanceSlabAmountFieldTitle': "Amount",
    'updateButtonTitle': "Update",

    // ----------------------------- common strings ----------------------------- //

    'invalidAddressAlert': 'Address is not valid',
    'EmptyListString': 'No Result Found',
    'locationInputBoxDefaultString': 'Google Location',
    'chooseImgOptionsTitle': "Choose Option",
    'imgSelectCameraOption': "Camera",
    'imgSelectGalleryOption': "Gallery",
    'SelectImageText': "Select Image",
    'headerSearchFieldPlaceholder': searchKeyLabel => `Enter ${searchKeyLabel} for search`,
    'fieldValNotExistsError': fieldName => `Please Enter ${fieldName}`,
    'sortByPlaceholder': "Sort By",
    'byDefaultSortByOption': "Relevance",
    'dateSortOptionTitle': "Date",
    'doneButtonTitle': "Done",
    'saveButtonTitle': "Save",
    'viewButtonTitle': "View",
    'viewDetailsButtonTitle': "View Details",
    'deliverHereButtonTitle': "Deliver here",
    'mobileNumberFieldTitle': "Mobile No.",
    'totalTitle': "Total",
    'filterPopupButton': "Filter",
    'nameFieldTitle': "Name",
    'addressFieldTitle': "Address",
    'currencySymbol': 'Rs',
    'okButton': 'Ok',
    'subtractButtonSymbol': '-',
    'addButtonSymbol': '+',
    'crossButtonSymbol': 'x',
    'addButton': "Add",
    'cancelButton': 'Cancel',
    'proceedButton': 'Proceed',
}
