import React from 'react';
import get from 'lodash/get';
import { StyleSheet, View } from 'react-native';

import { buttonTypes, orderStatus, orderTypes } from "../constants";
import stringConstants from "../constants/mobileStringConstants";
import { Button } from "./AppComponents";
import { fontSizes } from "../mobileTheme";

export default class ActionButtons extends React.Component {

    static defaultProps = {
        buttonStyle: {}
    };

    constructor(props) {
        super(props);
        this.getActiveButtons = this.getActiveButtons.bind(this);
        this.renderButton = this.renderButton.bind(this);
    }

    getActiveButtons({ rowData }) {

        const { onOrderStatusUpdatePress, isVendor } = this.props;
        const buttonsList = [];

        if (onOrderStatusUpdatePress) {

            if (get(rowData, 'status') === orderStatus.new) {
                buttonsList.push({
                    title: stringConstants.cancelOrderButtonTitle, onPress: _ => onOrderStatusUpdatePress({
                        recordId: rowData._id,
                        newStatus: orderStatus.canceled
                    })
                })
            }

            if (isVendor && get(rowData, 'status') === orderStatus.new) {
                buttonsList.push({
                    title: stringConstants.confirmOrderButtonTitle,
                    onPress: _ => onOrderStatusUpdatePress({
                        recordId: rowData._id,
                        newStatus: orderStatus.confirmed
                    })
                })
            }

            if (isVendor && get(rowData, 'status') === orderStatus.confirmed) {
                buttonsList.push({
                    title: stringConstants.packedOrderButtonTitle,
                    onPress: _ => onOrderStatusUpdatePress({
                        recordId: rowData._id,
                        newStatus: orderStatus.packed
                    })
                })
            }

            if (isVendor && get(rowData, 'status') === orderStatus.packed &&
                get(rowData, 'order_type') === orderTypes.home_delivery) {
                buttonsList.push({
                    title: stringConstants.outForDeliveryButtonTitle,
                    onPress: _ => onOrderStatusUpdatePress({
                        recordId: rowData._id,
                        newStatus: orderStatus.out_for_delivery
                    })
                })
            }

            if (isVendor && ((get(rowData, 'status') === orderStatus.out_for_delivery) || (get(rowData, 'status') === orderStatus.packed &&
                get(rowData, 'order_type') === orderTypes.pick_up))) {
                buttonsList.push({
                    title: stringConstants.completeOrderButtonTitle,
                    onPress: _ => onOrderStatusUpdatePress({
                        recordId: rowData._id,
                        newStatus: orderStatus.completed
                    })
                })
            }

        }
        return buttonsList
    }

    renderButton({ buttonData, buttonType }) {
        const { title, onPress } = buttonData;
        const { buttonStyle } = this.props;
        return <Button
            buttonType={buttonType}
            title={title}
            style={{ ...styles.buttonStyle, ...buttonStyle }}
            textStyle={styles.textStyle}
            onPress={onPress}
        />
    }

    render() {

        const { rowData, renderView } = this.props;
        const buttonsList = this.getActiveButtons({ rowData });

        return <View style={styles.rowButtonContainer}>

            {renderView && renderView({ buttonsList })}
            {!renderView && buttonsList.map((buttonData, index) => this.renderButton({
                buttonData,
                buttonType: (index === (buttonsList.length - 1)) ? buttonTypes.primary : buttonTypes.secondary
            }))}

        </View>
    }
}
const styles = StyleSheet.create({
    buttonStyle: {
        marginLeft: 10,
        height: undefined,
        width: undefined,
        padding: 7,
        paddingHorizontal: 15,
        fontSize: fontSizes.size12
    },
    textStyle: { fontSize: fontSizes.size12 },
    rowButtonContainer: {
        paddingTop: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
})