import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Bar from './bar';
import { observer, PropTypes as ObservableProptypes } from 'mobx-react';

// @observer
export default class Foo extends Component {
    static propTypes = {
        cache: ObservableProptypes.observableObject // PropTypes.object
    }
    render() {
        const cache = this.props.cache;
        return <div><Bar queue={cache.queue} /><br /><button onClick={this.props.refresh}>refresh</button></div>
    }
}