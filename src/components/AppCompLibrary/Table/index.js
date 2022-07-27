import React from 'react';
import Grid from './Grid';
import './index.css';
import NoResultFound from "../../NotFound/noResultFound";

const COLUMN_DEFAULT_WIDTH = 100;
const INITIAL_ROW_PADDING = 24;

export default class Table extends React.Component {
    static defaultProps = {
        data: [],
        showHeaders: true,
        showColumnsNames: true,
        noDataComponent: _ => <NoResultFound/>
    };

    constructor(props) {
        super(props);
        this.populateColumns(this.props.columns);
        this.getColumnContainerStyle = this.getColumnContainerStyle.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.columns !== newProps.columns) {
            this.populateColumns(newProps.columns);
        }
    }

    populateColumns(columns) {
        this.hasHeaderGroup = this.checkIfHeaderGroupsExistsOrNot(columns);
        if (this.hasHeaderGroup) {
            const { modifiedColumns, headerGroups, minRowWidth } = this.getColumnsAndHeaderGroups(columns);
            this.columns = modifiedColumns;
            this.headerGroups = headerGroups;
            this.minRowWidth = minRowWidth;
        }
        else {
            const { minRowWidth } = this.getColumnsAndHeaderGroups(columns);
            this.columns = columns;
            this.minRowWidth = minRowWidth;
        }
    }

    checkIfHeaderGroupsExistsOrNot(columns) {
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].columns && columns[i].columns.length > 0) {
                return true;
            }
        }
        return false;
    }

    getColumnContainerStyle(column) {
        const width = column.width || column.minWidth || COLUMN_DEFAULT_WIDTH;
        const style = { flex: `${width} 0 auto`, width };
        if (column.isMaxWidthColumn) {
            style.maxWidth = width;
        }
        return style;
    }

    getColumnsAndHeaderGroups = columns => {
        const modifiedColumns = [];
        const headerGroups = [];
        let minRowWidth = INITIAL_ROW_PADDING; // 24 is the initial padding for each row
        columns.forEach(column => {
            if (column.columns && column.columns.length > 0) {
                let width = 0;
                column.columns.forEach(innerColumn => {
                    modifiedColumns.push(innerColumn);
                    width = width + this.getColumnContainerStyle(innerColumn).width;
                    minRowWidth += this.getColumnContainerStyle(innerColumn).width;
                });
                headerGroups.push({ ...column, width });
            }
            else {
                headerGroups.push({
                    width: this.getColumnContainerStyle(column).width,
                    columns: [column],
                });
                minRowWidth += this.getColumnContainerStyle(column).width;
                modifiedColumns.push(column);
            }
        });
        return { modifiedColumns, headerGroups, minRowWidth };
    }

    render() {
        const { data, tableClassName } = this.props;
        return (
            <div className={`${tableClassName}`}>
                {data.map(row => (
                    <Grid
                        isLoading={row.isLoading}
                        isLoadingMore={row.isLoadingMore}
                        minRowWidth={this.minRowWidth}
                        rightView={row.rightView}
                        columns={this.columns}
                        isCollapsable={!row.isLoading && this.props.isCollapsable}
                        data={row.data}
                        showHeaders={this.props.showHeaders}
                        showColumnsNames={this.props.showColumnsNames}
                        valueAccessor={this.props.valueAccessor}
                        noOfFreezedColumns={this.props.noOfFreezedColumns}
                        getColumnContainerStyle={this.getColumnContainerStyle}
                        hasHeaderGroup={this.hasHeaderGroup}
                        headerGroups={this.headerGroups}
                        renderRow={this.props.renderRow}
                        getColumnsAndHeaderGroups={this.getColumnsAndHeaderGroups}
                        subTitle={row.sub_title}
                        title={row.title}
                        columnClassName={this.props.columnClassName}
                        headerColumnClassName={this.props.headerColumnClassName}
                        rowClassName={this.props.rowClassName}
                        applyClassName={this.props.applyClassName}
                        onRowClick={this.props.onRowClick}
                        rowKey={this.props.rowKey}
                        selectableRows={this.props.selectableRows}
                        selectRowActions={this.props.selectRowActions}
                        onRowSelectChange={this.props.onRowSelectChange}
                        noDataComponent={this.props.noDataComponent}
                    />
                ))}
            </div>
        )
    }
}
