import React from 'react';
import { connect } from 'react-redux';

import CompositionsComp from '../../components/Compositions';
import { getCompositions } from '../../redux-store/actions/compositionActions';
import history from "../../utils/history";

import { validAppRoutes } from "../../constants";

class Compositions extends React.Component {

    constructor(props) {
        super(props);
        this.onCompositionClick = this.onCompositionClick.bind(this);
    }

    componentDidMount() {
        const { getCompositions } = this.props;
        getCompositions();
    }

    onCompositionClick({ id }) {
        history.push(validAppRoutes.createComposition.replace(':compId', id));
    }

    render() {

        const { compositions } = this.props;

        return <CompositionsComp
            compositions={compositions}
            onCompositionClick={this.onCompositionClick}
        />
    }
}

export default connect((state, ownProps) => ({
    compositions: state.compositions.compositions
}), { getCompositions })(Compositions)
