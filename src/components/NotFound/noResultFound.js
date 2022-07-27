import React from 'react';

import appStringConstants from "../../constants/appStringConstants";
import './index.css';

export default class NoResultFound extends React.Component {
    static defaultProps = {
        imgUrl: '/no-results2.png',
        label: appStringConstants.noResultFoundLabel,
        renderLabel: undefined
    };

    render() {
        const { imgUrl, label, renderLabel } = this.props;
        return <div className="no-result-found-container">
            <img className="no-result-found-image" src={imgUrl}/>
            {!renderLabel && <div>{label}</div>}
            {renderLabel && renderLabel()}
        </div>
    }
}