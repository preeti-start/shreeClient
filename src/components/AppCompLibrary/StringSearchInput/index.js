import React from 'react';

import Input from "../Input";

import styles from './index.module.scss';

export default class StringSearchInput extends React.Component {

    render() {

        const { onClick, onChange, value, placeholder } = this.props;

        return <div className={styles['body']}>
            <Input
                className={styles['input-container']}
                onChange={onChange}
                inputValue={value}
                label={placeholder}
            />
            <svg className={styles['icon']} onClick={onClick}
                 viewBox={"0 0 57 57"}>
                <use xlinkHref={"#find_icon"}/>
            </svg>
        </div>
    }
}