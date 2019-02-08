import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import appConfig from '../../configuration.js';
import shortid from 'shortid';
import Loading from '../partials/Loading/Loading';

class VirtualList extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      virtuals: []
    }
  }

  componentDidMount() {
    axios.get(`${appConfig.apiBaseUrl}/virtuals`)
    .then( res => {
      this.setState({
        loaded: true,
        virtuals: res.data.data
      });
    })
    .catch(e => console.log(e))
  }

  render() { 
    const isLoaded = this.state.loaded;
    const virtuals = this.state.virtuals || [];
    const virtualLinks = virtuals.map((virtual, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action bg-info text-light rounded-0"
          to={`/virtuals/${virtual._id}`}
        >
          {virtual.name}
        </Link>
      )
    });    
    return ( 
      <div className="container-fluid pb-3">
        {(isLoaded) ? (
          <div className="row">
            <div className="col-12 col-lg-7"> 
              <div className="card rounded-0 mt-3">
                <div className="card-header bg-dark text-light rounded-0">
                  <h4 className="card-title mb-0">
                    <i className="mdi mdi-dna mr-2" />Virtual List
                  </h4>
                </div>
                <div className="card-body">
                  {(virtualLinks.length > 0) ? (
                    <p className="card-text">Select from the Virtuals listed below.</p>
                  ) : (
                    <p className="card-text">There are currently no Virtuals listed.</p>
                  )}
                </div>
                <ul className="list-group list-group-flush">
                  {virtualLinks}
                  <Link 
                    className="list-group-item list-group-item-action bg-success text-light rounded-0"
                    to={`/virtuals/new`}
                  >
                    <i className="mdi mdi-plus mr-2"/> Add Virtual 
                  </Link>                  
                </ul>
              </div>
            </div>               
          </div>
        ) : (
          <div 
            className="row justify-content-center align-items-center"
            style={{'minHeight': '100vh'}}
          >
            <Loading />
          </div>  
        )}  
      </div> 
    );
  }
}
 
export default VirtualList;