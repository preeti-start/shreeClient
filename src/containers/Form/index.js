import React from 'react';
import { connect } from 'react-redux';
import uuid from "react-native-uuid";

import Form from '../../components/AppCompLibrary/Form';
import { fieldTypes } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";
import { getPresignedUrl } from "../../redux-store/actions/userActions";


class FormContainer extends React.Component {

    static defaultProps = {
        formData: {}
    };

    constructor(props) {
        super(props);
        const { formData } = props;
        this.state = {
            errorJson: {},
            formData: { ...formData },
        };
        this.onFileSelect = this.onFileSelect.bind(this);
        this.onDelFileClick = this.onDelFileClick.bind(this);
        this.onInputValueChange = this.onInputValueChange.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick(onClick, event) {
        const { formData, errorJson } = this.state;
        const { fieldGroups } = this.props;
        const finalErrorJson = { ...errorJson };
        if (fieldGroups && fieldGroups.length > 0) {
            for (const grpVal in fieldGroups) {
                if (grpVal && fieldGroups.hasOwnProperty(grpVal) && fieldGroups[grpVal].fields) {
                    const grpFields = fieldGroups[grpVal].fields;
                    for (const fieldVal in grpFields) {
                        if (fieldVal && grpFields.hasOwnProperty(fieldVal) && grpFields[fieldVal].field && grpFields[fieldVal].isMandatory && (!formData.hasOwnProperty(grpFields[fieldVal].field) || formData[grpFields[fieldVal].field] === undefined || formData[grpFields[fieldVal].field] === null || formData[grpFields[fieldVal].field].length === 0)) {
                            finalErrorJson[grpFields[fieldVal].field] = appStringConstants.formFieldMandatoryError(grpFields[fieldVal].label);
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
            onClick && onClick({ formData, event });
        }
    }

    onDelFileClick({ field, file }) {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [field.field]: field.multiple ? prevState.formData[field.field].filter(fileVal => fileVal.name !== file.name) : undefined
            },
        }))
    }

    onFileSelect({ file, field, index }) {
        const { formData } = this.state;
        const { getSignedUrl = true } = field;
        const setDataToState = ({ e, name, presignedUrl }) => {
            this.setState(prevState => {
                const finalFieldVal = {
                    name,
                    title: file.name,
                    file,
                    contentType: file.type,
                    url: e && e.target && e.target.result,
                    presignedUrl,
                };
                return {
                    errorJson: {},
                    formData: {
                        ...prevState.formData,
                        [field.field]: field.multiple ? (prevState.formData[field.field] ? [...prevState.formData[field.field], finalFieldVal] : [finalFieldVal]) : finalFieldVal
                    },
                }
            });
        };
        const getSignedUrlFromServer = ({ e }) => {
            const { getPresignedUrl, userToken } = this.props;
            field && field.awsBucketName && userToken && getPresignedUrl && getPresignedUrl({
                userToken,
                contentType: file.type,
                name: `${field.awsBucketName}/${uuid.v4().toString()}`,
                onSuccess: ({ presignedUrl, name }) => {
                    setDataToState({ e, name, presignedUrl });
                }
            })
        };

        // here -- index -- holds the image number in case if multiple images are selected at the same time
        const maxLengthExceed = formData && field.field && field.hasOwnProperty('maxLimit') && field.maxLimit > 0 &&
            formData.hasOwnProperty(field.field) && Array.isArray(formData[field.field]) &&
            (formData[field.field].length + index + 1) > field.maxLimit;
        if (!maxLengthExceed) {
            if (file) {
                if (getSignedUrl) {
                    if (field && field.type) {
                        if (field.type === fieldTypes.image) {
                            const reader = new FileReader();
                            reader.onload = e => {
                                getSignedUrlFromServer({ e })
                            };
                            reader.readAsDataURL(file);
                        } else if (field.type === fieldTypes.file) {
                            getSignedUrlFromServer({})
                        }
                    }
                } else {
                    setDataToState({});
                }
            }
        }

    }

    onInputValueChange({ value, keyName }) {
        this.setState(prevState => ({
            formData: { ...prevState.formData, [keyName]: value },
            errorJson: {},
        }))
    }

    render() {
        const { fieldGroups, headerView, clickActions } = this.props;
        const { errorJson, formData } = this.state;
        return <div>
            <Form
                headerView={headerView && {
                    title: headerView.title,
                    rightActions: headerView.rightActions && headerView.rightActions.map(actionDef => ({
                        ...actionDef,
                        title: actionDef.title,
                        onClick: _ => this.onButtonClick(actionDef.onClick)
                    }))
                }}
                clickActions={clickActions && clickActions.map(actionDef => ({
                    ...actionDef,
                    title: actionDef.title,
                    onClick: _ => this.onButtonClick(actionDef.onClick),
                }))}
                errorJson={errorJson}
                fieldGroups={fieldGroups.map(groupDef => ({
                    title: groupDef.title,
                    fields: groupDef.fields.map(fieldDef => ({
                        ...fieldDef,
                        onKeyPress: event => this.onButtonClick(fieldDef.onKeyPress, event),
                        value: fieldDef && fieldDef.hasOwnProperty('field') && formData[fieldDef.field],
                        onValueChange: (!fieldDef.type || (fieldDef.hasOwnProperty("type") &&
                            (fieldDef.type === fieldTypes.location || fieldDef.type === fieldTypes.password || fieldDef.type === fieldTypes.textarea || fieldDef.type === fieldTypes.string || fieldDef.type === fieldTypes.number || fieldDef.type === fieldTypes.dropdown || fieldDef.type === fieldTypes.checkbox))) ?
                            (value) => {
                                this.onInputValueChange({
                                    value: (fieldDef.type === fieldTypes.dropdown ? value.value : value),
                                    keyName: fieldDef.field
                                });
                            } : undefined,
                        onFileSelect: (fieldDef.hasOwnProperty('type') && (fieldDef.type === fieldTypes.file || fieldDef.type === fieldTypes.image)) ? (file, index) => {
                            this.onFileSelect({
                                file,
                                index,
                                field: fieldDef
                            })
                        } : undefined,
                        onDelFileClick: (fieldDef.hasOwnProperty('type') && (fieldDef.type === fieldTypes.file || fieldDef.type === fieldTypes.image)) ? file => this.onDelFileClick({
                            field: fieldDef,
                            file,
                        }) : undefined,
                    }))

                }))}
            />
        </div>
    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
}), { getPresignedUrl })(FormContainer)
