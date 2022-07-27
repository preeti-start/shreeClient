import React from 'react';
import { View, ImageBackground, ScrollView, Text, StyleSheet } from 'react-native';

import Header from "../../mobileContainers/Header";
import AppDashboard from "../AppDashboard";
import stringConstants from "../../constants/mobileStringConstants";
import { colors, fontStyle, fonts, fontSizes } from "../../mobileTheme";

export default class AboutUs extends React.Component {

    render() {
        const { isAppLoading, aboutUs, navigation } = this.props;
        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                navigation={navigation}
                title={stringConstants.aboutUsPageTitle}
                showMenuButton={true}
            />}
            detailView={_ => <ImageBackground
                source={{ uri: aboutUs && aboutUs.bg_img }}
                style={styles.container}
            >
                <ScrollView style={styles.body}>
                    <Text style={styles.textStyle}>
                        {aboutUs && aboutUs.description}
                    </Text>
                </ScrollView>
            </ImageBackground>}
            isDashboardLoading={isAppLoading}
        />
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, resizeMode: 'contain' },
    textStyle: {
        ...fontStyle,
        fontSize: fontSizes.size15,
        fontFamily: fonts.MeriendaBold,
        color: colors.BLACK_SHADE_40
    },
    title: { ...fontStyle, fontSize: fontSizes.size20 },
    body: { flex: 1, paddingVertical: 10 }
});