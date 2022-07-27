import React from 'react';

import './index.css';
import SemanticInput from './SemanticInput';
import TextArea from './TextArea';
import { fieldTypes } from "../../../constants";

export default class InputText extends React.Component {
    static defaultProps = {
        type: fieldTypes.string,
        errorText: undefined,
        showSemantic: true,
    };

    render() {
        const {
            className, errorText, activeDropDownItemIndex, onDropDownSelect, showDropDown,
            dropDownOptions, placeholder = ' ', onKeyPress, onChange, style, onFocus,
            onBlur, type, label, inputValue, endAdornment, readOnly, supportsHelpIcon, info,
            dropDownLabelKey, dropDownValueKey, dropDownValuelKey, isMandatory, intl, name,
        } = this.props;
        const _label = isMandatory ? `${label}*` : label;
        if (type === 'textarea') {
            return <TextArea placeholder={errorText ? errorText : placeholder}
                             value={inputValue}
                             onChange={onChange}
                             className={`textarea-wrapper ${className || ''} ${errorText ? 'taxt-area-error-case' : ''}`}/>
        }
        else {
            return (
                <SemanticInput
                    errorText={errorText}
                    className={className}
                    activeDropDownItemIndex={activeDropDownItemIndex}
                    dropDownValuelKey={dropDownValuelKey}
                    dropDownValueKey={dropDownValueKey}
                    dropDownLabelKey={dropDownLabelKey}
                    onDropDownSelect={onDropDownSelect}
                    showDropDown={showDropDown}
                    onBlur={onBlur}
                    dropDownOptions={dropDownOptions}
                    placeholder={placeholder}
                    onKeyPress={onKeyPress}
                    onChange={onChange}
                    type={type}
                    label={_label}
                    isMandatory={isMandatory}
                    inputValue={inputValue}
                    endAdornment={endAdornment}
                    supportsHelpIcon={supportsHelpIcon}
                    readOnly={readOnly}
                    style={style}
                    onFocus={onFocus}
                    info={info}
                    intl={intl}
                    name={name}
                />
            );
        }
    }
}
