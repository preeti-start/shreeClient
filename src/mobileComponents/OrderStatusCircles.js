import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { colors, fonts, fontSizes, fontStyle } from "../mobileTheme";
import { orderStatus, orderTypes } from "../constants";
import LinearGradient from "react-native-linear-gradient";

const orderStatusMapping = {
    'completed': 'completed', 'inprogress': 'in-progress', 'pending': 'pending'
};

const getColorBasedOnStatus = ({ status }) => (status === orderStatusMapping.pending ? colors.BLACK_SHADE_10 :
    (status === orderStatusMapping.inprogress ? colors.PRIMARY_COLOR_1 : colors.PRIMARY_COLOR_4));

const getOrderStatusFlowList = ({ status, orderType }) => {

    const orderStatusFlowList = [];

    if (status) {
        orderStatusFlowList.push({
            title: orderStatus.confirmed,
            status: status === orderStatus.new ? orderStatusMapping.inprogress : orderStatusMapping.completed
        });
        orderStatusFlowList.push({
            title: orderStatus.packed,
            status: status === orderStatus.new ? orderStatusMapping.pending : (status === orderStatus.confirmed ?
                orderStatusMapping.inprogress : orderStatusMapping.completed)
        });
        if (orderType === orderTypes.home_delivery) {
            orderStatusFlowList.push({
                title: orderStatus.out_for_delivery,
                status: (status === orderStatus.new || status === orderStatus.confirmed) ? orderStatusMapping.pending :
                    (status === orderStatus.packed ? orderStatusMapping.inprogress : orderStatusMapping.completed)
            })
        }
        orderStatusFlowList.push({
            title: orderStatus.completed,
            status: (status === orderStatus.new || status === orderStatus.confirmed || status === orderStatus.packed) ?
                orderStatusMapping.pending : (status === orderStatus.out_for_delivery ? orderStatusMapping.inprogress :
                    orderStatusMapping.completed)
        });
    }

    return orderStatusFlowList
};

export default class OrderStatusCircles extends React.Component {

    renderStatusLine({ totalLength, isStart = false, marginRight = 0, marginLeft = 0, index, currentBackgroundColor, nextBackgroundColor }) {

        let colors = [((index + 1 < totalLength) ? currentBackgroundColor : 'transparent'),
            ((index + 1 < totalLength) ? nextBackgroundColor : 'transparent')];
        if (isStart) {
            colors = [(index === 0 ? 'transparent' : currentBackgroundColor), (index === 0 ? 'transparent' : currentBackgroundColor)]
        }

        return <LinearGradient
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            colors={colors}
            style={[styles.statusLine, { marginRight, marginLeft }]}/>
    }


    renderOrderStatusCircle({
                                statusData, nextBackgroundColor = 'transparent',
                                previousBackgroundColor = 'transparent', currentBackgroundColor = 'transparent',
                                totalLength, displayCircle = true, index
                            }) {

        return <View style={styles.orderStatus}>

            {displayCircle && this.renderStatusLine({
                marginRight: 2,
                isStart: true,
                totalLength,
                index,
                currentBackgroundColor,
                nextBackgroundColor
            })}
            <View style={styles.statusBlock}>
                {displayCircle && <View
                    style={[styles.statusCirclesBox, { backgroundColor: currentBackgroundColor }]}>
                    {statusData.status !== orderStatusMapping.completed &&
                    <Text style={styles.statusNumber}>{index + 1}</Text>}
                    {statusData.status === orderStatusMapping.completed && <FontAwesome style={{}}
                                                                                        name={'check'}
                                                                                        color={colors.WHITE}
                                                                                        size={12}/>}
                </View>}
                {!displayCircle &&
                <Text style={styles.statusTitle}>{statusData.title}</Text>}
            </View>
            {displayCircle && this.renderStatusLine({
                marginLeft: 2,
                totalLength,
                index,
                currentBackgroundColor,
                nextBackgroundColor
            })}
        </View>
    }

    render() {
        const { status, orderType } = this.props;

        const orderStatusMappings = getOrderStatusFlowList({ status, orderType });

        if (status !== orderStatus.canceled) {
            return <View style={styles.statusCirclesContainer}>
                <View style={styles.statusBarRow}>
                    {orderStatusMappings.map((statusData, index) => this.renderOrderStatusCircle({
                        statusData,
                        index,
                        nextBackgroundColor: (index + 1) < orderStatusMappings.length ?
                            getColorBasedOnStatus({ status: orderStatusMappings[index + 1].status }) : undefined,
                        previousBackgroundColor: index !== 0 ? getColorBasedOnStatus({ status: orderStatusMappings[index - 1].status }) : undefined,
                        currentBackgroundColor: getColorBasedOnStatus({ status: statusData.status }),
                        totalLength: orderStatusMappings.length
                    }))}
                </View>
                <View
                    style={styles.statusBarRow}>
                    {orderStatusMappings.map((statusData, index) => this.renderOrderStatusCircle({
                        displayCircle: false,
                        statusData,
                        index,
                    }))}
                </View>
            </View>
        }
        return null;
    }
}

const styles = StyleSheet.create({
    statusLine: {
        flex: 1,
        height: 1,
    },
    orderStatus: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    statusBarRow: {
        flexDirection: 'row'
    },
    statusCirclesBox: {
        width: 36,
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.BLACK_SHADE_20,
        justifyContent: 'center',
        borderRadius: 40,
        height: 36
    },
    statusTitle: {
        ...fontStyle,
        fontSize: fontSizes.size10,
        paddingTop: 5,
        textAlign: 'center',
        fontFamily: fonts.MeriendaBold,
        color: colors.BLACK_SHADE_40
    },
    statusBlock: { alignItems: 'center' },
    statusCirclesContainer: {
        paddingVertical: 15,
        justifyContent: 'flex-end'
    },
    statusNumber: {
        fontSize: fontSizes.size12,
        color: colors.WHITE,
        fontFamily: fonts.MeriendaBold
    },
})