import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import stringConstants from '../constants/mobileStringConstants';
import { colors, fontStyle, fonts, fontSizes } from '../mobileTheme';
import { Button, PopUp } from './index';
import ListContainer from '../mobileContainers/ListContainer';
import FormContainer from '../mobileContainers/FormContainer';
import Header from "../mobileContainers/Header";
import AppDashboard from "./AppDashboard";
import { dbnames } from "../constants";

export default class ItemCategoriesList extends React.Component {


    render() {

        const {
            toggleItemCategoryModal, onModalCrossClick, fieldGroups, clickActions, onRemoveItemsClick,
            navigation, isCreateItemCategoryModalActive, itemCategoriesList, isAppLoading, isAddItemActive, updateItemCategory,
        } = this.props;

        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                navigation={navigation}
                title={stringConstants.itemCategoriesPageTitle}
                showMenuButton={true}
            />}
            detailView={({ scrollY }) => <View style={styles.container}>
                <ListContainer
                    scrollY={scrollY}
                    showRowUpdateAction={true}
                    formFieldGroups={fieldGroups}
                    onUpdateItemClick={updateItemCategory}
                    showMultiDelAction={true}
                    enableSelectItem={true}
                    onRemoveItemsClick={onRemoveItemsClick}
                    collection={dbnames.ItemCategories}
                    captionField={'name'}
                    sections={[
                        { data: [itemCategoriesList], key: undefined },
                    ]}
                    renderScene={({ rowData }) => <View style={styles.listContainer}>
                        <Text style={styles.listItemText}>{rowData && rowData.name}</Text>
                    </View>}
                />
                <PopUp
                    title={stringConstants.enterNewItemCategoryPageTitle}
                    isPopUpActive={isCreateItemCategoryModalActive}
                    onCrossPress={onModalCrossClick}
                    popupView={_ => <FormContainer
                        clickActions={clickActions}
                        fieldGroups={fieldGroups}
                    />}
                />
                <Button
                    isLoading={isAddItemActive}
                    ifFloating={true}
                    title={stringConstants.addButtonSymbol}
                    onPress={toggleItemCategoryModal}
                />
            </View>}
            isDashboardLoading={isAppLoading}
        />
    }
}


const styles = StyleSheet.create({
    listContainer: {},
    listItemText: {
        ...fontStyle,
        fontSize: fontSizes.size14, color: colors.BLACK
    },
    container: { flex: 1 },
    modalContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    modalBg: {
        maxHeight: 300,
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.PRIMARY_BG_COLOR_1
    },
    modalHeader: { flexDirection: "row", justifyContent: "flex-end" },
    modalCrossText: { fontSize: fontSizes.size20, fontWeight: "bold" },
});