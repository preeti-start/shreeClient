import React from 'react';
import { connect } from 'react-redux';

import './index.css';
import { updateVendorDetails } from '../../redux-store/actions/userActions';
import { getShopCategories } from '../../redux-store/actions/shopCategoryActions';
import { AWSImageBuckets, useAdminLocationForDelivery, fieldTypes } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import FormContainer from "../Form";
import Table from "../../components/AppCompLibrary/Table";
import Button from "../../components/AppCompLibrary/Button";
import PopUp from "../../components/Popup";

class VendorProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAddNewSlabPopupActive: undefined,
            isDataSavingInProgress: false,
        };
        this.getTableFieldsList = this.getTableFieldsList.bind(this);
        this.getFormFieldsList = this.getFormFieldsList.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onDelSlabPress = this.onDelSlabPress.bind(this);
        this.saveDataToServer = this.saveDataToServer.bind(this);
        this.toggleAddSlab = this.toggleAddSlab.bind(this);
        this.onSaveSlabValPress = this.onSaveSlabValPress.bind(this);
    }

    componentDidMount() {
        const { userToken, getShopCategories } = this.props;
        userToken && getShopCategories && getShopCategories({
            userToken,
        })
    }

    saveDataToServer({ onSuccess, updateJson }) {
        const { userToken, vendorDetails, updateVendorDetails } = this.props;
        if (userToken && updateVendorDetails) {
            this.setState({ isDataSavingInProgress: true });
            updateVendorDetails({
                userToken,
                vendorId: vendorDetails._id,
                ...updateJson,
                onSuccess: _ => {
                    onSuccess && onSuccess();
                    this.setState({ isDataSavingInProgress: false });
                }
            })
        }
    }

    onSaveClick({ formData }) {
        const { name, shop_name, location, shop_category_id, is_active, is_home_delivery_active, shop_img, profile_img } = formData;
        this.saveDataToServer({
            updateJson: {
                shop_category_id: { "_id": shop_category_id },
                name,
                shop_name,
                location,
                is_active,
                is_home_delivery_active,
                profile_img,
                shop_img
            }
        })
    }

    onDelSlabPress(dataVal, rowIndex) {
        const { vendorDetails } = this.props;
        const { delivery_amount_slabs } = vendorDetails;
        this.saveDataToServer({
            updateJson: {
                delivery_amount_slabs: delivery_amount_slabs.filter((slabVal, index) => index !== rowIndex),
            }
        });
    }

    toggleAddSlab(props) {
        this.setState(prevState => ({
            isAddNewSlabPopupActive: prevState.isAddNewSlabPopupActive === undefined ? {
                active: true,
                slabDetails: props && props.slabDetails,
                delivery_amount_slabs: props && props.delivery_amount_slabs
            } : undefined
        }))
    }

    onSaveSlabValPress({ formData }) {
        const { delivery_amount_slabs } = this.state.isAddNewSlabPopupActive;
        this.saveDataToServer({
            updateJson: {
                delivery_amount_slabs: delivery_amount_slabs ? [formData, ...delivery_amount_slabs] : [formData],
            },
            onSuccess: this.toggleAddSlab
        });
    }

    getFormFieldsList() {

        const { shopCategoriesList } = this.props;

        const finalFieldsList = [
            {
                type: fieldTypes.image,
                field: "profile_img",
                awsBucketName: AWSImageBuckets.vendor_profile,
                placeholder: appStringConstants.vendorProfileImagePlaceholder,
            },
            {
                type: fieldTypes.image,
                field: "shop_img",
                awsBucketName: AWSImageBuckets.shop_images,
                placeholder: appStringConstants.shopImagePlaceholder,
            },
            {
                field: "name",
                isMandatory: true,
                placeholder: appStringConstants.nameFieldPlaceholder,
                label: appStringConstants.nameFieldPlaceholder,
            },
            {
                field: "shop_name",
                placeholder: appStringConstants.vendorProfileShopNameFieldPlaceholder,
            },
            {
                field: "shop_category_id",
                type: fieldTypes.dropdown,
                displayKey: "name",
                valKey: "_id",
                label: appStringConstants.vendorProfileShopCategoryFieldTitle,
                options: shopCategoriesList,
            },
            {
                type: fieldTypes.location,
                field: "location",
                label: appStringConstants.locationFieldPlaceholder,
                placeholder: appStringConstants.locationFieldPlaceholder,
            },
            {
                field: "is_active",
                type: fieldTypes.checkbox,
                title: appStringConstants.vendorProfileIsActiveFieldTitle,
            },
        ];

        if (!useAdminLocationForDelivery) {
            finalFieldsList.push({
                field: "is_home_delivery_active",
                type: fieldTypes.checkbox,
                title: appStringConstants.vendorProfileIsHomeDeliveryActiveFieldTitle,
            })
        }
        return finalFieldsList;
    }

    getSlabFields() {
        return [
            {
                field: "delivery_amount",
                isMandatory: true,
                type: fieldTypes.number,
                placeholder: appStringConstants.vendorProfileDeliveryAmtSlabDeliveryAmount,
                label: appStringConstants.vendorProfileDeliveryAmtSlabDeliveryAmount,
            },
            {
                field: "min_order_amount",
                isMandatory: true,
                type: fieldTypes.number,
                label: appStringConstants.vendorProfileDeliveryAmtSlabMinOrderAmount,
                placeholder: appStringConstants.vendorProfileDeliveryAmtSlabMinOrderAmount,
            },
            {
                field: "from_distance",
                isMandatory: true,
                type: fieldTypes.number,
                label: appStringConstants.vendorProfileDeliveryAmtSlabFromDistance,
                placeholder: appStringConstants.vendorProfileDeliveryAmtSlabFromDistance,
            },
            {
                field: "to_distance",
                isMandatory: true,
                type: fieldTypes.number,
                label: appStringConstants.vendorProfileDeliveryAmtSlabToDistance,
                placeholder: appStringConstants.vendorProfileDeliveryAmtSlabToDistance,
            },
        ]
    }

    getTableFieldsList() {
        const { vendorDetails } = this.props;
        const { delivery_amount_slabs } = vendorDetails;
        return [
            {
                width: 200,
                "label": appStringConstants.vendorProfileDeliveryAmtSlabFromDistance,
                "field": "from_distance"
            },
            { width: 200, "label": appStringConstants.vendorProfileDeliveryAmtSlabToDistance, "field": "to_distance" },
            {
                width: 200,
                "label": appStringConstants.vendorProfileDeliveryAmtSlabMinOrderAmount,
                "field": "min_order_amount"
            },
            {
                width: 200,
                "label": appStringConstants.vendorProfileDeliveryAmtSlabDeliveryAmount,
                "field": "delivery_amount"
            },
            {
                width: 50, "Cell": (dataVal, rowIndex) => <svg className="item-del-icon-style"
                                                               onClick={_ => this.toggleAddSlab({
                                                                   delivery_amount_slabs: [...delivery_amount_slabs.filter((data, index) => index !== rowIndex)],
                                                                   slabDetails: dataVal
                                                               })}
                                                               viewBox="0 0 24 24">
                    <use xlinkHref="#edit-pencil-icon-gray"/>
                </svg>
            },
            {
                width: 50, "Cell": (dataVal, rowIndex) => <svg className="item-del-icon-style"
                                                               onClick={_ => this.onDelSlabPress(dataVal, rowIndex)}
                                                               viewBox="0 0 24 24">
                    <use xlinkHref="#del_icon"/>
                </svg>
            },
        ];

    }

    render() {

        const { isAddNewSlabPopupActive, isDataSavingInProgress } = this.state;
        const { vendorDetails } = this.props;
        const { delivery_amount_slabs } = vendorDetails;

        return <div className="vendor-profile-container">
            {isAddNewSlabPopupActive && isAddNewSlabPopupActive.active &&
            <PopUp
                title={appStringConstants.vendorProfileDeliveryAmtSlabsTitle}
                onClose={this.toggleAddSlab}
                renderScene={_ => <FormContainer
                    clickActions={[
                        {
                            title: appStringConstants.addButtonTitle,
                            isLoading: isDataSavingInProgress,
                            onClick: this.onSaveSlabValPress
                        }
                    ]}
                    formData={isAddNewSlabPopupActive && isAddNewSlabPopupActive.slabDetails}
                    fieldGroups={
                        [
                            {
                                fields: this.getSlabFields()
                            },
                        ]}
                />}
            />}
            <FormContainer
                headerView={{
                    title: `${vendorDetails && vendorDetails.shop_number}`,
                    rightActions: [{
                        isLoading: isDataSavingInProgress,
                        title: appStringConstants.saveButtonTitle,
                        onClick: this.onSaveClick
                    }]
                }}
                formData={{
                    ...vendorDetails,
                    shop_category_id: vendorDetails && vendorDetails.shop_category_id && vendorDetails.shop_category_id._id,
                }}
                fieldGroups={
                    [
                        {
                            fields: this.getFormFieldsList()
                        },
                    ]}
            />
            {!useAdminLocationForDelivery && [<div className="vendor-profile-seperator"/>,
                <Table
                    data={[{
                        rightView: _ => (<Button title={appStringConstants.vendorProfileAddNewDeliveryAmtSlab}
                                                 onClick={_ => this.toggleAddSlab({ delivery_amount_slabs })}/>),
                        title: appStringConstants.vendorProfileDeliveryAmtSlabsTitle,

                        data: delivery_amount_slabs
                    }]}
                    noDataComponent={_ => <div/>}
                    columns={this.getTableFieldsList()}
                />]}
        </div>
    }
}

export default connect(state => ({
    userToken: state.users.userToken,
    vendorDetails: state.users.vendorDetails,
    shopCategoriesList: state.shopCategories.shopCategoriesList,
}), { updateVendorDetails, getShopCategories })(VendorProfile);

