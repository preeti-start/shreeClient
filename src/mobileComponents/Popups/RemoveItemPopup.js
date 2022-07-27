import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Button } from '../../mobileComponents/index';
import appStringConstants from "../../constants/appStringConstants";
import { colors, fontSizes, fonts, fontStyle } from "../../mobileTheme";


export default class RemoveItemPopup extends React.Component {

    render() {

        const { onRemoveItemsClick, isActionActive } = this.props;

        return <View style={styles.container}>
            <Text style={styles.description}>
                {appStringConstants.removeItemsPopupDescription}
            </Text>
            <View style={styles.footerContainer}>
                <Button
                    isLoading={isActionActive}
                    title={appStringConstants.removeButtonTitle}
                    onPress={onRemoveItemsClick}
                />
            </View>
        </View>
    }
}
const styles = StyleSheet.create({
    container: { padding: 15, position: 'relative' },
    description: { paddingBottom: 20, ...fontStyle, color: colors.BLACK_SHADE_20 },
    footerContainer: { alignItems: 'flex-end' },
});