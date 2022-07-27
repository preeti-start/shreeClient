import React from 'react';

import './index.css';

export default class RadioButton extends React.Component {
    static defaultProps = {
        onClick: _ => {
        },
        isActive: false,
        className: ''
    };

    render() {
        const { onClick, className, isActive, title, value } = this.props;
        return <div onClick={_ => onClick({ value, title })} className={`radio-button-row ${className}`}>
            <div className={`radio-button-option ${isActive ? 'active' : ''}`}>
                <div className={`radio-button-inner-option ${isActive ? 'active' : ''}`}/>
            </div>
            <div>{title}</div>
        </div>
    }
}