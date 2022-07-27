import React from 'react';
import { connect } from 'react-redux';

import { updateBuyerDetails } from "../redux-store/actions/userActions";
import { AppDashboard, BuyerProfileComp } from "../mobileComponents/index";
import Header from "./Header";
import { AWSImageBuckets, fieldTypes } from "../constants/index";
import stringConstants from "../constants/mobileStringConstants";
import { View } from "react-native";
import { selectPhotoTapped } from "../utils/mobileFunctions";
import { fontSizes } from "../mobileTheme";

class BuyerProfile extends React.Component {
    constructor(props) {
        super(props);
        // this.onProfileImgClick = this.onProfileImgClick.bind(this);
        // this.onImageSelect = this.onImageSelect.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
    }

    onSaveClick({ formData }) {
        const { profile_img, name, location } = formData;
        const { updateBuyerDetails, buyerDetails, userToken } = this.props;
        userToken && buyerDetails && buyerDetails._id && updateBuyerDetails && updateBuyerDetails({
            userToken,
            buyerId: buyerDetails._id,
            location,
            name,
            profile_img,
        })
    }

    // onImageSelect({ onImageSelect, val }) {
    //     onImageSelect && onImageSelect({
    //         val, fieldDef: {
    //             type: fieldTypes.image,
    //             name: 'profile_img',
    //             awsBucketName: AWSImageBuckets.buyer_profile,
    //         }
    //     })
    // }

    // onProfileImgClick({ onImageSelect }) {
    //     selectPhotoTapped().then(val => {
    //         this.onImageSelect({ val, onImageSelect })
    //     })
    // }

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
                        type: fieldTypes.location,
                        placeholder: stringConstants.addressFieldTitle,
                        name: 'location',
                        multiple: true,
                    },

                ],
            },

        ]
    }

    render() {
        const { navigation, isAppLoading, buyerDetails } = this.props;

        return <AppDashboard
            headerView={props => <Header
                animationProps={{ ...props }}
                subTitle={stringConstants.appTagLine}
                navigation={navigation}
                title={stringConstants.profileMenuTitle}
                showMenuButton={true}
            />}
            detailView={_ => <View style={{ flex: 1 }}>
                {buyerDetails && <BuyerProfileComp
                    headerProfileField={{
                        type: fieldTypes.image,
                        name: 'profile_img',
                        awsBucketName: AWSImageBuckets.buyer_profile,
                    }}
                    // onProfileImgClick={this.onProfileImgClick}
                    buyerDetails={buyerDetails}
                    onSaveClick={this.onSaveClick}
                    formData={{
                        ...buyerDetails,
                    }}
                    fieldGroups={this.getFieldsList()}
                />}
            </View>}
            isDashboardLoading={isAppLoading}
        />

    }
}

export default connect((state = {}, ownProps = {}) => ({
    isAppLoading: state.users.isAppLoading,
    userToken: state.users.userToken,
    buyerDetails: state.users.buyerDetails,
}), { updateBuyerDetails })(BuyerProfile)


