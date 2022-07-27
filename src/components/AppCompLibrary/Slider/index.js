import React, {Component} from 'react';
import Slider from 'react-slick';

import './index.css';

export default class AppSlider extends Component {

    render() {
        const {slickSlides} = this.props;
        const settings = {
            className: 'slickSlider',
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: false,
            autoplaySpeed: 3000,
            dragging: true,
            dots: true,
        };
        return <Slider {...settings}>
            {slickSlides}
        </Slider>
    }
}