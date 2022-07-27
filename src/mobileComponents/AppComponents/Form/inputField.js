import React from 'react';
import { TextInput } from 'react-native-paper';

import { colors, fontSizes, fonts } from '../../../mobileTheme';

export default class InputField extends React.Component {

    static defaultProps = {
        value: '',
        onChangeText: _ => {
        },
        mode: 'outlined',
        style: {}
    };

    render() {
        const { value, error, mode, keyboardType, multiline, placeholder, style, onChangeText } = this.props;
        const { fontSize = fontSizes.size14, backgroundColor = colors.WHITE } = style;

        return <TextInput
            keyboardType={keyboardType}
            error={error}
            style={[style, { fontSize, backgroundColor }]}
            mode={mode}
            multiline={multiline}
            label={error ? error : placeholder}
            value={(error && !value) ? ' ' : value}
            onChangeText={onChangeText}
        />
    }
}