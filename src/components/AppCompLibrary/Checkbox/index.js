import React from 'react'
import PropTypes from 'prop-types';

import './index.css';

export default class Checkbox extends React.Component {

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
        const { title, readOnly = false, containerStyle, value } = this.props;
        return <div className={`checkbox-container ${containerStyle}`}>
            <input className="checkbox"
                   readOnly={readOnly}
                   type={"checkbox"}
                   checked={value}
                   onChange={this.onCheckboxValChange}
            />
            <div className="checkbox-label">{title}</div>
        </div>
    }
}