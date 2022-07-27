import React from 'react';
import { connect } from 'react-redux';

import { AboutUsComp } from '../mobileComponents/index';
import { getAboutUsData } from '../redux-store/actions/userActions';


class AboutUs extends React.Component {

    componentDidMount() {
        const { getAboutUsData } = this.props;
        getAboutUsData && getAboutUsData();
    }

    render() {
        const { isAppLoading, aboutUs, navigation } = this.props;
        return <AboutUsComp
            aboutUs={aboutUs}
            navigation={navigation}
            isAppLoading={isAppLoading}
        />
    }
}


export default connect((state = {}, ownProps = {}) => ({
    isAppLoading: state.users.isAppLoading,
    aboutUs: state.users.aboutUs,
}), { getAboutUsData })(AboutUs)