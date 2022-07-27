import React from 'react';
import { ScrollView, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, fonts, fontSizes } from '../mobileTheme';
import { onSideMenuItemsClick } from "../utils/mobileFunctions";
import stringConstants from "../constants/mobileStringConstants";
import { delStoreDetails } from "../utils/mobileStore";

export default class SideMenu extends React.Component {

    constructor(props) {
        super(props);
        this.onProfileClick = this.onProfileClick.bind(this);
        this.onStatsClick = this.onStatsClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
    }

    onMenuItemClick(menuItem) {
        const { navigation, userToken, logoutUser } = this.props;
        navigation && onSideMenuItemsClick({ delStoreDetails, navigation, userToken, logoutUser, menuItem })
    }

    onStatsClick({ statItem }) {
        const { navigation } = this.props;
        if (navigation && statItem && statItem.route) {
            navigation.navigate(statItem.route);
        }
    }

    onProfileClick() {
        const { profileLink, navigation } = this.props;
        profileLink && navigation.navigate(profileLink)
    }

    render() {
        const { menuList, imgUrl, userStats, title } = this.props;

        return <View style={styles.container}>
            <StatusBar
                // hidden={true}
                translucent={true}
                backgroundColor={colors.BLACK_SHADE_20}
            />
            <View style={styles.titleContainer}>
                <TouchableOpacity style={styles.topSection} onPress={this.onProfileClick}>
                    {imgUrl && <View style={styles.imgContainer}>
                        <Image style={styles.imgStyle} source={{ uri: imgUrl }}/>
                    </View>}
                    <Text style={styles.titleText}>{title}</Text>
                </TouchableOpacity>
                <View style={styles.statsContainer}>
                    {userStats && userStats.map((statItem, statIndex) => <TouchableOpacity
                        onPress={_ => this.onStatsClick({ statItem })}
                        style={styles.eachStatHolder}
                        key={`${statIndex}_appStats`}>
                        <Text style={styles.statsTitle}>
                            {statItem && statItem.title}
                        </Text>
                        <Text style={styles.statsVal}>
                            {statItem && statItem.value}
                        </Text>
                    </TouchableOpacity>)}
                </View>
            </View>
            <ScrollView>
                {menuList && menuList.map((menuItem, menuIndex) =>
                    <TouchableOpacity style={styles.menuContainer} onPress={_ => this.onMenuItemClick(menuItem)}
                                      key={`${menuIndex}_appMenuItem`}>
                        {menuItem && menuItem.icon && <View style={styles.iconContainer}>{menuItem.icon}</View>}
                        <Text style={styles.menuText}>{menuItem && menuItem.title}</Text>
                    </TouchableOpacity>)}
            </ScrollView>
            <View>
                <Text style={styles.footerText}>{stringConstants.appFooterString}</Text>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    imgContainer: {
        marginBottom: 15,
        width: 80,
        borderRadius: 40,
        height: 80,
        alignItems: "center",
        justifyContent: "center"
    },
    topSection: { paddingHorizontal: 20, justifyContent: "center", alignItems: "center" },
    menuContainer: { flexDirection: "row", alignItems: "center" },
    iconContainer: {
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        marginRight: 10,
    },
    imgStyle: {
        width: 100,
        borderRadius: 50,
        height: 100
    },
    titleContainer: { alignItems: "center", justifyContent: "center", paddingTop: 20 },
    container: { paddingTop: 40, backgroundColor: colors.BLACK_SHADE_80, flex: 1 },
    statsVal: { color: colors.PRIMARY_COLOR_1, fontFamily: fonts.MeriendaBold, fontSize: fontSizes.size10 },
    menuText: { fontFamily: fonts.MeriendaBold, color: colors.WHITE_SHADE_90, fontSize: fontSizes.size14 },
    footerText: {
        fontFamily: fonts.MeriendaOneRegular,
        padding: 10,
        color: colors.WHITE_SHADE_50,
        fontSize: fontSizes.size10
    },
    statsTitle: { color: colors.WHITE, fontFamily: fonts.MeriendaBold, fontSize: fontSizes.size10 },
    titleText: { color: colors.WHITE, textAlign: "center", fontFamily: fonts.MeriendaBold, fontSize: fontSizes.size30 },
    eachStatHolder: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 10 },
    statsContainer: {
        flexDirection: 'row',
        width: "100%",
    }
});
