import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { colors, fontStyle, fontSizes } from "../../mobileTheme";

const activeButtonColor = colors.PRIMARY_COLOR_1;
const inActiveButtonColor = 'transparent';
const inActiveBorderColor = colors.BLACK_SHADE_80;

export default class RadioButton extends React.Component {
    static defaultProps = {
        options: [],
        onPress: _ => {
        },
    };

    constructor(props) {
        super(props);
        this.onOptionsPress = this.onOptionsPress.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.state = {
            activeIndex: undefined
        }
    }

    onOptionsPress({ option, index }) {
        const { onPress } = this.props;
        onPress({ option, index });
        this.setState({ activeIndex: index })
    }

    renderOptions() {
        const { options } = this.props;
        const { activeIndex } = this.state;
        return <View style={styles.optionsContainer}>
            {options.map((option, index) => <View key={`${index.id}`} style={styles.optionContainer}>
                <Text style={styles.textStyle}>{option.title}</Text>
                <TouchableOpacity onPress={_ => this.onOptionsPress({ option, index })}
                                  style={[styles.buttonContainer, { borderColor: activeIndex === index ? activeButtonColor : inActiveBorderColor }]}>
                    <View
                        style={[styles.innerButton, { backgroundColor: activeIndex === index ? activeButtonColor : inActiveButtonColor }]}/>
                </TouchableOpacity>
            </View>)}
        </View>
    }

    render() {
        const { options } = this.props;
        return <View>
            {options && options.length > 0 && this.renderOptions()}
        </View>
    }
}
const styles = StyleSheet.create({
    optionsContainer: { flexDirection: "row", borderColor: colors.PRIMARY_COLOR_1 },
    optionContainer: { flexDirection: "row", alignItems: "center" },
    textStyle: { ...fontStyle, paddingHorizontal: 10, fontSize: fontSizes.size12, color: colors.BLACK_SHADE_40 },
    buttonContainer: {
        borderWidth: 2,
        padding: 2,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    innerButton: { width: 12, height: 12, borderRadius: 6 },
});
