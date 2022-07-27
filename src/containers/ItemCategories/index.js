import React from 'react';
import { connect } from 'react-redux';
import get from "lodash/get";

import {
    getItemCategories,
    addItemCategory,
    updateItemCategory,
    removeItemCategory
} from '../../redux-store/actions/itemCategoryActions'
import { removeListRow, getVendorsListForFilter } from '../../redux-store/actions/userActions'
import { dbnames } from '../../constants'
import { roles } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import ListContainer from "../ListContainer";
import Input from "../../components/AppCompLibrary/Input";

import './index.css'


class ItemCategories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vendorsFilter: appStringConstants.dropDownFirstOption,
        };
        this.getRightView = this.getRightView.bind(this);
        this.onFiltersChange = this.onFiltersChange.bind(this);
        this.getListData = this.getListData.bind(this);
        this.getFinalFilter = this.getFinalFilter.bind(this);
        this.onRemoveButtonClick = this.onRemoveButtonClick.bind(this);
        this.onSubmitCategoryButtonClick = this.onSubmitCategoryButtonClick.bind(this);
        this.onUpdateDataButtonClick = this.onUpdateDataButtonClick.bind(this);
    }

    componentDidMount() {
        const { allVendors, userDetails, getVendorsListForFilter, userToken } = this.props;
        const isAdmin = get(userDetails, 'role') === roles.admin;
        if (!allVendors && isAdmin) {
            getVendorsListForFilter && getVendorsListForFilter({ userToken });
        }
    }

    onRemoveButtonClick({ userToken, onError, onSuccess, dataToBeRemoved }) {
        const { removeItemCategory, removeListRow } = this.props;
        const itemIds = [dataToBeRemoved._id];
        removeListRow && removeListRow({
            collection: dbnames.ItemCategories,
            userToken,
            itemIds,
            onSuccess: _ => {
                onSuccess();
                removeItemCategory && removeItemCategory({
                    itemIds,
                });
            },
            onError,
        });

    }

    getFinalFilter() {
        const { vendorsFilter } = this.state;
        const filter = {};
        if (vendorsFilter && vendorsFilter !== appStringConstants.dropDownFirstOption) {
            filter['vendor_id._id'] = vendorsFilter
        }
        return filter
    }

    getListData({ userToken }) {
        const { userDetails, getItemCategories, vendorDetails } = this.props;
        userDetails && userToken && ((userDetails.role === roles.vendor && vendorDetails &&
            vendorDetails._id) || userDetails.role === roles.admin) && getItemCategories && getItemCategories({
            userToken,
            filter: this.getFinalFilter(),
            vendorId: userDetails.role === roles.vendor ? vendorDetails._id : undefined,
        })
    }

    onSubmitCategoryButtonClick({ onError, formData, userToken, onSuccess }) {
        const { addItemCategory, vendorDetails } = this.props;
        const { name } = formData;
        if (name && userToken && vendorDetails && vendorDetails._id && addItemCategory) {
            addItemCategory({
                userToken,
                onError,
                vendorId: vendorDetails._id,
                name,
                onSuccess
            })
        }
    }

    onUpdateDataButtonClick({ onError, formData, userToken, onSuccess }) {
        const { updateItemCategory } = this.props;
        updateItemCategory && formData && formData._id && updateItemCategory && updateItemCategory({
            onError,
            recordId: formData._id,
            userToken,
            updateJson: { "name": formData.name },
            onSuccess
        })
    }

    onFiltersChange(value, key) {
        const { userToken } = this.props;
        if (value && value.value) {
            this.setState(_ => ({ [key]: value.value }), _ => {
                this.getListData({ userToken });
            });
        }
    }

    getRightView() {
        const { allVendors, userDetails } = this.props;
        const { vendorsFilter } = this.state;
        const isAdmin = get(userDetails, 'role') === roles.admin;
        if (isAdmin) {
            return _ => <div className="table-header-option">
                <Input
                    showDropDown={true}
                    dropDownLabelKey={'shop_name'}
                    dropDownValueKey={'_id'}
                    dropDownOptions={allVendors}
                    onDropDownSelect={val => this.onFiltersChange(val, 'vendorsFilter')}
                    inputValue={vendorsFilter}
                    activeDropDownItemIndex={vendorsFilter}
                    label={appStringConstants.itemsListVendorFieldTitle}
                />
            </div>
        }
    }

    render() {

        const { itemCategoriesList, userDetails } = this.props;
        const fieldsList = [
            { width: 300, "label": appStringConstants.nameFieldTitle, "field": "name" },
        ];
        if (userDetails.role === roles.admin) {
            fieldsList.push({
                "label": appStringConstants.itemCategoryListVendorFieldTitle,
                width: 300,
                "Cell": dataVal => <div>{dataVal && dataVal.vendor_id && dataVal.vendor_id.shop_name}</div>
            })
        }

        return <ListContainer
            rightView={this.getRightView()}
            getListData={this.getListData}
            fieldsList={fieldsList}
            data={[{
                isLoading: itemCategoriesList === undefined,
                data: itemCategoriesList
            }]}
            showAddAction={userDetails && userDetails.role && userDetails.role === roles.vendor}
            showDelAction={true}
            showUpdateAction={userDetails && userDetails.role && userDetails.role === roles.vendor}
            delConfirmationMsg={appStringConstants.delItemCategoryPopupText}
            onUpdateDataButtonClick={this.onUpdateDataButtonClick}
            updateItemTitle={appStringConstants.updateItemCategoryPageTitle}
            delConfirmationTitle={appStringConstants.delItemCategoryPopupTitle}
            addItemTitle={appStringConstants.addItemCategoryPopupTitle}
            headerTitle={appStringConstants.itemCategoryPageTitle}
            onRemoveButtonClick={this.onRemoveButtonClick}
            addUpdateFormFields={[
                {
                    fields: [
                        {
                            isMandatory: true,
                            field: "name",
                            placeholder: appStringConstants.nameFieldPlaceholder,
                            label: appStringConstants.nameFieldPlaceholder,
                        },
                    ]
                },

            ]}
            onSubmitDataButtonClick={this.onSubmitCategoryButtonClick}
        />

    }
}

export default connect(state => ({
    vendorDetails: state.users.vendorDetails,
    allVendors: state.users.allVendors,
    userDetails: state.users.userDetails,
    userToken: state.users.userToken,
    itemCategoriesList: state.itemCategories.itemCategoriesList,
}), {
    getItemCategories, getVendorsListForFilter,
    removeListRow, removeItemCategory, updateItemCategory, addItemCategory
})(ItemCategories)