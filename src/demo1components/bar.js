import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { observer, PropTypes as ObservableProptypes } from 'mobx-react';

@observer
export default class Bar extends Component {
    static propTypes = {
        queue: ObservableProptypes.observableArray // PropTypes.array
    }
    render() {
        const queue = this.props.queue;
        return <span>{queue.length}</span>
    }
}