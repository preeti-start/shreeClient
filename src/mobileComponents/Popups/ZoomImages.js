import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, ImageBackground, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import EntypoIcon from "react-native-vector-icons/Entypo";

import { colors } from "../../mobileTheme";

const sliderDim = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class ZoomImages extends React.Component {
    static defaultProps = {
        images: []
    };

    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 1
        };
    }

    componentDidMount() {
        // setTimeout(_ => {
        //     alert("m updating")
            // this.setState({ activeSlide: 1 })
        // }, 1000)
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <ImageBackground
                    // imageStyle={{ resizeMode: 'resize' }}
                    // imageStyle={{ resizeMode: 'scale' }}
                    // imageStyle={{ resizeMode: 'cover' }}
                    // imageStyle={{ resizeMode: 'stretch' }}
                    imageStyle={{ resizeMode: 'contain' }}
                    style={styles.imageStyle}
                    source={{ uri: item.url }}
                />
            </View>
        );
    };

    render() {
        const { images, onCrossPress } = this.props;
        return <View style={styles.container}>
            <Carousel
                // firstItem={this.state.activeIndex}
                activeSlideOffset={2}
                enableMomentum={true}
                // activeSlideOffset={this.state.activeIndex}
                // initialScrollIndex={this.state.activeIndex}
                // layout={'tinder'}
                // layout={'stack'}
                data={images}
                renderItem={this._renderItem}
                sliderWidth={sliderDim}
                onSnapToItem={index => {alert(index)}}
                itemWidth={sliderDim}
            />
            <TouchableOpacity style={styles.crossContainer} onPress={onCrossPress}>
                <EntypoIcon name={"cross"} color={colors.WHITE} size={25}/>
            </TouchableOpacity>
        </View>
    }
}
const styles = StyleSheet.create({
    container: { position: "relative", height: windowHeight, backgroundColor: colors.BLACK },
    crossContainer: {
        position: "absolute",
        top: 20,
        right: 10,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.WHITE_SHADE_20,
        justifyContent: "center",
        alignItems: "center",
    },
    imageStyle: { width: sliderDim, height: sliderDim },
    slide: {
        width: sliderDim,
        height: windowHeight,
        alignItems: "center",
        justifyContent: "center",
    },
});