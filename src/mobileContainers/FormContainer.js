import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { onFileSelect, onDelFileClick } from "../utils/functions";
import { getPresignedUrl } from "../redux-store/actions/userActions";
import { actionsOnImage, fieldTypes } from "../constants/index";
import { Form } from "../mobileComponents/AppComponents/index";
import stringConstants from "../constants/mobileStringConstants";

const initialState = {
    errorJson: {},
};

class FormContainer extends React.Component {
    static defaultProps = {
        formData: {},
        header: undefined,
        footer: undefined,
    };

    constructor(props) {
        super(props);
        const { formData } = props;
        this.state = {
            errorJson: initialState.errorJson,
            formData: { ...formData },
        };
        this.onClick = this.onClick.bind(this);
        this.onImageSelect = this.onImageSelect.bind(this);
        this.onFieldValChange = this.onFieldValChange.bind(this);
    }


    onImageSelect({ fieldDef, val, actionType = actionsOnImage.insert }) {
        const { getPresignedUrl, userToken } = this.props;
        const { formData } = this.state;
        const { getSignedUrl = true } = fieldDef;

        if (actionType === actionsOnImage.insert) {
            if (Array.isArray(val)) {
                const maxLimit = get(fieldDef, 'maxLimit');
                for (let count = 0; count < val.length; count++) {
                    const previousImgsCount = formData[fieldDef.name] ? formData[fieldDef.name].length : 0;
                    if (!maxLimit || (maxLimit > (count + previousImgsCount))) {
                        onFileSelect({
                            isMobile: true,
                            fieldVal: formData[fieldDef.name],
                            getSignedUrl,
                            formData,
                            index: count,
                            file: val[count],
                            field: fieldDef,
                            getPresignedUrl,
                            userToken
                        }).then(fileData => {
                            if (fileData) {
                                this.setState(prevState => ({
                                    errorJson: initialState.errorJson,
                                    formData: {
                                        ...prevState.formData,
                                        [fieldDef.name]: fieldDef.multiple ? (prevState.formData[fieldDef.name] ? [...prevState.formData[fieldDef.name], fileData] : [fileData]) : fileData
                                    },
                                }))
                            }
                        })
                    }
                }
            } else {
                onFileSelect({
                    isMobile: true,
                    fieldVal: formData[fieldDef.name],
                    getSignedUrl,
                    formData,
                    index: 0,
                    file: val,
                    field: fieldDef,
                    getPresignedUrl,
                    userToken
                }).then(fileData => {
                    if (fileData) {
                        this.setState(prevState => ({
                            errorJson: initialState.errorJson,
                            formData: {
                                ...prevState.formData,
                                [fieldDef.name]: fieldDef.multiple ? (prevState.formData[fieldDef.name] ? [...prevState.formData[fieldDef.name], fileData] : [fileData]) : fileData
                            },
                        }))
                    }
                })
            }
        }

        if (actionType === actionsOnImage.del) {
            this.setState(prevState => ({
                formData: {
                    ...prevState.formData,
                    [fieldDef.name]: onDelFileClick({ field: fieldDef, fieldValue: formData[fieldDef.name], file: val })
                },
            }))
        }

    }

    onFieldValChange({ val, resetOnSelect, fieldDef, fieldName }) {
        const { onFieldValChange } = this.props;
        const { formData } = this.state;
        let finalFormData = { ...formData };
        if (resetOnSelect && resetOnSelect.length > 0) {
            for (const fieldIndex in resetOnSelect) {
                if (finalFormData.hasOwnProperty(resetOnSelect[fieldIndex])) {
                    delete finalFormData[resetOnSelect[fieldIndex]];
                }
            }
        }
        finalFormData = { ...finalFormData, [fieldName]: val };
        // alert(JSON.stringify(finalFormData[fieldName]))

        if (onFieldValChange) {
            onFieldValChange({
                formData: finalFormData,
                fieldDef,
                onSuccess: ({ formData, errorJson = initialState.errorJson }) => {
                    this.setState({
                        formData,
                        errorJson,
                    });
                }
            });
        } else {
            this.setState({
                formData: finalFormData,
                errorJson: initialState.errorJson,
            });
        }
    }

    onClick(onClick) {
        const { formData, errorJson } = this.state;
        const { fieldGroups } = this.props;
        const finalErrorJson = { ...errorJson };
        if (fieldGroups && fieldGroups.length > 0) {
            for (const grpVal in fieldGroups) {
                if (grpVal && fieldGroups.hasOwnProperty(grpVal) && fieldGroups[grpVal].fields) {
                    const grpFields = fieldGroups[grpVal].fields;
                    for (const fieldVal in grpFields) {
                        if (fieldVal && grpFields.hasOwnProperty(fieldVal) && grpFields[fieldVal].name && grpFields[fieldVal].isMandatory && (!formData.hasOwnProperty(grpFields[fieldVal].name) || formData[grpFields[fieldVal].name] === undefined || formData[grpFields[fieldVal].name] === null || formData[grpFields[fieldVal].name].length === 0)) {
                            finalErrorJson[grpFields[fieldVal].name] = stringConstants.fieldValNotExistsError(grpFields[fieldVal].placeholder);
                        }
                    }
                }
            }
        }
        if (Object.keys(finalErrorJson).length > 0) {
            this.setState({
                errorJson: finalErrorJson,
            })
        } else {
            onClick && onClick({ formData });
        }
    }

    render() {
        const {
            clickActions, fieldsContainerStyle, clickActionsStyle,
            containerStyle, inputBoxBgColor, footer, header, fieldGroups
        } = this.props;
        const { errorJson, formData } = this.state;


        return <Form
            clickActionsStyle={clickActionsStyle}
            fieldsContainerStyle={fieldsContainerStyle}
            containerStyle={containerStyle}
            inputBoxBgColor={inputBoxBgColor}
            header={header ? _ => header({
                onClick: this.onClick,
                onImageSelect: this.onImageSelect,
                formData
            }) : undefined}
            footer={footer ? _ => footer({ formData }) : undefined}
            formData={formData}
            clickActions={clickActions && clickActions.map(actionDef => ({
                ...actionDef,
                title: actionDef.title,
                onClick: _ => this.onClick(actionDef.onClick)
            }))}
            errorJson={errorJson}
            fieldGroups={fieldGroups.map(groupDef => ({
                title: groupDef.title,
                fields: groupDef.fields.map(fieldDef => ({
                    ...fieldDef,
                    value: fieldDef.value ? fieldDef.value : (fieldDef.hasOwnProperty('name') && formData[fieldDef.name]),
                    onFieldClick: (!fieldDef.type || (fieldDef.hasOwnProperty("type") &&
                        (fieldDef.type === fieldTypes.object || fieldDef.type === fieldTypes.date || fieldDef.type === fieldTypes.location ||
                            fieldDef.type === fieldTypes.number || fieldDef.type === fieldTypes.string ||
                            fieldDef.type === fieldTypes.fk || fieldDef.type === fieldTypes.boolean))) ?
                        this.onFieldValChange :
                        ((fieldDef.hasOwnProperty("type") && fieldDef.type === fieldTypes.image) ?
                            this.onImageSelect : undefined),
                }))

            }))}
        />


    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
}), { getPresignedUrl })(FormContainer)
