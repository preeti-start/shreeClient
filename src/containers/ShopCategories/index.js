import React from 'react';
import { connect } from 'react-redux';

import './index.css';
import {
    getShopCategories,
    addShopCategory,
    updateShopCategory,
    removeShopCategory
} from '../../redux-store/actions/shopCategoryActions'
import appStringConstants from "../../constants/appStringConstants";
import ListContainer from "../ListContainer";
import { AWSImageBuckets, fieldTypes } from "../../constants";

class ShopCategories extends React.Component {

    constructor(props) {
        super(props);
        this.getListData = this.getListData.bind(this);
        this.onRemoveButtonClick = this.onRemoveButtonClick.bind(this);
        this.onSubmitCategoryButtonClick = this.onSubmitCategoryButtonClick.bind(this);
        this.onUpdateDataButtonClick = this.onUpdateDataButtonClick.bind(this);
    }


    onRemoveButtonClick({ userToken, dataToBeRemoved, onSuccess, onError }) {
        const { removeShopCategory } = this.props;
        dataToBeRemoved && dataToBeRemoved._id && userToken && removeShopCategory && removeShopCategory({
            userToken,
            recordId: dataToBeRemoved._id,
            onSuccess,
            onError,
        })
    }

    getListData({ userToken }) {
        const { getShopCategories } = this.props;
        userToken && getShopCategories && getShopCategories({
            userToken,
        })
    }

    onSubmitCategoryButtonClick({ onError, formData, onSuccess, userToken }) {
        const { addShopCategory } = this.props;
        const { name, img, description } = formData;

        name && userToken && addShopCategory && addShopCategory({
            userToken,
            name,
            onSuccess,
            onError,
            img,
            description,
        })
    }

    onUpdateDataButtonClick({ formData, userToken, onError, onSuccess }) {
        const { updateShopCategory } = this.props;
        if (updateShopCategory && formData && formData._id) {
            updateShopCategory({
                onError,
                recordId: formData._id,
                userToken,
                onSuccess,
                updateJson: { "name": formData.name, "description": formData.description },
                img: formData.img
            })
        }
    }

    render() {

        const { shopCategoriesList } = this.props;

        return <ListContainer
            getListData={this.getListData}
            fieldsList={[
                { width: 100, "label": appStringConstants.nameFieldTitle, "field": "name" },
                { width: 200, "label": appStringConstants.descFieldTitle, "field": "description" },
                {
                    width: 200,
                    label: appStringConstants.categoryImgTitle,
                    Cell: _ => _ && _.img ? <img className="img-style" src={_.img.url}/> : null,
                }
            ]}
            data={[{
                isLoading: !shopCategoriesList,
                data: shopCategoriesList
            }]}
            showAddAction={true}
            showUpdateAction={true}
            showDelAction={true}
            onUpdateDataButtonClick={this.onUpdateDataButtonClick}
            delConfirmationMsg={appStringConstants.delShopCategoryPopupText}
            delConfirmationTitle={appStringConstants.delShopCategoryPopupTitle}
            addItemTitle={appStringConstants.addShopCategoryPopupTitle}
            updateItemTitle={appStringConstants.updateShopCategoryPopupTitle}
            headerTitle={appStringConstants.shopCategoriesMenuTitle}
            onRemoveButtonClick={this.onRemoveButtonClick}
            addUpdateFormFields={[
                {
                    fields: [
                        {
                            field: "name",
                            placeholder: appStringConstants.nameFieldPlaceholder,
                            label: appStringConstants.nameFieldTitle,
                        },
                        {
                            field: "description",
                            placeholder: appStringConstants.descFieldTitle,
                            label: appStringConstants.descFieldTitle,
                        },
                        {
                            type: fieldTypes.image,
                            field: "img",
                            awsBucketName: AWSImageBuckets.shop_categories,
                            placeholder: appStringConstants.categoryImgTitle,
                        },
                    ]
                },

            ]}
            onSubmitDataButtonClick={this.onSubmitCategoryButtonClick}
        />
    }
}

export default connect(state => ({
    shopCategoriesList: state.shopCategories.shopCategoriesList,
}), { getShopCategories, updateShopCategory, removeShopCategory, addShopCategory })(ShopCategories)