import React from 'react';

import RadioButton from "../RadioButton";
import appStringConstants from "../../../constants/appStringConstants";
import { sortingOption } from "../../../constants";

import styles from './index.module.scss';

const initialState = {
    isBodyActive: false,
    activeId: undefined,
    activeTitle: undefined,
};

export default class SortBy extends React.Component {

    static defaultProps = {
        options: [],
    };

    constructor(props) {
        super(props);
        this.selectRef = null;
        this.onOptionClick = this.onOptionClick.bind(this);
        this.onClearSortClick = this.onClearSortClick.bind(this);
        this.onBodyClick = this.onBodyClick.bind(this);
        this.toggleBody = this.toggleBody.bind(this);
        this.state = initialState
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onBodyClick)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onBodyClick)
    }

    onBodyClick(event) {
        const { isBodyActive } = this.state;
        if (isBodyActive && this.selectRef && !this.selectRef.contains(event.target)) {
            this.setState({ isBodyActive: false });
        }
    }

    onClearSortClick() {
        const { onClick } = this.props;
        onClick && onClick({ sort: undefined });
        this.toggleBody();
        this.setState({ activeId: initialState.activeId, activeTitle: initialState.activeTitle });
    }

    toggleBody() {
        this.setState(prevState => ({ isBodyActive: !prevState.isBodyActive }))
    }

    onOptionClick({ value, title }) {
        const { onClick } = this.props;
        this.toggleBody();
        this.setState({ activeId: value, activeTitle: title });
        onClick && onClick({ sort: { [value]: sortingOption } });
    }

    render() {

        const { isBodyActive, activeId, activeTitle } = this.state;
        const { options } = this.props;

        return <div ref={node => this.selectRef = node} className={styles['container']}>
            <div onClick={this.toggleBody} className={styles['icon-container']}>
                <div
                    className={styles['title']}>
                    {activeTitle ? activeTitle : appStringConstants.sortByButtonLabel}
                </div>
                <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 512 512">
                    <use xlinkHref="#sort"/>
                </svg>
            </div>
            {isBodyActive && <div className={styles['popup-body']}>
                {options.map(option => <div className={styles['popup-data']}>
                    <RadioButton
                        className={styles['radio-button']}
                        isActive={activeId === option.id}
                        onClick={this.onOptionClick}
                        value={option.id}
                        title={option.label}
                    />
                </div>)}
                <div className={styles['clear-container']} onClick={this.onClearSortClick}>
                    {appStringConstants.clearButtonTitle}
                </div>
            </div>}
        </div>
    }
}