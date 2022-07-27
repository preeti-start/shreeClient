import React from 'react';
import {
    StyleSheet, Text,
    View, SectionList, FlatList, TouchableOpacity, Image, Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from "react-native-animatable";

import { Button } from "../AppComponents";
import { colors, sizes, fontStyle, fonts, fontSizes } from '../../mobileTheme'
import { buttonTypes, defaultValForSortAndFilters } from "../../constants/index";
import DropDown from "./Form/dropDown";
import { getDropdownFieldValueKeyMapping } from "../../utils/functions";
import stringConstants from "../../constants/mobileStringConstants";
import images from '../../mobileAssets/images/index';
import { renderLoadingView } from "../../utils/mobileFunctions";

const initialState = {
    sortByOptions: [],
    selectedItemIds: [],
    sortValue: defaultValForSortAndFilters.sortByVal,
};

const defaultMargin = 15;
const defaultMidMargin = 5;
const actionsIconColor = colors.BLACK_SHADE_20;
const actionsIconSize = 17;
const blankColKey = '_blank';
const listPaddingHorizontal = 10;
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

export default class ListComp extends React.Component {

    static defaultProps = {
        iconStyle: {},
        numColumns: 1,
        renderDefaultWhileLoading: true,
        backgroundColor: colors.WHITE,
        captionField: undefined,
        rowStyle: {},
        filterData: {},
        showIcon: false,
        sortable: false,
        isListLoading: false,
        enableSelectItem: false,
        listAnimation: undefined,
        onRowClick: undefined,
        showAnimation: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedItemIds: initialState.selectedItemIds
        };
        this.onRowClick = this.onRowClick.bind(this);
        this.formatData = this.formatData.bind(this);
        this.renderSearchOptions = this.renderSearchOptions.bind(this);
        this.onSortByValueChange = this.onSortByValueChange.bind(this);
        this.renderHeaderActions = this.renderHeaderActions.bind(this);
        this.onItemSelectActionsClick = this.onItemSelectActionsClick.bind(this);
        this.renderHeaderButton = this.renderHeaderButton.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.onSelectRowClick = this.onSelectRowClick.bind(this);
    }

    renderHeader({ title }) {
        if (title) {
            return <Text>{title}</Text>
        }
        return null;
    }

    onSelectRowClick({ data }) {
        if (data && data._id) {
            const { selectedItemIds } = this.state;
            let finalSelectedIds = [];
            if (selectedItemIds.indexOf(data._id) === -1) {
                finalSelectedIds = [...selectedItemIds, data._id]
            } else {
                finalSelectedIds = [...selectedItemIds.filter(itemId => itemId !== data._id)]
            }
            this.setState({ selectedItemIds: finalSelectedIds })
        }
    }


    onEndReached() {
        const { isListLoading, loadMore } = this.props;
        !isListLoading && loadMore && loadMore();
    }

    renderHeaderButton({ areItemsSelected = false, title, onPress }) {
        return <Button
            buttonType={areItemsSelected ? buttonTypes.secondary : buttonTypes.inactive}
            height={30}
            style={styles.actionsButtonStyle}
            textStyle={styles.headerButtonTextStyle}
            title={title}
            onPress={onPress}
        />
    }

    onSortByValueChange({ val }) {
        const { onSortByValueChange } = this.props;
        this.setState({ sortValue: val });
        onSortByValueChange && onSortByValueChange({ val })
    }

    renderSortOption() {
        const { sortByOptions } = this.props;
        const finalSortOptions = [{ _id: undefined, name: stringConstants.byDefaultSortByOption }, ...sortByOptions];
        const { sortValue } = this.state;
        const valueKey = '_id';
        const displayKey = 'name';
        return <View style={styles.sortingBlock}>
            <FontAwesome name={"sort-amount-desc"} size={actionsIconSize} color={actionsIconColor}/>
            <DropDown
                backgroundColor={'transparent'}
                fontSize={fontSizes.size10}
                height={17}
                mode={'flat'}
                placeholder={''}
                value={sortValue}
                valueKey={valueKey}
                displayKey={displayKey}
                options={finalSortOptions}
                optionsMapping={getDropdownFieldValueKeyMapping({ options: finalSortOptions, valueKey })}
                onFieldClick={this.onSortByValueChange}
            />
        </View>
    }

    onItemSelectActionsClick({ action }) {
        const { selectedItemIds } = this.state;
        action.onClick({
            selectedItemIds: [...selectedItemIds],
            onSuccess: _ => this.setState({ selectedItemIds: initialState.selectedItemIds })
        });
    }

    onRowClick({ rowData }) {
        const { enableSelectItem, onRowClick } = this.props;
        enableSelectItem && this.onSelectRowClick({ data: rowData });
        onRowClick && onRowClick({ rowData });
    }

    renderSearchOptions() {
        const { onFilterClick, filterData } = this.props;
        const filtersLength = Object.keys(filterData).length;
        return <TouchableOpacity onPress={onFilterClick} style={styles.filterContainer}>
            <View>
                <AntDesign name={"filter"} size={actionsIconSize} color={actionsIconColor}/>
                {filtersLength > 0 && <View style={styles.filterTextContainer}>
                    <Text style={styles.filterCountStyle}>
                        {filtersLength}
                    </Text>
                </View>}
            </View>
            <Text style={{ ...fontStyle, fontSize: fontSizes.size10, marginLeft: 2 }}>
                {stringConstants.filterPopupButton}
            </Text>
        </TouchableOpacity>
    }

    renderHeaderActions() {

        const { headerActions, sortable, searchByFields } = this.props;
        const { selectedItemIds } = this.state;
        const actions = headerActions.filter(action => (!action.hasOwnProperty('showOnItemSelect') || action.showOnItemSelect === false));
        const actionsOnItemSelect = headerActions.filter(action => action.showOnItemSelect === true);
        const showActions = actions && actions.length > 0;
        const areItemsSelected = selectedItemIds && selectedItemIds.length > 0 && actionsOnItemSelect.length > 0;

        return <View style={styles.headerActionsContainer}>
            <View style={styles.headerActionsLeft}>
                {searchByFields && this.renderSearchOptions()}
                {sortable && this.renderSortOption()}
            </View>
            {showActions && actions.map(action => this.renderHeaderButton({
                title: action.title,
                onPress: action.onClick
            }))}
            {actionsOnItemSelect.map(action => this.renderHeaderButton({
                title: action.title,
                areItemsSelected,
                onPress: _ => this.onItemSelectActionsClick({ action })
            }))}
        </View>
    }

    formatData({ data }) {
        const { numColumns } = this.props;
        const numberOfFullRows = Math.floor(data.length / numColumns);
        let numberOfEleLastRow = data.length - (numberOfFullRows * numColumns);
        while (numberOfEleLastRow !== numColumns && numberOfEleLastRow !== 0) {
            data.push({ key: blankColKey });
            numberOfEleLastRow++;
        }
        return data;
    }

    render() {

        let {
            renderScene, iconStyle, showIcon, iconName, sections, headerActions, captionField, toggleUpdateItemPopup, renderDefaultWhileLoading,
            isListLoading, backgroundColor, rowActions, showAnimation, listAnimation,
            enableSelectItem, scrollY, onRowClick, getListData, rowStyle, numColumns, showRowDelAction, showRowUpdateAction
        } = this.props;

        let { selectedItemIds } = this.state;

        const isListEmpty = Array.isArray(sections[0].data[0]) && sections[0].data[0].length === 0;
        let isInitialLoadingState = false;

        if (sections[0].data[0] === undefined) {
            isInitialLoadingState = true;
            sections[0].data[0] = [{}, {}, {}, {}, {}, {}, {}, {}];
        }
        const renderLoadingUi = isInitialLoadingState && renderDefaultWhileLoading;

        return <Animated.View style={[styles.listContainer, {
            alignItems: isListEmpty ? 'center' : 'flex-start',
        }]}>

            {headerActions && this.renderHeaderActions()}

            {isListEmpty && <View style={styles.emptyIconContainer}>
                <Image style={styles.emptyListImage} source={images.noData}/>
                <Text style={styles.emptyListText}>{stringConstants.EmptyListString}</Text>
            </View>}

            {!isListEmpty && <AnimatedSectionList
                sections={sections}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true },
                )}
                style={{
                    width: '100%',
                }}
                onRefresh={getListData ? _ => getListData({ skipCount: 0 }) : undefined}
                refreshing={isListLoading && !isInitialLoadingState}
                onEndReached={this.onEndReached}
                renderItem={({ item }) => <FlatList
                    extraData={this.state}
                    data={this.formatData({ data: [...item] })}
                    numColumns={numColumns}
                    renderItem={({ item, index }) => {

                        if (item && item.key === blankColKey) {
                            return <View style={styles.blankView}/>
                        }
                        const isRowSelected = item && item._id && selectedItemIds &&
                            selectedItemIds.indexOf(item._id.toString()) > -1;
                        const ListComp = (enableSelectItem || onRowClick) ? TouchableOpacity : View;
                        const hasRowActions = rowActions && rowActions.length > 0;
                        const marginLeft = numColumns === 1 ? (defaultMargin - 5) : (index % 2 === 0 ? defaultMargin : defaultMidMargin);
                        const marginRight = numColumns === 1 ? (defaultMargin - 5) : (index % 2 === 0 ? defaultMidMargin : defaultMargin);

                        if (renderLoadingUi) {
                            return <View style={[styles.renderItemContainer, styles.loaderContainer, {
                                marginLeft,
                                marginRight,
                            }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.loaderLeftBlock}/>
                                    <View style={{ flex: 1 }}>
                                        {renderLoadingView({})}
                                        {renderLoadingView({ width: "medium", height: "small" })}
                                        {renderLoadingView({ width: "small", height: "small" })}
                                    </View>
                                    <View style={{ flex: 1 }}/>
                                </View>

                            </View>
                        }
                        const onPress = ((enableSelectItem || onRowClick) ? _ => this.onRowClick({ rowData: item }) : undefined);

                        return <ListComp
                            onPress={onPress}
                            style={[styles.renderItemContainer, {
                                marginLeft,
                                marginRight,
                                paddingBottom: hasRowActions ? 0 : 10,
                                backgroundColor,
                                overflow: 'hidden',
                                borderWidth: isRowSelected ? 1 : 0,
                                borderColor: isRowSelected ? colors.PRIMARY_COLOR_3 : 'transparent',
                                shadowColor: colors.BLACK_SHADE_20,
                            },
                                { ...rowStyle }
                            ]}>
                            <Animatable.View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                animation={`${listAnimation ? listAnimation : (showAnimation ? 'slideInUp' : '')}`}//"flipInX"
                                // easing={"ease-in"}
                            >
                                {captionField && item[captionField] && item[captionField].length > 0 &&
                                <View style={styles.captionContainer}>
                                    <LinearGradient colors={['#c76704', '#f09537']}
                                                    style={styles.captionCircle}>
                                        <Text
                                            style={styles.nameCaption}>{item[captionField].substr(0, 1).toUpperCase()}</Text>
                                    </LinearGradient>
                                </View>}

                                {renderScene && <View style={styles.rowContainer}>
                                    {renderScene({ rowData: item, index })}
                                </View>}


                                {showRowDelAction &&
                                <EntypoIcon name={'cross'} color={colors.BLACK_SHADE_20} size={20}/>}

                                {showRowUpdateAction &&
                                <EntypoIcon onPress={_ => toggleUpdateItemPopup({ data: item })} name={'edit'}
                                            color={colors.BLACK_SHADE_20} size={20}/>}

                            </Animatable.View>

                            {hasRowActions &&
                            <View style={{ width: '100%', height: 1, backgroundColor: colors.BLACK_SHADE_5 }}/>}

                            {hasRowActions && <View style={{
                                paddingHorizontal: 20,
                                flexDirection: 'row',
                                justifyContent: 'flex-end'
                            }}>
                                {rowActions.map(action => <Button
                                    buttonType={buttonTypes.secondary}
                                    height={30}
                                    style={styles.actionsButtonStyle}
                                    textStyle={styles.headerButtonTextStyle}
                                    title={action.title}
                                    onPress={_ => action.onPress({ rowData: item })}
                                />)}
                            </View>}

                            {isRowSelected && <View style={styles.selectedCircle}>

                            </View>}
                            {isRowSelected && <FontAwesome style={styles.selectedIcon}
                                                           onPress={_ => toggleUpdateItemPopup({ data: item })}
                                                           name={'check'}
                                                           color={colors.WHITE} size={12}/>}
                            {showIcon && <Animatable.View
                                style={[styles.cardSideIconContainer, { ...iconStyle }]}
                                animation={"fadeInUp"}>
                                <TouchableOpacity
                                    onPress={(enableSelectItem || onRowClick) ? _ => this.onRowClick({ rowData: item }) : undefined}
                                >
                                    <FontAwesome style={[
                                        {
                                            transform: [{ rotate: iconName ? "0deg" : "45deg" }],
                                        }
                                    ]} name={iconName ? iconName : "location-arrow"}
                                                 color={colors.WHITE}
                                                 size={15}/>
                                </TouchableOpacity>
                            </Animatable.View>}
                        </ListComp>
                    }}
                />}
                renderSectionHeader={({ section }) => this.renderHeader({ title: section.key })}
            />}
        </Animated.View>
    }
};

