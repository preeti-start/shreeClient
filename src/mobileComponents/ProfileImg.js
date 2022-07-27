import React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";

import { colors, sizes } from "../mobileTheme";
import { buttonTypes } from "../constants";

const profileImgDim = sizes.profileImgDim;

export default class ProfileImg extends React.Component {
    render() {
        const { onProfileImgClick, imgUrl } = this.props;
        return <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            colors={[
                colors.TRANSPARENT,
                colors.TRANSPARENT
            ]}
            style={styles.imgDataContainer}
        >
            <TouchableOpacity onPress={onProfileImgClick}
                              style={[styles.imgContainer, { borderWidth: imgUrl ? 1 : 3 }]}>
                {imgUrl && <Animatable.Image animation="pulse" easing={"ease-in"} style={styles.imgStyle}
                                             source={{ uri: imgUrl }}/>}
                {!imgUrl && <Entypo style={{ opacity: 0.3 }} name={"camera"} size={60}
                                    color={colors.BLACK_SHADE_10}/>}
            </TouchableOpacity>
        </LinearGradient>
    }
}

const styles = StyleSheet.create({
    imgDataContainer: {
        height: profileImgDim - 30,
        alignItems: "center",
        justifyContent: "center",
    },
    imgContainer: {
        marginTop: 30,
        width: profileImgDim,
        height: profileImgDim,
        alignItems: "center",
        justifyContent: "center",
        overflow: 'hidden',
        borderRadius: profileImgDim / 2,
        borderStyle: "solid",
        borderColor: colors.BLACK_SHADE_10,
        backgroundColor: colors.WHITE,
    },
    imgStyle: {
        width: profileImgDim,
        height: profileImgDim,
        borderRadius: profileImgDim / 2
    },
});