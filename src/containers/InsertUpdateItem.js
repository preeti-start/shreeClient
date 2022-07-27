import React from 'react';
import { connect } from 'react-redux';

import FormContainer from "./Form";
import { fieldTypes, AWSImageBuckets, maxItemImageCount } from "../constants";
import appStringConstants from "../constants/appStringConstants";
import { insertNewItem, updateItemDetails } from "../redux-store/actions/itemActions";
import { getItemCategories } from "../redux-store/actions/itemCategoryActions";
import { getMeasuringUnits } from "../redux-store/actions/measuringUnitsActions";


class InsertUpdateItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
        this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    }

    componentDidMount() {
        const { getMeasuringUnits, getItemCategories, vendorDetails, userToken } = this.props;
        userToken && getMeasuringUnits && getMeasuringUnits({ userToken });
        userToken && getItemCategories && vendorDetails && vendorDetails._id && getItemCategories({
            userToken,
            vendorId: vendorDetails._id
        });
    }

    onSaveButtonClick({ formData }) {
        const { name, is_active, per_item_price, discount,maintain_stock, allow_negative_stock, category_id, item_images, measuring_unit_id } = formData;
        const {
            insertNewItem, onInsertUpdateItemSuccess, updateItemDetails,
            itemDetails, vendorDetails, userToken
        } = this.props;

        if (itemDetails && itemDetails._id) {

            if (userToken && updateItemDetails) {
                this.setState({ isLoading: true });
                updateItemDetails({
                    userToken,
                    updateJson: {
                        measuring_unit_id: { "_id": measuring_unit_id },
                        category_id: { "_id": category_id },
                        name,
                        is_active,
                        allow_negative_stock,
                        maintain_stock,
                        per_item_price,
                        discount,
                    },
                    itemImages: item_images,
                    itemId: itemDetails._id,
                    onSuccess: _ => {
                        onInsertUpdateItemSuccess && onInsertUpdateItemSuccess();
                        this.setState({ isLoading: false });
                    }
                })
            }

        } else {
            // as only vendor can insert item, because item can't exist without any vendor associated to it
            if (vendorDetails && vendorDetails._id && userToken && insertNewItem) {
                this.setState({ isLoading: true });
                insertNewItem({
                    userToken,
                    finalInsertJson: {
                        "category_id": { "_id": category_id },
                        "measuring_unit_id": { "_id": measuring_unit_id },
                        "vendor_id": { "_id": vendorDetails._id },
                        name,
                        is_active,
                        maintain_stock,
                        allow_negative_stock,
                        per_item_price,
                        discount,
                    },
                    itemImages: item_images,
                    onSuccess: _ => {
                        onInsertUpdateItemSuccess && onInsertUpdateItemSuccess();
                        this.setState({ isLoading: false });
                    }
                })
            }
        }
    }

    render() {

        const { measuringUnitsList, itemCategoriesList, itemDetails } = this.props;
        const { isLoading } = this.state;

        return <div>
            <FormContainer
                formData={{
                    ...itemDetails,
                    is_active: itemDetails && itemDetails._id ? itemDetails.is_active : true,  // this is done to set is_active to true by default on insert
                    measuring_unit_id: itemDetails && itemDetails.measuring_unit_id && itemDetails.measuring_unit_id._id,
                    category_id: itemDetails && itemDetails.category_id && itemDetails.category_id._id,
                }}
                fieldGroups={
                    [
                        {
                            fields: [
                                {
                                    isMandatory: true,
                                    field: "name",
                                    placeholder: appStringConstants.nameFieldPlaceholder,
                                    label: appStringConstants.nameFieldTitle,
                                },
                                {
                                    isMandatory: true,
                                    field: "per_item_price",
                                    type: fieldTypes.number,
                                    placeholder: appStringConstants.itemAddEditPopupPriceFieldPlaceholder,
                                    label: appStringConstants.itemAddEditPopupPriceFieldPlaceholder,
                                },
                                {
                                    isMandatory: true,
                                    field: "measuring_unit_id",
                                    type: fieldTypes.dropdown,
                                    displayKey: "name",
                                    valKey: "_id",
                                    label: appStringConstants.itemAddEditPopupMeasuringUnitFieldLabel,
                                    options: measuringUnitsList,
                                },
                                {
                                    field: "category_id",
                                    type: fieldTypes.dropdown,
                                    displayKey: "name",
                                    valKey: "_id",
                                    label: appStringConstants.itemsListCategoryFieldTitle,
                                    options: itemCategoriesList,
                                },
                                {
                                    maxLimit: maxItemImageCount,
                                    awsBucketName: AWSImageBuckets.item_images,
                                    type: fieldTypes.image,
                                    field: "item_images",
                                    multiple: true,
                                    placeholder: appStringConstants.fileFieldPlaceholder,
                                },
                                {
                                    field: "is_active",
                                    type: fieldTypes.checkbox,
                                    title: appStringConstants.itemAddEditPopupIsActiveCheckboxTitle,
                                },
                                {
                                    field: "allow_negative_stock",
                                    type: fieldTypes.checkbox,
                                    title: appStringConstants.itemAddEditPopupAllowNegativeStockCheckboxTitle,
                                },
                                {
                                    field: "maintain_stock",
                                    type: fieldTypes.checkbox,
                                    title: appStringConstants.itemAddEditPopupMaintainStockCheckboxTitle,
                                },
                                {
                                    field: "quantity",
                                    readOnly: true, // todo :testing is pending
                                    type: fieldTypes.number,
                                    title: appStringConstants.itemAddEditPopupQuantityFieldTitle,
                                },

                            ]
                        },
                    ]}
                clickActions={[
                    {
                        isLoading,
                        title: appStringConstants.saveButtonTitle,
                        onClick: this.onSaveButtonClick
                    }
                ]}
            />
        </div>


    }
}

export default connect(state => ({
    userToken: state.users.userToken,
    vendorDetails: state.users.vendorDetails,
    itemCategoriesList: state.itemCategories.itemCategoriesList,
    measuringUnitsList: state.measuringUnits.measuringUnitsList,
}), { insertNewItem, getItemCategories, updateItemDetails, getMeasuringUnits })(InsertUpdateItem)