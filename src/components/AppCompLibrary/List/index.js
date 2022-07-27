import React from 'react';

import './index.css';

export default class List extends React.Component {

    render() {

        const { data, fields } = this.props;

        return <div className="list-container">

            <div className="list-row">
                {fields && fields.length > 0 && fields.map((fieldVal, fieldIndex) => (
                    <div className="list-col list-col-title" key={fieldIndex}>{fieldVal.label}</div>))}
            </div>
            {data && data.length > 0 && data.map((dataVal, dataIndex) => <div className="list-row" key={dataIndex}>
                {fields && fields.length > 0 && fields.map((fieldVal, fieldIndex) => (
                    <div className="list-col" key={fieldIndex}>
                        {fieldVal.Cell && fieldVal.Cell(dataVal)}
                        {!fieldVal.Cell && fieldVal.field && dataVal.hasOwnProperty(fieldVal.field) && dataVal[fieldVal.field]}
                    </div>))}
            </div>)}


        </div>


    }
}
