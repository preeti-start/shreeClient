import React from 'react';
import { connect } from 'react-redux';

import { getAboutUsData } from '../../redux-store/actions/userActions';
import AboutUsComp from '../../components/AboutUs';

class AboutUs extends React.Component {


    componentDidMount() {
        const { getAboutUsData } = this.props;
        getAboutUsData && getAboutUsData();
    }

    render() {
        const { aboutUs } = this.props;
        return <AboutUsComp
            aboutUs={aboutUs}
        />
    }
}

export default connect(state => ({
    aboutUs: state.users.aboutUs,
}), { getAboutUsData })(AboutUs);