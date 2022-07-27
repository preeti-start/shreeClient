import React from 'react';
import './index.css';
import Input from '../Input';
import SwitchToggle from '../SwitchToggle';
import LocationComp from '../Input/LocationComp';
import Button from '../Button';
import FileUpload from '../FileUpload';
import { fieldTypes } from '../../../constants';

export default class Form extends React.Component {
    render() {
        const { fieldGroups, headerView, errorJson, clickActions } = this.props;
        return <div className="form-container">
            {headerView && ( headerView.title || headerView.rightActions ) && <div className="form-container-header">
                <div className="form-container-header-title">{headerView.title}</div>
                {headerView && headerView.rightActions && headerView.rightActions.length > 0 && headerView.rightActions.map((actionVal, actionIndex) =>
                    <Button
                        isLoading={actionVal.isLoading}
                        title={actionVal.title}
                        onClick={actionVal.onClick}
                    />)}
            </div>}
            {fieldGroups && fieldGroups.length > 0 && fieldGroups.map((grpVal, grpIndex) => (
                <div
                    className="form-fields-container"
                    key={grpIndex}>
                    {grpVal && grpVal.title && <div className="form-fields-title">{grpVal.title}</div>}
                    {grpVal && grpVal.fields && grpVal.fields.length > 0 && grpVal.fields.map((inputVal, inputIndex) => {

                        const errorText = inputVal && inputVal.field && errorJson && errorJson.hasOwnProperty(inputVal.field) ? errorJson[inputVal.field] : undefined;
                        const fieldType = inputVal && inputVal.type ? inputVal.type : fieldTypes.default;
                        return <div className="form-fields">
                            {fieldType === fieldTypes.dropdown && <Input
                                showDropDown={true}
                                errorText={errorText}
                                dropDownLabelKey={inputVal.displayKey}
                                dropDownValueKey={inputVal.valKey}
                                dropDownOptions={inputVal.options}
                                onDropDownSelect={inputVal.onValueChange}
                                inputValue={inputVal.value}
                                activeDropDownItemIndex={inputVal.value}
                                label={inputVal.label}
                            />}
                            {( fieldType === fieldTypes.number || fieldType === fieldTypes.textarea || fieldType === fieldTypes.string || fieldType === fieldTypes.password ) &&
                            <Input
                                type={fieldType}
                                onKeyPress={inputVal.onKeyPress}
                                errorText={errorText}
                                readOnly={inputVal.readOnly}
                                onChange={inputVal.onValueChange}
                                inputValue={inputVal.value}
                                label={inputVal.placeholder}
                                placeholder={fieldType === fieldTypes.textarea && inputVal.placeholder}
                            />}
                            {fieldType === fieldTypes.checkbox && <SwitchToggle
                                labelText={inputVal.title}
                                errorText={errorText}
                                type={inputVal.type}
                                value={inputVal.value}
                                key={inputIndex}
                                onValueChange={inputVal.onValueChange}
                            />}
                            {fieldType === fieldTypes.location && <LocationComp
                                errorText={errorText}
                                label={inputVal.label}
                                value={inputVal.value}
                                key={inputIndex}
                                onValueChange={inputVal.onValueChange}
                            />}
                            {( fieldType === fieldTypes.image || fieldType === fieldTypes.file ) && <FileUpload
                                errorText={errorText}
                                fileType={inputVal.fileType}
                                fieldType={inputVal.type}
                                maxLimit={inputVal.maxLimit}
                                multiple={inputVal.multiple}
                                onDelFileClick={inputVal.onDelFileClick}
                                key={inputIndex}
                                value={inputVal.value}
                                placeholder={inputVal.placeholder}
                                onChange={inputVal.onFileSelect}
                            />}
                        </div>

                    })}</div>
            ))}

            {clickActions && clickActions.length > 0 && <div className="form-actions-container">
                {clickActions.map((actionVal, actionIndex) => <Button
                    key={`${actionIndex}_form_action`}
                    title={actionVal.title}
                    isLoading={actionVal.isLoading}
                    onClick={actionVal.onClick}
                />)}
            </div>}
        </div>
    }
}
