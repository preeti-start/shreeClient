import React from 'react';


export default class TextArea extends React.Component {

    constructor(props) {
        super(props);
        this.onValChance = this.onValChance.bind(this);
    }

    onValChance(e) {
        const { onChange } = this.props;
        onChange && onChange(e.target.value, e)
    }

    render() {

        return <textarea {...this.props} onChange={this.onValChance}/>
    }
}
