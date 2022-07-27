import React from 'react';
import { View } from 'react-native';

import { fontSizes } from "../../mobileTheme";
import appStringConstants from "../../constants/appStringConstants";
import FormContainer from "../../mobileContainers/FormContainer";
import { buttonTypes } from "../../constants";

const actionStyles = {
    textStyle: { fontSize: fontSizes.size12 },
    style: { height: 40 }
};

export default class FilterPopup extends React.Component {
    static defaultProps = {
        filterData: {}
    };

    constructor(props) {
        super(props);
        this.onFiltersSelect = this.onFiltersSelect.bind(this);
    }

    onFiltersSelect({ formData }) {
        const { onFiltersSelect } = this.props;
        onFiltersSelect && onFiltersSelect({ filterData: formData })
    }

    render() {
        const { searchByFields, filterData, onClearFilterPress } = this.props;
        return <View>
            <FormContainer
                clickActionsStyle={{ paddingBottom: 5 }}
                formData={filterData}
                clickActions={[
                    {
                        title: appStringConstants.clearFiltersButtonTitle,
                        onClick: onClearFilterPress,
                        ...actionStyles,
                        buttonType: buttonTypes.secondary
                    },
                    { title: appStringConstants.filterApplyButtonTitle, onClick: this.onFiltersSelect, ...actionStyles }
                ]}
                fieldGroups={searchByFields}
            />
        </View>
    }
}