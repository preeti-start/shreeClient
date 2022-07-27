import React from 'react';

import DatePickerComp from '../../components/AppCompLibrary/DatePicker';
import appStringConstants from "../../constants/appStringConstants";

export default class DatePicker extends React.Component {

    static defaultProps = {
        label: appStringConstants.ordersListDateFieldTitle
    };

    constructor(props) {
        super(props);
        this.selectRef = null;
        const startDate = props.startDate || new Date();
        const endDate = props.endDate || new Date();
        this.state = {
            endDate,
            isStartDateSelected: false,
            startDate,
            isEndSelectorActive: false,
            isStartSelectorActive: false
        };
        this.onBodyClick = this.onBodyClick.bind(this);
        this.setRef = this.setRef.bind(this);
        this.toggleStartSelector = this.toggleStartSelector.bind(this);
        this.handleEndDayClick = this.handleEndDayClick.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.toggleEndSelector = this.toggleEndSelector.bind(this);
        this.handleStartDayClick = this.handleStartDayClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onBodyClick)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onBodyClick)
    }

    onBodyClick(event) {
        const { isStartSelectorActive, isEndSelectorActive } = this.state;
        if ((isEndSelectorActive || isStartSelectorActive) &&
            this.selectRef && !this.selectRef.contains(event.target)) {
            this.setState({ isEndSelectorActive: false, isStartSelectorActive: false });
        }
    }

    toggleStartSelector() {
        this.setState(prevState => ({
            isStartSelectorActive: !prevState.isStartSelectorActive
        }))
    }

    toggleEndSelector() {
        this.setState(prevState => ({
            isEndSelectorActive: !prevState.isEndSelectorActive,
        }))
    }

    handleDayClick(day) {
        const { isEndSelectorActive, isStartSelectorActive } = this.state;
        if (isStartSelectorActive) {
            this.handleStartDayClick(day)
        } else if (isEndSelectorActive) {
            this.handleEndDayClick(day)
        }
    }

    handleStartDayClick(day) {
        this.setState({ startDate: day, endDate: day, isStartDateSelected: true });
        this.toggleStartSelector();
        this.toggleEndSelector();
    }

    handleEndDayClick(day) {
        const { startDate } = this.state;
        if (startDate.getTime() <= day.getTime()) {
            this.setState(_ => ({ endDate: day, isStartDateSelected: false }), _ => {
                const { endDate } = this.state;
                const { onDateSelect } = this.props;
                onDateSelect && onDateSelect({ startDate, endDate })
            });
            this.toggleEndSelector();
        }
    }

    setRef(ref) {
        this.selectRef = ref;
    }

    render() {

        const { endDate, isStartDateSelected, startDate, isEndSelectorActive, isStartSelectorActive } = this.state;
        const { label } = this.props;

        return <DatePickerComp
            isStartDateSelected={isStartDateSelected}
            setRef={this.setRef}
            label={label}
            handleDayClick={this.handleDayClick}
            toggleStartSelector={this.toggleStartSelector}
            isStartSelectorActive={isStartSelectorActive}
            isEndSelectorActive={isEndSelectorActive}
            endDate={endDate}
            startDate={startDate}
        />
    }
}