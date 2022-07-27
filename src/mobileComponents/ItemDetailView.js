import React from 'react';
import get from 'lodash/get';
import {
    View, ScrollView, TouchableOpacity, Dimensions,
    ImageBackground, Text, StyleSheet
} from 'react-native';
import intersection from 'lodash/intersection'
import Carousel from 'react-native-snap-carousel';
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";

import { Button, PopUp } from "../mobileComponents/AppComponents/index";
import ZoomImages from "../mobileComponents/Popups/ZoomImages";
import stringConstants from "../constants/mobileStringConstants";
import { getItemCartId } from "../utils/functions";
import { getFinalPrizeString } from "../utils/mobileFunctions";
import Header from "../mobileContainers/Header";
import AppDashboard from "./AppDashboard";
import { colors, fontSizes, fontStyle, sizes } from "../mobileTheme";
import ItemQuantitySelector from "./ItemQuantitySelector";

const containerPadding = 30;
const sliderWidth = Dimensions.get('window').width / 2;
const slideHeight = sliderWidth;


export default class ItemDetailView extends React.Component {

    static defaultProps = {
        onItemVersionClick: _ => {
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
            isZoomImagePopupActive: false
        };
        this.isItemFeatureExists = this.isItemFeatureExists.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this.getDetailView = this.getDetailView.bind(this);
        this.renderItemFeatures = this.renderItemFeatures.bind(this);
        this.toggleZoomImagePopup = this.toggleZoomImagePopup.bind(this);
        this.renderRelatedItemVersions = this.renderRelatedItemVersions.bind(this);
    }

