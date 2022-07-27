import React, { Component } from 'react';
import { View, Image, Keyboard, Dimensions, Platform, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { colors, sizes, fontSizes, fontStyle, fonts } from '../mobileTheme';
import stringConstants from "../constants/mobileStringConstants";
import { Button } from "./AppComponents/index";

const { width } = Dimensions.get('window');
const circleDim = ((width / 2) + 40);

export default class UserRegistrationComponent extends Component {

    static defaultProps = {};

    constructor(props) {
        super(props);

        this.keyboardWillShow = this.keyboardWillShow.bind(this);
        this.keyboardWillHide = this.keyboardWillHide.bind(this);

        this.state = {
            isVisible: true
        }
    }

    keyboardWillShow = event => {
        this.setState({
            isVisible: false
        })
    }

    keyboardWillHide = event => {
        this.setState({
            isVisible: true
        })
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    componentDidMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    }

    renderCircles() {
        return [<Animatable.View style={[styles.circle, { marginRight: -45, top: 40, right: 0 }]} animation="zoomIn">
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                colors={[colors.PRIMARY_COLOR_1, colors.PRIMARY_COLOR_SHADE_1]}
                style={{ width: "100%", height: "100%" }}/>
        </Animatable.View>,
            <Animatable.View style={[styles.circle, { marginLeft: -45, bottom: 40, left: 0 }]} animation="zoomIn">
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    colors={[colors.PRIMARY_COLOR_1, colors.PRIMARY_COLOR_SHADE_1]}
                    style={{ width: "100%", height: "100%" }}/>
            </Animatable.View>]
    }

    render() {
        const {
            renderFromView, buttonString, isAppLoading, onButtonClick, footerAction
        } = this.props;
        const { isVisible } = this.state;

        return <View style={styles.container}>

            {this.renderCircles()}

            {isVisible && <Animatable.View
                animation="fadeInLeft"
                style={[styles.subSection, {
                    marginTop: 20,
                    paddingLeft: 30,
                    alignItems: "flex-start",
                }]}>
                <Text style={styles.appTitleText}>{stringConstants.appName}</Text>
                <Text style={styles.appTagLineText}>{stringConstants.appTagLine}</Text>
            </Animatable.View>}

            <View style={styles.mainBlock}>
                <Animatable.View style={[styles.centralBlock, { paddingVertical: isVisible ? 50 : 20 }]}
                                 animation="fadeIn">
                    <Animatable.View animation="fadeInDown" style={styles.textContainer}>

                        {!isVisible && <Animatable.Text
                            animation="zoomIn"
                            style={[styles.appTitleText, {
                                color: colors.BLACK_SHADE_40,
                                fontSize: fontSizes.size25
                            }]}>
                            {stringConstants.appName}
                        </Animatable.Text>}

                        {renderFromView({ isVisible })}

                        <Button
                            style={styles.buttonStyle}
                            isLoading={isAppLoading}
                            textStyle={{ fontSize: fontSizes.size14 }}
                            title={buttonString}
                            onPress={onButtonClick}
                        />
                        {footerAction && <Text onPress={!isAppLoading ? footerAction.onPress : undefined}
                                               style={[styles.footerActionStyle, { opacity: isAppLoading ? 0.4 : 1 }]}>
                            {footerAction.title}
                        </Text>}
                    </Animatable.View>
                </Animatable.View>
            </View>
            {isVisible && <View style={[styles.subSection, { paddingBottom: 10 }]}>
                <Text style={styles.appFooterText}>{stringConstants.appFooterString}</Text>
            </View>}
        </View>
    }
}

const styles = StyleSheet.create({
    circle: {
        width: circleDim,
        borderWidth: 30,
        borderColor: colors.BLACK_SHADE_3,
        overflow: "hidden",
        position: "absolute",
        borderRadius: circleDim / 2,
        height: circleDim
    },
    mainBlock: {
        flex: 1,
        justifyContent: 'center'
    },
    container: { flex: 1, position: "relative", backgroundColor: colors.WHITE },
    centralBlock: {
        paddingHorizontal: 10,
        marginHorizontal: 40,
        borderColor: 'black',
        elevation: 2,
        borderRadius: 20,
        backgroundColor: colors.WHITE,
        shadowColor: colors.BLACK_SHADE_40,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
    },
    subSection: {
        width: "100%",
        height: 100,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    appTitleText: {
        color: colors.BLACK_SHADE_80,
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size35
    },
    appFooterText: {
        ...fontStyle,
        color: colors.BLACK_SHADE_40,
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size10
    },
    footerActionStyle: {
        ...fontStyle,
        marginTop: 10,
        fontSize: fontSizes.size10,
        color: colors.PRIMARY_COLOR_1,
        fontFamily: fonts.MeriendaBold
    },
    appTagLineText: {
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.BLACK_SHADE_40,
        fontSize: fontSizes.size12
    },
    buttonStyle: { borderRadius: 50, width: 150, height: 40 },
});

