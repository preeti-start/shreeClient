import React from 'react';
import { View, StyleSheet } from 'react-native'

import stringConstants from "../constants/mobileStringConstants";
import { fieldTypes } from "../constants/index";
import FormContainer from "./FormContainer";
import { colors } from "../mobileTheme";


export default class DistanceBasedAmountSlab extends React.Component {
    constructor(props) {
        super(props);
        this.onSavePress = this.onSavePress.bind(this);
    }

    onSavePress({ formData }) {
        const { min_order_amount, delivery_amount, from_distance, to_distance } = formData;

        const { toggleAddSlab, onSaveSlabValPress } = this.props;
        onSaveSlabValPress && onSaveSlabValPress({
            slabVal: {
                min_order_amount,
                delivery_amount,
                from_distance,
                to_distance
            }
        });
        toggleAddSlab && toggleAddSlab();
    }

    render() {
        return <View style={styles.container}>
            <FormContainer
                clickActions={[
                    { title: stringConstants.saveButtonTitle, onClick: this.onSavePress },
                ]}
                fieldGroups={[
                    {
                        fields: [
                            {
                                type: fieldTypes.number,
                                placeholder: stringConstants.addNewDistanceSlabPopupMinOrderAmntTitle,
                                name: 'min_order_amount',
                                isMandatory: true,
                            },
                            {
                                type: fieldTypes.number,
                                placeholder: stringConstants.addNewDistanceSlabPopupDeliveryAmntTitle,
                                name: 'delivery_amount',
                                isMandatory: true,
                            },
                            {
                                type: fieldTypes.number,
                                isMandatory: true,
                                placeholder: stringConstants.addNewDistanceSlabPopupFromDistanceTitle,
                                name: 'from_distance',
                            },
                            {
                                type: fieldTypes.number,
                                isMandatory: true,
                                placeholder: stringConstants.addNewDistanceSlabPopupToDistanceTitle,
                                name: 'to_distance',
                            },
                        ]
                    }
                ]}
            />
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
});