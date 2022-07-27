import React, {Component} from 'react'
import PropTypes from 'prop-types'


import ColumnRender from './ColumnRender'

export default class Row extends Component {
    static propTypes = {
        columnClassName: PropTypes.string,
        columns: PropTypes.array.isRequired,
        getColumnContainerStyle: PropTypes.func.isRequired,
        row: PropTypes.object.isRequired,
        rowClassName: PropTypes.string,
        rowIndex: PropTypes.number.isRequired,
        isColumnVisible: PropTypes.func.isRequired,
    }

    static defaultProps = {
        columnClassName: '',
        rowClassName: '',
    }

    constructor(props) {
        super(props);
        this.onRowClick = this.onRowClick.bind(this);
    }

    renderColumns() {
        const {columns, rowIndex, row, columnClassName, isColumnVisible} = this.props
        return columns.map((column, columnIndex) => {
            if (!isColumnVisible(column)) {
                return null;
            }
            const style = this.props.getColumnContainerStyle(column);
            return (
                <div
                    className={`table-column ${columnClassName} ${column.className || ''}`}
                    key={`row_${rowIndex}_column_${columnIndex}`}
                    style={style}
                >
                    <ColumnRender
                        column={column}
                        key={columnIndex}
                        rowIndex={rowIndex}
                        valueAccessor={this.props.valueAccessor}
                        row={row}
                        selectRow={this.props.selectRow}
                    />
                </div>
            )
        })
    }

    onRowClick() {
        if (this.props.onRowClick) {
            this.props.onRowClick(this.props.row);
        }
    }

    render() {
        const style = Object.assign({}, this.props.onRowClick && {cursor: 'pointer'})
        const {row, applyClassName, rowClassName, selectRow} = this.props;
        const className = applyClassName ? `${applyClassName(row)} ${rowClassName}` : rowClassName;
        const selectedClassName = selectRow ? 'selected' : '';
        return (
            <div className={`table-row ${className} ${selectedClassName}`} onClick={this.onRowClick}
                 style={style}>
                {this.renderColumns()}
            </div>
        )
    }
}
