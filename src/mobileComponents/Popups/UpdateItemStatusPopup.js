import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { RadioButton, Button } from '../../mobileComponents/index';
import appStringConstants from "../../constants/appStringConstants";
import { colors, fontSizes, fonts } from "../../mobileTheme";


export default class UpdateItemStatusPopup extends React.Component {
    render() {
        const { setItemUpdateStatus, options, onUpdateItemsClick } = this.props;
        return <View style={styles.container}>
            <View style={styles.bodyContainer}>
                <RadioButton
                    onPress={setItemUpdateStatus}
                    options={options}
                />
            </View>
            <View style={styles.footerContainer}>
                <Button
                    title={appStringConstants.updateButtonTitle}
                    onPress={onUpdateItemsClick}
                />
            </View>
        </View>
    }
}
const styles = StyleSheet.create({
    container: { padding: 15, paddingTop: 0, flex: 1 },
    footerContainer: { alignItems: 'flex-end' },
    bodyContainer: { flex: 1, justifyContent: "center" },
});