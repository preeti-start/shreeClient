import React from 'react';

import PropTypes from 'prop-types'


export default class Option extends React.Component {
    static propTypes = {
        labelKey: PropTypes.string.isRequired,
        index: PropTypes.number.isRequired,
        option: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        event.stopPropagation();
        this.props.onChange(this.props.option, this.props.index);
    }

    render() {
        const {option, labelKey, className} = this.props;
        return (
            <div
                className={className ? 'options-selector-option ' + className : 'options-selector-option'}
                onMouseDown={this.onChange}>
                {option.icon && option.icon()}{option[labelKey]}
            </div>
        )
    }
}
