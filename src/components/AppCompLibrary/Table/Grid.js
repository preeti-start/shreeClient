import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash';

import RowRender from './RowRender';
import CheckBox from '../CheckBoxFromHms';
import ListPreLoader from '../ListPreLoader';
import Tooltip from '../Tooltip';
import Loader from "../../Loaders";

export default class Grid extends Component {
    static propTypes = {
        columns: PropTypes.array.isRequired,
        data: PropTypes.array,
        isCollapsable: PropTypes.bool,
        onRowClick: PropTypes.func,
        noOfFreezedColumns: PropTypes.number,
    }

    static defaultProps = {
        columnClassName: '',
        headerColumnClassName: '',
        data: [],
        rowKey: 'id',
        noOfFreezedColumns: 0,
        isCollapsable: false,
        onRowClick: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedRows: {},
            headerHeight: 0,
            isFrozenTableVisible: false,
            isCollapsed: false,
            isPartiallyChecked: false,
        }
        this.onScroll = this.onScroll.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.setRef = this.setRef.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const newData = newProps.data;
        const { selectedRows } = this.state;
        const { data, rowKey, selectableRows } = this.props;
        if (selectableRows && newData !== data) {
            const selectCount = Object.keys(selectedRows).length;
            let dataCount = 0;
            const newSelectedRows = {};
            for ( let i = 0; i < newData.length; i++ ) {
                if (selectCount === dataCount) {
                    break;
                }
                if (selectedRows.hasOwnProperty(newData[i][rowKey])) {
                    newSelectedRows[newData[rowKey]] = newData[i];
                    dataCount++;
                }
            }
            if (selectCount !== dataCount) {
                this.setState({ selectedRows: newSelectedRows })
            }
        }
    }

    setRef(ref) {
        this.ref = ref;
    }

    isColumnVisible(column) {
        const { isVisible } = column;
        if (typeof isVisible === 'function') {
            return isVisible();
        }
        return true;
    }

    renderRow(columns, row, index) {
        const { renderRow, selectableRows, rowKey } = this.props
        if (renderRow) {
            return renderRow({ rowData: row, index });
        }
        let modifiedColumns = [];
        if (selectableRows) {
            modifiedColumns = [this.getSelectAllColumn(index), ...columns];
        }
        return (
            <RowRender
                columns={selectableRows ? modifiedColumns : columns}
                columnClassName={this.props.columnClassName}
                valueAccessor={this.props.valueAccessor}
                rowClassName={this.props.rowClassName}
                applyClassName={this.props.applyClassName}
                getColumnContainerStyle={this.props.getColumnContainerStyle}
                key={`${row[rowKey]}_${index}`}
                row={row}
                rowIndex={index}
                isColumnVisible={this.isColumnVisible}
                onRowClick={this.props.onRowClick}
                selectRow={this.state.selectedRows[row[rowKey]] ? true : false}
            />
        )
    }

    showSelectRowActions(selectRowActions) {
        const { selectedRows } = this.state;
        return ( Object.keys(selectedRows).length > 0 && selectRowActions );
    }

    toggleCollapsedStatus = () => {
        this.setState(previousState => ( { isCollapsed: !previousState.isCollapsed } ))
    }

    renderExpandCollapseIcon() {
        const { isCollapsed } = this.state;
        const overlayTitleId = isCollapsed ? 'expandTableTitle' : 'collapseTableTitle';
        return (
            <div className="display-flex cursor-pointer" onClick={this.toggleCollapsedStatus}>
                <Tooltip overlay={<div>{overlayTitleId}</div>} containerClass="expand-icon-container">
                    <svg className={`drop-down-icon ${isCollapsed ? '' : 'collapse-icon'}`} viewBox="0 0 14 9">
                        <use xlinkHref="#down_arrow_icon"/>
                    </svg>
                </Tooltip>
            </div>
        )
    }

    renderTableHeader(title, subTitle, rightView, selectRowActions) {
        const { showHeaders, isCollapsable } = this.props;
        if (!showHeaders) {
            return null;
        }
        const showActions = this.showSelectRowActions(selectRowActions);
        return [
            <div
                className={`table-section-dummy-header ${this.state.isCollapsed ? 'table-section-dummy-header-collapsed' : ''}`}>
                {rightView && rightView()}
                {isCollapsable && this.renderExpandCollapseIcon()}
            </div>,
            <div className={`table-section-header  ${showActions ? 'actions-header' : ''}`}>
                <div className="table-section-header-title-container">
                    <div className="table-section-header-title-left">
                        <div className="table-section-header-title">
                            {title}
                        </div>
                        <div className="table-section-header-sub-title">
                            {subTitle}
                        </div>
                        <div className="table-section-header-select-actions">
                            {showActions && selectRowActions()}
                        </div>
                    </div>
                </div>
            </div>,
        ]
    }

    onScroll = event => {
        if (!this.state.isFrozenTableVisible && event.target.scrollLeft >= 0) {
            this.setState({
                isFrozenTableVisible: true,
            })
        }
    }

    renderHeaderGroups() {
        const { headerGroups, minRowWidth } = this.props;
        if (!headerGroups || headerGroups.length === 0) {
            return null;
        }
        return (
            <div className={'table-header'} style={{ minWidth: minRowWidth }} ref={this.setRef}>
                {headerGroups.map(headerGroup => {
                    const style = this.props.getColumnContainerStyle(headerGroup);
                    return (
                        <div className="table-header-group-container" style={style}>
                            <div className="table-header-group-label">
                                {headerGroup.label}
                            </div>
                            <div className="table-header-group-columns">
                                {headerGroup.columns && headerGroup.columns.map(this.renderHeader)}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    isSelectAllChecked = () => {
        const { selectedRows } = this.state;
        const { data } = this.props;
        return Object.keys(selectedRows).length === data.length || this.state.isPartiallyChecked;
    }

    handleSelectAllChange = (event, checked) => {
        const { data, rowKey } = this.props;
        const rowMap = {};
        if (checked) {
            data.forEach(row => {
                rowMap[row[rowKey]] = row;
            });
            this.setState({
                selectedRows: rowMap,
            });
            this.props.onRowSelectChange(rowMap);
        }
        else {
            this.setState({ selectedRows: {}, isPartiallyChecked: false });
            this.props.onRowSelectChange({});
        }
    }

    handleSelectRowChange = (event, checked, rowData) => {
        const { rowKey } = this.props;
        const { selectedRows } = this.state;
        if (checked) {
            let partiallyChecked = true;
            const updatedSelectedRows = { ...selectedRows, [rowData[rowKey]]: rowData };
            if (Object.keys(selectedRows).length + 1 === this.props.data.length) {
                partiallyChecked = false;
            }
            this.setState({
                selectedRows: updatedSelectedRows,
                isPartiallyChecked: partiallyChecked,
            });
            this.props.onRowSelectChange(updatedSelectedRows);
        }
        else {
            const updatedSelectedRows = { ...selectedRows };
            delete updatedSelectedRows[rowData[rowKey]];
            let partiallyChecked = true;
            if (isEmpty(updatedSelectedRows)) {
                partiallyChecked = false;
            }
            this.setState({
                selectedRows: updatedSelectedRows,
                isPartiallyChecked: partiallyChecked,
            });
            this.props.onRowSelectChange(updatedSelectedRows);
        }
    }

    renderHeaderCheckBox = () => {
        const style = this.props.getColumnContainerStyle(this.getSelectAllColumn());
        return (
            <div style={style}>
                <CheckBox
                    id={`header-id`}
                    shape={`square ${this.state.isPartiallyChecked && 'partially-checked'}`}
                    onChange={this.handleSelectAllChange}
                    checked={this.isSelectAllChecked()}
                />
            </div>
        )
    }

    renderSelectRow = rowData => (
        <CheckBox
            id={rowData[this.props.rowKey]}
            shape="square"
            onChange={this.handleSelectRowChange}
            checked={this.state.selectedRows[rowData[this.props.rowKey]]}
            data={rowData}
        />
    )

    getSelectAllColumn() {
        return {
            width: 3,
            Cell: this.renderSelectRow,
        }
    }

    renderHeader(column, index) {
        if (!this.isColumnVisible(column)) {
            return;
        }
        const { columnClassName, headerColumnClassName } = this.props;
        const style = this.props.getColumnContainerStyle(column)
        const props = {
            className: `table-header-column ${columnClassName} ${column.className || ''} ${headerColumnClassName}`,
            key: `column_header_${index}`,
            style,
            title: column.label,
        }
        return (
            <div {...props}>
                {column.label}
            </div>
        )
    }

    renderHeaders(columns) {
        const { showColumnsNames, selectableRows } = this.props;
        if (!showColumnsNames) return;
        const renderedHeaders = columns.map(this.renderHeader);
        return (
            <div className={'table-header'} style={{ height: this.ref && this.ref.clientHeight }}>
                {selectableRows && this.renderHeaderCheckBox()}
                {renderedHeaders}
            </div>
        )
    }

    hasFreezedColumns = () => ( this.props.noOfFreezedColumns > 0 );

    renderTable = columns => {
        const {
            title, subTitle, isLoadingMore, data, minRowWidth, rightView,
            hasHeaderGroup, selectRowActions, noDataComponent
        } = this.props;
        const hasFreezedColumns = this.hasFreezedColumns();
        return (
            <div className={`table ${data.length === 0 ? 'no-data' : ''}`}>
                {( title || subTitle || rightView || selectRowActions ) && this.renderTableHeader(title, subTitle, rightView, selectRowActions)}
                {!this.state.isCollapsed &&
                <div className="table-header-row-container" onScroll={hasFreezedColumns && this.onScroll}>
                    {data.length !== 0 && ( hasHeaderGroup ? this.renderHeaderGroups() : this.renderHeaders(columns) )}
                    <div className="table-body-row-container" style={{ minWidth: minRowWidth }}>
                        {data.map((row, index) => this.renderRow(columns, row, index))}
                        {data.length === 0 && noDataComponent && noDataComponent()}
                        {isLoadingMore &&
                        <div className="table-body-more-loader"><Loader isCircularLoader={true}/></div>}
                    </div>
                </div>}
            </div>
        );
    };

    getFreezedColumns = () => {
        const freezedColumns = [];
        const { columns } = this.props;
        for ( let i = 0; i < this.props.noOfFreezedColumns; i++ ) {
            freezedColumns.push(columns[i]);
        }
        return freezedColumns;
    };

    renderFrozenTable = columns => {
        const { data } = this.props;
        const { minRowWidth } = this.props.getColumnsAndHeaderGroups(columns)
        return (
            <div className={`table frozen-table ${this.state.isFrozenTableVisible ? 'frozon-table-visible' : ''}`}
                 style={{ maxWidth: minRowWidth }}>
                {this.renderTableHeader()}
                <div className="table-header-row-container">
                    {this.renderHeaders(columns)}
                    <div>
                        {data.map((row, index) => this.renderRow(columns, row, index))}
                    </div>
                </div>
            </div>
        );
    }

    renderFrozenTables = () => {
        const { columns } = this.props;
        const frozenColumns = this.getFreezedColumns();
        return (
            <div style={{ position: 'relative' }}>
                {this.renderFrozenTable(frozenColumns)}
                {this.renderTable(columns)}
            </div>
        )
    }

    render() {
        const { data, columns, isLoading, title, noDataComponent } = this.props;
        if (isLoading) {
            return <ListPreLoader title={title}/>
        }
        if (!data) {
            return null;
        }
        if (data.length === 0 && !noDataComponent) {
            return null;
        }
        const hasFreezedColumns = this.hasFreezedColumns();
        if (hasFreezedColumns) {
            return this.renderFrozenTables()
        }
        return this.renderTable(columns);
    }
}
