import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';

import { List, PopUp } from "../mobileComponents/AppComponents/index";
import { removeListRow } from "../redux-store/actions/userActions";
import stringConstants from "../constants/mobileStringConstants";
import appStringConstants from "../constants/appStringConstants";
import { defaultValForSortAndFilters } from "../constants/index";
import { RemoveItemPopup, FilterPopup } from "../mobileComponents";
import FormContainer from "./FormContainer";

class ListContainer extends React.Component {

    static defaultProps = {
        listAnimation: undefined,
        showAnimation: true,
        showMultiDelAction: false,
        rowActions: [],
        headerActions: [],
        showRowDelAction: false,
        showRowUpdateAction: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            isUpdateItemPopupActive: false,
            isRemoveItemsPopupActive: false,
            isUpdateItemsInProgress: false,
            isRemoveItemsInProgress: false,
            isFilterPopupActive: false,
        };
        this.onUpdateItemClick = this.onUpdateItemClick.bind(this);
        this.onClearFilterPress = this.onClearFilterPress.bind(this);
        this.onFiltersSelect = this.onFiltersSelect.bind(this);
        this.getFinalHeadersList = this.getFinalHeadersList.bind(this);
        this.onRemoveItemsClick = this.onRemoveItemsClick.bind(this);
        this.toggleFilterPopup = this.toggleFilterPopup.bind(this);
        this.toggleDeleteItemPopup = this.toggleDeleteItemPopup.bind(this);
        this.toggleUpdateItemPopup = this.toggleUpdateItemPopup.bind(this);
    }

    toggleDeleteItemPopup(data) {
        this.setState(prevState => ({
            selectedItemIds: data && data.selectedItemIds ? data.selectedItemIds : [],
            onSelectedItemRemoveSuccess: data && data.onSuccess,
            isRemoveItemsPopupActive: !prevState.isRemoveItemsPopupActive
        }))
    }

    toggleUpdateItemPopup(data) {
        const { formatFormData } = this.props;
        let updateItemPopupData = undefined;
        if (get(data, 'data')) {
            updateItemPopupData = formatFormData ? formatFormData(data.data) : data.data
        }
        this.setState(prevState => ({
            updateItemPopupData,
            isUpdateItemPopupActive: !prevState.isUpdateItemPopupActive
        }))

    }

    toggleFilterPopup() {
        this.setState(prevState => ({
            isFilterPopupActive: !prevState.isFilterPopupActive
        }))
    }

    onRemoveItemsClick() {
        const { onRemoveItemsClick, userToken, collection, removeListRow } = this.props;
        const { selectedItemIds, onSelectedItemRemoveSuccess } = this.state;
        this.setState({ isRemoveItemsInProgress: true });
        userToken && collection && removeListRow && removeListRow({
            itemIds: selectedItemIds,
            userToken,
            isMobile: true,
            collection,
            onError: _ => {
                this.setState({ isRemoveItemsInProgress: false })
            },
            onSuccess: _ => {
                onSelectedItemRemoveSuccess();
                this.setState({ isRemoveItemsInProgress: false });
                this.toggleDeleteItemPopup();
                onRemoveItemsClick && onRemoveItemsClick({
                    selectedItemIds
                });
            }
        });
    }

    getFinalHeadersList() {
        const { headerActions, showMultiDelAction } = this.props;
        const finalHeaderActions = [...headerActions];
        if (showMultiDelAction) {
            finalHeaderActions.push({
                title: stringConstants.deleteItemsStatusTitle,
                showOnItemSelect: true,
                onClick: this.toggleDeleteItemPopup
            })
        }
        return finalHeaderActions;
    }

    onFiltersSelect({ filterData }) {
        const { onFiltersSelect } = this.props;
        onFiltersSelect && onFiltersSelect({ filterData });
        this.setState({ filterData });
        this.toggleFilterPopup();
    }

    onClearFilterPress() {
        const { onFiltersSelect } = this.props;
        const finalFilter = defaultValForSortAndFilters.searchFilters;
        this.setState({ filterData: finalFilter });
        this.toggleFilterPopup();
        onFiltersSelect && onFiltersSelect({ filterData: finalFilter })
    }

    onUpdateItemClick({ formData }) {
        const { onUpdateItemClick } = this.props;
        this.setState({ isUpdateItemsInProgress: true });
        onUpdateItemClick({
            formData,
            onSuccess: _ => {
                this.toggleUpdateItemPopup();
                this.setState({ isUpdateItemsInProgress: false });
            }
        });

    }

    render() {

        const {
            isRemoveItemsPopupActive, backgroundColor, isUpdateItemPopupActive,
            rowStyle, updateItemPopupData, showAnimation, listAnimation,
            isFilterPopupActive, scrollY, filterData, isRemoveItemsInProgress, iconStyle,
            isUpdateItemsInProgress, renderDefaultWhileLoading, showIcon, iconName
        } = this.state;
        const { searchByFields, showRowDelAction, showRowUpdateAction, rowActions, onFormFieldValChange, formFieldGroups } = this.props;

        return <View style={styles.container}>
            <List
                iconStyle={iconStyle}
                iconName={iconName}
                showIcon={showIcon}
                scrollY={scrollY}
                listAnimation={listAnimation}
                showAnimation={showAnimation}
                rowActions={rowActions}
                renderDefaultWhileLoading={renderDefaultWhileLoading}
                backgroundColor={backgroundColor}
                rowStyle={rowStyle}
                toggleUpdateItemPopup={this.toggleUpdateItemPopup}
                showRowDelAction={showRowDelAction}
                showRowUpdateAction={showRowUpdateAction}
                searchByFields={searchByFields}
                toggleDeleteItemPopup={this.toggleDeleteItemPopup}
                filterData={filterData}
                onFilterClick={this.toggleFilterPopup}
                {...this.props}
                headerActions={this.getFinalHeadersList()}
            />
            <PopUp
                title={appStringConstants.removeItemsPopupTitle}
                isPopUpActive={isRemoveItemsPopupActive}
                onCrossPress={this.toggleDeleteItemPopup}
                popupView={_ => <RemoveItemPopup
                    isActionActive={isRemoveItemsInProgress}
                    onRemoveItemsClick={this.onRemoveItemsClick}
                />}
            />
            <PopUp
                isPopUpActive={isUpdateItemPopupActive}
                onCrossPress={this.toggleUpdateItemPopup}
                title={appStringConstants.updatePopupTitle}
                popupView={_ => <FormContainer
                    formData={updateItemPopupData}
                    onFieldValChange={onFormFieldValChange}
                    fieldGroups={formFieldGroups}
                    clickActions={[
                        {
                            isLoading: isUpdateItemsInProgress,
                            title: stringConstants.updateButtonTitle,
                            onClick: this.onUpdateItemClick
                        },
                    ]}
                />}
            />
            <PopUp
                title={appStringConstants.filtersTitle}
                animationType={'none'}
                viewAnimation={'fadeInUp'}
                containerStyle={{
                    justifyContent: 'flex-end',
                    padding: 0,
                    paddingHorizontal: 0,
                }}
                isPopUpActive={isFilterPopupActive}
                onCrossPress={this.toggleFilterPopup}
                popupView={_ => <FilterPopup
                    filterData={filterData}
                    onClearFilterPress={this.onClearFilterPress}
                    onFiltersSelect={this.onFiltersSelect}
                    searchByFields={searchByFields}
                />}
            />
        </View>
    }
}

export default connect(state => ({
    userToken: state.users.userToken,
}), { removeListRow })(ListContainer)

const styles = StyleSheet.create({
    container: { flex: 1 }
});