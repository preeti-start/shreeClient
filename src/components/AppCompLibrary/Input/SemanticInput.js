import React from 'react';
import './index.css';
import Select from '../../AppCompLibrary/Select'
import getInput from './NativeInput';
import { getLocaleSupportedInputValue, isNoValueOrWhiteSpace } from '../../../utils/functions';

export default class SemanticInput extends React.Component {
    static defaultProps = {
        dropDownLabelKey: 'name',
        dropDownValueKey: '_id',
    };

    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
            showInputMessage: false,
        };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.autocomplete = 'new-password';
    }

    onFocus() {
        if (!this.props.readOnly) {
            this.setState({ isFocused: true });
            this.setState({
                showInputMessage: true,
            });
        }
        this.props.onFocus && this.props.onFocus();
    }

    onBlur(evt) {
        if (!this.props.readOnly) {
            this.setState({ isFocused: false });
            this.setState({
                showInputMessage: false,
            });
        }
        this.props.onBlur && this.props.onBlur(evt);
    }

    onChange(event) {
        const { onChange } = this.props;
        onChange && onChange(event.target.value, event);
    }

    getLocaleSupportedInput(inputValue) {
        if (this.props.type !== 'currency') {
            return inputValue;
        }
        const locale = this.props.intl.locale;
        const localeBasedValue = getLocaleSupportedInputValue(inputValue, locale);
        return localeBasedValue;
    }

    renderDropdownInput() {
        const {
            errorText, activeDropDownItemIndex, onDropDownSelect,
            dropDownOptions, readOnly, dropDownLabelKey, dropDownValueKey,
            label, info, name
        } = this.props;
        const { showInputMessage } = this.state;
        return (
            <div className={`${'input-container'} ${errorText ? 'input-error-case-container' : ''}`}>
                <div className="field" style={{ position: 'relative', flexFlow: 'unset' }}>
                    <Select
                        onChange={(value, option) => onDropDownSelect({ value, option })}
                        options={dropDownOptions}
                        value={activeDropDownItemIndex}
                        labelKey={dropDownLabelKey}
                        valueKey={dropDownValueKey}
                        disabled={readOnly}
                        name={name}
                    />
                    <label style={{ position: 'absolute', top: 0, pointerEvents: 'none' }}
                           className={`add_transition input-label-section ${errorText ? 'input-label-error-case' : ''}`}>
                        {errorText ? errorText : label}
                    </label>
                    {( showInputMessage && info ) &&
                    <div className="info-text">
                        {info}
                    </div>
                    }
                </div>
            </div>
        )
    }

    renderNonDropDown() {
        const { isFocused } = this.state;
        const {
            errorText, onKeyPress, className,
            type, label, inputValue, endAdornment, readOnly, supportsHelpIcon, info, name
        } = this.props;
        const { showInputMessage } = this.state;
        const showAnimatedLabel = isFocused || !isNoValueOrWhiteSpace(inputValue);
        const placeholder = !isFocused ? '' : this.props.placeholder;
        return (
            <div className={`${'input-container'} ${errorText ? 'input-error-case-container' : ''} ${className || ''}`}>
                <div className="input-subcontainer">
                    {getInput({
                        className: `input-class ${showAnimatedLabel ? 'input-class-focused' : ''} ${readOnly ? 'disabled-input-class' : ''}`,
                        autocomplete: this.autocomplete,
                        type: type === 'currency' ? 'text' : type,
                        placeholder,
                        value: this.getLocaleSupportedInput(inputValue),
                        onChange: this.onChange,
                        onKeyPress,
                        onFocus: this.onFocus,
                        onBlur: this.onBlur,
                        readOnly,
                        name,
                    })}
                    <label
                        className={`add_transition input-label-section ${showAnimatedLabel ? 'label-focused' : ''} ${errorText ? 'input-label-error-case' : ''}`}>
                        {errorText ? errorText : label}
                        {supportsHelpIcon &&
                        <span className="helpIconContainer">
              <svg className="svg-icon" width="12" height="12" viewBox="0 0 12 14">
                <use xlinkHref="#placeholder_question_mark"/>
              </svg>
            </span>}
                    </label>
                </div>
                {( showInputMessage && info ) &&
                <div className="info-text">
                    {info}
                </div>
                }
                {endAdornment && <div className="input-right-content-container">{endAdornment}</div>}
            </div>
        )
    }

    render() {
        const { showDropDown } = this.props;
        if (showDropDown) {
            return this.renderDropdownInput();
        }
        return this.renderNonDropDown();
    }
}
