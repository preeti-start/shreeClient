import React from 'react';
import {
    View
} from 'react-native';
import { colors } from '../../mobileTheme'
import { Spinner } from "native-base";


export default class LoadingComp extends React.Component {
    render() {
        return <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 105,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <View style={{
                width: 115,
                height: 90,
                borderRadius: 5,
                backgroundColor: ( 'rgba(0,0,0,0.7)' )
            }}>
                <Spinner size={"large"} color={colors.PRIMARY_COLOR_1}/>
            </View>

        </View>
    }
}