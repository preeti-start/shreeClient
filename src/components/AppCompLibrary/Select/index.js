import React from 'react'; // eslint-disable-line react/no-deprecated
import PropTypes from 'prop-types'

import Option from './Option';

import './index.css';
import {isNoValueOrWhiteSpace} from '../../../utils/functions';

export default class Select extends React.Component {
    static propTypes = {
        options: PropTypes.array,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        open: PropTypes.bool,
        disabled: PropTypes.bool,
        renderDropDown: PropTypes.func,
        placeholder: PropTypes.string,
        valueKey: PropTypes.string,
        label: PropTypes.string,
        errorText: PropTypes.string,
        labelKey: PropTypes.string,
        searchable: PropTypes.bool,
        onChange: PropTypes.func,
        optionsClass: PropTypes.string,
        showIconinInput: PropTypes.bool,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
    }

    static defaultProps = {
        options: [],
        value: '',
        label: '',
        placeholder: '',
        errorText: '',
        optionsClass: '',
        renderDropDown: null,
        open: false,
        searchable: true,
        disabled: false,
        labelKey: 'label',
        valueKey: 'value',
        onChange: () => {
        },
        onFocus: () => {
        },
        onBlur: () => {
        },
        validateOnChange: () => true,
        showIconinInput: false,
    }

