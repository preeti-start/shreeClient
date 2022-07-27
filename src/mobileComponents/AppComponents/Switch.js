import React from 'react';
import { colors } from "../../mobileTheme";
import { Switch } from "react-native";

export default class SwitchComp extends React.Component {
    static defaultProps = {
        onValueChange: _ => {
        },
        disabled: false,
    };

    render() {
        const { disabled, value, onValueChange } = this.props;
        return <Switch
            disabled={disabled}
            style={{}}
            trackColor={{
                true: colors.PRIMARY_COLOR_1,
                false: colors.BLACK_SHADE_10
            }}
            thumbColor={colors.WHITE}
            onValueChange={onValueChange}
            value={value}/>
    }
}
