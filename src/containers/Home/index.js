import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import HomeComp from '../../components/Home'
import HomeHeader from "../HomeHeader";
import { getWebHomeData } from '../../redux-store/actions/userActions'
import appStringConstants from "../../constants/appStringConstants";
import { loadAnimations } from "../../utils/functions";
import { onShopCompositionsClick } from "../../utils/webFunctions";
import history from "../../utils/history";
import { validAppRoutes } from "../../constants";

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.onShopClick = this.onShopClick.bind(this);
        this.getData = this.getData.bind(this);
        this.onCategoryClick = this.onCategoryClick.bind(this);
    }

    getData(prop) {
        const { getWebHomeData } = this.props;
        getWebHomeData({ coordinates: get(prop, 'coordinates') });
    }

    componentDidMount() {

        loadAnimations();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                this.getData({ coordinates: [lng, lat] })
            }, error => {
                this.getData()
            });
        } else {
            this.getData()
            // Geolocation is not supported by this browser
        }
    }

    onCategoryClick(categoryId) {
        history.push(validAppRoutes.shopsList, { categoryId })
    }

    onShopClick(event, shopId) {
        event.preventDefault();
        shopId && history.push(validAppRoutes.shopItems.replace(':shopId', shopId));
    }

    renderGoals() {
        return <div className="container">
            <div className="featured-property-half d-flex">
                <div className="image" style={{ backgroundImage: 'url("images/hero_bg_1.jpg")' }}/>
                <div className="text">
                    <h2>{appStringConstants.goalsSectionTitle}</h2>
                    <p className="mb-5">Here will be the description of the app. Here will be the
                        description of the app.
                        Here will be the description of the app. Here will be the description of the
                        app.</p>
                    <ul className="property-list-details mb-5">
                        <li className="text-black">1. bullet point one{/* :<strong className="text-black">Marga Luxury
                                Suite</strong>*/}</li>
                        <li>2. bullet point two{/*: <strong>2</strong>*/}</li>
                        <li>3. bullet point three{/*: <strong>482 Square Feets</strong>*/}</li>
                        <li>4. bullet point four{/*: <strong>Modern House</strong>*/}</li>
                        <li>5. bullet point five{/*: Jan 20, 2019<strong/>*/}</li>
                    </ul>
                    <p><a href="" onClick={onShopCompositionsClick} className="btn btn-primary px-4 py-3">
                        {appStringConstants.viewCompositionsButtonTitle}
                    </a></p>
                </div>
            </div>
        </div>
    }

    render() {
        const { webHomeData } = this.props;
        return <div>
            <HomeHeader
                title={appStringConstants.homeTitle}
                subTitle={appStringConstants.homeSubTitle}
            />
            {this.renderGoals()}
            {webHomeData && <HomeComp
                onShopClick={this.onShopClick}
                onCategoryClick={this.onCategoryClick}
                categories={get(webHomeData, 'categories', [])}
                newShops={get(webHomeData, 'new_shops', [])}
                nearbyShops={get(webHomeData, 'nearby_shops', [])}
                topRatedShops={get(webHomeData, 'top_rated_vendors', [])}
            />}
        </div>
    }
}

export default connect((state = {}, ownProps = {}) => ({
    webHomeData: state.users.webHomeData,
}), { getWebHomeData })(Home)