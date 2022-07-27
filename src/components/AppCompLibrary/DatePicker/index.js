import React from 'react';
import ReactDayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from 'moment';

import styles from './index.module.scss'

export default class DatePicker extends React.Component {

    render() {

        const {
            handleDayClick, isEndSelectorActive, isStartSelectorActive,
            label, toggleStartSelector, setRef, startDate, endDate, isStartDateSelected
        } = this.props;
        const isSelectorActive = (isStartSelectorActive || isEndSelectorActive);
        let disabledDays = {};
        if (isStartDateSelected) {
            disabledDays = { before: startDate }
        }

        return <div ref={node => setRef(node)} className={styles['container']}>
            <div className={styles['date-holder']} onClick={toggleStartSelector}>
                <div className={styles['label']}>{label}</div>
                <div
                    className={styles['data']}>
                    {`${moment(startDate).format('DD MMM')} - ${moment(endDate).format('DD MMM')}`}
                </div>
            </div>
            {isSelectorActive && <div className={styles['picker-container']}>
                <ReactDayPicker
                    disabledDays={disabledDays}
                    onDayClick={handleDayClick}
                    selectedDays={{
                        from: startDate,
                        to: endDate,
                    }}
                />
            </div>}
        </div>
    }
}