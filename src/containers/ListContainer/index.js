import React from 'react';
import { connect } from 'react-redux';

import Table from "../../components/AppCompLibrary/Table";
import PageHeader from "../../components/PageHeader";
import PopUp from "../../components/Popup";
import Button from "../../components/AppCompLibrary/Button";
import appStringConstants from "../../constants/appStringConstants";
import { DelListItemConfirmationPopup } from "../../components/ListContainerPopups/delItemPopup";
import FormContainer from "../Form";

import './index.css'

class ListContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRemoveDataInProgress: false,
            isAddDataLoading: false,
            isUpdateDataLoading: false,
            isUpdateDataPopupActive: false,
            isAddDataPopupActive: false,
            isDelConfirmationPopupActive: false,
            dataToBeUpdated: undefined,
            dataToBeRemoved: undefined,
        };
        this.onUpdateDataButtonClick = this.onUpdateDataButtonClick.bind(this);
        this.onSubmitDataButtonClick = this.onSubmitDataButtonClick.bind(this);
        this.onRemoveButtonClick = this.onRemoveButtonClick.bind(this);
        this.toggleDelConfirmationPopup = this.toggleDelConfirmationPopup.bind(this);
        this.toggleAddNewItemPopup = this.toggleAddNewItemPopup.bind(this);
        this.toggleUpdateItemPopup = this.toggleUpdateItemPopup.bind(this);
        this.getHeaderRightView = this.getHeaderRightView.bind(this);
    }

    static defaultProps = {
        fieldsList: [],
        showDelAction: false,
        showUpdateAction: false,
        showAddAction: false,
    };

    toggleDelConfirmationPopup(dataVal) {
        this.setState(prevState => ({
            isDelConfirmationPopupActive: !prevState.isDelConfirmationPopupActive,
            dataToBeRemoved: dataVal,
        }))
    }

    toggleAddNewItemPopup() {
        this.setState(prevState => ({
            isAddDataPopupActive: !prevState.isAddDataPopupActive,
        }))
    }

    toggleUpdateItemPopup(dataVal) {
        this.setState(prevState => ({
            isUpdateDataPopupActive: !prevState.isUpdateDataPopupActive,
            dataToBeUpdated: dataVal,
        }))
    }

    componentDidMount() {
        const { getListData, userToken } = this.props;
        getListData && getListData({ userToken })
    }

    onRemoveButtonClick() {
        const { dataToBeRemoved } = this.state;
        const { userToken, onRemoveButtonClick } = this.props;
        this.setState({ isRemoveDataInProgress: true });
        onRemoveButtonClick && onRemoveButtonClick({
            userToken,
            dataToBeRemoved,
            onError: _ => {
                this.setState({ isRemoveDataInProgress: false });
            },
            onSuccess: _ => {
                this.setState({ isRemoveDataInProgress: false });
                this.toggleDelConfirmationPopup();
            }
        });

    }

    onSubmitDataButtonClick({ formData }) {
        const { userToken, onSubmitDataButtonClick } = this.props;
        this.setState({ isAddDataLoading: true });
        onSubmitDataButtonClick && onSubmitDataButtonClick({
            formData, userToken, onSuccess: _ => {
                this.setState({ isAddDataLoading: false });
                this.toggleAddNewItemPopup();
            }, onError: _ => {
                this.setState({ isAddDataLoading: false });
            }
        })
    }

    onUpdateDataButtonClick({ formData }) {
        const { userToken, onUpdateDataButtonClick } = this.props;
        this.setState({ isUpdateDataLoading: true });
        onUpdateDataButtonClick && onUpdateDataButtonClick({
            formData, userToken, onSuccess: _ => {
                this.setState({ isUpdateDataLoading: false });
                this.toggleUpdateItemPopup();
            }, onError: _ => {
                this.setState({ isUpdateDataLoading: false });
            }
        })
    }

    getFinalFieldsList() {
        const { showDelAction, showUpdateAction, fieldsList } = this.props;
        let finalFieldsList = [...fieldsList];
        if (showUpdateAction) finalFieldsList.push({
            width: 50,
            "Cell": dataVal => <svg className="edit-icon-style"
                                    onClick={_ => this.toggleUpdateItemPopup(dataVal)}
                                    viewBox="0 0 24 24">
                <use xlinkHref="#edit-pencil-icon-gray"/>
            </svg>
        });
        if (showDelAction) finalFieldsList.push({
            width: 50,
            "Cell": dataVal => <svg className="del-icon-style"
                                    onClick={_ => this.toggleDelConfirmationPopup(dataVal)}
                                    viewBox="0 0 24 24">
                <use xlinkHref="#del_icon"/>
            </svg>
        });
        return finalFieldsList;
    }

    getHeaderRightView() {
        const { rightView, showAddAction } = this.props;
        return _ => <>
            {rightView && rightView()}
            {showAddAction && <Button
                onClick={this.toggleAddNewItemPopup}
                title={appStringConstants.addNewListItemButtonText}/>}
        </>
    }

    render() {
        const {
            isDelConfirmationPopupActive, isUpdateDataPopupActive, isRemoveDataInProgress,
            isAddDataLoading, isUpdateDataLoading, dataToBeUpdated, isAddDataPopupActive,
        } = this.state;
        const {
            data, headerTitle, addItemTitle, delConfirmationTitle,
            delConfirmationMsg, updateItemTitle, addUpdateFormFields,
        } = this.props;

        return <div className="list-container">
            <PageHeader
                rightView={this.getHeaderRightView()}
                title={headerTitle}
            />
            {isDelConfirmationPopupActive && <PopUp
                footerActions={_ => <Button
                    isLoading={isRemoveDataInProgress}
                    onClick={this.onRemoveButtonClick}
                    title={appStringConstants.delButtonTitle}/>}
                title={delConfirmationTitle}
                onClose={this.toggleDelConfirmationPopup}
                renderScene={_ => DelListItemConfirmationPopup({ msg: delConfirmationMsg })}
            />}
            {isAddDataPopupActive && <PopUp
                title={addItemTitle}
                onClose={this.toggleAddNewItemPopup}
                renderScene={_ => (
                    <FormContainer
                        fieldGroups={addUpdateFormFields}
                        clickActions={[{
                            isLoading: isAddDataLoading,
                            title: appStringConstants.addButtonTitle,
                            onClick: this.onSubmitDataButtonClick
                        }]}
                    />
                )}
            />}
            {isUpdateDataPopupActive && dataToBeUpdated && <PopUp
                title={updateItemTitle}
                onClose={this.toggleUpdateItemPopup}
                renderScene={_ => (
                    <FormContainer
                        formData={{ ...dataToBeUpdated }}
                        fieldGroups={addUpdateFormFields}
                        clickActions={[{
                            isLoading: isUpdateDataLoading,
                            title: appStringConstants.updateButtonTitle,
                            onClick: this.onUpdateDataButtonClick
                        }]}
                    />
                )}
            />}
            <Table
                data={data}
                columns={this.getFinalFieldsList()}
            />
        </div>
    }
}

export default connect((state = {}, ownProps = {}) => ({
    userToken: state.users.userToken,
}), {})(ListContainer)