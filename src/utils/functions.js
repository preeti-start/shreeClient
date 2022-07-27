import React from "react";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import q from 'q';
import moment from "moment";
import uuid from "react-native-uuid";

import {
    fieldTypes, notificationStatus, orderTypes,
    serverURL,
    useAdminLocationForDelivery,
} from '../constants';
import { appRoutes, roles } from "../constants";
import { addToasts } from "../redux-store/actions/toastActions";
import { logoutUser } from "../redux-store/actions/userActions";


export const getDateVal = ({ date, format = "DD/MM/YYYY" }) => {
    return moment(date).format(format)
};

export const showShopNowButton = ({ isVisible = true, userDetails }) => isVisible && userDetails && userDetails.role && userDetails.role === roles.buyer;
export const showViewCompositionsButton = ({ isVisible, userDetails }) => isVisible && userDetails && userDetails.role && userDetails.role === roles.buyer;

export const isImgUrlExists = ({ data, fieldName }) => {
    return data && data.hasOwnProperty(fieldName) && typeof data[fieldName] === "object" && data[fieldName] !== null && data[fieldName] !== undefined && Object.keys(data[fieldName]).length > 0 && data[fieldName].url
};
export const showLocMissingNotification = ({ vendorDetails, userDetails }) => !useAdminLocationForDelivery &&
    userDetails && userDetails.role
    && userDetails.role === roles.vendor && (!vendorDetails ||
        !vendorDetails.hasOwnProperty("is_home_delivery_active") ||
        (vendorDetails.is_home_delivery_active === true && !vendorDetails.location));
export const isNoValueOrWhiteSpace = value => {
    if (value === undefined || value === null || value === '') return true;
    const string = String(value);
    for (let i = 0; i < string.length; ++i) {
        if (string[i] !== ' ') return false;
    }
    return true;
};
export const getDropdownFieldValueKeyMapping = ({ options = [], valueKey }) => {
    const finalMapping = {};
    for (const optionIndex in options) {
        finalMapping[options[optionIndex][valueKey]] = options[optionIndex];
    }
    return finalMapping;
};

const commaDecimalSeperatorLanguages = [
    'es-ES', 'pt', 'de-DE', 'vi', 'in',
];
export const getLocaleSupportedInputValue = (inputValue, locale) => {
    const isCommaTypeInput = commaDecimalSeperatorLanguages.includes(locale) ? true : false;
    let formattedValue = inputValue;
    if (isCommaTypeInput && (inputValue || inputValue === 0)) {
        const numberString = String(inputValue);
        formattedValue = numberString.replace('.', ',');
    }
    return formattedValue;
};

export const decimalInput = (number, locale) => {
    const isDotInput = commaDecimalSeperatorLanguages.includes(locale) ? false : true;
    const numberString = String(number);
    let isCurrencySeperatorFound = false;
    let finalDecimalValue = '';
    for (let i = 0; i < numberString.length; ++i) {
        const charCode = numberString.charCodeAt(i);
        if (!isCurrencySeperatorFound && !isDotInput && charCode === 44) {
            // 44 for comma
            isCurrencySeperatorFound = true;
            finalDecimalValue += '.';
        } else if (!isCurrencySeperatorFound && charCode === 46) {
            // 46 for dot
            isCurrencySeperatorFound = true;
            finalDecimalValue += numberString[i];
        } else if (charCode <= 57 && charCode >= 48) {
            // 48 to 57 are 0 to 9
            finalDecimalValue += numberString[i];
        }
    }
    return finalDecimalValue;
};

export const getErrorMessage = error => {
    if (error.message && error.message.length > 0) {
        return error.message;
    }
    if (error.body) {
        if (error.body.error && error.body.error.message) {
            return error.body.error.message
        }
        if (error.body.message) {
            return error.body.message;
        }
    }
    return '';
};

export const getOrderData = ({ cartDetails, getOrderJson, onSuccess, toLocation, isMobile, userToken }) => {
    if (userToken && getOrderJson && cartDetails) {
        getOrderJson({
            cartDetails,
            isMobile,
            onSuccess,
            userToken,
            toLocation: toLocation,
        });
    }
};

