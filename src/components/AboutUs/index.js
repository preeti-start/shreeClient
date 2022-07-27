import React, { Component } from 'react';

import './index.css';
import HomeHeader from "../../containers/HomeHeader";
import appStringConstants from "../../constants/appStringConstants";
import { loadAnimations } from "../../utils/functions";

class AboutUs extends Component {

    componentDidMount() {
        loadAnimations();
    }

    renderTeam({ imgUrl, name, designation, description }) {
        return <div className="col-md-6 col-lg-4 mb-5 mb-lg-5">
            <div className="team-member">

                <img src={imgUrl} alt="Image" className="img-fluid"/>

                <div className="text">

                    <h2 className="mb-2 font-weight-light h4">{name}</h2>
                    <span className="d-block mb-2 text-white-opacity-05">{designation}</span>
                    <p className="mb-4">{description}</p>
                    <p>
                        <a className="text-white p-2"><span
                            className="icon-facebook"/></a>
                        <a className="text-white p-2"><span
                            className="icon-twitter"/></a>
                        <a className="text-white p-2"><span
                            className="icon-linkedin"/></a>
                    </p>
                </div>

            </div>
        </div>
    }

    render() {
        const { aboutUs } = this.props;
        return <div className="about-us-container1">

            <HomeHeader
                showCompositionsButton={false}
                showShopNow={false}
                title={appStringConstants.contactUsTitle}
                subTitle={aboutUs && aboutUs.description}
            />


            <div className="about-us-leadership">

                <div className="site-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <img src="images/img_1.jpg" alt="Image" className="img-fluid"/>
                            </div>
                            <div className="col-lg-6">
                                <div className="site-section-heading text-center mb-5 w-border col-md-6 mx-auto">
                                    <h2 className="mb-5">Our Office</h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, fugit nam
                                        obcaecati fuga itaque deserunt
                                        officia, error reiciendis ab quod?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="site-section">
                    <div className="container" data-aos="fade-up">
                        <div className="row">
                            <div className="site-section-heading text-center mb-5 w-border col-md-6 mx-auto">
                                <h2 className="mb-5">Team</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, fugit nam
                                    obcaecati fuga itaque deserunt
                                    officia, error reiciendis ab quod?</p>
                            </div>
                        </div>
                        <div className="row">
                            {aboutUs && aboutUs.leadership && aboutUs.leadership.length > 0 && aboutUs.leadership.map((empData, empIndex) =>
                                this.renderTeam({
                                    name: 'one',
                                    designation: 'designation',
                                    imgUrl: empData.img_url,
                                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit\n" +
                                        "                        ullam reprehenderit nemo."
                                }))}


                        </div>
                    </div>
                </div>
            </div>
        </div>

    }
}

export default AboutUs;
