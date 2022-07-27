import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageBackground,
    Dimensions,
    Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from "react-native-animatable";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';

import Header from "../mobileContainers/Header";
import stringConstants from "../constants/mobileStringConstants";
import AppDashboard from "./AppDashboard";
import { isImgUrlExists } from "../utils/functions";

import { colors, fonts, fontStyle, sizes, fontSizes } from "../mobileTheme";

const topCardBottomMargin = 40;
const topCardHeight = 200;
const titleColors = ['#effbfb', '#fefaf4'];
const newArrivalsBlockColors = ['#dfe4fb', '#fdecd4', '#fcd6e2', '#dbf3f5'];
const defaultMarginLeft = 15;
const blockWidths = 130;

const sliderWidth = Dimensions.get('window').width - 10;
const windowWidth = Dimensions.get('window').width;
const catBlockWidth = 120;
const catImgWidth = 100;


export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
            scrollEnabled: true,
        };
        this.renderNewArrivalsBlock = this.renderNewArrivalsBlock.bind(this);
        this.renderShopBlock = this.renderShopBlock.bind(this);
        this.renderSeparatorCard = this.renderSeparatorCard.bind(this);
        this.renderTopCard = this.renderTopCard.bind(this);
        this.renderCategoryBlock = this.renderCategoryBlock.bind(this);
        this.renderBlock = this.renderBlock.bind(this);
        this._renderItem = this._renderItem.bind(this);

    }

    _renderItem = ({ item, index }) => {
        const { data } = this.props;
        return (
            <View style={styles.slide}>
                <ImageBackground
                    imageStyle={{ resizeMode: 'stretch', borderRadius: sizes.borderRadius }}
                    style={styles.imageStyle}
                    source={{ uri: item.url }}
                >
                    <Pagination
                        activeDotIndex={this.state.activeSlide}
                        dotsLength={data.top_cards.length}
                        containerStyle={{}}
                        dotStyle={styles.dotStyle}
                        inactiveDotStyle={{
                            // Define styles for inactive dots here
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                    />
                </ImageBackground>
            </View>
        );
    };

    renderBlock({ title = '', subTitle = '', containerStyle = {}, titleStyle = {}, plainTitle = false, titleColorIndex = undefined, showHorizontalScroll = true, data, renderBlock }) {
        return <Animatable.View
            animation="fadeInUp"
            style={[styles.blockContainer, { backgroundColor: titleColorIndex ? titleColors[titleColorIndex - 1] : 'transparent' }, { ...containerStyle }]}>
            <View
                style={[styles.blockTitleContainer, {
                    paddingLeft: plainTitle ? 0 : 10,
                    marginLeft: defaultMarginLeft,
                }, { ...titleStyle }]}>
                <Text
                    style={[styles.blockTitle, { color: plainTitle ? colors.BLACK_SHADE_80 : colors.WHITE }]}>
                    {title}
                </Text>
                {subTitle.length > 0 && <Text
                    style={[styles.blockSubTitle, { color: plainTitle ? colors.BLACK_SHADE_40 : colors.WHITE }]}>
                    {subTitle}
                </Text>}
            </View>
            {showHorizontalScroll &&
            <ScrollView style={[styles.blockDataContainer, { paddingBottom: 10, marginLeft: defaultMarginLeft }]}
                        horizontal={true}
            >
                {data && data.length > 0 && data.map((entity, index) => renderBlock({ data: entity, index }))}
            </ScrollView>}
            {!showHorizontalScroll &&
            <View style={[styles.blockDataContainer, { flexWrap: 'wrap' }, { marginLeft: defaultMarginLeft }]}>
                {data && data.length > 0 && data.map((entity, index) => renderBlock({ data: entity, index }))}
            </View>}
        </Animatable.View>
    }

    renderShopBlock({ data }) {
        const { onShopClick } = this.props;
        return <TouchableOpacity onPress={_ => onShopClick({ data })} style={[styles.cardStyle, styles.shopBlock]}>
            {isImgUrlExists({ data, fieldName: "shop_img" }) &&
            <Image source={{ uri: data.shop_img.url }} style={styles.shopImage}/>}
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{data.shop_name}</Text>
                <Text style={styles.cardSubTitle}>{data.name}</Text>
            </View>
            <View style={styles.shopBlockFooter}>
                {/*<Button*/}
                {/*onPress={_ => onShopClick({ data })}*/}
                {/*title={stringConstants.homeBuyNowButtonTitle}*/}
                {/*style={{*/}
                {/*marginLeft: 5,*/}
                {/*width: undefined,*/}
                {/*height: undefined,*/}
                {/*padding: 5,*/}
                {/*paddingHorizontal: 10,*/}
                {/*}}*/}
                {/*textStyle={{ fontSize: fontSizes.size8 }}*/}
                {/*/>*/}
            </View>
            <TouchableOpacity onPress={_ => onShopClick({ data })} style={styles.cardSideIconContainer}>
                <FontAwesomeIcons style={styles.cardIcon} name={"location-arrow"} color={colors.WHITE} size={15}/>
            </TouchableOpacity>
        </TouchableOpacity>
    }

    renderCategoryBlock({ data }) {
        const { onCategoryClick } = this.props;
        return <TouchableOpacity style={styles.categoryBlock} onPress={_ => onCategoryClick({ data })}>
            {isImgUrlExists({ data, fieldName: "img" }) &&
            <Image source={{ uri: data.img.url }} style={styles.categoryImage}/>}
            {!isImgUrlExists({ data, fieldName: "img" }) &&
            <View style={[styles.categoryImage, { opacity: 0 }]}/>}
            <Text style={styles.categoryTitle}>{data.name}</Text>
        </TouchableOpacity>
    }

    renderSeparatorCard() {

        const { data } = this.props;

        return <Animatable.View animation="zoomIn" style={{
            position: 'relative',
            justifyContent: 'center'
        }}>
            <View style={styles.slide}>
                <ImageBackground
                    imageStyle={{ resizeMode: 'stretch' }}
                    style={[styles.imageStyle, { width: windowWidth, height: (topCardHeight / 2) }]}
                    source={{ uri: data.section_card }}
                />
            </View>
        </Animatable.View>
    }

    renderTopCard() {

        const { data } = this.props;

        return <View style={{
            position: 'relative',
            justifyContent: 'center'
        }}>
            <View style={{
                height: topCardHeight - topCardBottomMargin,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                marginBottom: topCardBottomMargin
            }}/>
            <LinearGradient colors={[colors.WHITE, colors.WHITE]} style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {data && data.top_cards && data.top_cards.length > 0 && <Carousel
                    // layout={'tinder'}
                    // layout={'stack'}
                    data={data.top_cards}
                    autoplay={true}
                    enableMomentum={false}
                    loop={true}
                    lockScrollWhileSnapping={true}
                    renderItem={this._renderItem}
                    sliderWidth={sliderWidth}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                    itemWidth={sliderWidth}
                />}

            </LinearGradient>
        </View>

    }

    renderNewArrivalsBlock({ data, index }) {
        const { onShopClick } = this.props;
        return <TouchableOpacity onPress={_ => onShopClick({ data })}
                                 style={[styles.cardStyle, styles.newArrivalsBlock]}>
            <View
                style={[styles.newArrivalsTopBlock, { backgroundColor: newArrivalsBlockColors[(index % (newArrivalsBlockColors.length))] }]}>
                <Text style={styles.cardTitle}>{data.shop_name}</Text>
                <Text style={styles.cardSubTitle}>{data.name}</Text>
                {isImgUrlExists({ data, fieldName: "shop_img" }) &&
                <Image source={{ uri: data.shop_img.url }} style={styles.newArrivalsImage}/>}
            </View>
            {/*<Button*/}
            {/*onPress={_ => onShopClick({ data })}*/}
            {/*buttonType={buttonTypes.secondary}*/}
            {/*title={stringConstants.homeBuyNowButtonTitle}*/}
            {/*style={{*/}
            {/*backgroundColor: colors.WHITE,*/}
            {/*borderRadius: 30,*/}
            {/*marginBottom: 10,*/}
            {/*marginLeft: 5,*/}
            {/*width: undefined,*/}
            {/*height: undefined,*/}
            {/*padding: 5,*/}
            {/*paddingHorizontal: 17,*/}
            {/*}}*/}
            {/*textStyle={{ fontSize: fontSizes.size8 }}*/}
            {/*/>*/}
            <View style={{ height: 30, width: '100%', backgroundColor: colors.WHITE }}/>
            <TouchableOpacity
                onPress={_ => onShopClick({ data })}
                style={[styles.cardSideIconContainer, {
                    // paddingTop: 10,
                    // alignItems: 'flex-end',
                    // paddingRight: 10,
                    // left: -5
                }]}>
                <FontAwesomeIcons style={styles.cardIcon} name={"location-arrow"} color={colors.WHITE} size={15}/>
            </TouchableOpacity>
        </TouchableOpacity>
    }

    render() {

        const { data, navigation, isLoading } = this.props;

        return <AppDashboard
            isDashboardLoading={isLoading}
            headerView={(props) => <Header
                animationProps={{ ...props }}
                subTitle={stringConstants.appTagLine}
                title={stringConstants.appName}
                navigation={navigation}
                showMenuButton={true}
            />}
            detailView={({ scrollY }) => <ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                )}
                scrollEventThrottle={16}
                style={styles.container}>

                {this.renderTopCard()}

                {data && data.categories && data.categories.length > 0 &&
                this.renderBlock({
                    title: stringConstants.homeCategoriesBlockTitle,
                    data: data.categories,
                    showHorizontalScroll: false,
                    plainTitle: true,
                    renderBlock: this.renderCategoryBlock
                })}

                {data && data.section_card && this.renderSeparatorCard()}

                {data && data.nearby_shops && data.nearby_shops.length > 0 &&
                this.renderBlock({
                    titleColorIndex: 1,
                    title: stringConstants.homeNearbyShopsBlockTitle,
                    data: data.nearby_shops,
                    plainTitle: true,
                    titleStyle: { paddingTop: 15 },
                    containerStyle: { paddingBottom: 15 },
                    renderBlock: this.renderShopBlock
                })}


                {data && data.new_shops && data.new_shops.length > 0 &&
                this.renderBlock({
                    title: stringConstants.homeNewArrivalsBlockTitle,
                    plainTitle: true,
                    subTitle: stringConstants.homeNewArrivalsShopsBlockSubTitle,
                    data: data.new_shops,
                    renderBlock: this.renderNewArrivalsBlock,
                })}

                {data && data.top_rated_vendors && data.top_rated_vendors.length > 0 &&
                this.renderBlock({
                    title: stringConstants.homeTopRatedShopsBlockTitle,
                    subTitle: stringConstants.homeTopRatedShopsBlockSubTitle,
                    data: data.top_rated_vendors,
                    renderBlock: this.renderShopBlock,
                    containerStyle: { paddingBottom: 15 },
                    titleStyle: { paddingTop: 15 },
                    titleColorIndex: 2,
                    plainTitle: true,
                })}

                {data && data.recommended_shops && data.recommended_shops.length > 0 &&
                this.renderBlock({
                    title: stringConstants.recommendedShopsBlockTitle,
                    plainTitle: true,
                    subTitle: stringConstants.recommendedShopsBlockSubTitle,
                    data: data.recommended_shops,
                    renderBlock: this.renderNewArrivalsBlock,
                })}

            </ScrollView>}
        />

    }
}

