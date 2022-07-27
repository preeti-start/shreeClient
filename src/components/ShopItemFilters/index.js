import React from 'react';

import appStringConstants from "../../constants/appStringConstants";
import { fieldTypes } from "../../constants";
import Checkbox from "../AppCompLibrary/Checkbox";
import StringSearchInput from "../AppCompLibrary/StringSearchInput";
import Input from "../AppCompLibrary/Input";

import './index.css';

export default class ShopItemFilters extends React.Component {
    render() {
        const { sortOptions, filterOptions } = this.props;
        return <div className="filter-left-section">

            <div className="shop-filters-header">{appStringConstants.sortByButtonLabel}</div>

            {sortOptions && sortOptions.length > 0 && sortOptions.map((sortVal, sortIndex) => <div
                key={`shop_sort_${sortIndex}`}
                className={`shop-list-sort-option ${sortVal.isActive ? 'sort-active' : ''}`}
                onClick={sortVal.onClick}>
                {sortVal.label}
            </div>)}

            <div className="shop-filters-header margin_top">{appStringConstants.filtersTitle}</div>

            {filterOptions && filterOptions.length > 0 && filterOptions.map((filterVal, filterIndex) => {
                if (filterVal && filterVal.type === fieldTypes.checkbox) {
                    return <div className="shop-list-sort-option">
                        <Checkbox key={`shop_filter_${filterIndex}`} onValueChange={filterVal.onClick}
                                  title={filterVal.label} value={filterVal.value}/>
                    </div>
                } else if (filterVal && filterVal.type === fieldTypes.dropdown) {
                    return <div className="shop-list-sort-option">
                        <Input
                            showDropDown={true}
                            dropDownLabelKey={filterVal.dropDownLabelKey}
                            dropDownValueKey={filterVal.dropDownValueKey}
                            dropDownOptions={filterVal.dropDownOptions}
                            onDropDownSelect={filterVal.onDropDownSelect}
                            inputValue={filterVal.inputValue}
                            activeDropDownItemIndex={filterVal.activeDropDownItemIndex}
                            label={filterVal.label}
                        />
                    </div>
                } else if (filterVal && filterVal.type === fieldTypes.string) {
                    return <div className="shop-list-sort-option">
                        {/*<div className="shop-list-filter-title">*/}
                            {/*{filterVal.label}*/}
                        {/*</div>*/}
                        <StringSearchInput
                            onClick={filterVal.onClick}
                            onChange={filterVal.onChange}
                            placeholder={filterVal.label}
                            value={filterVal.value}
                        />
                    </div>
                }
                return null;
            })}

        </div>
    }
}