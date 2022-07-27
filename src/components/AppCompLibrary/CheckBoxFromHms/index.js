import React from 'react';

import './index.css'

export default class CheckBox extends React.Component {
  static defaultProps = {
    shape: 'round',
    onChange: null,
    disabled: false,
    hasError: false,
    label: '',
    checked: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    }
  }

  onChange = event => {
    const { onChange, data } = this.props;
    const { checked } = event.target;
    if (onChange) onChange(event, checked, data);
  }


  render() {
    const { shape, label, id, disabled } = this.props;
    return (
      <div className={`os-checkbox ${shape}`}>
        <input
          id={id}
          type="checkbox"
          checked={this.props.checked}
          onClick={this.onChange}
          disabled={disabled}
        />
        <label htmlFor={id} className="mark" />
        {label && <div className="label">{label}</div>}
      </div>
    )
    }
  }
