import React from 'react';
import get from 'lodash/get';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { colors, fontSizes, fonts, fontStyle } from "../mobileTheme";
import { VendorProfileComponent, AppDashboard, PopUp } from '../mobileComponents/index';
import Header from './Header';
import stringConstants from "../constants/mobileStringConstants";
import AddDistanceBasedAmountSlab from "./AddDistanceBasedAmountSlab";
import {
    AWSImageBuckets,
    fieldTypes,
    timesArray,
    useAdminLocationForDelivery,
    userNotifications
} from "../constants/index";
import { updateVendorDetails } from "../redux-store/actions/userActions";
import { getShopCategories } from "../redux-store/actions/shopCategoryActions";

const holidayOptionDim = 20;

class VendorProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddSlabModelActive: false,
            isDatePickerVisible: false,
        };
        this.onFieldValChange = this.onFieldValChange.bind(this);
        this.onDelSlabPress = this.onDelSlabPress.bind(this);
        this.toggleAddSlab = this.toggleAddSlab.bind(this);
        this.onSavePress = this.onSavePress.bind(this);
        this.onSaveSlabValPress = this.onSaveSlabValPress.bind(this);
        this.saveDataToServer = this.saveDataToServer.bind(this);
    }

    componentDidMount() {
        const { getShopCategories, userToken } = this.props;
        userToken && getShopCategories && getShopCategories({ isMobile: true, userToken })
    }

    toggleDatePicker = () => {
        alert('m in')
        this.setState(prevState => ({ isDatePickerVisible: !prevState.isDatePickerVisible }))
    };

    handleConfirm = (date) => {
        alert("A date has been picked: ", date);
        this.toggleDatePicker();
    };

    saveDataToServer({ formData }) {
        const { updateVendorDetails, vendorDetails, userToken } = this.props;
        userToken && vendorDetails && vendorDetails._id && updateVendorDetails && updateVendorDetails({
            isMobile: true,
            userToken,
            vendorId: vendorDetails._id,
            ...formData,
            onSuccess: _ => {
                ToastAndroid.show(userNotifications.msgOnProfileUpdateSuccess, ToastAndroid.SHORT);
            }
        })
    }

    onSavePress({ formData }) {
        const {
            is_home_delivery_active, shop_timings, shop_img, profile_img, location,
            shop_category_id, name, shop_name, shop_number, is_active
        } = formData;

        this.saveDataToServer({
            formData: {
                profile_img,
                shop_timings,
                shop_img,
                is_home_delivery_active,
                shop_category_id: { "_id": shop_category_id },
                name,
                location,
                shop_name,
                shop_number,
                is_active
            }
        });
    }

    onSaveSlabValPress({ slabVal }) {
        const { vendorDetails } = this.props;
        const { delivery_amount_slabs } = vendorDetails;
        this.saveDataToServer({
            formData: {
                delivery_amount_slabs: delivery_amount_slabs ? [slabVal, ...delivery_amount_slabs] : [slabVal],
            }
        });
    }

    toggleAddSlab() {
        this.setState(prevState => ({ isAddSlabModelActive: !prevState.isAddSlabModelActive }))
    }

    onDelSlabPress(slabIndex) {
        const { vendorDetails } = this.props;
        const { delivery_amount_slabs } = vendorDetails;
        this.saveDataToServer({
            formData: {
                delivery_amount_slabs: delivery_amount_slabs.filter((slabVal, index) => index !== slabIndex),
            }
        });
    }

    getFieldsList() {
        const { shopCategoriesList } = this.props;

        const finalFields = [
            {
                fields: [

                    {
                        placeholder: stringConstants.ownerNameFieldTitle,
                        name: 'name',
                    },
                    {
                        placeholder: stringConstants.unitNameFieldTitle,
                        name: 'shop_name',
                        isMandatory: true,
                    },
                    {
                        type: fieldTypes.fk,
                        placeholder: stringConstants.unitCategoryFieldTitle,
                        displayKey: 'name',
                        valueKey: '_id',
                        dataArray: shopCategoriesList,
                        name: 'shop_category_id',
                    },
                    {
                        type: fieldTypes.boolean,
                        title: stringConstants.isActiveFieldTitle,
                        name: 'is_active',
                    },
                    {
                        type: fieldTypes.location,
                        placeholder: stringConstants.addressFieldTitle,
                        name: 'location',
                    },
                    {
                        type: fieldTypes.image,
                        title: stringConstants.ownerProfileImgFieldTitle,
                        name: 'profile_img',
                        awsBucketName: AWSImageBuckets.vendor_profile,
                    },

                ]
            }
        ];
        if (!useAdminLocationForDelivery) {
            finalFields[0].fields.push({
                type: fieldTypes.boolean,
                title: stringConstants.isHomeDeliveryActiveFieldTitle,
                name: 'is_home_delivery_active',
            })
        }
        finalFields[0].fields.push({
            type: fieldTypes.object,
            multiple: true,
            name: 'shop_timings',
            title: stringConstants.shopTimingsBlockTitle,
            showInsertOption: false,
            showDelOption: false,
            renderTitle: ({ formData }) => `${stringConstants.updateTimingsBlockTitle({ day: get(formData, 'day') })}`,
            fields: [
                {
                    type: fieldTypes.string,
                    listTitle: stringConstants.dayNameFieldTitle,
                    placeholder: stringConstants.dayNameFieldTitle,
                    name: 'day',
                    showInForm: false,
                    width: 1
                },
                {
                    type: fieldTypes.fk,
                    displayKey: 'label',
                    listTitle: stringConstants.shopStartTimeLabel,
                    placeholder: stringConstants.shopStartTimeLabel,
                    valueKey: 'key',
                    width: 1,
                    style: ({ data }) => ({ opacity: get(data, 'is_holiday', false) ? 0.2 : 1 }),
                    dataArray: timesArray,
                    name: 'start_time',
                },
                {
                    type: fieldTypes.fk,
                    displayKey: 'label',
                    placeholder: stringConstants.shopEndTimeLabel,
                    listTitle: stringConstants.shopEndTimeLabel,
                    valueKey: 'key',
                    width: 1,
                    style: ({ data }) => ({ opacity: get(data, 'is_holiday', false) ? 0.2 : 1 }),
                    dataArray: timesArray,
                    name: 'end_time',
                },
                {
                    type: fieldTypes.boolean,
                    width: 1,
                    title: stringConstants.isHolidayFieldTitle,
                    placeholder: stringConstants.isHolidayFieldTitle,
                    name: 'is_holiday'
                },
            ]
        });
        return finalFields;
    }

    onFieldValChange({ fieldDef, formData, onSuccess }) {
        onSuccess({ formData })
    }

    render() {
        const { navigation, isAppLoading, vendorDetails } = this.props;
        const {
            isAddSlabModelActive, isDatePickerVisible
        } = this.state;


        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                navigation={navigation}
                title={stringConstants.profileMenuTitle}
                subTitle={stringConstants.appTagLine}
                showMenuButton={true}
            />}
            detailView={_ => <View style={styles.container}>
                <PopUp
                    onCrossPress={this.toggleAddSlab}
                    title={stringConstants.addNewDistanceSlabPopupTitle}
                    style={{ height: 500 }}
                    isPopUpActive={isAddSlabModelActive}
                    popupView={_ => <AddDistanceBasedAmountSlab
                        onSaveSlabValPress={this.onSaveSlabValPress}
                        toggleAddSlab={this.toggleAddSlab}
                    />}
                />
                <Text onPress={this.toggleDatePicker}>one</Text>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={this.handleConfirm}
                    onCancel={this.toggleDatePicker}
                />
                {vendorDetails &&
                <VendorProfileComponent
                    formData={{
                        ...vendorDetails,
                        shop_category_id: vendorDetails && vendorDetails.shop_category_id && vendorDetails.shop_category_id._id
                    }}
                    headerProfileField={{
                        type: fieldTypes.image,
                        name: 'shop_img',
                        awsBucketName: AWSImageBuckets.shop_images,
                    }}
                    vendorDetails={vendorDetails}
                    toggleAddSlab={this.toggleAddSlab}
                    onFieldValChange={this.onFieldValChange}
                    onDelSlabPress={this.onDelSlabPress}
                    onSavePress={this.onSavePress}
                    fieldGroups={this.getFieldsList()}
                />}
            </View>}
            isDashboardLoading={isAppLoading}
        />;


    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    isHolidayContainer: { backgroundColor: 'yellow' },
    isHolidayOptBlock: {
        borderWidth: 1,
        borderColor: colors.PRIMARY_COLOR_1,
        width: holidayOptionDim,
        height: holidayOptionDim,
        borderRadius: holidayOptionDim / 2
    },
    isHolidayOptInsideBlock: {
        backgroundColor: colors.PRIMARY_COLOR_1,
        width: holidayOptionDim - 2,
        height: holidayOptionDim - 2,
        borderRadius: ((holidayOptionDim - 4) / 2)
    },
});

export default connect((state = {}, ownProps = {}) => ({
    vendorDetails: state.users.vendorDetails,
    shopCategoriesList: state.shopCategories.shopCategoriesList,
    userToken: state.users.userToken,
    isAppLoading: state.users.isAppLoading,
}), { getShopCategories, updateVendorDetails })(VendorProfile)
