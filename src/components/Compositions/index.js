import React from 'react';

import AppHeader from "../../containers/AppHeader";

import styles from './index.module.scss';

export default class CompositionComp extends React.Component {
    render() {
        const { compositions, onCompositionClick } = this.props;
        return <div>
            <AppHeader showCompositionsButton={ false } showShopNow={ false }/>
            <div className={ styles['container'] }>
                { compositions.map(comp => <div className={ styles['composition'] }
                                                onClick={ _ => onCompositionClick({ id: comp._id }) }>
                    <img className={ styles['image'] } src={ comp.img }/>
                    <div>{ comp.title }</div>
                </div>) }
            </div>
        </div>
    }
}
