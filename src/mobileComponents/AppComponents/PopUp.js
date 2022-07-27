import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import * as Animatable from "react-native-animatable";
import EntypoIcon from "react-native-vector-icons/Entypo";

import { colors, sizes, fontSizes, fonts } from "../../mobileTheme";

export default class Popup extends React.Component {
    static defaultProps = {
        popupView: _ => {
        },
        title: '',
        viewAnimation: "bounceIn",
        animationType: 'fade',
        containerStyle: {},
    };

    render() {

        const { popupView, animationType, viewAnimation, containerStyle, style, onCrossPress, isPopUpActive, title } = this.props;

        return <Modal
            animationType={animationType}
            transparent={true}
            visible={isPopUpActive}
            onRequestClose={() => {
            }}>
            <View
                style={[styles.container, { ...containerStyle }]}
            >
                <Animatable.View
                    animation={viewAnimation}
                    // easing={"ease-in"}
                    style={[styles.popupBodyContainer, { ...style }]}>
                    {title.length > 0 && <View style={styles.popupTitle}>
                        <Text style={styles.popupTitleText}>{title}</Text>
                        <TouchableOpacity onPress={onCrossPress} style={styles.closeActionContainer}>
                            <EntypoIcon name={"cross"} color={colors.BLACK_SHADE_60} size={25}/>
                        </TouchableOpacity>
                    </View>}
                    {popupView()}
                </Animatable.View>
            </View>
        </Modal>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingHorizontal: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.BLACK_SHADE_60
    },
    closeActionContainer: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    popupTitle: {
        padding: 15,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.BLACK_SHADE_5
    },
    popupTitleText: {
        fontFamily: fonts.MeriendaBold,
        flex: 1,
        color: colors.BLACK_SHADE_80,
        fontSize: fontSizes.size17
    },
    popupBodyContainer: {
        width: '100%',
        borderRadius: sizes.borderRadius,
        backgroundColor: colors.WHITE
    }
});