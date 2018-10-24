import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import appConfig from '../../configuration.js';
import shortid from 'shortid';
import Loading from '../partials/Loading/Loading';

class PhysicalList extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      physicals: []
    }
  }

  componentDidMount() {
    axios.get(`${appConfig.apiBaseUrl}/physicals`)
    .then( res => {
      this.setState({
        loaded: true,
        physicals: res.data.data
      });
    })
    .catch(e => console.log(e))
  }

  render() { 
    const isLoaded = this.state.loaded;
    const physicals = this.state.physicals || [];
    const physicalLinks = physicals.map((physical, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action bg-info text-light rounded-0"
          to={`/physicals/${physical._id}`}
        >
          {physical.name}
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
                    <i className="mdi mdi-dna mr-2" />Physical List
                  </h4>
                </div>
                <div className="card-body">
                  {(physicalLinks.length > 0) ? (
                    <p className="card-text">Select from the Physicals listed below.</p>
                  ) : (
                    <p className="card-text">There are currently no Physicals listed.</p>
                  )}
                </div>
                <ul className="list-group list-group-flush">
                  {physicalLinks}
                  <Link 
                    className="list-group-item list-group-item-action bg-success text-light rounded-0"
                    to={`/physicals/new`}
                  >
                    <i className="mdi mdi-plus mr-2"/> Add Physical 
                  </Link>                  
                </ul>
              </div>
            </div>               
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-5">
              <Loading />
            </div>
          </div>  
        )}  
      </div> 
    );
  }
}
 
export default PhysicalList;