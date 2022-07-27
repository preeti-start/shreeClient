import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import Entypo from "react-native-vector-icons/Entypo";

import Header from "../../mobileContainers/Header";
import AppDashboard from "../AppDashboard";
import stringConstants from "../../constants/mobileStringConstants";
import FormContainer from "../../mobileContainers/FormContainer";
import { colors, sizes } from "../../mobileTheme";

const { width, height } = Dimensions.get('window');
const topCircleRadius = 60;
const marginHorizontal = 20;

export default class ContactUs extends React.Component {

    render() {
        const { isAppLoading, clickActions, fieldGroups, navigation } = this.props;
        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                navigation={navigation}
                title={stringConstants.contactUsPageTitle}
                showMenuButton={true}
            />}
            detailView={_ => <ImageBackground
                source={{ uri: 'https://shreeapp1.s3.ap-south-1.amazonaws.com/images/appImages/about_us.jpg' }}
                style={styles.container}>
                <View style={styles.bgDiv}/>
                <View style={styles.body}>
                    <View style={styles.topContainer}/>
                    <View style={styles.bottomContainer}/>
                    <View style={styles.iconContainer}>
                        <Entypo
                            name={"mail"}
                            size={50}
                            color={colors.PRIMARY_COLOR_1}
                        />
                    </View>
                    <View style={styles.formContainer}>
                        <FormContainer
                            clickActionsStyle={{paddingHorizontal: 15}}
                            clickActions={clickActions}
                            fieldsContainerStyle={{ paddingHorizontal: 15, backgroundColor: colors.WHITE }}
                            containerStyle={{ padding: 0 }}
                            fieldGroups={fieldGroups}
                        />
                    </View>
                </View>
            </ImageBackground>}
            isDashboardLoading={isAppLoading}
        />
    }
}

const styles = StyleSheet.create({
    body: { marginHorizontal: marginHorizontal, flex: 1 },
    container: { flex: 1, position: 'relative' },
    topContainer: {
        width: "100%",
        height: topCircleRadius
    },
    bottomContainer: {
        borderTopLeftRadius: sizes.borderRadius,
        borderTopRightRadius: sizes.borderRadius,
        width: "100%",
        backgroundColor: colors.WHITE,
        height: topCircleRadius
    },
    iconContainer: {
        position: 'absolute',
        top: 0,
        left: ((width / 2) - topCircleRadius - marginHorizontal),
        backgroundColor: colors.WHITE,
        height: topCircleRadius * 2,
        width: topCircleRadius * 2,
        borderRadius: topCircleRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgDiv: {
        position: 'absolute',
        top: 0,
        height: height / 2,
        left: 0,
        right: 0
    },
    formContainer: {
        backgroundColor: colors.WHITE,
        borderBottomLeftRadius: sizes.borderRadius,
        borderBottomRightRadius: sizes.borderRadius,
        elevation: 1,
        shadowColor: colors.PRIMARY_COLOR_1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    }
});