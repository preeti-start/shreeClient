import React from 'react';
import { connect } from "react-redux";

import stringConstants from '../constants/mobileStringConstants';
import { Button, VendorItemCategoriesListComp } from '../mobileComponents/index';
import {
    getItemCategories,
    addItemCategory,
    removeItemCategory,
    updateItemCategory
} from '../redux-store/actions/itemCategoryActions';

class ItemCategoriesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isCreateItemCategoryModalActive: false,
            isAddItemActive: false,
        };
        this.updateItemCategory = this.updateItemCategory.bind(this);
        this.onRemoveItemsClick = this.onRemoveItemsClick.bind(this);
        this.onModalCrossClick = this.onModalCrossClick.bind(this);
        this.addNewItemCategory = this.addNewItemCategory.bind(this);
        this.toggleItemCategoryModal = this.toggleItemCategoryModal.bind(this);
    }


    toggleItemCategoryModal() {
        this.setState(prevState => ({ isCreateItemCategoryModalActive: !prevState.isCreateItemCategoryModalActive }))
    }

    componentDidMount() {
        const { getItemCategories, userToken, vendorDetails } = this.props;
        vendorDetails && vendorDetails._id && getItemCategories && getItemCategories({
            userToken,
            vendorId: vendorDetails._id
        })
    }

    onModalCrossClick() {
        this.toggleItemCategoryModal();
        this.setState({
            name: '',
            errorJson: {}
        })
    }

    addNewItemCategory({ formData }) {

        const { addItemCategory, userToken, vendorDetails } = this.props;
        const { name } = formData;
        this.setState({ isAddItemActive: true });

        userToken && vendorDetails && vendorDetails._id && addItemCategory && addItemCategory({
            isMobile: true,
            vendorId: vendorDetails._id,
            name,
            userToken,
            onSuccess: _ => {
                this.setState({ isAddItemActive: false });
                this.onModalCrossClick();
            }
        });

    }

    onRemoveItemsClick({ selectedItemIds }) {
        const { removeItemCategory } = this.props;
        selectedItemIds && removeItemCategory({
            itemIds: selectedItemIds
        })
    }

    updateItemCategory({ formData, onSuccess }) {
        const { updateItemCategory, userToken } = this.props;
        userToken && updateItemCategory({
            userToken,
            recordId: formData._id,
            isMobile: true,
            updateJson: { name: formData.name },
            onSuccess
        })
    }

    render() {

        const { itemCategoriesList, navigation, isAppLoading } = this.props;
        const { isCreateItemCategoryModalActive, isAddItemActive } = this.state;

        return <VendorItemCategoriesListComp
            updateItemCategory={this.updateItemCategory}
            onRemoveItemsClick={this.onRemoveItemsClick}
            isAppLoading={isAppLoading}
            clickActions={[
                {
                    isLoading: isAddItemActive,
                    title: stringConstants.doneButtonTitle,
                    onClick: this.addNewItemCategory
                },
            ]}
            fieldGroups={[
                {
                    fields: [
                        {
                            isMandatory: true,
                            placeholder: stringConstants.nameFieldTitle,
                            name: 'name',
                        },
                    ]
                }
            ]}
            onModalCrossClick={this.onModalCrossClick}
            isCreateItemCategoryModalActive={isCreateItemCategoryModalActive}
            toggleItemCategoryModal={this.toggleItemCategoryModal}
            navigation={navigation}
            itemCategoriesList={itemCategoriesList}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    vendorDetails: state.users.vendorDetails,
    itemCategoriesList: state.itemCategories.itemCategoriesList,
    isAppLoading: state.users.isAppLoading,
}), {
    getItemCategories, addItemCategory, removeItemCategory, updateItemCategory
})(ItemCategoriesList)

