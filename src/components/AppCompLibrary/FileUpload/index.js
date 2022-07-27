import React from 'react';
import './index.css';

import { fieldTypes } from '../../../constants';
import appStringConstants from '../../../constants/appStringConstants';
import { showSelectImageLink } from '../../../utils/functions';

export default class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.renderImgInput = this.renderImgInput.bind(this);
        this.onFilePlaceholderClick = this.onFilePlaceholderClick.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.fileInputRef = React.createRef();
    }

    static defaultProps = {
        errorText: undefined,
        value: undefined,
        multiple: false,
        fieldType: undefined,
        maxLimit: undefined,
        fileType: 'image/jpg, image/jpeg, image/png'
    };

    onFileChange() {
        const { onChange } = this.props;
        const files = this.fileInputRef.current.files;
        if (files) {
            [].forEach.call(files, onChange);
        }
    }

    onFilePlaceholderClick() {
        this.fileInputRef.current.click();
    }


    renderImgInput() {

        const { multiple, fieldType, placeholder, fileType } = this.props;

        return <div>
            {fieldType === fieldTypes.image &&
            <div onClick={this.onFilePlaceholderClick} className="img-upload-placeholder">
                <svg viewBox="0 0 512 512" className="file-upload-img-icon">
                    <use xlinkHref="#profile_img"/>
                </svg>
                <span>{placeholder ? placeholder : appStringConstants.imageFieldPlaceholder}</span>
            </div>}
            {fieldType === fieldTypes.file &&
            <div onClick={this.onFilePlaceholderClick} className="file-upload-placeholder">
                <svg viewBox="0 0 17 22" className="file-upload-file-icon">
                    <use xlinkHref="#file_upload_icon"/>
                </svg>
            </div>}
            <input
                ref={this.fileInputRef}
                style={{ display: "none" }}
                multiple={multiple}
                accept={fileType}
                onChange={this.onFileChange}
                type={'file'}
            />
        </div>
    }

    renderImages(value) {
        const { onDelFileClick } = this.props;
        return value.map((file, fileIndex) => file.url &&
            <div className="file-upload-img-container">
                <div onClick={_ => onDelFileClick(file)} className="file-upload-img-del">
                    <svg className="file-upload-close_icon" viewBox="0 0 24 24">
                        <use xlinkHref="#close_icon"/>
                    </svg>
                </div>
                <img
                    src={file.url}
                    key={fileIndex}
                    className="file-upload-img"
                />
            </div>)
    }

    renderFile(value) {
        return value.map((file, fileIndex) => {
            return <div>
                <svg className="file-icon" viewBox="0 0 20 27">
                    <use xlinkHref="#file"/>
                </svg>
                <div className="file-upload-filename">{file && file.title}</div>
            </div>
        })
    }

    render() {

        const { multiple, errorText, maxLimit, fieldType } = this.props;
        let { value } = this.props;

        ( !multiple && value ) && ( value = [value] );

        return <div className="file-upload-body">

            <div className="file-upload-container">
                {fieldType === fieldTypes.image && value && this.renderImages(value)}
                {fieldType && fieldType === fieldTypes.file && value && this.renderFile(value)}
                {showSelectImageLink({ multiple, value, maxLimit }) &&
                this.renderImgInput()}
            </div>
            {maxLimit && multiple &&
            <span
                className="file-upload-items-left-info">{appStringConstants.fileMaxLimitIndicationLine(maxLimit - ( value ? value.length : 0 ))}</span>}
            {errorText && <div className="file-upload-error-text">{errorText}</div>}

        </div>
    }
}