const styles = StyleSheet.create({
        headerActionsContainer: {
            paddingBottom: 15,
            paddingHorizontal: (defaultMargin + 5),
            display: 'flex',
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        showDetailsIconContainer: {
            justifyContent: 'center',
        },
        captionCircle: {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            width: 40,
            height: 40,
        },
        nameCaption: {
            color: colors.WHITE, fontWeight: 'bold'
        },
        captionContainer: {
            marginRight: 15,
            marginLeft: 5,
        },
        listContainer: {
            flex: 1,
            padding: 5,
            paddingHorizontal: 0,
            backgroundColor: colors.WHITE
        },
        rowContainer: {
            flex: 1
        },
        sortingBlock: {
            flexDirection: 'row',
            // borderWidth: 1,
            borderColor: colors.BLACK_SHADE_20,
            borderRadius: sizes.borderRadius,
            alignItems: 'flex-end',
            paddingLeft: 10
        },
        filterContainer: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            position: 'relative',
            marginRight: 10
        },
        filterTextContainer: {
            backgroundColor: colors.PRIMARY_COLOR_2,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: sizes.borderRadius,
            width: 10,
            height: 10,
            position: 'absolute',
            top: -5,
            right: -5
        },
        emptyListImage: { width: 200, height: 150, opacity: 0.8 },
        emptyIconContainer: { paddingTop: 100, alignItems: 'center' },
        emptyListText: { ...fontStyle, marginTop: 10, fontSize: fontSizes.size20, color: colors.BLACK_SHADE_40 },
        blankView: { flex: 1, paddingHorizontal: listPaddingHorizontal },
        headerButtonTextStyle: { fontSize: fontSizes.size10 },
        actionsButtonStyle: {
            backgroundColor: colors.TRANSPARENT,
            marginLeft: 10,
            elevation: 0,
            borderWidth: 0,
            width: undefined
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
        headerActionsLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-end' },
        loaderLeftBlock: {
            marginTop: 5,
            backgroundColor: colors.BLACK_SHADE_10,
            width: 60,
            height: '80%',
            borderRadius: sizes.borderRadius,
            marginRight: 10
        },
        primaryLoader: {
            borderRadius: sizes.borderRadius,
            width:
                200,
            height:
                20,
            backgroundColor:
            colors.BLACK_SHADE_5,
            marginTop:
                10
        },
        loaderContainer: {
            marginVertical: 5,
            paddingBottom: 10,
            elevation: 1,
            backgroundColor: colors.WHITE
        },
        secondaryLoader: {
            width: 100,
            height: 10,
        },
        renderItemContainer: {
            flex: 1,
            position: 'relative',
            paddingHorizontal: listPaddingHorizontal,
            paddingTop: 10,
            borderRadius: 20,
            marginBottom: 10,
            elevation: 2,
            shadowOffset: { width: 5, height: 5 },
        },
        selectedIcon: {
            position: "absolute",
            bottom: 8,
            right: 8,
        },
        selectedCircle: {
            position: "absolute",
            bottom: -17,
            right: -17,
            borderRadius: 25,
            width: 50,
            height: 50,
            backgroundColor: colors.PRIMARY_COLOR_3
        },
        filterCountStyle: {
            fontSize: fontSizes.size8, color:
            colors.WHITE, fontFamily:
            fonts.MeriendaBold
        }

    })
;
