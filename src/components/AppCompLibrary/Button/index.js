import React from 'react';

import './index.css';
import { appButtonType } from '../../../constants';

export default class Button extends React.Component {
    static defaultProps = {
        isActive: true,
        isLoading: false,
        isRound: false,
        buttonType: appButtonType.type_1,
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    onClick(e) {
        const { isActive, onClick, isLoading } = this.props;
        if (isActive && onClick && !isLoading) {
            onClick(e);
        }
    }

    render() {
        const {
            title, isLoading, buttonType,
            style, icon, className, isRound,
        } = this.props;
        let { isActive } = this.props;

        return (
            <div className="button-container">
                {isLoading &&
                <div
                    className={`${(buttonType === appButtonType.type_1 || buttonType === appButtonType.type_3) ? 'white-loading-dots' : (buttonType === appButtonType.type_4 ? 'red-loading-dots' : 'green-loading-dots')}`}>
                    <div className="dot-pulse"/>
                </div>}
                <div
                    className={`button
          ${isRound ? 'round-edge' : ''}
          ${buttonType === appButtonType.type_1 ? 'button-primary' : ''}
          ${buttonType === appButtonType.type_4 ? 'button-secondary-red' : ''}
          ${buttonType === appButtonType.type_2 ? 'button-white' : ''}
          ${!isActive ? 'button-inactive' : ''}
          ${isActive && buttonType === appButtonType.type_3 ? 'button-red' : ''}
          ${isActive && buttonType === appButtonType.type_5 ? 'button-secondary-green' : ''}
          ${className ? className : ''}`}
                    onClick={this.onClick}
                    style={style}>
                    {icon && <div className="button-icon">{icon}</div>}
                    {!isLoading &&
                    <div className="button-text-container"><span>{title}</span></div>}
                </div>
            </div>
        );
    }
}
