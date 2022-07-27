import React from 'react';
import { loadingComp } from './LoadingData';
import Table from '../../AppCompLibrary/Table';

export default class ListPreLoader extends React.Component {
  render() {
    const loadingObject = {
      label: (<div>{loadingComp()}</div>),
      field: '',
      width: 1,
      Cell: row => (<div>{loadingComp()}</div>),
    }
    const dummyColumns = [loadingObject, loadingObject, loadingObject, loadingObject, loadingObject];
    const dummyData = [{
      title: this.props.title || <div>{loadingComp()}</div>,
      data: [{}, {}, {}, {}, {}],
    }];
    return <div style={{ paddingTop: 20 }}>
      <Table key={'dummy'} columns={dummyColumns} data={dummyData}/>
    </div>
  }
}
