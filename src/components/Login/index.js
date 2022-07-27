import React, { Component } from 'react';

import FormContainer from "../../containers/Form";
import appStringConstants from "../../constants/appStringConstants";
import Slider from "../AppCompLibrary/Slider";

import './index.css';

export default class LoginComp extends Component {
    renderSlickSlides() {
        if (appStringConstants && appStringConstants.appDescription && appStringConstants.appDescription.length > 0) {
            return appStringConstants.appDescription.map((descVal, descIndex) =>
                <div className="login-desc-container" key={`${descIndex}_app_desc`}>
                    {descVal}
                </div>)
        }
        return null;
    }

    render() {
        const { fieldGroups, clickActions } = this.props;
        return <div className="login-container">
            <div className="login-body">
                <div className="login-left-section">
                    <div className="login-left-desc-section">
                        <Slider slickSlides={this.renderSlickSlides()}/>
                    </div>
                </div>
                <div className="login-right-section">
                    <div className="login-right-form-section">
                        <FormContainer
                            fieldGroups={fieldGroups}
                            clickActions={clickActions}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}
