import React from 'react';

import FormContainer from "../../containers/Form";

import './index.css'
import HomeHeader from "../../containers/HomeHeader";
import { loadAnimations } from "../../utils/functions";

export default class ContactUs extends React.Component {
    componentDidMount() {
        loadAnimations();
    }

    render() {
        const { clickActions, fieldGroups } = this.props;
        return <div>
            <HomeHeader
                showShopNow={false}
                showCompositionsButton={false}
            />
            <div className="contact-us-container">
                <div className="contact-us-body">
                    <div className="">
                        <img className="contact-us-img" src={'/contact-us.gif'}/>
                    </div>
                    <div className="contact-us-form">
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
