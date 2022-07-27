import React from 'react';

import appStringConstants from "../../constants/appStringConstants";
import { onShopNowClick, onAboutUsClick, onHomeClick, onContactUsClick } from '../../utils/webFunctions'

import './index.css';

export default class HomeHeader extends React.Component {
    render() {
        const { title, subTitle } = this.props;
        return <div>
            <div className="site-wrap">

                <div className="site-navbar mt-4">
                    <div className="container py-1">
                        <div className="row align-items-center">
                            <div className="col-8 col-md-8 col-lg-4">
                                <h1 className="mb-0">
                                    <a onClick={onHomeClick} className="text-white h2 mb-0 app-title">
                                        <strong>
                                            {appStringConstants.appTitle}
                                        </strong>
                                    </a>
                                </h1>
                            </div>
                            <div className="col-4 col-md-4 col-lg-8">
                                <nav className="site-navigation text-right text-md-right" role="navigation">

                                    <div className="d-inline-block d-lg-none ml-md-0 mr-auto py-3">
                                        <a className="site-menu-toggle js-menu-toggle text-white">
                                            <span className="icon-menu h3"/></a></div>

                                    <ul className="site-menu js-clone-nav d-none d-lg-block">

                                        <li><a className="app-title"
                                               onClick={onAboutUsClick}>{appStringConstants.headerAboutUsButtonTitle}</a>
                                        </li>
                                        <li><a className="app-title"
                                               onClick={onContactUsClick}>{appStringConstants.headerContactUsButtonTitle}</a>
                                        </li>

                                    </ul>
                                </nav>
                            </div>


                        </div>
                    </div>
                </div>
            </div>

            <div className="site-mobile-menu">
                <div className="site-mobile-menu-header">
                    <div className="site-mobile-menu-close mt-3">
                        <span className="icon-close2 js-menu-toggle"/>
                    </div>
                </div>
                <div className="site-mobile-menu-body"/>
            </div>

            <div className="site-blocks-cover overlay" style={{ backgroundImage: "url('bg_1.jpg')" }}
                 data-aos="fade" data-stellar-background-ratio="0.5" data-aos="fade">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-md-8 text-center" data-aos="fade-up" data-aos-delay="400">
                            <h1 className="mb-4">{title}</h1>
                            <p className="mb-5">{subTitle}</p>
                            <p>
                                <a onClick={onShopNowClick}
                                   className="btn btn-primary px-5 py-3">{appStringConstants.shopNowButtonTitle}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
