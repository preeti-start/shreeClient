import React from 'react';
import Geosuggest from 'react-geosuggest';

import './index.css';

export default class LocationComp extends React.Component {
    render() {
        const { label, value, errorText, className, onValueChange } = this.props;
        return <div
            className={`${'input-container'} ${errorText ? 'input-error-case-container' : ''} ${className || ''}`}>
            <div className="input-subcontainer">
                <Geosuggest
                    style={{
                        'input': {
                            marginTop: '12px',
                            border: "none"
                        },
                        'suggests': {},
                        'suggestItem': {
                            cursor: "pointer",
                            paddingBottom: "5px",
                            paddingTop: "5px",
                        }
                    }}
                    initialValue={value && value.name}
                    onSuggestSelect={_ => {
                        const finalLocObject = _ && {
                            name: _.label,
                            address: _.description,
                            coordinates: [_.location.lng, _.location.lat]
                        };
                        onValueChange(finalLocObject)
                    }}/>
                <label style={{ position: 'absolute', top: 0, pointerEvents: 'none' }}
                       className={`add_transition input-label-section ${errorText ? 'input-label-error-case' : ''} label-focused`}>
                    {errorText ? errorText : label}
                </label>
            </div>
        </div>;

    }
}