export const getOrderType = data => ((get(data, "vendor_id.is_home_delivery_active", false) === true || useAdminLocationForDelivery) ? orderTypes.home_delivery : orderTypes.pick_up);
export const logoutOnError = ({ store, onError, error, isMobile, delStoreDetails, userToken, history }) => {

    // logout has to be placed on top -- as after logout state will reset to initial state - but then app lands to home page and again query will fetch home page's data
    store.dispatch(logoutUser({ history, delStoreDetails, isMobile, userToken }));

    onError && onError();
    const errMsg = getErrorMessage(error);
    if (isMobile) {
        alert(errMsg);
    } else {
        error && store.dispatch(addToasts({
            id: 'get_user_details_error',
            status: notificationStatus['2'],
            toast_text: errMsg,
        }));
    }
}

export const showSelectImageLink = ({ value, multiple, maxLimit }) => {
    return ((value === undefined || value === null) || ((!multiple && value.length === 0) || (multiple && (maxLimit === undefined || (maxLimit && value.length < maxLimit)))))
}
export const onFileSelect = ({ fieldVal, isMobile = false, getSignedUrl, formData, index, file, field, getPresignedUrl, userToken }) => {

    var d = q.defer();

    const setDataToState = ({ name, presignedUrl }) => {
        const finalFieldVal = {
            ...file,
            url: file.uri,
            name,
            file,
            presignedUrl,
        };
        // --- pending --- finalFieldVal should be added with other keys based on web
        d.resolve(finalFieldVal);
    };
    const getSignedUrlFromServer = ({}) => {
        if (field && field.awsBucketName && userToken && getPresignedUrl) {
            getPresignedUrl({
                userToken,
                contentType: file.type,
                name: `${field.awsBucketName}/${uuid.v4().toString()}`,
                onSuccess: ({ presignedUrl, name }) => {
                    setDataToState({ name, presignedUrl });
                },
                onError: _ => d.reject()
            })
        } else {
            d.resolve(undefined)
        }
    };

    // here -- index -- holds the image number in case if multiple images are selected at the same time
    const maxLengthExceed = formData && field.field && field.hasOwnProperty('maxLimit') &&
        field.maxLimit > 0 && formData.hasOwnProperty(field.field) &&
        Array.isArray(formData[field.field]) && (formData[field.field].length + index + 1) > field.maxLimit;

    if (!maxLengthExceed && file) {
        if (getSignedUrl) {
            if (field && field.type) {
                if (field.type === fieldTypes.image) {
                    if (isMobile) {
                        getSignedUrlFromServer({})
                    } else {
                        const reader = new FileReader();
                        reader.onload = e => {
                            // pending ---- in case of mobile --  file in setDataToState should be this new fileReader file object
                            getSignedUrlFromServer({ file: e.target.result })
                        };
                        reader.readAsDataURL(file);
                    }
                } else if (field.type === fieldTypes.file) {
                    getSignedUrlFromServer({})
                }
            } else {
                d.resolve(undefined);
            }
        } else {
            setDataToState({});
        }
    } else {
        d.resolve(undefined);
    }
    return d.promise;
};

export const onDelFileClick = ({ field, fieldValue, file }) => {
    return field.multiple ? fieldValue.filter(fileVal => fileVal.name !== file.name) : undefined
};

export const isNewFile = fileData => {
    return fileData.hasOwnProperty("presignedUrl")
};

export const uploadImagesToAWS = ({ presignedUrl, contentType, name, file }) => {
    const d = q.defer();
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', presignedUrl);
    xhr.onreadystatechange = _ => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                d.resolve({ name, url: xhr.responseURL.toString().split("?Content-Type")[0] })
            } else {
                const error = new Error();
                error.statusCode = xhr.status;
                error.message = xhr.response;
                // console.log('Error while sending the image to S3', xhr);
                d.reject(error);
            }
        }
    };
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.send(file);
    return d.promise;
};

export const getDataFromServer = ({ body, path, method, headers }) => {

    const options = {
        method,
        headers,
    };
    if (method !== 'GET' && body) {
        options.body = JSON.stringify(body);
    }
    let statusCode;
    return fetch(serverURL + path, options).then(response => {
        statusCode = response.status;

        if (response.ok) return response.json();

        const error = new Error();
        error.response = response;
        error.status = statusCode;
        throw error;

    }).catch(err => {
        const error = new Error();
        error.statusCode = err.status;
        error.message = err.message;
        error.body = err.body;
        if (err.response) {
            return err.response.json().then(errorBody => {
                error.body = errorBody;
                throw error;
            });
        }
        throw error;
    });
};

