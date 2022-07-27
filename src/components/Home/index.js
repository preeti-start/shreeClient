import React from 'react';
import get from 'lodash/get';

import { loadAnimations } from '../../utils/functions'
import { onShopNowClick } from '../../utils/webFunctions'
import appStringConstants from '../../constants/appStringConstants'

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.renderNearbyShop = this.renderNearbyShop.bind(this);
    }

    componentDidMount() {
        loadAnimations();
    }

    renderFooter() {
        return <footer className="site-footer">
            <div className="container">
                <div className="row">


                    <div className="col-lg-4 mb-5 mb-lg-0">
                        <div className="mb-5">
                            <h3 className="footer-heading mb-4">Watch Live Streaming</h3>

                            <div className="block-16">
                                <figure>
                                    <img src="images/img_1.jpg" alt="Image placeholder"
                                         className="img-fluid rounded"/>
                                    <a href="https://vimeo.com/channels/staffpicks/93951774"
                                       className="play-button popup-vimeo"><span
                                        className="icon-play"/></a>
                                </figure>
                            </div>

                        </div>

                    </div>

                    <div className="col-lg-4">
                        <div className="mb-5">
                            <h3 className="footer-heading mb-4">About {appStringConstants.appTitle}</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe pariatur
                                reprehenderit vero atque, consequatur id ratione, et non dignissimos culpa? Ut
                                veritatis, quos illum totam quis blanditiis, minima minus odio!</p>
                        </div>

                    </div>

                </div>

            </div>
        </footer>
    }

    renderTopRatedShops() {
        const { topRatedShops, onShopClick } = this.props;
        if (topRatedShops.length > 0) {
            return <div className="site-section bg-light">
                <div className="container">
                    <div className="row">
                        <div className="site-section-heading text-center mb-5 w-border col-md-6 mx-auto"
                             data-aos="fade-up">
                            <h2 className="mb-5">{appStringConstants.topRatedBlockTitle}</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, fugit nam obcaecati
                                fuga itaque deserunt officia, error reiciendis ab quod?</p>
                        </div>
                    </div>
                    <div className="row">
                        {topRatedShops.map(shop => <div onClick={_ => onShopClick(_, shop._id)}
                                                        className="col-md-6 col-lg-4 mb-4 mb-lg-0" data-aos="fade-up"
                                                        data-aos-delay="100">
                            <a href=""><img src={get(shop, 'shop_img.url')} alt="Image" className="img-fluid"/></a>
                            <div className="p-4 bg-white">
                            <span
                                className="d-block text-secondary small text-uppercase">{get(shop, 'shop_category_id.name')}</span>
                                <h2 className="h5 text-black mb-3"><a href="">{get(shop, 'name')}</a></h2>

                            </div>
                        </div>)}

                    </div>
                </div>
            </div>
        }
        return null;
    }

    renderNearbyShop({ data, className }) {
        const { onShopClick } = this.props;
        if (data) {
            return <a onClick={_ => onShopClick(_, data._id)} href="" className={`${className} unit-9 no-height`}
                      data-aos="fade-up"
                      data-aos-delay="100">
                <div className="image" style={{ backgroundImage: `url('${get(data, 'shop_img.url')}')` }}/>
                <div className="unit-9-content">
                    <h2>{get(data, 'shop_name')}</h2>
                    <span>{get(data, 'name')}</span>
                </div>
            </a>
        }
        return null;
    }

    renderNearbyShopsContainer() {

        const { nearbyShops } = this.props;

        if (nearbyShops.length > 0) {
            return <div className="site-section">

                <div className="container">

                    <div className="row">
                        <div className="site-section-heading text-center mb-5 w-border col-md-6 mx-auto"
                             data-aos="fade-up">
                            <h2 className="mb-5">{appStringConstants.nearbyShopsBlockTitle}</h2>
                            <p>Here we will be having some desciption related to the above title section. Here we will
                                be having some desciption related to the above title section.</p>
                        </div>
                    </div>

                    <div className="site-block-retro d-block d-md-flex">

                        {this.renderNearbyShop({ data: get(nearbyShops, '0'), isLarge: true, className: 'col1' })}

                        <div className="col2 ml-auto">

                            {this.renderNearbyShop({
                                data: get(nearbyShops, '1'),
                                isLarge: true,
                                className: 'col2-row1'
                            })}
                            {this.renderNearbyShop({
                                data: get(nearbyShops, '2'),
                                isLarge: true,
                                className: 'col2-row2'
                            })}

                        </div>

                    </div>
                    <div className="col-md-12 text-center mt-5" data-aos="fade-up">
                        <a href="" onClick={onShopNowClick}
                           className="btn btn-primary">{appStringConstants.viewAllShopsButton}</a>
                    </div>
                </div>
            </div>
        }
        return null;
    }

    renderNewShops() {
        const { newShops, onShopClick } = this.props;
        if (newShops.length > 0) {
            return <div className="site-section">
                <div className="container">
                    <div className="row">
                        <div className="site-section-heading text-center mb-5 w-border col-md-6 mx-auto">
                            <h2 className="mb-5">{appStringConstants.newShopsBlockTitle}</h2>
                            <p>Here we will be having some desciption related to the above title section. Here we will
                                be
                                having some desciption related to the above title section.</p>
                        </div>
                    </div>
                    <div className="row">
                        {newShops && newShops.map(shop => <div className="col-md-6 col-lg-3" data-aos="fade-up"
                                                               data-aos-delay="100">
                                <a onClick={_ => onShopClick(_, shop._id)} href="#" className="unit-9">
                                    <div className="image"
                                         style={{ backgroundImage: `url("${get(shop, 'shop_img.url')}")` }}/>
                                    <div className="unit-9-content">
                                        <h2>{get(shop, 'shop_name')}</h2>
                                        <span>{get(shop, 'name')}</span>
                                    </div>
                                </a>
                            </div>
                        )}

                        <div className="col-md-12 text-center mt-5" data-aos="fade-up">
                            <a href="" onClick={onShopNowClick}
                               className="btn btn-primary">{appStringConstants.viewAllShopsButton}</a>
                        </div>
                    </div>
                </div>
            </div>
        }
        return null;
    }

    renderCategories() {
        const { categories, onCategoryClick } = this.props;
        if (categories.length > 0) {

            return <div className="site-section block-13">
                <div className="container" data-aos="fade-up">
                    <div className="row">
                        <div className="site-section-heading text-center mb-5 w-border col-md-6 mx-auto">
                            <h2 className="mb-5">{appStringConstants.categoriesBlockTitle}</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, fugit nam obcaecati
                                fuga itaque deserunt officia, error reiciendis ab quod?</p>
                        </div>
                    </div>
                    <div className="nonloop-block-13 owl-carousel">

                        {categories.map(category => <div onClick={_ => onCategoryClick(category._id)}
                                                         className="text-center p-3 p-md-5 bg-white">
                            <div className="mb-4">
                                <img src={get(category, 'img.url')} alt="Image"
                                     className="w-75 mx-auto img-fluid rounded-circle"/>
                            </div>
                            <div className="text-black">
                                <h3 className="font-weight-light h5">{get(category, 'name')}</h3>
                                <p className="font-italic">{get(category, 'description')}</p>
                            </div>
                        </div>)}


                    </div>
                    <div className="col-md-12 text-center mt-5" data-aos="fade-up">
                        <a href="" onClick={onShopNowClick}
                           className="btn btn-primary">{appStringConstants.viewAllCategoriesButton}</a>
                    </div>
                </div>
            </div>
        }
        return null;
    }


    render() {

        return <div>

            {this.renderCategories()}

            {this.renderNearbyShopsContainer()}

            {this.renderNewShops()}

            {this.renderTopRatedShops()}

            <div className="bg-primary" data-aos="fade">
                <div className="container">
                    <div className="row">
                        <div className="col-2 text-center py-4 social-icon1 d-block"/>
                    </div>
                </div>
            </div>

            {this.renderFooter()}

        </div>
    }
}