const styles = StyleSheet.create({
    shopBlock: {
        width: blockWidths * 1.25,
        backgroundColor: colors.WHITE,
        marginRight: 15,
        padding: 10
    },
    cardTitle: {
        ...fontStyle,
        fontSize: fontSizes.size15
    },
    categoryTitle: {
        ...fontStyle,
        textAlign: 'center',
        fontSize: fontSizes.size12,
        color: colors.BLACK_SHADE_60
    },
    dotStyle: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    cardSubTitle: {
        ...fontStyle,
        fontSize: fontSizes.size8,
        color: colors.BLACK_SHADE_20
    },
    categoryBlock: {
        borderRadius: sizes.borderRadius,
        width: catBlockWidth,
        padding: ((catBlockWidth - catImgWidth) / 2),
        marginBottom: 10,
        marginRight: 10,
    },
    blockContainer: {
        marginTop: 30,
    },
    shopImage: {
        width: '100%', height: 130, marginBottom: 10, borderRadius: 20
    },
    blockTitleContainer: {
        borderRadius: sizes.borderRadius,
        paddingBottom: 15
    },
    blockDataContainer: {
        flexDirection: 'row',
    },
    blockTitle: {
        ...fontStyle,
        fontSize: fontSizes.size17,
        fontFamily: fonts.MeriendaBold
    },
    blockSubTitle: {
        ...fontStyle,
        fontSize: fontSizes.size10,
        fontFamily: fonts.MeriendaBold
    },
    shopBlockFooter: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingTop: 10,
    },
    newArrivalsTopBlock: {
        paddingBottom: 10,
        // alignItems: 'flex-end',
        width: blockWidths * 1.5,
        padding: 10,
        height: blockWidths,
        marginBottom: 20
    },
    cardIcon: {
        transform: [{ rotate: "45deg" }],
    },
    cardSideIconContainer: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        paddingLeft: 10,
        paddingTop: 15,
        borderRadius: 5,
        width: 40,
        height: 40,
        backgroundColor: colors.PRIMARY_COLOR_1
    },
    cardStyle: {
        position: 'relative',
        elevation: 1,
        shadowColor: colors.PRIMARY_COLOR_1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        borderRadius: 20,
        overflow: 'hidden',
    },
    newArrivalsBlock: {
        marginRight: 15,
        position: 'relative',
        alignItems: 'flex-end',
        backgroundColor: colors.WHITE
    },
    newArrivalsImage: {
        position: 'absolute',
        bottom: -10,
        left: 10,
        height: 70,
        width: 70,
        borderRadius: 100,
    },
    categoryImage: {
        width: catImgWidth,
        height: catImgWidth,
        marginBottom: 5,
        borderRadius: sizes.borderRadius
    },
    imageStyle: {
        width: sliderWidth,
        borderRadius: 10,
        height: topCardHeight,
        justifyContent: 'flex-end'
    },
    container: {
        backgroundColor: colors.WHITE
    },
});