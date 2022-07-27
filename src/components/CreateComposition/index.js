import React from 'react';
import get from "lodash/get";

import appStringConstants from "../../constants/appStringConstants";

import styles from './index.module.scss'
import Button from "../AppCompLibrary/Button";

export default class CreateComposition extends React.Component {

    render() {

        const {
            sections, onAddToCartPress, finalCompSections, onDataClick,
            composition, activeSection, activeSectionData, onSectionClick
        } = this.props;
        const sectionDetails = get(finalCompSections, `${activeSection}`, {});

        return <div className={styles['container']}>
            <div className={styles['header']}>
                <div className={styles['title']}>
                    {composition && appStringConstants.createCompositionTitle(composition.title)}
                </div>
                <Button
                    title={appStringConstants.addItemToCartButtonTitle}
                    onClick={onAddToCartPress}
                />
            </div>
            <div className={styles['body']}>
                <div className={styles['title-section']}>
                    {Object.keys(sections).map(sectionId => <div
                        className={`${styles['title-container']} ${sectionId === activeSection ? `${styles['selected']}` : ''}`}
                        onClick={_ => onSectionClick({ sectionId })}>
                        {sections[sectionId].title}
                    </div>)}
                </div>
                <div className={`${styles['data-section']}`}>
                    {activeSectionData.map(data => {
                        const isActive = get(finalCompSections, `${activeSection}.id`) === data.id;
                        return <div className={`${styles['data-container']} ${isActive ? styles['selected'] : ''}`}
                                    onClick={_ => onDataClick({ sectionId: activeSection, data })}>
                            <img className={styles['data-img']} src={data.img}/>
                            <div>{data.title}</div>
                        </div>
                    })}
                </div>
                {Object.keys(sectionDetails).length > 0 && <div className={styles['details-section']}>
                    <div>{sectionDetails.title}</div>
                    <div>{`${appStringConstants.currencySymbol} ${sectionDetails.price}`}</div>
                </div>}
                <div className={styles['edit-section-container']}>
                    <div className={styles['edit-section']}>
                        {Object.keys(finalCompSections).map(sectionId => {
                            const data = finalCompSections[sectionId];
                            return <img
                                src={data.img}
                                className={styles['data']}
                                style={{
                                    zIndex: `${get(data, 'position.index')}`,
                                    top: `${get(data, 'position.top')}px`,
                                    left: `${get(data, 'position.left')}px`
                                }}/>
                        })}
                    </div>
                </div>
            </div>
        </div>
    }
}
