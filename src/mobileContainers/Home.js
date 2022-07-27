import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { HomeComp } from '../mobileComponents';
import { getHomeData } from '../redux-store/actions/userActions';
import { appRoutes } from "../constants";


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.getHomeDetails = this.getHomeDetails.bind(this);
        this.onShopClick = this.onShopClick.bind(this);
        this.onCategoryClick = this.onCategoryClick.bind(this);
    }

    componentDidMount() {
        let coordinates = [];

        // commented while doing new setup

        // navigator.geolocation.getCurrentPosition((result) => {
        //     alert(JSON.stringify(result))
        //     if (get(result, 'coords.longitude')) {
        //         coordinates = [result.coords.longitude, result.coords.latitude]
        //     }
        //     this.getHomeDetails({ coordinates })
        // }, (err) => {
        //     this.getHomeDetails({ coordinates })
        // });

    }

    getHomeDetails({ coordinates }) {
        const { getHomeData } = this.props;
        getHomeData({
            isMobile: true,
            coordinates
        });
    };

    onCategoryClick({ data }) {
        const { navigation, userToken, buyerDetails } = this.props;
        if (data && data._id) {
            if (userToken && buyerDetails) {
                navigation && navigation.navigate(appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ShopsListView.route, { shop_category_id: data._id })
            } else {
                navigation && navigation.navigate(appRoutes.AppRoutes.childRoutes.Home.childRoutes.ShopsListView.route, { shop_category_id: data._id })
            }
        }
    }

    onShopClick({ data }) {
        const { navigation, userToken, buyerDetails } = this.props;
        if (data && data._id) {
            if (userToken && buyerDetails) {
                navigation && navigation.navigate(appRoutes.BuyerRoutes.childRoutes.Home.childRoutes.ItemsListView.route, {
                    vendorId: data._id,
                    vendorDetails: data,
                })
            } else {
                navigation && navigation.navigate(appRoutes.AppRoutes.childRoutes.Home.childRoutes.ItemsListView.route, {
                    vendorId: data._id,
                    vendorDetails: data,
                })
            }
        }
    }

    render() {
        const { homeData, isAppLoading, navigation } = this.props;

        return <HomeComp
            isLoading={isAppLoading}
            onShopClick={this.onShopClick}
            onCategoryClick={this.onCategoryClick}
            navigation={navigation}
            data={homeData}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    homeData: state.users.homeData,
    buyerDetails: state.users.buyerDetails,
    isAppLoading: state.users.isAppLoading,
    userToken: state.users.userToken,
}), { getHomeData })(Home)