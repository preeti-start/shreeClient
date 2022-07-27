import React from 'react';
import { connect } from 'react-redux';

import './index.css';
import { getAllBuyers } from '../../redux-store/actions/userActions'
import Table from "../../components/AppCompLibrary/Table";
import appStringConstants from "../../constants/appStringConstants";
import InfiniteScroller from "../../components/AppCompLibrary/InfiniteScroller";
import PageHeader from "../../components/PageHeader";
import StringSearchInput from "../../components/AppCompLibrary/StringSearchInput";
import { sortingOption } from "../../constants";
import SortBy from "../../components/AppCompLibrary/SortBy";

const initialState = {
    sort: { _id: sortingOption }
};

class BuyersList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sort: initialState.sort,
            isDataLoading: false,
            buyerNameFilter: ''
        };
        this.loadMore = this.loadMore.bind(this);
        this.onItemNameFilterValueChange = this.onItemNameFilterValueChange.bind(this);
        this.getFinalFilter = this.getFinalFilter.bind(this);
        this.onSortOptionSelect = this.onSortOptionSelect.bind(this);
        this.getBuyersList = this.getBuyersList.bind(this);
    }

    onSortOptionSelect({ sort }) {
        const finalSort = sort ? sort : initialState.sort;
        this.setState({ sort: finalSort }, _ => {
            this.getBuyersList({})
        });
    }

    componentDidMount() {
        this.getBuyersList({})
    }

    onItemNameFilterValueChange(val) {
        this.setState({
            buyerNameFilter: val
        })
    }

    getFinalFilter() {
        const { buyerNameFilter } = this.state;
        const filter = {};
        if (buyerNameFilter && buyerNameFilter.length > 0) filter['name'] = { $regex: buyerNameFilter };
        return filter;
    }

    getBuyersList({ skipCount = 0 }) {
        const { userToken, getAllBuyers } = this.props;
        const { sort } = this.state;
        if (userToken && getAllBuyers) {
            this.setState({ isDataLoading: true });
            getAllBuyers({
                userToken,
                sort,
                skipCount,
                filter: this.getFinalFilter(),
                onSuccess: _ => {
                    this.setState({ isDataLoading: false });
                },
                onError: _ => {
                    this.setState({ isDataLoading: false });
                }
            })
        }
    }

    loadMore() {
        const { allBuyersListData } = this.props;
        if (allBuyersListData && allBuyersListData.data && allBuyersListData.pagination &&
            allBuyersListData.data.length < allBuyersListData.pagination.total_records) {
            this.getBuyersList({ skipCount: allBuyersListData.data.length });
        }
    }

    render() {

        const { allBuyersListData, isAppLoading } = this.props;
        const { isDataLoading, buyerNameFilter } = this.state;

        return <div className="buyer-list-container">
            <PageHeader
                rightView={_ => <>
                    <div className="table-header-option">
                        <StringSearchInput
                            onClick={_ => this.getBuyersList({})}
                            onChange={this.onItemNameFilterValueChange}
                            placeholder={appStringConstants.nameFieldPlaceholder}
                            value={buyerNameFilter}
                        />
                    </div>
                    <div className="table-header-option">
                        <SortBy
                            onClick={this.onSortOptionSelect}
                            options={[
                                { label: appStringConstants.nameFieldTitle, id: 'name' },
                            ]}
                        />
                    </div>
                </>}
                title={appStringConstants.buyersListMenuTitle}
            />
            <InfiniteScroller
                isLoading={isDataLoading}
                scrollableTarget={'dashboard'}
                loadMore={this.loadMore}>
                <Table
                    data={[{
                        isLoading: isAppLoading,
                        data: allBuyersListData && allBuyersListData.data,
                    }]}
                    columns={[
                        { "label": appStringConstants.nameFieldTitle, "field": "name" },
                        { "label": appStringConstants.buyersListPhoneNumberFieldTitle, "field": "phone_no" },
                        {
                            "label": appStringConstants.buyersListProfileImageFieldTitle,
                            Cell: _ => <div>{_.profile_img && _.profile_img.url &&
                            <img className="buyer-list-img" src={_.profile_img.url}/>}</div>,
                        },
                    ]}
                />
            </InfiniteScroller>
        </div>


    }
}

export default connect(state => ({
    isAppLoading: state.users.isAppLoading,
    userToken: state.users.userToken,
    allBuyersListData: state.users.allBuyersListData,
}), { getAllBuyers })(BuyersList)