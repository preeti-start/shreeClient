import React from 'react';
import get from 'lodash/get';
import { connect } from "react-redux";

import stringConstants from '../constants/mobileStringConstants';
import { VendorItemFeaturesListComp } from '../mobileComponents/index';
import { getItemCategories } from '../redux-store/actions/itemCategoryActions';
import {
    getItemFeatures,
    addItemFeature,
    removeItemFeature,
    updateItemFeature
} from '../redux-store/actions/itemFeaturesActions';
import { fieldTypes } from "../constants";

class ItemFeaturesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isCreateItemFeatureModalActive: false,
            isAddItemActive: false,
        };
        this.formatFormData = this.formatFormData.bind(this);
        this.onRemoveItemsClick = this.onRemoveItemsClick.bind(this);
        this.onModalCrossClick = this.onModalCrossClick.bind(this);
        this.updateItemFeature = this.updateItemFeature.bind(this);
        this.addNewItemFeature = this.addNewItemFeature.bind(this);
        this.toggleItemFeatureModal = this.toggleItemFeatureModal.bind(this);
        this.onFieldValChange = this.onFieldValChange.bind(this);
    }


    toggleItemFeatureModal() {
        this.setState(prevState => ({ isCreateItemFeatureModalActive: !prevState.isCreateItemFeatureModalActive }))
    }

    componentDidMount() {
        const { getItemFeatures, itemCategoriesList, getItemCategories, userToken, vendorDetails } = this.props;
        if (userToken && get(vendorDetails, '_id')) {
            !itemCategoriesList && getItemCategories({
                userToken,
                isMobile: true,
                vendorId: vendorDetails._id
            });
            getItemFeatures({
                userToken,
                vendorId: vendorDetails._id
            })
        }
    }

    onModalCrossClick() {
        this.toggleItemFeatureModal();
        this.setState({
            name: '',
            errorJson: {}
        })
    }

    addNewItemFeature({ formData }) {

        const { addItemFeature, userToken, vendorDetails } = this.props;
        const { name, options, is_sale_based } = formData;

        this.setState({ isAddItemActive: true });

        vendorDetails && vendorDetails._id && addItemFeature && addItemFeature({
            isMobile: true,
            vendorId: vendorDetails._id,
            name,
            options,
            userToken,
            is_sale_based,
            onSuccess: _ => {
                this.setState({ isAddItemActive: false });
                this.onModalCrossClick();
            }
        });

    }

    updateItemFeature({ formData, onSuccess }) {
        const { updateItemFeature, userToken } = this.props;
        const updateJson = {
            name: formData.name,
            is_sale_based: formData.is_sale_based,
            options: formData.options,
        };
        const itemCat = get(formData, 'item_category_id', []);
        // alert(JSON.stringify(itemCat))

        if (itemCat.length > 0 && itemCat.indexOf('all') === -1) {
            updateJson['item_category_id'] = formData.item_category_id.map(_id => ({ _id }))
        }else{
            updateJson['item_category_id']=[];
        }
        updateItemFeature({
            userToken,
            recordId: formData._id,
            updateJson,
            onSuccess
        });

    }

    onRemoveItemsClick({ selectedItemIds }) {
        const { removeItemFeature } = this.props;
        selectedItemIds && removeItemFeature({
            itemIds: selectedItemIds
        })
    }

    formatFormData(data) {
        const finalFormData = { ...data };
        if (get(data, 'item_category_id', []).length > 0) {
            finalFormData['item_category_id'] = data.item_category_id.map(catVal => catVal._id)
        } else {
            finalFormData['item_category_id'] = ['all']
        }
        return finalFormData
    }

    onFieldValChange({ fieldDef, formData, onSuccess }) {
        // alert(JSON.stringify(formData));
        const finalFormData = { ...formData };
        const itemCat = get(finalFormData, 'item_category_id', []);
        // alert(JSON.stringify(itemCat[itemCat.length - 1]))
        if (itemCat[itemCat.length - 1] === "all") {
            finalFormData['item_category_id'] = ['all']
        } else if (itemCat.indexOf('all') > -1) {
            finalFormData.item_category_id.shift();
            // finalFormData['item_category_id'] = finalFormData.item_category_id.map(cat => cat !== 'all')
        }
        onSuccess({ formData: finalFormData })

    }

    render() {

        const { ItemFeaturesList, navigation, itemCategoriesList, isAppLoading } = this.props;
        const { isCreateItemFeatureModalActive, isAddItemActive } = this.state;

        return <VendorItemFeaturesListComp
            formatFormData={this.formatFormData}
            updateItemFeature={this.updateItemFeature}
            onRemoveItemsClick={this.onRemoveItemsClick}
            isAppLoading={isAppLoading}
            clickActions={[
                {
                    title: stringConstants.doneButtonTitle,
                    isLoading: isAddItemActive,
                    onClick: this.addNewItemFeature
                },
            ]}
            popupTitle={stringConstants.enterNewItemFeaturePageTitle}
            onFieldValChange={this.onFieldValChange}
            fieldGroups={[
                {
                    fields: [
                        {
                            isMandatory: true,
                            placeholder: stringConstants.nameFieldTitle,
                            name: 'name',
                        },
                        {
                            type: fieldTypes.fk,
                            displayKey: 'name',
                            placeholder: stringConstants.itemCategoryFieldLabel,
                            valueKey: '_id',
                            dataArray: itemCategoriesList ? [{
                                _id: "all",
                                name: "All"
                            }, ...itemCategoriesList] : [{ _id: "all", name: "All" }],
                            name: 'item_category_id',
                            multiple: true,
                        },
                        {
                            isMandatory: true,
                            multiple: true,
                            placeholder: stringConstants.itemFeaturesOptionFieldTitle,
                            name: 'options',
                        },
                        {
                            type: fieldTypes.boolean,
                            title: stringConstants.itemIsSaleBasedTitle,
                            name: 'is_sale_based',
                        },

                    ]
                }
            ]}
            onModalCrossClick={this.onModalCrossClick}
            isCreateItemFeatureModalActive={isCreateItemFeatureModalActive}
            toggleItemFeatureModal={this.toggleItemFeatureModal}
            navigation={navigation}
            ItemFeaturesList={ItemFeaturesList}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    vendorDetails: state.users.vendorDetails,
    ItemFeaturesList: state.itemFeature.ItemFeaturesList,
    itemCategoriesList: state.itemCategories.itemCategoriesList,
    isAppLoading: state.users.isAppLoading,
}), {
    getItemFeatures, getItemCategories, updateItemFeature, addItemFeature, removeItemFeature
})(ItemFeaturesList)

