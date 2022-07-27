import React from 'react';
import { connect } from 'react-redux';

import { contactUs } from "../../redux-store/actions/userActions";
import appStringConstants from "../../constants/appStringConstants";
import ContactUsComp from "../../components/ContactUs";
import { fieldTypes } from "../../constants";


class ContactUs extends React.Component {
    constructor(props) {
        super(props);
        this.onContactUsClick = this.onContactUsClick.bind(this);
    }

    onContactUsClick({ formData }) {
        const { contactUs, userDetails } = this.props;
        const { name, msg, emailId } = formData;
        contactUs && contactUs({ userId: userDetails && userDetails._id, name, msg, emailId })
    }


    render() {
        return <ContactUsComp
            clickActions={[
                { title: appStringConstants.contactUsPageButtonClick, onClick: this.onContactUsClick }
            ]}
            fieldGroups={
                [
                    {
                        title: appStringConstants.contactUsFormTitle,
                        fields: [
                            {
                                isMandatory: true,
                                field: "name",
                                placeholder: appStringConstants.nameFieldTitle,
                                label: appStringConstants.nameFieldTitle,
                            },
                            {
                                isMandatory: true,
                                field: "emailId",
                                label: appStringConstants.contactUsPageEmailIdInputPlaceholder,
                                placeholder: appStringConstants.contactUsPageEmailIdInputPlaceholder,
                            },
                            {
                                type: fieldTypes.textarea,
                                isMandatory: true,
                                field: "msg",
                                placeholder: appStringConstants.contactUsPageMsgInputPlaceholder,
                                label: appStringConstants.contactUsPageMsgInputPlaceholder,
                            },
                        ]
                    },

                ]}
        />

    }
}

export default connect(state => ( {
    userDetails: state.users.userDetails,
} ), { contactUs })(ContactUs);