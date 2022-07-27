import React from 'react';

import { validAppRoutes } from '../../constants';
import HomeHeaderComp from '../../components/HomeHeader';
import history from "../../utils/history";

export default class HomeHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { title, subTitle } = this.props;
        return <HomeHeaderComp
            title={title}
            subTitle={subTitle}
        />
    }
}
