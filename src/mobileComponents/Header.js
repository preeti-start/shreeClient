import React, { Component } from 'react';
import { View, Animated, TextInput, TouchableOpacity, Text, StyleSheet, SectionList } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from "react-native-animatable";

import { colors, fonts, fontStyle, fontSizes, sizes } from '../mobileTheme';
import { defaultValForSortAndFilters } from "../constants/index";
import stringConstants from "../constants/mobileStringConstants";

const contentColor1 = colors.BLACK_SHADE_80;
const contentColor2 = colors.BLACK_SHADE_20;

export default class Header extends Component {

    static defaultProps = {
        headerStyle: {},
        titleTextStyle: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            searchVal: defaultValForSortAndFilters.searchByName,
        };
        this.getIconColor = this.getIconColor.bind(this);
        this.getSearchIcon = this.getSearchIcon.bind(this);
        this.onClearSearchClick = this.onClearSearchClick.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
    }

    renderMenuButton() {
        const { onMenuButtonClick } = this.props;
        return <TouchableOpacity onPress={onMenuButtonClick}>
            <View style={{ width: 10, borderRadius: 2, height: 5, backgroundColor: this.getIconColor({}) }}/>
            <View style={{
                width: 20,
                marginTop: 3,
                height: 5,
                borderRadius: 2,
                backgroundColor: this.getIconColor({})
            }}/>
        </TouchableOpacity>
    }

    renderBackButton() {
        const { onBackClick } = this.props;
        return <TouchableOpacity onPress={onBackClick}>
            <EntypoIcon name={"chevron-left"} size={30}
                        color={this.getIconColor({})}/>
        </TouchableOpacity>
    }

    renderCartButton() {
        const { totalCartItemsCount, onCartClick } = this.props;
        return <TouchableOpacity onPress={onCartClick} style={styles.cartContainer}>
            <MaterialCommunityIcons name={"cart"} size={25}
                                    color={this.getIconColor({})}
            />
            {totalCartItemsCount > 0 && <View style={styles.cartCountContainer}>
                <Text style={styles.cartCountText}>
                    {totalCartItemsCount}
                </Text>
            </View>}

        </TouchableOpacity>
    }

    onChangeText(val) {
        this.setState({ searchVal: val });
    }

    onClearSearchClick() {
        const { onSearchClick } = this.props;
        const finalVal = defaultValForSortAndFilters.searchByName;
        this.onChangeText(finalVal);
        onSearchClick({ value: finalVal })
    }

    onSearchClick() {
        const { onSearchClick } = this.props;
        const { searchVal } = this.state;
        onSearchClick({ value: searchVal })
    }

    getIconColor({ isSecond }) {
        return (isSecond ? contentColor2 : contentColor1)
    }

    getSearchIcon() {
        return <Feather style={styles.searchIcon} onPress={this.onSearchClick} name={"search"} size={15}
                        color={colors.BLACK_SHADE_20}/>
    }

    renderSearchBlock() {

        const { searchVal } = this.state;
        const { searchKeyLabel } = this.props;
        const searchIconAtStart = searchVal.length === 0;

        return <View
            style={[styles.searchContainer, {
                backgroundColor: colors.WHITE,
                borderColor: contentColor2,
                marginTop: 5
            }]}>
            {searchIconAtStart && this.getSearchIcon()}
            <TextInput style={styles.searchInput}
                       placeholder={stringConstants.headerSearchFieldPlaceholder(searchKeyLabel)}
                       onChangeText={this.onChangeText}
                       value={searchVal}/>
            {!searchIconAtStart && this.getSearchIcon()}
            <EntypoIcon onPress={this.onClearSearchClick} name={"cross"} size={20}
                        color={colors.BLACK_SHADE_20}/>
        </View>
    }

    render() {

        const {
            title, renderTitle, showLocMissingNotification, onSearchClick, headerStyle,
            showMenuButton, animationProps, titleTextStyle, showBackButton, showCartIcon
        } = this.props;
        const { titleScale, leftMargin, topSectionTopMargin, headerTopMargin } = animationProps;

        return <Animated.View
            style={[{
                transform: [
                    { translateY: headerTopMargin }
                ],
                paddingTop: 30,// for status menu
                paddingLeft: 15,
                paddingBottom: (showBackButton && !onSearchClick) ? 20 : 10,
                ...headerStyle,
                backgroundColor: colors.WHITE

            }]}>

            <View
                style={[styles.headerContainer, {
                    paddingTop: showBackButton ? 20 : 15,
                    flexDirection: showBackButton ? "row" : "column"
                }]}>

                {showLocMissingNotification && <View
                    style={styles.locNotificationContainer}>
                    <Text style={styles.locNotificationText}>
                        {stringConstants.stringForLocMissingWhileServingHomeDelivery}
                    </Text>
                </View>}

                <Animated.View
                    style={[
                        styles.firstSection,
                        {
                            zIndex: 2,
                            transform: [
                                { translateY: topSectionTopMargin }
                            ],
                        }
                    ]}>
                    <Animatable.View
                        animation="fadeInLeft"
                        style={[styles.mainIconsContainer, { flex: showBackButton ? 0 : 1 }]}>
                        {showMenuButton && this.renderMenuButton()}
                        {showBackButton && this.renderBackButton()}
                    </Animatable.View>

                    {!showBackButton && showCartIcon &&
                    <Animatable.View animation="fadeIn" style={styles.lastSectionContainer}>
                        {this.renderCartButton()}
                    </Animatable.View>}
                </Animated.View>

                <Animatable.View
                    animation="fadeInLeft"
                    style={[
                        styles.middleContainer,
                        {
                            zIndex: 1,
                        }
                    ]}>
                    {renderTitle && renderTitle()}
                    {!renderTitle && <Animated.Text
                        style={[styles.title, {
                            transform: [
                                { scale: titleScale },
                                { translateX: leftMargin }
                            ],
                            marginTop: showBackButton ? 0 : 10,
                            fontSize: showBackButton ? fontSizes.size25 : fontSizes.size30,
                            color: contentColor1
                        }, { ...titleTextStyle }]}>
                        {title}
                    </Animated.Text>}
                </Animatable.View>

            </View>
            {onSearchClick && this.renderSearchBlock()}
        </Animated.View>
    }
}
const styles = StyleSheet.create({
    locNotificationContainer: {
        position: "absolute",
        borderRadius: 2,
        top: 2,
        right: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: colors.BLACK_SHADE_80
    },
    locNotificationText: { fontSize: fontSizes.size10, color: colors.WHITE, fontWeight: "bold" },
    headerContainer: {
        marginLeft: 15
    },
    rectHdrTitle1Container: {
        marginTop: -10,
        paddingHorizontal: 10,
        borderRadius: sizes.borderRadius,
    },
    title: {
        ...fontStyle,
        fontFamily: fonts.MeriendaBold,
    },
    rectHdrTitle1Style: {
        fontWeight: "bold",
        fontSize: fontSizes.size17,
    },
    rectHeaderContainer: {
        borderWidth: 2,
        justifyContent: "center",
        width: "80%",
        alignItems: "center"
    },
    mainIconsContainer: {},
    lastSectionContainer: {
        width: 30,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartContainer: { position: "relative" },
    cartCountText: {
        fontSize: fontSizes.size8,
        color: colors.WHITE,
        fontWeight: 'bold',
    },
    firstSection: { flexDirection: "row", alignItems: "center" },
    searchContainer: {
        paddingHorizontal: 10,
        marginRight: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: sizes.borderRadius,
        alignItems: 'center'
    },
    searchInput: {
        height: 40,
        flex: 1,
        fontFamily: fonts.MeriendaOneRegular,
        fontSize: fontSizes.size12
    },
    searchIcon: { padding: 5 },
    cartCountContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        borderRadius: 7,
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.PRIMARY_COLOR_2
    },
    middleContainer: {
        alignItems: "flex-start",
        justifyContent: "center",
    },
});
