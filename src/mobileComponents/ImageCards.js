import React from 'react';
import { View, Image, StyleSheet } from 'react-native'
import Fontisto from "react-native-vector-icons/Fontisto";

import { colors } from "../mobileTheme";

const staticWidth = 60;

export default class ImageCards extends React.Component {
    static defaultProps = {
        isItemImgExists: undefined
    };

    render() {
        const { isItemImgExists } = this.props;
        return <View
            style={[styles.img1Style, { marginRight: 20, width: staticWidth, height: staticWidth }]}
        >
            {isItemImgExists &&
            <Image
                style={[styles.img1Style, { borderWidth: isItemImgExists ? 1 : 0 }]}
                source={{
                    uri: isItemImgExists
                }}/>}
            {!isItemImgExists &&
            <Fontisto style={{ opacity: 0.3 }} name={"photograph"} color={colors.BLACK_SHADE_5} size={50}/>}
        </View>
    }
};
const styles = StyleSheet.create({
    img1Style: {
        width: staticWidth,
        height: staticWidth,
        borderColor: colors.BLACK_SHADE_20,
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

