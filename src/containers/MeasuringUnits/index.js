import React from 'react';
import { connect } from 'react-redux';

import {
    getMeasuringUnits,
    addMeasuringUnits,
    removeMeasuringUnit,
    updateMeasuringUnit,
} from '../../redux-store/actions/measuringUnitsActions'
import appStringConstants from "../../constants/appStringConstants";
import ListContainer from "../ListContainer";

import './index.css';

class MeasuringUnits extends React.Component {

    constructor(props) {
        super(props);
        this.getListData = this.getListData.bind(this);
        this.onRemoveButtonClick = this.onRemoveButtonClick.bind(this);
        this.onUpdateDataButtonClick = this.onUpdateDataButtonClick.bind(this);
        this.onSubmitUnitButtonClick = this.onSubmitUnitButtonClick.bind(this);
    }


    onRemoveButtonClick({ userToken, dataToBeRemoved, onSuccess, onError }) {
        const { removeMeasuringUnit } = this.props;
        dataToBeRemoved && dataToBeRemoved._id && userToken && removeMeasuringUnit && removeMeasuringUnit({
            userToken,
            recordId: dataToBeRemoved._id,
            onSuccess,
            onError
        })
    }

    getListData({ userToken }) {
        const { getMeasuringUnits } = this.props;
        userToken && getMeasuringUnits && getMeasuringUnits({
            userToken,
        })
    }

    onSubmitUnitButtonClick({ onSuccess, onError, formData, userToken }) {
        const { addMeasuringUnits } = this.props;
        const { name, short_name } = formData;

        name && short_name && userToken && addMeasuringUnits && addMeasuringUnits({
            userToken,
            name,
            short_name,
            onSuccess,
            onError,
        })

    }

    onUpdateDataButtonClick({ onSuccess, onError, formData, userToken }) {
        const { name, short_name } = formData;
        const { updateMeasuringUnit } = this.props;
        userToken && formData && formData._id && updateMeasuringUnit && updateMeasuringUnit({
            recordId: formData._id,
            onSuccess,
            onError,
            updateJson: { name, short_name },
            userToken
        })
    }

    render() {

        const { measuringUnitsList } = this.props;


        return <ListContainer
            getListData={this.getListData}
            fieldsList={[
                { width: 100, "label": appStringConstants.nameFieldTitle, "field": "name" },
                { width: 100, "label": appStringConstants.measuringUnitShortNameFieldTitle, "field": "short_name" },
            ]}
            data={[{
                data: measuringUnitsList
            }]}
            showAddAction={true}
            showDelAction={true}
            showUpdateAction={true}
            delConfirmationMsg={appStringConstants.delMeasuringUnitPopupText}
            delConfirmationTitle={appStringConstants.delMeasuringUnitPopupTitle}
            onUpdateDataButtonClick={this.onUpdateDataButtonClick}
            updateItemTitle={appStringConstants.updateMeasuringUnitPageTitle}
            addItemTitle={appStringConstants.addMeasuringUnitPopupTitle}
            headerTitle={appStringConstants.measuringUnitsMenuTitle}
            onRemoveButtonClick={this.onRemoveButtonClick}
            addUpdateFormFields={[
                {
                    fields: [
                        {
                            isMandatory: true,
                            field: "name",
                            placeholder: appStringConstants.nameFieldPlaceholder,
                            label: appStringConstants.nameFieldTitle,
                        },
                        {
                            isMandatory: true,
                            field: "short_name",
                            placeholder: appStringConstants.addMeasuringUnitShortNameFieldPlaceHolder,
                            label: appStringConstants.addMeasuringUnitShortNameFieldPlaceHolder,
                        },
                    ]
                },

            ]}
            onSubmitDataButtonClick={this.onSubmitUnitButtonClick}
        />

    }
}

export default connect(state => ( {
    measuringUnitsList: state.measuringUnits.measuringUnitsList,
} ), { getMeasuringUnits, updateMeasuringUnit, removeMeasuringUnit, addMeasuringUnits })(MeasuringUnits)