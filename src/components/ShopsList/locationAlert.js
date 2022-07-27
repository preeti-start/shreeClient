import React from 'react';

import appStringConstants from '../../constants/appStringConstants';

export default class LocationAlert extends React.Component {
    render() {
        return <div>
            {appStringConstants.buyerLocationMissingPopupText}
        </div>
    }
}