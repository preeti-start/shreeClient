import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

import stringConstants from "../constants/mobileStringConstants";
import { colors, fontStyle, fonts, fontSizes } from "../mobileTheme";

export default class OrderSummeryBlock extends React.Component {

    renderPrizeSummaryRow({ summaryData }) {
        return <View style={styles.prizeSummaryRow}>
            <Text style={styles.prizeSummaryTitle}>{summaryData && summaryData.title}</Text>
            <Text
                style={styles.prizeDataText}>{summaryData && summaryData.value}</Text>
        </View>
    }

    renderSeperator() {
        return <View style={styles.separatorView}/>
    }

    render() {
        const { title, notes, totalAmount, containerStyle, prizeSummaryList } = this.props;
        return <Animatable.View animation={"slideInUp"} style={[styles.orderSummaryCard, { ...containerStyle }]}>
            {title && [<Text style={styles.orderSummaryCardTitleText}>{title}</Text>,
                this.renderSeperator()]}
            {prizeSummaryList.map(summaryData => this.renderPrizeSummaryRow({ summaryData }))}

            {this.renderSeperator()}
            <View style={styles.prizeSummaryRow}>
                <Text style={styles.prizeSummaryTitle}>{stringConstants.totalChargesTitle}</Text>
                <Text
                    style={styles.prizeDataText}>{totalAmount}</Text>

            </View>
            {notes && <Text
                style={styles.notesText}>{notes}</Text>}
        </Animatable.View>
    }
}

const styles = StyleSheet.create({
    orderSummaryCardTitleText: {
        ...fontStyle,
        fontFamily: fonts.MeriendaBold,
        color: colors.BLACK_SHADE_80,
        fontSize: fontSizes.size15
    },
    separatorView: {
        width: "100%",
        height: 1,
        backgroundColor: colors.BLACK_SHADE_10,
        marginVertical: 5,
    },
    prizeDataText: {
        ...fontStyle,
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.BLACK_SHADE_80,
        fontSize: fontSizes.size10
    },
    notesText: {
        marginTop: 5,
        ...fontStyle,
        opacity: 0.7,
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.PRIMARY_COLOR_3,
        fontSize: fontSizes.size8
    },
    prizeSummaryTitle: {
        ...fontStyle,
        flex: 1,
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.BLACK_SHADE_20,
        fontSize: fontSizes.size10
    },
    prizeSummaryRow: {
        flexDirection: "row",
        marginVertical: 5
    },
    orderSummaryCard: {
        borderColor: colors.BLACK_SHADE_10,
    }
});
