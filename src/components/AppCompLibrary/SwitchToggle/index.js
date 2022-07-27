import React from 'react';
import PropTypes from "prop-types";

import './index.css';

export default class SwitchToggle extends React.Component {
    constructor(props) {
        super(props);
        this.onCheckboxValChange = this.onCheckboxValChange.bind(this);
    }

    static propTypes = {
        onValueChange: PropTypes.func.isRequired,
    };

    onCheckboxValChange(e) {
        const { onValueChange } = this.props;
        onValueChange && onValueChange(e.target.checked, e)
    }

    render() {
        const { labelText, value, disabled, onClick } = this.props;
        return (
            <div className="toggle-switch-container">
                <span className="labeText">{labelText}</span>
                <label className="switch">
                    <input type="checkbox"
                           checked={value}
                           onChange={this.onCheckboxValChange}
                           disabled={disabled}
                           onClick={onClick}
                    />
                    <span className="slider round"/>
                </label>
            </div>
        );
    }
}
