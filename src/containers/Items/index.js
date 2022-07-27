import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux'

import { dbnames } from '../../constants'
import {
    uploadItemsInBulk,
    removeItem,
    updateItemsStatus,
    uploadItemSampleFile,
    getItems
} from '../../redux-store/actions/itemActions'
import { getItemCategories } from '../../redux-store/actions/itemCategoryActions'
import { getMeasuringUnits } from '../../redux-store/actions/measuringUnitsActions'
import { removeListRow, getVendorsListForFilter } from '../../redux-store/actions/userActions'
import PopUp from '../../components/Popup'
import { fieldTypes, roles, appButtonType, itemStatus } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import FormContainer from "../Form";
import InsertUpdateItem from "../InsertUpdateItem";
import Table from "../../components/AppCompLibrary/Table";
import InfiniteScroller from "../../components/AppCompLibrary/InfiniteScroller";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/AppCompLibrary/Button";
import { DelItemPopup } from "../../components/Items/delItemPopup";
import { getFinalPrizeString } from "../../utils/webFunctions";
import StringSearchInput from "../../components/AppCompLibrary/StringSearchInput";
import Checkbox from "../../components/AppCompLibrary/Checkbox";
import Input from "../../components/AppCompLibrary/Input";
import RadioButton from "../../components/AppCompLibrary/RadioButton";

import './index.css'

class ItemsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            itemCategoriesList: props.itemCategoriesList ? [{
                _id: appStringConstants.dropDownFirstOption,
                name: appStringConstants.dropDownFirstOption
            }, ...props.itemCategoriesList] : undefined,
            measuringUnitsList: props.measuringUnitsList ? [{
                _id: appStringConstants.dropDownFirstOption,
                name: appStringConstants.dropDownFirstOption
            }, ...props.measuringUnitsList] : undefined,
            itemNameFilter: '',
            selectedItemIds: [],
            isRemoveItemConfirmationPopupActive: false,
            isDataLoading: false,
            fileUploadPopup: false,
            itemStatusFilter: undefined,
            itemIdToBeRemoved: undefined,
            itemDetailsToBeUpdated: undefined,
            isAddUpdateItemPopupActive: false,
            isUpdateItemStatusPopupActive: false,
            vendorsFilter: appStringConstants.dropDownFirstOption,
            measuringUnitFilter: appStringConstants.dropDownFirstOption,
            itemCategoryFilter: appStringConstants.dropDownFirstOption,
        };
        this.onDownloadFileClick = this.onDownloadFileClick.bind(this);
        this.onItemStatusFilterChange = this.onItemStatusFilterChange.bind(this);
        this.onFiltersChange = this.onFiltersChange.bind(this);
        this.headerBottomView = this.headerBottomView.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.toggleUpdateItemStatusPopup = this.toggleUpdateItemStatusPopup.bind(this);
        this.showFileUploadPopup = this.showFileUploadPopup.bind(this);
        this.hideFileUploadPopup = this.hideFileUploadPopup.bind(this);
        this.onUploadClick = this.onUploadClick.bind(this);
        this.getFinalFilterSortOptions = this.getFinalFilterSortOptions.bind(this);
        this.getItemsList = this.getItemsList.bind(this);
        this.toggleAddUpdateItemPopup = this.toggleAddUpdateItemPopup.bind(this);
        this.toggleRemoveItemPopup = this.toggleRemoveItemPopup.bind(this);
        this.onRemoveItemConfirmation = this.onRemoveItemConfirmation.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onUpdateItemStatusClick = this.onUpdateItemStatusClick.bind(this);
        this.onItemNameFilterValueChange = this.onItemNameFilterValueChange.bind(this);
        this.headerRightView = this.headerRightView.bind(this);
        this.onEditItemButtonClick = this.onEditItemButtonClick.bind(this);
    }

    onItemNameFilterValueChange(val) {
        this.setState({
            itemNameFilter: val
        })
    }

    getFinalFilterSortOptions({ skipCount }) {
        const {
            itemNameFilter, itemStatusFilter, itemCategoryFilter, measuringUnitFilter, vendorsFilter
        } = this.state;
        let filter = {};

        if (itemStatusFilter !== undefined) filter['is_active'] = itemStatusFilter;
        if (itemNameFilter && itemNameFilter.length > 0) filter['name'] = { $regex: itemNameFilter };
        if (vendorsFilter && vendorsFilter !== appStringConstants.dropDownFirstOption) filter['vendor_id._id'] = vendorsFilter;
        if (measuringUnitFilter && measuringUnitFilter !== appStringConstants.dropDownFirstOption)
            filter['measuring_unit_id._id'] = measuringUnitFilter;
        if (itemCategoryFilter && itemCategoryFilter !== appStringConstants.dropDownFirstOption)
            filter['category_id._id'] = itemCategoryFilter;

        this.getItemsList({ filter, skipCount });

    }

    getItemsList({ skipCount = 0, filter = {} }) {

        const { getItems, userToken, userDetails, vendorDetails } = this.props;
        this.setState({ isDataLoading: true });
        userToken && userDetails.role && ((userDetails.role === roles.vendor &&
            vendorDetails && vendorDetails._id) || userDetails.role === roles.admin) && getItems && getItems({
            userToken,
            userId: userDetails.role === roles.vendor ? vendorDetails._id : undefined,
            skipCount,
            filters: filter,
            onSuccess: _ => {
                this.setState({ isDataLoading: false });
            },
            onError: _ => {
                this.setState({ isDataLoading: false });
            }
        })
    }

    onEditItemButtonClick(dataVal) {
        this.toggleAddUpdateItemPopup(dataVal)
    }

    componentDidMount() {
        const {
            measuringUnitsList, userDetails, vendorDetails, allVendors, userToken,
            getVendorsListForFilter, getMeasuringUnits, getItemCategories, itemCategoriesList
        } = this.props;
        const isAdmin = get(userDetails, 'role') === roles.admin;
        if (!allVendors && isAdmin) {
            getVendorsListForFilter && getVendorsListForFilter({ userToken });
        }
        const vendorId = get(vendorDetails, '_id');
        if (!itemCategoriesList && (isAdmin || (!isAdmin && vendorId))) {
            getItemCategories({
                userToken,
                onSuccess: ({ data }) => {
                    this.setState({
                        itemCategoriesList: [{
                            _id: appStringConstants.dropDownFirstOption,
                            name: appStringConstants.dropDownFirstOption
                        }, ...data]
                    })
                }, vendorId: (isAdmin ? undefined : vendorId)
            });
        }
        !measuringUnitsList && getMeasuringUnits({
            userToken, onSuccess: ({ data }) => {
                this.setState({
                    measuringUnitsList: [{
                        _id: appStringConstants.dropDownFirstOption,
                        name: appStringConstants.dropDownFirstOption
                    }, ...data]
                })
            }
        });
        this.getFinalFilterSortOptions({});
    }

    onUpdateItemStatusClick({ formData }) {
        const { updateItemsStatus, userToken } = this.props;
        const { selectedItemIds } = this.state;
        updateItemsStatus && updateItemsStatus({
            status: formData.status === itemStatus.active._id,
            userToken,
            selectedItemIds,
            onSuccess: this.toggleUpdateItemStatusPopup,
        })
    }

    toggleUpdateItemStatusPopup() {
        this.setState(prevState => ({
            selectedItemIds: prevState.isUpdateItemStatusPopupActive ? [] : prevState.selectedItemIds,
            isUpdateItemStatusPopupActive: !prevState.isUpdateItemStatusPopupActive
        }))
    }

    onRemoveItemConfirmation() {
        const { removeItem, removeListRow, userToken } = this.props;
        const { itemIdToBeRemoved } = this.state;
        const itemIds = [itemIdToBeRemoved];
        userToken && removeListRow && removeListRow({
            collection: dbnames.Items,
            userToken,
            itemIds,
            onError: this.toggleRemoveItemPopup,
            onSuccess: _ => {
                removeItem && removeItem({
                    itemIds,
                });
                this.toggleRemoveItemPopup();
            }
        })
    }


    toggleRemoveItemPopup(dataVal) {
        this.setState(prevState => ({
            itemIdToBeRemoved: dataVal && dataVal._id,
            isRemoveItemConfirmationPopupActive: !prevState.isRemoveItemConfirmationPopupActive
        }))
    }

    toggleAddUpdateItemPopup(dataVal) {
        this.setState(prevState => ({
            itemDetailsToBeUpdated: dataVal,
            isAddUpdateItemPopupActive: !prevState.isAddUpdateItemPopupActive
        }))
    }

    hideFileUploadPopup() {
        this.setState({
            fileUploadPopup: false,
        })
    }

    showFileUploadPopup() {
        this.setState({
            fileUploadPopup: true,
        })
    }


    onUploadClick({ formData }) {
        const { items_file } = formData;
        if (items_file && items_file.file) {
            const { uploadItemsInBulk, userToken, vendorDetails } = this.props;
            const data = new FormData();
            data.append('file', items_file.file);
            userToken && vendorDetails && vendorDetails._id && uploadItemsInBulk && uploadItemsInBulk({
                data,
                vendorId: vendorDetails._id,
                userToken,
                onSuccess: _ => {
                    this.hideFileUploadPopup();
                    this.getFinalFilterSortOptions({});
                }
            })
        }
    }

    onRowClick(row) {
        if (row && row._id) {
            this.setState(prevState => {
                if (prevState.selectedItemIds.indexOf(row._id) > -1) {
                    return { selectedItemIds: prevState.selectedItemIds.filter(val => val !== row._id) }
                } else {
                    return { selectedItemIds: [...prevState.selectedItemIds, row._id] }
                }
            })
        }
    }

    getColsList() {
        const { userDetails } = this.props;
        const { selectedItemIds } = this.state;
        const isAdmin = userDetails && userDetails.role && userDetails.role === roles.admin;
        let fieldsList = [];

        if (!isAdmin) {
            fieldsList.push({
                width: 1,
                "Cell": rowVal => <RadioButton
                    isActive={rowVal && rowVal._id && selectedItemIds.indexOf(rowVal._id) > -1}
                    value={rowVal._id}
                />
            })
        }
        fieldsList = [...fieldsList
            ,
            {
                width: 2,
                "label": appStringConstants.nameFieldTitle,
                "field": "name"
            },
            {
                width: 2,
                "label": appStringConstants.itemsListPriceFieldTitle,
                "field": "per_item_price",
                "Cell": rowVal => getFinalPrizeString({ data: rowVal })
            },
            {
                width: 2,
                "label": appStringConstants.itemsListDiscountFieldTitle,
                "field": "discount"
            },
            {
                width: 2,
                "label": appStringConstants.itemsListIsActiveFieldTitle,
                Cell: _ => <div>{_ && JSON.stringify(_.is_active)}</div>,
            },
            {
                width: 2,
                "label": appStringConstants.itemsListCategoryFieldTitle,
                Cell: _ => <div>{_ && _.category_id && _.category_id.name}</div>,
            },
            {
                width: 2,
                "label": appStringConstants.itemsListMeasuringUnitFieldTitle,
                Cell: _ => <div>{_ && _.measuring_unit_id && _.measuring_unit_id.name}</div>,
            },
            {
                width: 3,
                "label": appStringConstants.itemsListImagesFieldTitle,
                Cell: _ => <div>{_ && _.item_images && _.item_images.map((imgData, imgIndex) =>
                    <img className="item-img-list-style" key={`item_img_${imgIndex}`} src={imgData.url}/>
                )}</div>,
            },
        ];
        if (isAdmin) {
            // have to show vendor field only to admin
            fieldsList.push(
                {
                    width: 2, "label": appStringConstants.itemsListVendorFieldTitle,
                    Cell: _ => <div>{get(_, 'vendor_id.shop_name')}</div>,
                    "field": "vendor_id"
                }
            )
        }
        fieldsList.push({
            width: 1,
            "Cell": dataVal => <svg className="item-del-icon-style"
                                    onClick={_ => this.toggleRemoveItemPopup(dataVal)}
                                    viewBox="0 0 24 24">
                <use xlinkHref="#del_icon"/>
            </svg>
        });
        fieldsList.push({
            width: 1,
            "Cell": dataVal => <svg className="item-edit-icon-style"
                                    onClick={_ => this.onEditItemButtonClick(dataVal)}
                                    viewBox="0 0 24 24">
                <use xlinkHref="#edit-pencil-icon-gray"/>
            </svg>
        });
        return fieldsList;
    }

    onFiltersChange(value, key) {
        if (value && value.value) {
            this.setState(_ => ({ [key]: value.value }), _ => {
                this.getFinalFilterSortOptions({});
            });
        }
    }

    onItemStatusFilterChange(val) {
        this.setState({ itemStatusFilter: val ? val : undefined }, _ => {
            this.getFinalFilterSortOptions({});
        })
    }

    headerRightView() {
        const { userDetails } = this.props;
        let options = [];
        let isVendor = get(userDetails, 'role') === roles.vendor;

        if (isVendor) {
            options = [
                ...options,
                <Button
                    onClick={this.toggleUpdateItemStatusPopup}
                    buttonType={appButtonType.type_5}
                    title={appStringConstants.updateItemStatusButtonTitle}/>,
                <Button
                    onClick={this.showFileUploadPopup}
                    buttonType={appButtonType.type_5}
                    title={appStringConstants.uploadBulkButtonTitle}
                />,
                <Button onClick={this.toggleAddUpdateItemPopup}
                        title={appStringConstants.addItemButtonTitle}/>
            ]
        }
        return options
    }

    headerBottomView() {

        const { userDetails, allVendors } = this.props;
        const {
            itemNameFilter, measuringUnitsList, itemCategoryFilter,
            vendorsFilter, measuringUnitFilter, itemStatusFilter, itemCategoriesList
        } = this.state;
        let options = [];

        options.push(<div className="table-header-option">
            <StringSearchInput
                onClick={this.getFinalFilterSortOptions}
                onChange={this.onItemNameFilterValueChange}
                placeholder={appStringConstants.nameFieldPlaceholder}
                value={itemNameFilter}
            />
        </div>);

        options.push(<div className="table-header-option">
            <Checkbox
                containerStyle={"checkbox-body"}
                onValueChange={this.onItemStatusFilterChange}
                title={appStringConstants.itemsListIsActiveFieldTitle}
                value={itemStatusFilter}
            />
        </div>);

        if (get(userDetails, 'role') === roles.admin) {
            options.push(<div className="table-header-option">
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
            </div>);
        }
        options.push(<div className="table-header-option">
            <Input
                showDropDown={true}
                dropDownLabelKey={'name'}
                dropDownValueKey={'_id'}
                dropDownOptions={measuringUnitsList}
                onDropDownSelect={val => this.onFiltersChange(val, 'measuringUnitFilter')}
                inputValue={measuringUnitFilter}
                activeDropDownItemIndex={measuringUnitFilter}
                label={appStringConstants.itemsListMeasuringUnitFieldTitle}
            />
        </div>);
        options.push(<div className="table-header-option">
            <Input
                showDropDown={true}
                dropDownLabelKey={'name'}
                dropDownValueKey={'_id'}
                dropDownOptions={itemCategoriesList}
                onDropDownSelect={val => this.onFiltersChange(val, 'itemCategoryFilter')}
                inputValue={itemCategoryFilter}
                activeDropDownItemIndex={itemCategoryFilter}
                label={appStringConstants.itemCategoryFieldTitle}
            />
        </div>);

        return options
    }

    onDownloadFileClick() {
        const { vendorDetails, uploadItemSampleFile } = this.props;
        const vendor_id = get(vendorDetails, '_id');
        uploadItemSampleFile({ vendor_id })
    }

    render() {

        const { itemListData, userDetails } = this.props;
        let isVendor = get(userDetails, 'role') === roles.vendor;
        const {
            fileUploadPopup, isDataLoading, isUpdateItemStatusPopupActive, itemDetailsToBeUpdated,
            isRemoveItemConfirmationPopupActive, isAddUpdateItemPopupActive
        } = this.state;


        return <div className="item-list-container">
            <PageHeader
                rightView={!isVendor ? this.headerBottomView : this.headerRightView}
                bottomView={isVendor && this.headerBottomView}
                title={appStringConstants.itemsPageTitle}
            />
            {isUpdateItemStatusPopupActive &&
            <PopUp
                title={appStringConstants.updateItemStatusPopupTitle}
                onClose={this.toggleUpdateItemStatusPopup}
                renderScene={_ => <div className="status-popup">
                    <FormContainer
                        fieldGroups={
                            [
                                {
                                    fields: [
                                        {
                                            isMandatory: true,
                                            field: "status",
                                            type: fieldTypes.dropdown,
                                            displayKey: "name",
                                            valKey: "_id",
                                            label: appStringConstants.updateItemStatusFieldTitle,
                                            options: [itemStatus.active, itemStatus.in_active],
                                        },
                                    ]
                                },

                            ]}
                        clickActions={[
                            {
                                title: appStringConstants.updateButtonTitle,
                                onClick: this.onUpdateItemStatusClick
                            }
                        ]}
                    />
                </div>}
            />
            }
            {isAddUpdateItemPopupActive &&
            <PopUp
                title={appStringConstants.addEditItemPopupTitle}
                onClose={this.toggleAddUpdateItemPopup}
                renderScene={_ => <InsertUpdateItem
                    itemDetails={itemDetailsToBeUpdated}
                    onInsertUpdateItemSuccess={this.toggleAddUpdateItemPopup}/>}
            />
            }
            {isRemoveItemConfirmationPopupActive &&
            <PopUp
                title={appStringConstants.addEditItemPopupTitle}
                onClose={this.toggleRemoveItemPopup}
                footerActions={_ => <Button onClick={this.onRemoveItemConfirmation}
                                            title={appStringConstants.delButtonTitle}/>}
                renderScene={DelItemPopup}
            />
            }
            {fileUploadPopup &&
            <PopUp
                title={appStringConstants.bulkUploadPopupTitle}
                onClose={this.hideFileUploadPopup}
                renderScene={_ => <div className="file-upload-popup">
                    <FormContainer
                        fieldGroups={
                            [
                                {
                                    fields: [
                                        {
                                            fileType: '.xlsx',
                                            isMandatory: true,
                                            type: fieldTypes.file,
                                            getSignedUrl: false,
                                            field: "items_file",
                                            placeholder: appStringConstants.bulkUploadFileFieldPlaceholder,
                                            label: appStringConstants.bulkUploadFileFieldPlaceholder,
                                        },
                                    ]
                                },

                            ]}
                        clickActions={[
                            {
                                title: appStringConstants.bulkUploadUploadButtonClick,
                                onClick: this.onUploadClick
                            }
                        ]}
                    />
                    <div
                        className="file-download-action"
                        onClick={this.onDownloadFileClick}
                    >
                        {appStringConstants.bulkUploadItemSampleFileDownloadTitle}
                    </div>
                </div>}
            />}
            <InfiniteScroller
                isLoading={isDataLoading}
                scrollableTarget={'dashboard'}
                loadMore={this.loadMore}>
                <Table
                    onRowClick={this.onRowClick}
                    data={[{
                        isLoadingMore: itemListData && itemListData.isLoading && itemListData.data,
                        isLoading: itemListData && itemListData.isLoading && !itemListData.data,
                        data: itemListData && itemListData.data
                    }]}
                    columns={this.getColsList()}
                />
            </InfiniteScroller>

        </div>


    }

    loadMore() {
        const { itemListData } = this.props;
        if (itemListData && itemListData.data && itemListData.pagination && itemListData.data.length < itemListData.pagination.total_records) {
            this.getFinalFilterSortOptions({ skipCount: itemListData.data.length });
        }
    }

}

export default connect(state => ({
    vendorDetails: state.users.vendorDetails,
    userToken: state.users.userToken,
    userDetails: state.users.userDetails,
    itemCategoriesList: state.itemCategories.itemCategoriesList,
    measuringUnitsList: state.measuringUnits.measuringUnitsList,
    itemListData: state.items.itemListData,
    allVendors: state.users.allVendors,
}), {
    getMeasuringUnits, getVendorsListForFilter, uploadItemsInBulk, updateItemsStatus,
    uploadItemSampleFile, getItemCategories, removeListRow, removeItem, getItems
})(ItemsList)
