import React from 'react';

import appStringConstants from "../../constants/appStringConstants";
import {
    onShopNowClick,
    onShopCompositionsClick,
    onHomeClick,
    onAboutUsClick,
    onContactUsClick
} from '../../utils/webFunctions'
import Button from "../../components/AppCompLibrary/Button";
import { appButtonType } from "../../constants";
import { isImgUrlExists } from "../../utils/functions";

import './index.css';

export default class AppHeader extends React.Component {

    static defaultProps = {
        totalCartItemsCount: 0,
        showCartIcon: false,
        lightHeader: false,
        showContactUsIcon: true,
        showAboutUsIcon: true,
    };

    renderAppName() {
        let { lightHeader } = this.props;
        return <div className="app-header-logo-container">
            <span
                onClick={onHomeClick}
                className={`label ${lightHeader ? 'light-color' : ''}`}>{appStringConstants.appTitle}</span>
            {/*{appStringConstants.appTitle.split("").map((stringVal, stringIndex) => <span*/}
                {/*onClick={onHomeClick}*/}
                {/*key={`app_title${stringIndex}`}*/}
                {/*className={`label ${lightHeader ? 'light-color' : ''} labelwwww_${stringIndex}`}>{stringVal}</span>)}*/}
        </div>
    }

    renderUserDetails = ({ isProfileImageUrl, appIconStyle }) => {

        const { onUserNameClick, userData } = this.props;

        if (userData) {
            return [<div onClick={onUserNameClick}>
                {isProfileImageUrl &&
                <img className="app-header-profile-img-icon"
                     src={isProfileImageUrl}/>}
                {!isProfileImageUrl &&
                <svg viewBox="0 0 299 299" className={appIconStyle}>
                    <use xlinkHref="#user-icon"/>
                </svg>}
            </div>, <div className="app-header-horizontal-seperator"/>]
        }
        return null;
    };

    render() {
        let {
            onCartIconClick, totalCartItemsCount, onLoginLinkClick, showShopNowLink, showCartIcon,
            userData, showLocMissingNotification, showCompositionsButton,
            onLogoutClick, showContactUsIcon, showAboutUsIcon, lightHeader
        } = this.props;

        const appIconStyle = `app-header-icons ${lightHeader ? 'light-color' : ''}`;
        const isProfileImageUrl = isImgUrlExists({ data: userData, fieldName: 'profile_img' });

        return <header>

            {this.renderAppName()}

            <div className="app-header-menu-container">
                {showLocMissingNotification &&
                <div
                    className="app-header-location-notification">{appStringConstants.stringForLocMissingWhileServingHomeDelivery}</div>}
                {showShopNowLink &&
                <Button buttonType={appButtonType.type_1} title={appStringConstants.shopNowButtonTitle}
                        onClick={onShopNowClick}/>}
                {showCompositionsButton &&
                <Button buttonType={appButtonType.type_1} title={appStringConstants.compositionsButtonTitle}
                        onClick={onShopCompositionsClick}/>}
                <div className="app-header-right-menu-container">
                    {showCartIcon && [<div className="app-header-cart-container">
                        <svg onClick={onCartIconClick} viewBox="0 0 19.25 19.25" className={appIconStyle}>
                            <use xlinkHref="#cart-icon"/>
                        </svg>
                        <div className="app-header-cart-count">{totalCartItemsCount}</div>
                    </div>, <div className="app-header-horizontal-seperator"/>]}
                    {showContactUsIcon && [<svg onClick={onContactUsClick} viewBox="0 0 512 512"
                                                className={appIconStyle}>
                        <use xlinkHref="#phone-icon-circle"/>
                    </svg>,
                        <div className="app-header-horizontal-seperator"/>]}
                    {showAboutUsIcon && [<svg onClick={onAboutUsClick} viewBox="0 0 475 475" className={appIconStyle}>
                        <use xlinkHref="#user-profile-icon"/>
                    </svg>,
                        <div className="app-header-horizontal-seperator"/>]}

                    {this.renderUserDetails({ isProfileImageUrl, appIconStyle })}

                    {userData && <div className="logout-icon" onClick={onLogoutClick}>
                        <svg viewBox="0 0 490 490" className={appIconStyle}>
                            <use xlinkHref="#logout"/>
                        </svg>
                    </div>}

                    {!userData &&
                    <Button
                        title={appStringConstants.homeScreenLoginButtonTitle}
                        onClick={onLoginLinkClick}/>}

                </div>
            </div>

        </header>
    }
}
