import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import PopUp from '../mobileComponents/AppComponents/PopUp'
import stringConstants from '../constants/mobileStringConstants';
import { colors, fontStyle, fonts, fontSizes } from '../mobileTheme';
import { Button } from './index';
import ListContainer from '../mobileContainers/ListContainer';
import FormContainer from '../mobileContainers/FormContainer';
import Header from "../mobileContainers/Header";
import AppDashboard from "./AppDashboard";
import { dbnames } from "../constants";

export default class ItemFeaturesList extends React.Component {


    render() {

        const {
            toggleItemFeatureModal, onModalCrossClick, fieldGroups,
            formatFormData, updateItemFeature, clickActions, onRemoveItemsClick,
            navigation, isCreateItemFeatureModalActive, onFieldValChange, ItemFeaturesList, isAppLoading, popupTitle
        } = this.props;

        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                navigation={navigation}
                title={stringConstants.itemFeaturesPageTitle}
                showMenuButton={true}
            />}
            detailView={({ scrollY }) => <View style={styles.container}>
                <ListContainer
                    scrollY={scrollY}
                    formatFormData={formatFormData}
                    onUpdateItemClick={updateItemFeature}
                    formFieldGroups={fieldGroups}
                    onFormFieldValChange={onFieldValChange}
                    showRowUpdateAction={true}
                    showMultiDelAction={true}
                    enableSelectItem={true}
                    onRemoveItemsClick={onRemoveItemsClick}
                    collection={dbnames.ItemFeatures}
                    captionField={'name'}
                    sections={[
                        { data: [ItemFeaturesList], key: undefined },
                    ]}
                    renderScene={({ rowData }) => <View style={styles.listContainer}>
                        <View style={styles.listTopSection}>
                            <Text style={styles.listItemText}>{rowData && rowData.name}</Text>
                            {rowData.hasOwnProperty('is_sale_based') && rowData.is_sale_based === true &&
                            <View style={styles.isSaleBasedContainer}>
                                <Text style={styles.isSaleBasedText}>{stringConstants.itemIsSaleBasedTitle}</Text>
                            </View>}
                        </View>
                        <Text style={styles.optionsStyle}>
                            {rowData.options && rowData.options.join(', ')}
                        </Text>
                    </View>}
                />
                <PopUp
                    isPopUpActive={isCreateItemFeatureModalActive}
                    onCrossPress={onModalCrossClick}
                    title={popupTitle}
                    popupView={_ => <FormContainer
                        clickActions={clickActions}
                        fieldGroups={fieldGroups}
                    />}
                />
                <Button
                    ifFloating={true}
                    title={stringConstants.addButtonSymbol}
                    onPress={toggleItemFeatureModal}
                />
            </View>}
            isDashboardLoading={isAppLoading}
        />
    }
}


const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 10
    },
    listTopSection: { flexDirection: 'row' },
    optionsStyle: { ...fontStyle, fontSize: fontSizes.size10, color: colors.BLACK_SHADE_20 },
    isSaleBasedText: {
        fontFamily: fonts.MeriendaOneRegular,
        fontSize: fontSizes.size8,
        color: colors.BLACK_SHADE_60
    },
    isSaleBasedContainer: {
        backgroundColor: colors.PRIMARY_BG_COLOR_2,
        marginLeft: 10,
        padding: 4,
        borderRadius: 5
    },
    listItemText: {
        ...fontStyle, color: colors.BLACK
    },
    container: { flex: 1 },
});