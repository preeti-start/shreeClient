import React from 'react';
import { colors } from "../../mobileTheme";
import { CheckBox } from "native-base";

export default class CheckboxComp extends React.Component {
    static defaultProps = {
        onValueChange: _ => {
        },
        value: false,
    };

    render() {
        const { value, onValueChange } = this.props;
        return <CheckBox
            borderRadius={10}
            color={colors.PRIMARY_COLOR_1}
            checked={value}
            onPress={onValueChange}
        />
    }
}
