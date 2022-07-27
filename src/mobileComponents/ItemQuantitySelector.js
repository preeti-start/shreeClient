import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Button } from "./AppComponents";
import stringConstants from "../constants/mobileStringConstants";
import { quantitySelectorAlignments } from "../constants";
import { colors, fontSizes, fontStyle, sizes } from "../mobileTheme";


export default class ItemQuantitySelector extends React.Component {

    constructor(props) {
        super(props);
        this.renderDecButton = this.renderDecButton.bind(this);
        this.renderIncButton = this.renderIncButton.bind(this);
        this.onIncButtonPress = this.onIncButtonPress.bind(this);
        this.onDecButtonPress = this.onDecButtonPress.bind(this);
    }

    static  defaultProps = {
        isLoading: false,
        title: '',
        setCount: 1,
        alignment: quantitySelectorAlignments.horizontal
    };

    onDecButtonPress() {
        const { onButtonPress, isLoading, setCount } = this.props;
        !isLoading && onButtonPress && onButtonPress({ incBy: (-1 * setCount) });
    }

    onIncButtonPress() {
        const { onButtonPress, setCount, isLoading } = this.props;
        !isLoading && onButtonPress && onButtonPress({ incBy: setCount });
    }

    renderDecButton({ style }) {
        return <Button
            style={style}
            title={stringConstants.subtractButtonSymbol}
            onPress={this.onDecButtonPress}
        />
    }

    renderIncButton({ style }) {
        return <Button
            style={style}
            title={stringConstants.addButtonSymbol}
            onPress={this.onIncButtonPress}
        />
    }

    render() {

        const { title, alignment } = this.props;

        let firstButtonStyle = { ...styles.buttonStyle };
        let secondButtonStyle = { ...styles.buttonStyle };

        if (alignment === quantitySelectorAlignments.horizontal) {
            firstButtonStyle = { ...firstButtonStyle, ...styles.buttonLeftStyle };
            secondButtonStyle = { ...secondButtonStyle, ...styles.buttonRightStyle }
        } else {
            firstButtonStyle = { ...firstButtonStyle, ...styles.buttonBottomStyle };
            secondButtonStyle = { ...secondButtonStyle, ...styles.buttonTopStyle }
        }

        return <View
            style={alignment === quantitySelectorAlignments.horizontal ? styles.horizontalContainer : styles.verticalContainer}>
            {alignment === quantitySelectorAlignments.horizontal ? this.renderDecButton({ style: firstButtonStyle }) :
                this.renderIncButton({ style: secondButtonStyle })}
            <Text
                style={styles.titleStyle}>{title}</Text>
            {alignment === quantitySelectorAlignments.horizontal ? this.renderIncButton({ style: secondButtonStyle }) :
                this.renderDecButton({ style: firstButtonStyle })}

        </View>
    }
}

const styles = StyleSheet.create({
    titleStyle: { ...fontStyle, paddingHorizontal: 10 },
    horizontalContainer: { alignItems: "center", flexDirection: 'row' },
    verticalContainer: { alignItems: "center" },
    buttonTopStyle: { borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    buttonBottomStyle: { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
    buttonLeftStyle: { borderTopLeftRadius: 15, borderBottomLeftRadius: 15 },
    buttonRightStyle: { borderTopRightRadius: 15, borderBottomRightRadius: 15 },
    buttonStyle: { width: 30, height: 30 },
});
