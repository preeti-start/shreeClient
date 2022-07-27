import React, { Component } from 'react';
import { View, Image, Keyboard, Platform, Text, Dimensions, StyleSheet } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { colors, sizes, fontSizes, fontStyle, fonts } from '../mobileTheme';
import stringConstants from "../constants/mobileStringConstants";
import { Button } from "./AppComponents/index";

const { width, height } = Dimensions.get('window');
const centralCardWidth = width - 30; // 15 margin for each side
const slantCardHeight = 100;

export default class UserRegistrationComponent extends Component {

    static defaultProps = {
        imgContainerStyle: {},
        middleContainerFlex: 1.5,
    };

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
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }

    render() {
        const {
            renderFromView, imgContainerStyle, imgUrl, middleContainerFlex,
            buttonString, isAppLoading, onButtonClick, footerAction
        } = this.props;
        const { isVisible } = this.state;

        return <LinearGradient style={styles.container} colors={[colors.WHITE, colors.BLACK_SHADE_10]}>
            <View
                style={styles.container}>
                <View style={[styles.topContainer, { flex: isVisible ? 0.7 : 0 }]}>
                    <Text style={styles.appTitleText}>{stringConstants.appName}</Text>
                    <Text style={styles.appTagLineText}>{stringConstants.appTagLine}</Text>
                </View>
                <View style={[styles.middleContainer, { flex: middleContainerFlex }]}>

                    {isVisible && <View style={styles.slantContainer}/>}

                    <View style={[styles.formContainer, { flex: isVisible ? 1 : 0, marginTop: isVisible ? 0 : 30 }]}>
                        <View style={[styles.formBg, {
                            flex: isVisible ? 1 : 0,
                            backgroundColor: isVisible ? colors.PRIMARY_BG_COLOR_1 : 'transparent'
                        }]}>
                            {renderFromView({ isVisible })}
                        </View>
                        <View style={[styles.buttonHalfBg, { height: isVisible ? 30 : (sizes.buttonHeight + 10) }]}/>
                        <View style={styles.buttonContainer}>
                            <Button
                                style={styles.buttonStyle}
                                isLoading={isAppLoading}
                                title={buttonString}
                                onPress={onButtonClick}
                            />
                        </View>
                    </View>
                    {isVisible && <View style={[styles.imgContainer, { ...imgContainerStyle }]}>
                        <Image style={styles.imgStyle} source={imgUrl}/>
                    </View>}

                </View>
                <View
                    style={[styles.bottomContainer, {
                        flex: isVisible ? 0.5 : 0,
                        justifyContent: footerAction && footerAction.align ? footerAction.align : 'center'
                    }]}>
                    {footerAction && <Text onPress={!isAppLoading ? footerAction.onPress : undefined}
                                           style={[styles.footerActionStyle, { opacity: isAppLoading ? 0.4 : 1 }]}>
                        {footerAction.title}
                    </Text>}
                </View>
                {Platform.OS === 'ios' && <LinearGradient style={{
                    position: 'absolute',
                    right: 0,
                    height, width: 15, backgroundColor: colors.WHITE
                }} colors={[colors.WHITE, colors.BLACK_SHADE_10]}/>}
            </View>
        </LinearGradient>
    }
}

const styles = StyleSheet.create({
    buttonContainer: { position: 'absolute', bottom: 0 },
    footerActionStyle: {
        ...fontStyle,
        fontSize: fontSizes.size12,
        color: colors.PRIMARY_COLOR_1,
        fontFamily: fonts.MeriendaBold
    },
    buttonStyle: { borderRadius: 50 },
    appTitleText: {
        color: colors.PRIMARY_COLOR_1,
        fontFamily: fonts.MeriendaBold,
        fontSize: fontSizes.size35
    },
    buttonHalfBg: { width: '100%', backgroundColor: 'transparent' },
    appTagLineText: {
        paddingTop: 5,
        fontFamily: fonts.MeriendaOneRegular,
        color: colors.PRIMARY_COLOR_1,
        fontSize: fontSizes.size15
    },
    container: { flex: 1, position: 'relative' },
    formContainer: {
        alignItems: 'center',
        justifyContent: "flex-end",
        width: centralCardWidth,
    },
    formBg: { justifyContent: 'center', width: '100%' },
    imgContainer: {
        position: 'absolute',
        width: 100,
        height: 100,
        top: 5,
    },
    imgStyle: { width: "100%", height: "100%" },
    slantContainer: {
        marginTop: Platform.OS === 'ios' ? -slantCardHeight : 0,
        marginRight: Platform.OS === 'ios' ? -centralCardWidth : 0,
        borderLeftWidth: Platform.OS === 'ios' ? centralCardWidth * 2 : centralCardWidth,
        borderLeftColor: 'transparent',
        borderBottomWidth: Platform.OS === 'ios' ? slantCardHeight * 2 : slantCardHeight,
        borderBottomColor: colors.PRIMARY_BG_COLOR_1,
        width: 0,
        height: 0
    },
    topContainer: { paddingTop: 5, justifyContent: "center", marginLeft: 60 },
    middleContainer: {
        position: 'relative',
        alignItems: "center",
        justifyContent: "center"
    },
    bottomContainer: { alignItems: 'center', paddingTop: 10, paddingBottom: 20 }
});