    _renderItem = ({ item, index }) => {
        const { itemDetails } = this.props;
        return (
            <TouchableOpacity onPress={_ => this.toggleZoomImagePopup({ img: item })} style={styles.slide}>
                <ImageBackground
                    imageStyle={{ resizeMode: 'stretch' }}
                    style={styles.imageStyle}
                    source={{ uri: item.url }}
                >
                    {/*<Pagination*/}
                    {/*activeDotIndex={this.state.activeSlide}*/}
                    {/*dotsLength={itemDetails.item_images.length}*/}
                    {/*containerStyle={{}}*/}
                    {/*dotStyle={styles.dotStyle}*/}
                    {/*inactiveDotStyle={{*/}
                    {/*// Define styles for inactive dots here*/}
                    {/*}}*/}
                    {/*inactiveDotOpacity={0.4}*/}
                    {/*inactiveDotScale={0.6}*/}
                    {/*/>*/}
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    toggleZoomImagePopup(prop) {
        this.setState(prevState => ({
            zoomImg: get(prop, 'img'),
            isZoomImagePopupActive: !prevState.isZoomImagePopupActive
        }))
    }

    renderItemFeatures({ hasDescription }) {
        const { itemDetails } = this.props;
        if (get(itemDetails, 'item_features', []).length > 0) {
            return <View>
                {hasDescription && <View style={styles.separator}/>}
                <View style={styles.itemFeaturesContainer}>
                    <Text
                        style={[styles.subDetailsTextStyle, styles.subDetailsTitleStyle, { flex: 1 }]}>
                        {stringConstants.itemDetailsBlockTitle}
                    </Text>
                    {itemDetails.item_features.map(featureData => {
                        if (featureData.feature_id.is_sale_based) {
                            return null;
                        }
                        return <View style={styles.itemFeaturesRow}>
                            <Text
                                style={[styles.subDetailsTextStyle, { flex: 1, marginTop: 8 }]}>
                                {featureData && featureData.feature_id && featureData.feature_id.name}
                            </Text>
                            <Text
                                style={[styles.subDetailsTextStyle, {
                                    flex: 1,
                                    color: colors.BLACK_SHADE_40,
                                    marginTop: 5
                                }]}>
                                {featureData && featureData.options && featureData.options.length > 0 && featureData.options.join(', ')}
                            </Text>
                        </View>
                    })}
                </View>
            </View>
        }
        return null;
    }

    renderRelatedItemVersions() {
        const { relatedItemVersions, onItemVersionClick } = this.props;
        const activeItems = (relatedItemVersions && relatedItemVersions.activeItems) ? relatedItemVersions.activeItems : [];
        if (relatedItemVersions && relatedItemVersions.features && Object.keys(relatedItemVersions.features).length > 0) {
            const featuresMapping = relatedItemVersions.features;
            return <View style={styles.itemFeaturesContainer}>
                {Object.keys(featuresMapping).map(feature => <View>
                    <View style={styles.separator}/>
                    <View style={styles.featureBox}>
                        <Text style={[styles.subDetailsTextStyle, styles.subDetailsTitleStyle, styles.featureTitle]}>
                            {featuresMapping[feature].feature && `${stringConstants.itemFeaturesTitle(get(featuresMapping, `${feature}.feature.name`))}`}
                        </Text>
                        <View style={styles.featuresContainer}>
                            {Object.keys(featuresMapping[feature].options).length > 0 && Object.keys(featuresMapping[feature].options).map(option => {
                                const isItemActive = featuresMapping[feature].options[option].relatedItemIds &&
                                    intersection(featuresMapping[feature].options[option].relatedItemIds, activeItems).length > 0;
                                const isFeatureSelected = featuresMapping[feature].options[option].isSelected;
                                return <View style={[styles.featuresRow, { opacity: isItemActive ? 1 : 0.5, }]}>
                                    <TouchableOpacity
                                        onPress={isItemActive ? _ => onItemVersionClick({
                                            featureId: feature,
                                            option
                                        }) : undefined}
                                        style={[styles.featureBlock, {
                                            borderStyle: 'dotted',
                                            borderColor: isFeatureSelected ? colors.PRIMARY_COLOR_2 : colors.BLACK_SHADE_20,
                                            backgroundColor: isFeatureSelected ? colors.PRIMARY_COLOR_2 : 'transparent',
                                        }]}>
                                        <Text
                                            style={[styles.subDetailsTextStyle, { color: isFeatureSelected ? colors.WHITE : colors.BLACK_SHADE_20 }]}>
                                            {featuresMapping[feature].options[option] && featuresMapping[feature].options[option].name}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            })}
                        </View>
                    </View>

                </View>)}
            </View>
        }
        return null;
    }

    isItemFeatureExists() {

        const { itemDetails } = this.props;
        const itemFeatures = get(itemDetails, 'item_features');

        let isItemFeatureExists = false;
        for (const featureCount in itemFeatures) {
            if (!get(itemFeatures, `${featureCount}.feature_id.is_sale_based`)) {
                isItemFeatureExists = true;
            }
        }
        return isItemFeatureExists
    }

    getDetailView() {

        const {
            itemDetails, selectedQuantity, cartItemIds, onQuantityButtonPress,
            onViewCartPress, onAddToCartPress, relatedItemVersions
        } = this.props;
        const { isZoomImagePopupActive, zoomImg } = this.state;


        const itemCartId = getItemCartId({ relatedItemVersions, cartItemIds, itemDetails });
        const isImgExists = itemDetails && itemDetails.item_images && itemDetails.item_images.length > 0;
        const hasDescription = itemDetails && itemDetails.hasOwnProperty('description');
        const hasCategory = itemDetails && itemDetails.category_id;
        const setCount = get(itemDetails, 'set_count', 0);
        const measuringUnit = get(itemDetails, 'measuring_unit_id.short_name');


        return <View style={[styles.container]}>
            <ScrollView style={[styles.container]}>
                {isImgExists && <Animatable.View animation="zoomIn" style={styles.itemImageContainer}>
                    <Carousel
                        // layout={'tinder'}
                        // layout={'stack'}
                        data={itemDetails.item_images}
                        renderItem={this._renderItem}
                        sliderWidth={sliderWidth + 200}
                        onSnapToItem={index => this.setState({ activeSlide: index })}
                        itemWidth={sliderWidth + 50}
                    />

                </Animatable.View>}

                <Animatable.View animation="fadeInLeft" style={styles.masterDetailsSection}>

                    {hasCategory && <Text
                        style={[styles.subDetailsTextStyle, { marginBottom: 10 }]}>
                        {itemDetails.category_id.name}
                    </Text>}

                    <Text style={styles.detailTextStyle}>
                        {itemDetails && itemDetails.name}
                    </Text>

                    <View style={{ marginVertical: 10 }}>
                        {getFinalPrizeString({
                            data: itemDetails,
                            quantity: selectedQuantity
                        })}
                    </View>

                    {hasDescription && [
                        <View style={styles.separator}/>,
                        <Text style={[styles.subDetailsTextStyle, { marginTop: 10 }]}>
                            {itemDetails.description}
                        </Text>
                    ]}

                    {setCount > 1 && [
                        <Text
                            style={[styles.setCountTextStyle, { marginTop: 10 }]}>
                            {`${stringConstants.setCountLabel} ${setCount} ${measuringUnit}`}
                        </Text>
                    ]}

                </Animatable.View>
                <Animatable.View animation="fadeInRight" style={styles.detailsContainer}>
                    {this.isItemFeatureExists() && this.renderItemFeatures({ hasDescription })}
                    {this.renderRelatedItemVersions()}
                </Animatable.View>
            </ScrollView>

            <Animatable.View animation="slideInUp">
                <LinearGradient
                    colors={[colors.WHITE, colors.PRIMARY_BG_COLOR_1]}
                    style={{
                        borderTopLeftRadius: 50,
                        paddingTop: 20,
                        borderTopWidth: 2,
                        borderTopColor: colors.BLACK_SHADE_1,
                        paddingHorizontal: containerPadding,
                        backgroundColor: colors.WHITE,
                        borderTopRightRadius: 50,
                        elevation: 2,
                        shadowColor: colors.BLACK,
                        shadowOffset: { width: 5, height: 5 },
                        shadowOpacity: 0.8,
                        shadowRadius: 5,
                    }}>
                    <View
                        style={styles.detailsRightContainer}>
                        <View style={{ flex: 1 }}>
                            {getFinalPrizeString({
                                data: itemDetails,
                                showPrize: false,
                                showNetPrize: !itemCartId,
                                quantity: selectedQuantity
                            })}
                        </View>
                        {!itemCartId && measuringUnit &&
                        <ItemQuantitySelector
                            setCount={get(itemDetails, 'set_count')}
                            onButtonPress={onQuantityButtonPress}
                            title={`${selectedQuantity} ${measuringUnit}`}
                        />}
                    </View>
                    {itemDetails && <View style={styles.buttonContainer}>
                        {!itemCartId && <Button
                            style={{ width: undefined, height: 45, borderRadius: 50 }}
                            textStyle={{ fontSize: fontSizes.size14 }}
                            title={stringConstants.itemListAddToCartButtonTitle}
                            onPress={onAddToCartPress}
                        />}
                        {itemCartId && <Button
                            style={{ width: undefined, height: 45, borderRadius: 50 }}
                            textStyle={{ fontSize: fontSizes.size14 }}
                            title={stringConstants.itemListViewCartButtonTitle}
                            onPress={_ => onViewCartPress({ cartId: itemCartId })}
                        />}
                    </View>}
                </LinearGradient>
            </Animatable.View>
            <PopUp
                // title={stringConstants.chooseImgOptionsTitle}
                // animationType={'none'}
                // viewAnimation={'fadeInUp'}
                containerStyle={{
                    // justifyContent: 'flex-end',
                    padding: 0,
                    backgroundColor: colors.BLACK_SHADE_60,
                    paddingHorizontal: 0,
                }}
                isPopUpActive={isZoomImagePopupActive}
                onCrossPress={this.toggleZoomImagePopup}
                popupView={_ => <ZoomImages
                    onCrossPress={this.toggleZoomImagePopup}
                    images={[zoomImg]}
                />}
            />
        </View>

    }

    render() {

        const { navigation, isAppLoading } = this.props;

        return <AppDashboard
            isDashboardLoading={isAppLoading}
            headerView={props => <Header
                headerStyle={{ backgroundColor: colors.WHITE }}
                animationProps={{ ...props }}
                title={stringConstants.itemDetailPageTitle}
                navigation={navigation}
                showBackButton={true}
            />}
            detailView={this.getDetailView}
        />

    }
}

const styles = StyleSheet.create({
    detailsContainer: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: containerPadding
    },
    separator: {
        height: 1,
        width: '100%',
        marginVertical: 5,
        backgroundColor: colors.BLACK_SHADE_5
    },
    featuresRow: {
        marginRight: 10,
    },
    featureBlock: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 2,
    },
    featuresContainer: { flexDirection: 'row' },
    itemImageContainer: {
        marginHorizontal: 15,
        overflow: 'hidden',
        marginBottom: 20,
        alignItems: "center"
    },
    imgStyle: { width: "100%", height: "100%" },
    container: { flex: 1, backgroundColor: colors.WHITE },
    detailTextStyle: {
        ...fontStyle,
        fontSize: fontSizes.size30,
    },
    subDetailsTitleStyle: {
        color: colors.BLACK_SHADE_80,
        fontSize: fontSizes.size17,
    },
    subDetailsTextStyle: {
        ...fontStyle,
        fontSize: fontSizes.size12,
        color: colors.BLACK_SHADE_10,
    },
    setCountTextStyle: {
        ...fontStyle,
        fontSize: fontSizes.size10,
        color: colors.PRIMARY_COLOR_2,
    },
    masterDetailsSection: {
        paddingHorizontal: containerPadding,
    },
    buttonContainer: {
        paddingTop: 15,
        padding: 10,
    },
    itemFeaturesContainer: { paddingVertical: 10 },
    dotStyle: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    itemFeaturesRow: { flexDirection: "row" },
    featureTitle: {
        marginBottom: 5
    },
    featureBox: {
        paddingBottom: 15,
    },
    imageStyle: { width: (sliderWidth + 50), height: slideHeight, justifyContent: 'flex-end' },
    slide: {
        width: (sliderWidth + 50),
        height: slideHeight,
    },
    detailsLeftSection: {},
    detailsRightContainer: { flexDirection: "row", alignItems: 'center' }
});
