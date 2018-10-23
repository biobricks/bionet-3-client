import React, { Component } from 'react';
import axios from 'axios';
import appConfig from '../../configuration.js';

class VirtualList extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {
    // let virtualArray = []
    axios.get(`${appConfig.apiBaseUrl}/virtuals`)
    .then( res => console.log(res))
    .catch(e => console.log(e))
  }
  render() { 
    return ( <div><h1>VirtualList Component</h1></div> );
  }
}
 
export default VirtualList;