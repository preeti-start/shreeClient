import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { getCompositionDetails, addCompToUserCart } from '../../redux-store/actions/compositionActions';
import CreateCompositionComp from '../../components/CreateComposition';

import styles from './index.module.scss';

class CreateComposition extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSection: undefined,
            finalComposition: undefined,
        };

        this.onAddToCartPress = this.onAddToCartPress.bind(this);
        this.onDataClick = this.onDataClick.bind(this);
        this.onSectionClick = this.onSectionClick.bind(this);
    }

    componentDidMount() {
        const { getCompositionDetails, match } = this.props;
        const compId = get(match, 'params.compId');
        if (compId) {
            getCompositionDetails({
                _id: compId,
                onSuccess: ({ data }) => {
                    const sectionKeys = Object.keys(get(data, 'sections', {}));
                    if (sectionKeys.length > 0) {
                        this.setState({ activeSection: sectionKeys[0] })
                    }
                }
            });
        }
    }

    onSectionClick({ sectionId }) {
        this.setState({ activeSection: sectionId })
    }

    onDataClick({ sectionId, data }) {

        this.setState(prevState => {
            const { composition } = this.props;
            const { finalComposition } = prevState;
            let finalComp = {};
            if (!finalComposition) {
                finalComp = { title: composition.title, id: composition.id, sections: {} }
            } else {
                finalComp = { ...finalComposition }
            }
            if (sectionId && data) {
                finalComp.sections[sectionId] = data
            }
            return { finalComposition: finalComp }
        });

    }

    onAddToCartPress() {
        const { addCompToUserCart, userToken, buyerDetails } = this.props;
        const { finalComposition } = this.state;
        let total_comp_amount = 0;

        if (Object.keys(get(finalComposition, 'sections', {})).length > 0) {
            for (const sectionId in finalComposition.sections) {
                const price = get(finalComposition, `sections.${sectionId}.price`, 0);
                total_comp_amount += price
            }
        }
        addCompToUserCart({
            userToken,
            buyerId: get(buyerDetails, '_id'),
            total_comp_amount,
            composition: { ...finalComposition }
        })
    }

    render() {

        const { composition } = this.props;
        const { activeSection, finalComposition } = this.state;
        const activeSectionData = get(composition, `sections.${activeSection}.data`, []);
        const sections = get(composition, `sections`, {});
        const finalCompSections = get(finalComposition, `sections`, {});

        return <div className={styles['container']}>
            <CreateCompositionComp
                onAddToCartPress={this.onAddToCartPress}
                composition={composition}
                sections={sections}
                activeSection={activeSection}
                finalCompSections={finalCompSections}
                activeSectionData={activeSectionData}
                onDataClick={this.onDataClick}
                onSectionClick={this.onSectionClick}
            />
        </div>
    }
}


export default connect((state, ownProps) => ({
    composition: state.compositions.composition,
    buyerDetails: state.users.buyerDetails,
    userToken: state.users.userToken,
}), { addCompToUserCart, getCompositionDetails })(CreateComposition)
