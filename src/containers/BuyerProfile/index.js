import React from 'react';
import { connect } from 'react-redux';

import './index.css';
import FormContainer from '../Form';
import { updateBuyerDetails } from '../../redux-store/actions/userActions';
import { AWSImageBuckets, fieldTypes } from "../../constants";
import appStringConstants from "../../constants/appStringConstants";

class BuyerProfile extends React.Component {
    constructor(props) {
        super(props);
        this.onSaveClick = this.onSaveClick.bind(this);
    }

    onSaveClick({ formData }) {
        const { name, location, profile_img } = formData;
        const { userToken, buyerDetails, updateBuyerDetails } = this.props;
        buyerDetails && buyerDetails._id && updateBuyerDetails && updateBuyerDetails({
            userToken,
            buyerId: buyerDetails._id,
            name,
            location,
            profile_img,
        })
    }


    render() {
        const { buyerDetails } = this.props;
        return <div className="buyer-profile-body">
            <FormContainer
                headerView={{
                    title: appStringConstants.profileMenuTitle,
                    rightActions: [{
                        title: appStringConstants.saveButtonTitle, onClick: this.onSaveClick
                    }]
                }}
                formData={{ ...buyerDetails }}
                fieldGroups={
                    [
                        {
                            fields: [
                                {
                                    type: fieldTypes.image,
                                    field: "profile_img",
                                    awsBucketName: AWSImageBuckets.buyer_profile,
                                    placeholder: appStringConstants.fileFieldPlaceholder,
                                },
                                {
                                    isMandatory: true,
                                    field: "name",
                                    placeholder: appStringConstants.nameFieldPlaceholder,
                                    label: appStringConstants.nameFieldTitle,
                                },
                                {
                                    type: fieldTypes.location,
                                    field: "location",
                                    label: appStringConstants.locationFieldPlaceholder,
                                    placeholder: appStringConstants.locationFieldPlaceholder,
                                },
                            ]
                        },
                    ]}
            />
        </div>
    }
}

export default connect(state => ({
    userToken: state.users.userToken,
    buyerDetails: state.users.buyerDetails,
}), { updateBuyerDetails })(BuyerProfile);