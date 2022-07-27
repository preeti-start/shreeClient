import React from 'react';
import get from 'lodash/get';

import appStringConstants from '../../constants/appStringConstants';
import RadioButton from '../../components/AppCompLibrary/RadioButton'

import './index.css';

export default class OrderAddress extends React.Component {

    render() {
        const { addressArray, activeAddressIndex, onAddressRowClick, toggleAddressPopUp } = this.props;
        return <div>
            {addressArray && addressArray.length > 0 && addressArray.map((addressVal, addressIndex) =>
                <div className="address-row">
                    <RadioButton
                        isActive={addressIndex === activeAddressIndex}
                        onClick={_ => onAddressRowClick(addressIndex)}
                        title={get(addressVal, 'address')}
                    />
                </div>
            )}
            <div className="add-new-address-button"
                 onClick={toggleAddressPopUp}>{appStringConstants.addNewAddressButtonTitle}</div>
        </div>
    }
}