export const loadAnimations = _ => {

    window && window.AOS && window.AOS.init && window.AOS.init({
        duration: 800,
        easing: 'slide',
        once: true
    });

    if (window && window.jQuery) {
        (function ($) {


            "use strict";

            var siteMenuClone = function () {

                $('.js-clone-nav').each(function () {
                    var $this = $(this);
                    $this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
                });


                setTimeout(function () {

                    var counter = 0;
                    $('.site-mobile-menu .has-children').each(function () {
                        var $this = $(this);

                        $this.prepend('<span class="arrow-collapse collapsed">');

                        $this.find('.arrow-collapse').attr({
                            'data-toggle': 'collapse',
                            'data-target': '#collapseItem' + counter,
                        });

                        $this.find('> ul').attr({
                            'class': 'collapse',
                            'id': 'collapseItem' + counter,
                        });

                        counter++;

                    });

                }, 1000);

                $('body').on('click', '.arrow-collapse', function (e) {
                    var $this = $(this);
                    if ($this.closest('li').find('.collapse').hasClass('show')) {
                        $this.removeClass('active');
                    } else {
                        $this.addClass('active');
                    }
                    e.preventDefault();

                });

                $(window).resize(function () {
                    var $this = $(this),
                        w = $this.width();

                    if (w > 768) {
                        if ($('body').hasClass('offcanvas-menu')) {
                            $('body').removeClass('offcanvas-menu');
                        }
                    }
                })

                $('body').on('click', '.js-menu-toggle', function (e) {
                    var $this = $(this);
                    e.preventDefault();

                    if ($('body').hasClass('offcanvas-menu')) {
                        $('body').removeClass('offcanvas-menu');
                        $this.removeClass('active');
                    } else {
                        $('body').addClass('offcanvas-menu');
                        $this.addClass('active');
                    }
                })

                // click outisde offcanvas
                $(document).mouseup(function (e) {
                    var container = $(".site-mobile-menu");
                    if (!container.is(e.target) && container.has(e.target).length === 0) {
                        if ($('body').hasClass('offcanvas-menu')) {
                            $('body').removeClass('offcanvas-menu');
                        }
                    }
                });
            };
            siteMenuClone();


            var sitePlusMinus = function () {
                $('.js-btn-minus').on('click', function (e) {
                    e.preventDefault();
                    if ($(this).closest('.input-group').find('.form-control').val() != 0) {
                        $(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
                    } else {
                        $(this).closest('.input-group').find('.form-control').val(parseInt(0));
                    }
                });
                $('.js-btn-plus').on('click', function (e) {
                    e.preventDefault();
                    $(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
                });
            };
            // sitePlusMinus();


            var siteSliderRange = function () {
                $("#slider-range").slider({
                    range: true,
                    min: 0,
                    max: 500,
                    values: [75, 300],
                    slide: function (event, ui) {
                        $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
                    }
                });
                $("#amount").val("$" + $("#slider-range").slider("values", 0) +
                    " - $" + $("#slider-range").slider("values", 1));
            };
            // siteSliderRange();


            var siteMagnificPopup = function () {
                $('.image-popup').magnificPopup({
                    type: 'image',
                    closeOnContentClick: true,
                    closeBtnInside: false,
                    fixedContentPos: true,
                    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
                    gallery: {
                        enabled: true,
                        navigateByImgClick: true,
                        preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
                    },
                    image: {
                        verticalFit: true
                    },
                    zoom: {
                        enabled: true,
                        duration: 300 // don't foget to change the duration also in CSS
                    }
                });

                $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
                    disableOn: 700,
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,

                    fixedContentPos: false
                });
            };
            siteMagnificPopup();


            var siteCarousel = function () {
                if ($('.nonloop-block-13').length > 0) {
                    $('.nonloop-block-13').owlCarousel({
                        center: false,
                        items: 1,
                        loop: true,
                        stagePadding: 0,
                        autoplay: true,
                        margin: 20,
                        nav: false,
                        dots: true,
                        navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
                        responsive: {
                            600: {
                                margin: 20,
                                stagePadding: 0,
                                items: 1
                            },
                            1000: {
                                margin: 20,
                                stagePadding: 0,
                                items: 2
                            },
                            1200: {
                                margin: 20,
                                stagePadding: 0,
                                items: 3
                            }
                        }
                    });
                }

                if ($('.slide-one-item').length > 0) {
                    $('.slide-one-item').owlCarousel({
                        center: false,
                        items: 1,
                        loop: true,
                        stagePadding: 0,
                        margin: 0,
                        autoplay: true,
                        pauseOnHover: false,
                        nav: true,
                        animateOut: 'fadeOut',
                        animateIn: 'fadeIn',
                        navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">']
                    });
                }


                if ($('.nonloop-block-4').length > 0) {
                    $('.nonloop-block-4').owlCarousel({
                        center: true,
                        items: 1,
                        loop: false,
                        margin: 10,
                        nav: true,
                        navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
                        responsive: {
                            600: {
                                items: 1
                            }
                        }
                    });
                }

            };
            siteCarousel();

            var siteStellar = function () {
                $(window).stellar({
                    responsive: true,
                    parallaxBackgrounds: true,
                    parallaxElements: true,
                    horizontalScrolling: false,
                    hideDistantElements: false,
                    scrollProperty: 'scroll'
                });
            };
            siteStellar();

            var siteCountDown = function () {

                if ($('#date-countdown').length > 0) {
                    $('#date-countdown').countdown('2020/10/10', function (event) {
                        var $this = $(this).html(event.strftime(''
                            + '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
                            + '<span class="countdown-block"><span class="label">%d</span> days </span>'
                            + '<span class="countdown-block"><span class="label">%H</span> hr </span>'
                            + '<span class="countdown-block"><span class="label">%M</span> min </span>'
                            + '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
                    });
                }

            };
            siteCountDown();

            var siteDatePicker = function () {

                if ($('.datepicker').length > 0) {
                    $('.datepicker').datepicker();
                }

            };
            siteDatePicker();


        })(window.jQuery);
    }

};
export const getItemCartId = ({ relatedItemVersions, cartItemIds, itemDetails }) => {
    let itemCartId = undefined;
    const currentFeaturesMapping = [];
    if (relatedItemVersions && relatedItemVersions.features && Object.keys(relatedItemVersions.features).length > 0) {
        for (const featureId in relatedItemVersions.features) {
            if (relatedItemVersions.features.hasOwnProperty(featureId) && relatedItemVersions.features[featureId] &&
                relatedItemVersions.features[featureId].options &&
                Object.keys(relatedItemVersions.features[featureId].options).length > 0) {
                for (const optionName in relatedItemVersions.features[featureId].options) {
                    if (relatedItemVersions.features[featureId].options.hasOwnProperty(optionName) &&
                        relatedItemVersions.features[featureId].options[optionName].isSelected) {
                        currentFeaturesMapping.push(`${featureId}-${optionName}`)
                    }
                }

            }
        }
    }
    currentFeaturesMapping.sort();

    const cartsItemFeaturesMapping = [];
    if (itemDetails && itemDetails._id && cartItemIds && cartItemIds.length > 0) {
        for (const dataCount in cartItemIds) {
            const itemFeaturesMapping = [];
            if (cartItemIds[dataCount].features && cartItemIds[dataCount].item_id && cartItemIds[dataCount].item_id === itemDetails._id) {
                cartItemIds[dataCount].features.map(feature => {
                    itemFeaturesMapping.push(`${feature._id}-${feature.option}`)
                })
            }
            cartsItemFeaturesMapping.push({
                itemId: cartItemIds[dataCount].item_id,
                cartId: cartItemIds[dataCount].cart_id,
                features: itemFeaturesMapping.sort()
            })
        }
    }
    for (const count in cartsItemFeaturesMapping) {
        if (isEqual(cartsItemFeaturesMapping[count].features, currentFeaturesMapping) &&
            cartsItemFeaturesMapping[count].itemId === itemDetails._id) {
            itemCartId = cartsItemFeaturesMapping[count].cartId;
        }
    }
    return itemCartId;
};
export const onAddToCartPress = ({ callForLogin, onSuccess, features = {}, isMobile, buyerId, addItemToUserCart, vendorId, quantity, itemId, userToken }) => {
    const finalFeaturesMapping = {};
    for (const featureKey in features) {
        if (features.hasOwnProperty(featureKey) && features[featureKey].options && Object.keys(features[featureKey].options).length > 0) {
            for (const optionName in features[featureKey].options) {
                if (features[featureKey].options[optionName] && features[featureKey].options[optionName].isSelected) {
                    if (!finalFeaturesMapping.hasOwnProperty(featureKey)) {
                        finalFeaturesMapping[featureKey] = undefined;
                    }
                    finalFeaturesMapping[featureKey] = optionName;
                }
            }
        }
    }
    if (userToken && buyerId) {
        if (vendorId && quantity && itemId && addItemToUserCart) {
            addItemToUserCart({
                isMobile,
                buyerId,
                features: finalFeaturesMapping,
                vendorId,
                quantity,
                itemId,
                userToken,
                onSuccess
            })
        }
    } else {
        callForLogin && callForLogin();
    }
};
