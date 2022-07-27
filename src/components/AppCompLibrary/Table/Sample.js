import React from 'react';
import Table from './index.js'
import Button from '../Button'
export default class TableSample extends React.Component {
  render() {
    const data = [{
      title: `Title 1`,
      data: [
        {
          name: 'Test 1',
          age: '12',
          address: {
            city: 'NY',
            country: 'USA',
          },
        },
        {
          name: 'Test 2',
          age: '12',
        },
      ],
    }, {
      title: 'Title 2',
      data: [
        {
          name: 'Test 1',
          age: '12',
        },
        {
          name: 'Test 2',
          age: '12',
        },
      ],
    },
    ]

    const columns = [
      { label: 'Name', field: 'name' },
      { label: 'Age', field: 'age', width: 150 },
      { label: 'City', field: 'address.city', width: 150 },
      { label: 'State', field: 'address.state', width: 150 },
      {
        label: '',
        width: 250,
        Cell: row => <Button title={'Click me'} onClick={() =>{alert('button clicked')}} />,
      },
    ];
    return <Table columns={columns} data={data} />
  }
}
