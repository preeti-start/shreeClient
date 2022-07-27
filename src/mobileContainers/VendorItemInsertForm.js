import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { insertNewItem, updateItemDetails } from '../redux-store/actions/itemActions';
import { getItemCategories } from '../redux-store/actions/itemCategoryActions';
import { getMeasuringUnits } from '../redux-store/actions/measuringUnitsActions';
import { getItemFeatures } from '../redux-store/actions/itemFeaturesActions';
import stringConstants from "../constants/mobileStringConstants";
import { fieldTypes, AWSImageBuckets, maxItemImageCount } from "../constants/index";
import FormContainer from "./FormContainer";
import Header from "./Header";
import AppDashboard from "../mobileComponents/AppDashboard";
import { colors, fontSizes, sizes, fontStyle, fonts } from '../mobileTheme';

const initialState = {
    itemFeaturesMapping: {}
};

class ItemInsertForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { itemFeaturesMapping: initialState.itemFeaturesMapping };
        this.onFeatureSelect = this.onFeatureSelect.bind(this);
        this.renderItemFeatures = this.renderItemFeatures.bind(this);
        this.getFinalItemFeaturesList = this.getFinalItemFeaturesList.bind(this);
        this.onFieldValChange = this.onFieldValChange.bind(this);
        this.onInsertButtonClick = this.onInsertButtonClick.bind(this);
    }

    componentDidMount() {

        const {
            getItemCategories, ItemFeaturesList, itemCategoriesList, measuringUnitsList,
            getItemFeatures, navigation, getMeasuringUnits, userToken, vendorDetails
        } = this.props;

        if (userToken) {
            if (vendorDetails && vendorDetails._id) {
                !itemCategoriesList && getItemCategories({
                    userToken,
                    isMobile: true,
                    vendorId: vendorDetails._id
                });
                let itemFeaturesMapping = {};
                if (get(navigation, 'state.params.formData.item_features')) {
                    const features = navigation.state.params.formData.item_features;
                    for (const featureIndex in features) {
                        if (get(features, `${featureIndex}.feature_id`) && get(features, `${featureIndex}.options`, []).length > 0) {
                            itemFeaturesMapping[features[featureIndex].feature_id] = features[featureIndex].options;
                        }
                    }
                }
                // alert(JSON.stringify(itemFeaturesMapping))
                if (!ItemFeaturesList) {
                    getItemFeatures({
                        userToken,
                        isMobile: true,
                        vendorId: vendorDetails._id,
                        onSuccess: ({ data }) => {
                            const { navigation } = this.props;
                            let finalItemFeatureList = data;
                            if (get(navigation, 'state.params.formData.category_id')) {
                                const categoryId = get(navigation, 'state.params.formData.category_id');
                                finalItemFeatureList = this.getFinalItemFeaturesList({ categoryId, data })
                            }
                            this.setState({ ItemFeaturesList: finalItemFeatureList, itemFeaturesMapping })
                        }
                    });
                } else {
                    let finalItemFeatureList = ItemFeaturesList;
                    if (get(navigation, 'state.params.formData.category_id')) {
                        const categoryId = get(navigation, 'state.params.formData.category_id');
                        finalItemFeatureList = this.getFinalItemFeaturesList({ categoryId, data: ItemFeaturesList })
                    }
                    this.setState({ ItemFeaturesList: finalItemFeatureList, itemFeaturesMapping })
                }

            }
            !measuringUnitsList && getMeasuringUnits({
                userToken,
                isMobile: true,
            })
        }

    }


    onInsertButtonClick({ formData }) {

        const { itemFeaturesMapping } = this.state;
        const { insertNewItem, vendorDetails, userToken, updateItemDetails } = this.props;
        const {
            name, item_images, maintain_stock, discount, item_code, set_count, allow_negative_stock,
            is_active, description, per_item_price, category_id, measuring_unit_id,
        } = formData;
        const finalItemFeaturesList = [];

        for (const featureIndex in itemFeaturesMapping) {
            if (itemFeaturesMapping[featureIndex].length > 0) {
                finalItemFeaturesList.push({
                    options: itemFeaturesMapping[featureIndex],
                    feature_id: { _id: featureIndex }
                })
            }
        }

        if (formData && formData._id) {
            if (userToken && updateItemDetails) {
                updateItemDetails({
                    userToken,
                    updateJson: {
                        item_features: finalItemFeaturesList,
                        measuring_unit_id: { "_id": measuring_unit_id },
                        category_id: { "_id": category_id },
                        name,
                        is_active,
                        description,
                        allow_negative_stock,
                        maintain_stock,
                        per_item_price,
                        item_code,
                        set_count,
                        discount,
                    },
                    onSuccess: _ => {
                        const { navigation } = this.props;
                        navigation.goBack();
                    },
                    itemImages: item_images,
                    itemId: formData._id,
                })
            }

        } else {
            if (userToken && vendorDetails && vendorDetails._id && insertNewItem) {
                let insertJson = {
                    maintain_stock,
                    item_code,
                    set_count,
                    discount,
                    allow_negative_stock,
                    name,
                    is_active,
                    description,
                    per_item_price,
                    item_features: finalItemFeaturesList,
                    "vendor_id": { "_id": vendorDetails._id }
                };
                if (category_id) {
                    insertJson['category_id'] = { "_id": category_id }
                }
                if (measuring_unit_id) {
                    insertJson['measuring_unit_id'] = { "_id": measuring_unit_id }
                }
                insertNewItem({
                    userToken,
                    itemImages: item_images,
                    onSuccess: _ => {
                        const { navigation } = this.props;
                        navigation.goBack();
                    },
                    isMobile: true,
                    finalInsertJson: insertJson
                })
            }
        }
    }


    getIdMapping({ data = [] }) {
        const finalMapping = {};
        for (const featureId in data) {
            finalMapping[data[featureId]._id] = data[featureId]
        }
        return finalMapping;
    }

    getFieldsList() {

        const { itemCategoriesList, measuringUnitsList } = this.props;

        return [
            {
                fields: [
                    {
                        placeholder: stringConstants.nameFieldTitle,
                        name: 'name',
                        isMandatory: true,
                    },
                    {
                        type: fieldTypes.number,
                        placeholder: stringConstants.itemFormPriceFieldLabel,
                        name: 'per_item_price',
                        isMandatory: true,
                    },
                    {
                        type: fieldTypes.fk,
                        displayKey: 'name',
                        valueKey: '_id',
                        placeholder: stringConstants.itemFormCategoryFieldLabel,
                        dataArray: itemCategoriesList,
                        name: 'category_id',
                    },
                    {
                        type: fieldTypes.fk,
                        displayKey: 'name',
                        placeholder: stringConstants.itemFormMeasuringUnitFieldLabel,
                        valueKey: '_id',
                        dataArray: measuringUnitsList,
                        isMandatory: true,
                        name: 'measuring_unit_id',
                    },
                    // {
                    //     editable: false, // todo : has tobe tested
                    //     type: fieldTypes.number,
                    //     title: stringConstants.itemFormQuantityFieldLabel,
                    //     name: 'quantity',
                    // },
                    {
                        type: fieldTypes.boolean,
                        title: stringConstants.itemFormIsItemActiveFieldLabel,
                        name: 'is_active',
                    },
                    // {
                    //     type: fieldTypes.boolean,
                    //     title: stringConstants.itemFormMainStockFieldLabel,
                    //     name: 'maintain_stock',
                    // },
                    // {
                    //     type: fieldTypes.boolean,
                    //     title: stringConstants.itemFormAllowNegativeStockFieldLabel,
                    //     name: 'allow_negative_stock',
                    // },
                    {
                        type: fieldTypes.image,
                        multiple: true,
                        maxLimit: maxItemImageCount,
                        name: 'item_images',
                        title: stringConstants.itemFormImagesFieldLabel,
                        awsBucketName: AWSImageBuckets.item_images,
                    },
                    {
                        placeholder: stringConstants.descriptionFieldLabel,
                        name: 'description',
                        multiline: true,
                    },
                    {
                        placeholder: stringConstants.itemCodeFieldLabel,
                        name: 'item_code',
                    },
                    {
                        type: fieldTypes.number,
                        placeholder: stringConstants.itemFormDiscountFieldLabel,
                        name: 'discount',
                    },
                    {
                        type: fieldTypes.number,
                        placeholder: stringConstants.setCountFieldLabel,
                        name: 'set_count',
                    },
                    // {
                    //     type: fieldTypes.object,
                    //     multiple: true,
                    //     name: 'item_features',
                    //     title: stringConstants.itemDetailsBlockTitle,
                    //     fields: [
                    //         {
                    //             type: fieldTypes.fk,
                    //             displayKey: 'name',
                    //             placeholder: stringConstants.itemFormFeatureFieldLabel,
                    //             valueKey: '_id',
                    //             width: 1,
                    //             resetOnSelect: ['options'],
                    //             dataArray: ItemFeaturesList,
                    //             isMandatory: true,
                    //             name: 'feature_id',
                    //         },
                    //         {
                    //             type: fieldTypes.string,
                    //             multiple: true,
                    //             title: stringConstants.itemFormFeatureOptionFieldLabel,
                    //             placeholder: stringConstants.itemFormFeatureOptionFieldLabel,
                    //             name: 'options',
                    //             width: 1,
                    //             renderView: ({ formData, onFieldClick, fieldName }) => {
                    //                 if (formData && formData.feature_id && ItemFeaturesIdMapping.hasOwnProperty(formData.feature_id) &&
                    //                     ItemFeaturesIdMapping[formData.feature_id].options) {
                    //                     return <View style={styles.optionsContainer}>
                    //                         {ItemFeaturesIdMapping[formData.feature_id].options.map(option => <View
                    //                             style={styles.optionBox}>
                    //                             <Checkbox
                    //                                 value={option && formData.options &&
                    //                                 formData.options.indexOf(option) > -1}
                    //                                 onValueChange={_ => {
                    //                                     const previousVal = formData.options ? formData.options : [];
                    //                                     onFieldClick && onFieldClick({
                    //                                         val: previousVal.indexOf(option) > -1 ?
                    //                                             previousVal.filter(feature => feature !== option) :
                    //                                             [...previousVal, option],
                    //                                         fieldName
                    //                                     });
                    //                                 }}
                    //                             />
                    //                             <Text style={styles.optionTitle}>{option}</Text>
                    //                         </View>)}
                    //                     </View>
                    //                 }
                    //                 return null;
                    //             }
                    //         },
                    //     ]
                    // },
                ]
            }
        ]
    }

    onFieldValChange({ fieldDef, formData, onSuccess }) {
        // alert(JSON.stringify(fieldDef));
        // const featureMapping = [];
        // let errorJson = {};
        // if (fieldDef && fieldDef.name && (fieldDef.name === 'item_features')) {
        //     if (formData && fieldDef && fieldDef.name && formData[fieldDef.name] && formData[fieldDef.name].length > 0) {
        //         for (const index in formData[fieldDef.name]) {
        //             if (formData[fieldDef.name][index].feature_id && featureMapping.indexOf(formData[fieldDef.name][index].feature_id) !== -1) {
        //                 errorJson = { [fieldDef.name]: stringConstants.sameFeatureTwiceNotSupportedNotice };
        //             } else {
        //                 featureMapping.push(formData[fieldDef.name][index].feature_id)
        //             }
        //         }
        //     }
        //     onSuccess({ formData, errorJson })
        // } else {
        //     onSuccess({ formData })
        // }


        // alert('fieldDef ' + JSON.stringify(fieldDef))
        const { ItemFeaturesList } = this.props;
        if (get(fieldDef, 'name') === 'category_id') {
            const categoryId = formData[fieldDef.name];
            // alert('categoryId ' + JSON.stringify(categoryId));

            this.setState({
                ItemFeaturesList: this.getFinalItemFeaturesList({ categoryId, data: ItemFeaturesList }),
                itemFeaturesMapping: initialState.itemFeaturesMapping
            })
        }
        onSuccess({ formData })
    }

    getFinalItemFeaturesList({ categoryId, data = [] }) {

        let finalFeatureList = [];

        for (const featureCount in data) {
            if (get(data[featureCount], 'item_category_id', []).length > 0) {
                for (const catCount in data[featureCount].item_category_id) {
                    if (data[featureCount].item_category_id[catCount]._id === categoryId) {
                        finalFeatureList = [...finalFeatureList, data[featureCount]]
                    }
                }
            } else {
                finalFeatureList = [...finalFeatureList, data[featureCount]]
            }
        }
        return finalFeatureList
    }

    onFeatureSelect({ feature, option }) {

        const { itemFeaturesMapping } = this.state;

        if (!itemFeaturesMapping.hasOwnProperty(feature._id)) {
            itemFeaturesMapping[feature._id] = [];
        }
        const gotVal = get(itemFeaturesMapping, `${feature._id}`, []).indexOf(option) > -1;
        this.setState({
            itemFeaturesMapping: {
                ...itemFeaturesMapping,
                [feature._id]: gotVal ? itemFeaturesMapping[feature._id].filter(opt =>
                    opt !== option) : [...itemFeaturesMapping[feature._id], option]
            }
        })
    }

    renderItemFeatures() {

        const { itemFeaturesMapping, ItemFeaturesList } = this.state;

        return <View style={{}}>
            {ItemFeaturesList && ItemFeaturesList.length > 0 && ItemFeaturesList.map(feature =>
                <View>
                    <Text style={{
                        ...fontStyle,
                        paddingTop: 10,
                        color: colors.BLACK_SHADE_60,
                        fontSize: fontSizes.size14
                    }}>
                        {feature.name}
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
                        {get(feature, 'options', []).map(option => {

                            const isSelected = option && get(itemFeaturesMapping, `${feature._id}`, []).indexOf(option) > -1;

                            return <TouchableOpacity onPress={_ => this.onFeatureSelect({ feature, option })}
                                                     style={{
                                                         marginRight: 10,
                                                         marginTop: 5
                                                     }}>
                                <Text style={{
                                    ...fontStyle,
                                    color: isSelected ? colors.WHITE : colors.BLACK_SHADE_40,
                                    fontSize: fontSizes.size12,
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    backgroundColor: isSelected ? 'green' : 'transparent',
                                    borderRadius: sizes.borderRadius,
                                }}>{option}</Text>

                            </TouchableOpacity>
                        })}
                    </View>
                </View>)}
        </View>

    }

    render() {

        const { navigation, isAppLoading } = this.props;
        const { ItemFeaturesList } = this.state;
        const ItemFeaturesIdMapping = this.getIdMapping({ data: ItemFeaturesList });

        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                title={stringConstants.itemDetailPageTitle}
                navigation={navigation}
                showBackButton={true}
            />}
            detailView={_ => <View style={styles.container}>
                <FormContainer
                    onFieldValChange={this.onFieldValChange}
                    formData={navigation && navigation.state && navigation.state.params && navigation.state.params.formData}
                    footer={({ formData }) => <View
                        style={{}}>
                        <View style={{ paddingVertical: 10, flexDirection: "row" }}>
                            <Text
                                style={{
                                    flex: 1, ...fontStyle, fontFamily: fonts.MeriendaBold,
                                    color: colors.BLACK_SHADE_60,
                                    fontSize: fontSizes.size14
                                }}>{stringConstants.itemFeaturesPageTitle}</Text>
                        </View>
                        {this.renderItemFeatures()}
                    </View>}
                    fieldGroups={this.getFieldsList({ ItemFeaturesIdMapping })}
                    clickActions={[
                        {
                            title: stringConstants.doneButtonTitle,
                            isLoading: isAppLoading,
                            onClick: this.onInsertButtonClick
                        },
                    ]}
                />

            </View>}
            isDashboardLoading={isAppLoading}
        />
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    optionsContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    optionBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: 20,
        marginBottom: 10,
    },
    optionTitle: {
        marginLeft: 20,
        fontWeight: 'bold',
        fontSize: fontSizes.size14,
    }
});

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
    vendorDetails: state.users.vendorDetails,
    isAppLoading: state.users.isAppLoading,
    ItemFeaturesList: state.itemFeature.ItemFeaturesList,
    itemCategoriesList: state.itemCategories.itemCategoriesList,
    measuringUnitsList: state.measuringUnits.measuringUnitsList,
}), { getItemCategories, getItemFeatures, updateItemDetails, getMeasuringUnits, insertNewItem })(ItemInsertForm)

