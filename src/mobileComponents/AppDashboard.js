import React, { Component } from 'react';
import { Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from "../mobileTheme";
import { Loader } from "./AppComponents/index";

const HEADER_SCROLL_DISTANCE = 200;
const topMarginSlide = 35;

export default class AppDashboard extends Component {

    static defaultProps = {
    };

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
        };
    }

    render() {
        const { headerView, isDashboardLoading, detailView } = this.props;
        const { scrollY } = this.state;

        const headerTopMargin = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -topMarginSlide],
            extrapolate: 'clamp',
        });
        const viewTopMargin = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -topMarginSlide],
            extrapolate: 'clamp',
        });
        const topSectionTopMargin = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, (topMarginSlide + 5)],
            extrapolate: 'clamp',
        });
        const titleScale = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 0.85],
            extrapolate: 'clamp',
        });
        const leftMargin = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 35],
            extrapolate: 'clamp',
        });

        return <LinearGradient style={styles.container}
                               colors={[colors.WHITE, colors.WHITE]}>
            {headerView && headerView({ leftMargin, headerTopMargin, titleScale, topSectionTopMargin })}
            <Animated.View style={[
                styles.detailViewContainer,
                {
                    transform: [
                        { translateY: viewTopMargin }
                    ],
                }
            ]}>
                {detailView && detailView({ scrollY, topSectionTopMargin })}
            </Animated.View>
            {isDashboardLoading && <Loader/>}
        </LinearGradient>
    }
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    detailViewContainer: { flex: 1 },
});
