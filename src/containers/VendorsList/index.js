import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { getAllVendors, updateVendorDetails } from '../../redux-store/actions/userActions'
import Table from "../../components/AppCompLibrary/Table";
import appStringConstants from "../../constants/appStringConstants";
import { appButtonType, fieldTypes, itemStatus, useAdminLocationForDelivery } from "../../constants";
import InfiniteScroller from "../../components/AppCompLibrary/InfiniteScroller";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/AppCompLibrary/Button";
import RadioButton from "../../components/AppCompLibrary/RadioButton";
import Checkbox from "../../components/AppCompLibrary/Checkbox";
import StringSearchInput from "../../components/AppCompLibrary/StringSearchInput";
import PopUp from "../../components/Popup";
import FormContainer from "../Form";

import './index.css';


const initialState = {
    selectedItemIds: []
};
const activeStatus = 'active';

class VendorsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shopNumberFilter: '',
            isUpdateInProgress: false,
            isDataLoading: false,
            isUpdateStatusPopupActive: false,
            vendorAuthFilter: undefined,
            vendorStatusFilter: undefined,
            selectedItemIds: initialState.selectedItemIds
        };
        this.updateIsRecommendedStatus = this.updateIsRecommendedStatus.bind(this);
        this.onShopNumberFilterValueChange = this.onShopNumberFilterValueChange.bind(this);
        this.onVendorStatusFilterChange = this.onVendorStatusFilterChange.bind(this);
        this.onUpdateVendorStatusClick = this.onUpdateVendorStatusClick.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.getFinalFilters = this.getFinalFilters.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.toggleUpdateStatusPopup = this.toggleUpdateStatusPopup.bind(this);
        this.getVendorsList = this.getVendorsList.bind(this);
    }

    componentDidMount() {
        this.getVendorsList({})
    }

    updateIsRecommendedStatus({ val, data }) {
        const { updateVendorDetails, userToken } = this.props;
        updateVendorDetails({
            isListUpdate: true,
            is_recommended: val,
            userToken,
            vendorId: data._id,
        })
    }

    toggleUpdateStatusPopup() {
        this.setState(prevState => ({ isUpdateStatusPopupActive: !prevState.isUpdateStatusPopupActive }))
    }

    onShopNumberFilterValueChange(val) {
        this.setState({
            shopNumberFilter: val
        })
    }

    getFinalFilters() {
        const { vendorStatusFilter, shopNumberFilter, vendorAuthFilter } = this.state;
        const filter = {};
        if (shopNumberFilter && shopNumberFilter.length > 0) filter['shop_number'] = { $regex: shopNumberFilter };
        if (vendorStatusFilter !== undefined) filter['is_active'] = vendorStatusFilter;
        if (vendorAuthFilter !== undefined) filter['is_authorized'] = vendorAuthFilter;
        return filter;
    }

    getVendorsList({ skipCount = 0 }) {
        const { userToken, getAllVendors } = this.props;
        if (userToken && getAllVendors) {
            this.setState({ isDataLoading: true });
            getAllVendors({
                userToken,
                skipCount,
                filter: this.getFinalFilters(),
                onSuccess: _ => {
                    this.setState({ isDataLoading: false });
                },
                onError: _ => {
                    this.setState({ isDataLoading: false });
                }
            })
        }
    }

    loadMore() {
        const { allVendorsListData } = this.props;
        if (allVendorsListData && allVendorsListData.data && allVendorsListData.pagination &&
            allVendorsListData.data.length < allVendorsListData.pagination.total_records) {
            this.getVendorsList({ skipCount: allVendorsListData.data.length });
        }
    }

    onUpdateVendorStatusClick({ formData }) {
        const { status } = formData;
        const { updateVendorDetails, userToken } = this.props;
        const { selectedItemIds } = this.state;
        this.setState({ isUpdateInProgress: true });
        updateVendorDetails({
            isListUpdate: true,
            is_authorized: status === activeStatus,
            userToken,
            vendorId: selectedItemIds,
            selectedItemIds,
            onError: _ => {
                this.setState({ isUpdateInProgress: false })
            },
            onSuccess: _ => {
                this.toggleUpdateStatusPopup();
                this.setState({ selectedItemIds: initialState.selectedItemIds, isUpdateInProgress: false })
            }
        })
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

    getColList() {
        const { selectedItemIds } = this.state;
        const finalColumns = [
            {
                width: 50,
                Cell: rowVal => <RadioButton
                    isActive={rowVal && rowVal._id && selectedItemIds.indexOf(rowVal._id) > -1}
                    value={rowVal._id}
                />,
            },
            {
                width: 100, "label": appStringConstants.nameFieldTitle, "field": "name"
            },
            {
                width: 100, "label": appStringConstants.shopNameFieldTitle, "field": "shop_name"
            },
            {
                width: 100, "label": appStringConstants.shopNumberFieldTitle, "field": "shop_number"
            },
            {
                width: 100,
                "label": appStringConstants.vendorsListPhoneNumberFieldTitle,
                "field": "phone_no"
            },
            {
                width: 100,
                "label": appStringConstants.vendorListIsActiveFieldTitle,
                Cell: _ => <div>{_ && JSON.stringify(_.is_active)}</div>,
            },
            {
                width: 100,
                "label": appStringConstants.vendorListIsAuthorizedFieldTitle,
                Cell: _ => <div>{_ && JSON.stringify(_.is_authorized)}</div>,
            },
            {
                width: 100,
                "label": appStringConstants.shopListShopCategoryFieldTitle,
                Cell: _ => <div>{_ && _.shop_category_id && _.shop_category_id.name}</div>,
            },

        ];
        if (useAdminLocationForDelivery) {
            finalColumns.push({
                width: 100,
                "label": appStringConstants.vendorListIsHomeDeliveryActiveFieldTitle,
                Cell: _ => <div>{_ && JSON.stringify(_.is_home_delivery_active)}</div>,
            })
        }
        finalColumns.push({
            width: 100,
            "label": appStringConstants.vendorsListProfileImgFieldTitle,
            Cell: _ => <div>{_.profile_img && _.profile_img.url &&
            <img className="vendors-list-img" src={_.profile_img.url}/>}</div>,
        });
        finalColumns.push({
            width: 100,
            "label": appStringConstants.shopIsRecommendedFieldTitle,
            Cell: rowVal => <div className="recommended_checkbox">
                <Checkbox
                    containerStyle={"checkbox-body"}
                    onValueChange={val => this.updateIsRecommendedStatus({ val, data: rowVal })}
                    value={get(rowVal, 'is_recommended', false)}
                />
            </div>,
        });
        return finalColumns;
    }

    onVendorStatusFilterChange(val, key) {
        this.setState({ [key]: val ? val : undefined }, _ => {
            this.getVendorsList({});
        })
    }


    render() {

        const { allVendorsListData, isAppLoading } = this.props;
        const {
            isDataLoading, isUpdateStatusPopupActive, isUpdateInProgress,
            vendorAuthFilter, shopNumberFilter, vendorStatusFilter
        } = this.state;

        return <div className="vendors-list-container">
            <PageHeader
                rightView={_ => <>
                    <div className="table-header-option">
                        <StringSearchInput
                            onClick={this.getVendorsList}
                            onChange={this.onShopNumberFilterValueChange}
                            placeholder={appStringConstants.shopNumberFieldTitle}
                            value={shopNumberFilter}
                        />
                    </div>
                    <div className="table-header-option">
                        <Checkbox
                            containerStyle={"checkbox-body"}
                            onValueChange={val => this.onVendorStatusFilterChange(val, 'vendorStatusFilter')}
                            title={appStringConstants.itemsListIsActiveFieldTitle}
                            value={vendorStatusFilter}
                        />
                    </div>
                    <div className="table-header-option">
                        <Checkbox
                            containerStyle={"checkbox-body"}
                            onValueChange={val => this.onVendorStatusFilterChange(val, 'vendorAuthFilter')}
                            title={appStringConstants.vendorListIsAuthorizedFieldTitle}
                            value={vendorAuthFilter}
                        />
                    </div>
                    <Button
                        onClick={this.toggleUpdateStatusPopup}
                        title={appStringConstants.updateVendorStatusPopupTitle}/>
                </>}
                title={appStringConstants.vendorsListMenuTitle}
            />
            <InfiniteScroller
                isLoading={isDataLoading}
                scrollableTarget={'dashboard'}
                loadMore={this.loadMore}>
                <Table
                    onRowClick={this.onRowClick}
                    data={[{ isLoading: isAppLoading, data: allVendorsListData && allVendorsListData.data }]}
                    columns={this.getColList()}
                />
            </InfiniteScroller>
            {isUpdateStatusPopupActive && <PopUp
                title={appStringConstants.updateVendorStatusPopupTitle}
                onClose={this.toggleUpdateStatusPopup}
                renderScene={_ => (
                    <FormContainer
                        fieldGroups={[
                            {
                                fields: [
                                    {
                                        isMandatory: true,
                                        field: "status",
                                        type: fieldTypes.dropdown,
                                        displayKey: "name",
                                        valKey: "_id",
                                        label: appStringConstants.ordersListStatusFieldTitle,
                                        options: [
                                            { name: appStringConstants.activeOptionLabel, _id: 'in_active' },
                                            {
                                                name: appStringConstants.inActiveOptionLabel,
                                                _id: activeStatus
                                            }
                                        ],
                                    }
                                ]
                            }]}
                        clickActions={[{
                            isLoading: isUpdateInProgress,
                            title: appStringConstants.updateButtonTitle,
                            onClick: this.onUpdateVendorStatusClick
                        }]}
                    />
                )}
            />}

        </div>


    }
}

export default connect(state => ({
    isAppLoading: state.users.isAppLoading,
    userToken: state.users.userToken,
    allVendorsListData: state.users.allVendorsListData,
}), { getAllVendors, updateVendorDetails })(VendorsList)