    constructor(props) {
        super(props);
        const option = this.getValue(props.value, props.options);
        let inputValue = option[props.labelKey];
        if (props.formatSelectedValue) {
            inputValue = props.formatSelectedValue(option);
        }
        this.state = {
            inputValue,
            option: option,
            open: props.open,
            isFocused: false,
            options: props.options,
        }
        this.selectRef = null;
        this.onInputChange = this.onInputChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onBodyClick = this.onBodyClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onLabelClick = this.onLabelClick.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onBodyClick)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.options !== this.props.options || newProps.value !== this.props.value) {
            const {value, options, valueAdditionalCheckKey, valueAdditionalCheckValue} = newProps;
            const option = this.getValue(value, options, valueAdditionalCheckKey, valueAdditionalCheckValue)
            this.setState({
                options: newProps.options,
                option,
                inputValue: this.getInputValue(option),
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onBodyClick)
    }

    getValue(value, options, valueAdditionalCheckKey, valueAdditionalCheckValue) {
        const {valueKey, userInputSupport, labelKey} = this.props;
        for (let i = 0; i < options.length; i++) {
            const selectedOption = valueAdditionalCheckKey ?
                (options[i][valueAdditionalCheckKey] === valueAdditionalCheckValue) :
                options[i][valueKey] === value;
            if (selectedOption) {
                return options[i];
            }
        }
        if (userInputSupport) {
            const option = {};
            option[valueKey] = value;
            option[labelKey] = value;
            return option;
        }
        return {};
    }

    getInputValue = option => {
        const {labelKey, formatSelectedValue} = this.props;
        let inputValue = option[labelKey];
        if (formatSelectedValue) {
            inputValue = formatSelectedValue(option);
        }
        return inputValue;
    }

    onBodyClick(event) {
        if (this.state.open && this.selectRef && !this.selectRef.contains(event.target)) {
            this.setState({open: false});
        }
    }

    onInputChange(event) {
        const {options, labelKey, userInputSupport} = this.props;
        const value = event.target.value;
        const valueLowerCasedValue = value.toString().toLowerCase();
        this.touch = true;
        const filteredOptions = options.filter(option => {
            const optionLowerCasedValue = option[labelKey].toString().toLowerCase();
            return optionLowerCasedValue.indexOf(valueLowerCasedValue) >= 0;
        });
        if (userInputSupport && !isNoValueOrWhiteSpace(value) && filteredOptions.length === 0) {
            this.setState({
                inputValue: value,
                options: filteredOptions.length > 0 ? filteredOptions : [],
            });
        }
        else {
            this.setState({
                inputValue: value,
                options: filteredOptions.length > 0 ? filteredOptions : null,
            });
        }
    }

    onChange(option, index) {
        const {valueKey, labelKey, validateOnChange} = this.props;
        const isValidValue = validateOnChange(option);
        if (!isValidValue) {
            this.setState({open: false});
            return;
        }
        this.touch = false;
        if (this.state.option[labelKey] !== option[labelKey] && this.props.onChange) {
            this.props.onChange(option[valueKey], option, index);
        }
        this.setState({
            option,
            inputValue: this.getInputValue(option),
            open: false,
        });
    }

    onFocus() {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            open: true,
            isFocused: true,
        });
        this.props.onFocus && this.props.onFocus();
    }

    onBlur() {
        const {userInputSupport, valueKey, labelKey} = this.props;
        const {inputValue} = this.state;
        this.setState({
            isFocused: false,
            options: this.props.options,
        });
        if (this.touch) {
            if (userInputSupport) {
                const option = {};
                option[valueKey] = inputValue;
                option[labelKey] = labelKey;
                this.props.onChange(inputValue, option);
            }
            else {
                this.setState({
                    inputValue: this.getInputValue(this.state.option),
                });
            }
        }
        this.props.onBlur && this.props.onBlur();
    }

    onLabelClick() {
        if (this.props.disabled) {
            return;
        }
        this.setState(prevState => ({
            open: true,
        }));
    }

    renderDropDown() {
        if (this.props.renderDropDown) {
            this.props.renderDropDown();
        }
        const {disabled, errorText} = this.props;
        const {open} = this.state;
        return (
            <svg
                className={`option-selector-drop-down ${disabled ? 'option-selector-disabled' : ''} ${errorText ? 'option-selector-error' : ''} ${open ? 'option-selector-close' : ''}`}
                viewBox="0 0 14 9">
                <use xlinkHref="#down_arrow_icon"/>
            </svg>
        )
    }

    renderOptions() {
        const {labelKey, valueKey, value} = this.props;
        const {options} = this.state;
        if (!options) {
            return (
                <div className="select-option-no-element">
                    nothing selected
                </div>
            )
        }
        const keyField = this.props.keyField || valueKey;
        return (
            options.map((option, index) => (
                <Option
                    key={option[keyField]}
                    option={option}
                    index={index}
                    labelKey={labelKey}
                    onChange={this.onChange}
                    className={option[valueKey] === value ? 'selected' : ''}
                />
            ))
        )
    }

    renderInputBox() {
        const {inputValue, isFocused, option, open} = this.state;
        const {showIconinInput, disabled, label, errorText, searchable, isMandatory, name} = this.props;
        const _label = isMandatory ? `${label}*` : label
        const showAnimatedLabel = (isFocused || inputValue);
        return (
            <div
                className={`option-selector-input-subcontainer ${open ? 'selector-expanded' : ''} ${errorText ? 'option-selector-input-subcontainer-error-case' : ''}`}
                onClick={this.onLabelClick}>
                {searchable ? <input
                    autoComplete={'new-password'}
                    type={'text'}
                    className={`${disabled ? 'option-selector-disabled' : ''} ${showAnimatedLabel ? 'option-selector-input-focused' : ''}`}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    readOnly={disabled}
                    onChange={this.onInputChange}
                    value={inputValue}
                    name={name}
                /> : inputValue ?
                    <div className="non-searchable-input-value">
                        {showIconinInput && option.icon && option.icon()}{"testtestsetst"}
                    </div> :
                    null}
                {this.renderDropDown()}
                <label
                    className={`option-selector-input-label ${showAnimatedLabel ? 'option-selector-label-focused' : ''} ${errorText ? 'input-label-error-case' : ''}`}>
                    {errorText ? errorText : _label}
                </label>
            </div>
        )
    }

    render() {
        const {open} = this.state;

        return (
            <div className={`option-selector-main-container ${this.props.optionsClass}`}
                 ref={node => this.selectRef = node}>
                {this.renderInputBox()}
                {open && <div className="options-container">
                    {this.renderOptions()}
                </div>}
            </div>
        )
    }
}
