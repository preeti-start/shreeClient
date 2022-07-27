import React from 'react';
import {
    Text,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    View,
    StyleSheet,
    Dimensions
} from "react-native";
import PureChart from 'react-native-pure-chart';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from "react-native-animatable";

import { colors, fontSizes, fontStyle, sizes, fonts } from '../mobileTheme'
import AppDashboard from "./AppDashboard";
import Header from "../mobileContainers/Header";
import stringConstants from "../constants/mobileStringConstants";
import images from '../mobileAssets/images/index';
import SwitchComp from "./AppComponents/Switch";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default class VendorDashboard extends React.Component {


    render() {

        const { isAppLoading, onToggleSwitch, isShopActive, vendorDashboardData, onItemCardClick, navigation, onAddItemClick } = this.props;
        let data = [
            {
                seriesName: 'series_id_1',
                data: vendorDashboardData && vendorDashboardData.data ? vendorDashboardData.data : [],
                color: colors.PRIMARY_COLOR_1
            }
        ];
        const gotOrderStats = vendorDashboardData && vendorDashboardData.data &&
            vendorDashboardData.data.length > 0;
        const gotDataToDisplay = vendorDashboardData && vendorDashboardData.top_sales && vendorDashboardData.top_sales.length >= 3;
        const colorIndexMapping = ['#f7862c', '#D0021B', '#0070c0', '#5f300e'];

        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                subTitle={stringConstants.appTagLine}
                navigation={navigation}
                renderTitle={_ => <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitleText}>
                        {stringConstants.dashoardPageTitle}
                    </Text>
                    <View style={styles.headerIcon}>
                        <SwitchComp
                            onValueChange={onToggleSwitch}
                            value={isShopActive}
                        />
                    </View>
                </View>}
                showMenuButton={true}
            />}
            detailView={_ => <View style={styles.container}>
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    colors={[
                        colors.TRANSPARENT,
                        colors.TRANSPARENT,
                    ]}
                    style={styles.topContainer}>
                    {gotOrderStats &&
                    <PureChart
                        labelColor={colors.BLACK}
                        xAxisColor={colors.BLACK}
                        yAxisColor={colors.BLACK}
                        backgroundColor={colors.TRANSPARENT}
                        height={(windowHeight / 3) - 30}
                        defaultColumnWidth={windowWidth / (data[0].data.length * 2)}
                        showEvenNumberXaxisLabel={false}
                        data={data}
                        type='bar'
                    />}
                    {vendorDashboardData && !gotOrderStats &&
                    <Text
                        style={styles.noOrdersTitleText}>{stringConstants.dashoardGraphNoOrdersAvailableTitle}</Text>}
                    {gotOrderStats &&
                    <Text style={styles.graphTitleText}>{stringConstants.dashoardGraphTitle}</Text>}
                </LinearGradient>
                <View style={styles.bottomContainer}>

                    {vendorDashboardData && !gotDataToDisplay && <View style={{
                        paddingHorizontal: 40,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.7
                    }}>
                        <Text style={[styles.pendingDataNotificationText, {
                            color: colors.PRIMARY_COLOR_2,
                            fontSize: fontSizes.size25
                        }]}>
                            {stringConstants.dashoardWelcomeMsg}
                        </Text>


                        <Text style={styles.pendingDataNotificationText}>
                            {stringConstants.dashboardDataMissingNotifications}
                        </Text>

                        <MaterialIcons onPress={onAddItemClick} name={"library-add"} color={colors.PRIMARY_COLOR_1}
                                       size={60}/>
                    </View>}

                    {gotDataToDisplay && vendorDashboardData.top_sales && <ScrollView style={{ flex: 1 }}>
                        {vendorDashboardData.top_sales.map((itemDetail, index) => {
                            return <TouchableOpacity onPress={onItemCardClick}>
                                <Animatable.View
                                    animation="pulse"
                                    easing={"ease-in"}
                                    style={{
                                        overflow: 'hidden',
                                        marginHorizontal: 20,
                                        marginVertical: 10,
                                        shadowOffset: { width: 5, height: 5 },
                                        borderRadius: sizes.borderRadius,
                                        shadowColor: colors.BLACK_SHADE_20,
                                        flexDirection: 'row',
                                        elevation: 2,
                                        paddingTop: 1,
                                    }}>
                                    <View style={{ width: 5, backgroundColor: colorIndexMapping[index] }}/>
                                    <ImageBackground
                                        imageStyle={{ resizeMode: 'stretch' }}
                                        style={{
                                            flexDirection: 'row',
                                            backgroundColor: 'white',
                                            padding: 20,
                                            width: '100%',
                                            height: '115%'
                                        }}
                                        source={images.dashboardBox}>

                                        <View style={{ flex: 1 }}>
                                            <Text style={{
                                                ...fontStyle,
                                                fontSize: fontSizes.size20,
                                            }}>{itemDetail && itemDetail._id && itemDetail._id.name}</Text>

                                            <View style={styles.topSalesBlockRow}>
                                                <Text
                                                    style={[styles.topSalesBlockDetailText, { color: colorIndexMapping[index] }]}>
                                                    {itemDetail && JSON.stringify(itemDetail.orders_count)}
                                                </Text>
                                                <Text
                                                    style={[styles.topSalesBlockSubDetailText, {
                                                        paddingBottom: 2,
                                                        marginLeft: 7
                                                    }]}>
                                                    {stringConstants.dashoardOrderCountString}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text
                                                    style={[styles.topSalesBlockSubDetailText, { paddingTop: 5 }]}>
                                                    {itemDetail && itemDetail.hasOwnProperty('quantity') && stringConstants.dashboardOrderItemsQuantity({
                                                        quantity: itemDetail.quantity,
                                                        unit: itemDetail._id && itemDetail._id.measuring_unit_id && itemDetail._id.measuring_unit_id.short_name
                                                    })}
                                                </Text>

                                            </View>
                                        </View>
                                        <View style={{
                                            position: 'relative'
                                        }}>
                                            <Text style={{
                                                ...fontStyle,
                                                color: colorIndexMapping[index],
                                                fontSize: fontSizes.size10,
                                                position: 'absolute',
                                                top: 9,
                                                fontFamily: fonts.MeriendaBold,
                                                left: '44%'
                                            }}>{index + 1}</Text>
                                            <FontAwesome5 name={"award"} color={colorIndexMapping[index]} size={45}/>
                                        </View>
                                    </ImageBackground>
                                </Animatable.View>
                            </TouchableOpacity>
                        })}
                    </ScrollView>}
                </View>
            </View>}
            isDashboardLoading={isAppLoading}
        />

    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.WHITE },
    graphTitleText: {
        ...fontStyle,
        margin: 10,
        marginTop: 5,
        alignItems: "center",
        fontSize: fontSizes.size10,
        fontFamily: fonts.MeriendaBold,
        color: colors.BLACK_SHADE_80,
    },
    noOrdersTitleText: {
        alignItems: "center",
        color: colors.BLACK_SHADE_80,
        fontSize: fontSizes.size20,
        fontFamily: fonts.MeriendaBold
    },
    headerTitleContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems:'center'
    },
    headerIcon: {
        marginRight: 10
    },
    headerTitleText: {
        flex: 1,
        ...fontStyle,
        fontSize: fontSizes.size30,
        fontFamily: fonts.MeriendaBold,
        color: colors.BLACK_SHADE_80
    },
    topSalesBlockRow: { alignItems: 'flex-end', flexDirection: "row" },
    topSalesBlock: {
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        borderRadius: sizes.borderRadius,
        width: windowWidth / 2.5,
        height: windowHeight / 6,
        backgroundColor: colors.BLACK_SHADE_10,
    },
    pendingDataNotificationText: {
        ...fontStyle,
        textAlign: "center",
        marginTop: 20,
        color: colors.PRIMARY_COLOR_1,
        fontSize: fontSizes.size15,
        fontFamily: fonts.MeriendaBold
    },
    topSalesBlockDetailText: { fontFamily: fonts.MeriendaBold, fontSize: fontSizes.size27, color: colors.BLACK },
    topSalesBlockSubDetailText: {
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size12,
        color: colors.BLACK_SHADE_40
    },
    topContainer: {
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    bottomContainer: {
        flex: 1,
        paddingVertical: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: colors.PRIMARY_COLOR_1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    }
});
