import React from 'react';
import { connect } from 'react-redux';

import ContactUsView from '../mobileComponents/ContactUs/index'
import { contactUs } from '../redux-store/actions/userActions'
import stringConstants from "../constants/mobileStringConstants";

class ContactUs extends React.Component {

    constructor(props) {
        super(props);
        this.onSavePress = this.onSavePress.bind(this);
        this.getFieldsList = this.getFieldsList.bind(this);
    }

    getFieldsList() {

        return [
            {
                fields: [
                    {
                        isMandatory: true,
                        placeholder: stringConstants.nameFieldTitle,
                        name: 'name',
                    },
                    {
                        isMandatory: true,
                        placeholder: stringConstants.contactUsEmailIdFieldTitle,
                        name: 'emailId',
                    },
                    {
                        isMandatory: true,
                        multiline: true,
                        placeholder: stringConstants.contactUsMessageFieldTitle,
                        name: 'msg',
                    },
                ]
            }
        ]
    }

    onSavePress({ formData }) {
        const { msg, emailId, name } = formData;
        const { contactUs, userDetails } = this.props;
        userDetails && userDetails._id && contactUs && contactUs({
            userId: userDetails && userDetails._id,
            name,
            msg,
            emailId
        })

    }

    render() {
        const { isAppLoading, navigation } = this.props;
        return <ContactUsView
            clickActions={[
                { title: stringConstants.contactUsPageTitle, onClick: this.onSavePress },
            ]}
            fieldGroups={this.getFieldsList()}
            navigation={navigation}
            isAppLoading={isAppLoading}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    isAppLoading: state.users.isAppLoading,
    userDetails: state.users.userDetails,
}), { contactUs })(ContactUs)