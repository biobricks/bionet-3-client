import React, { Component } from 'react';
import axios from 'axios';
import appConfig from '../../configuration.js';
import shortid from 'shortid';

class VirtualList extends Component {
  constructor() {
    super();
    this.state = {
      virtuals: []
    }
  }

  componentDidMount() {
    // let virtualArray = []
    axios.get(`${appConfig.apiBaseUrl}/virtuals`)
    .then( res => {
      this.setState({virtuals: res.data.data})
    })
    .catch(e => console.log(e))
  }
  render() { 
    return ( 
    <div className="container-fluid">
      {this.state.virtuals.map(virtual => (
        <div key={shortid.generate()}>
          <div className="row"> 
            <p>{virtual.name}</p>
            <p>{virtual.description}</p>
          </div>
        </div>
      ))}
    </div> );
  }
}
 
export default VirtualList;