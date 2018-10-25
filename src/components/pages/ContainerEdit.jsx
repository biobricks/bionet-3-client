import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import { Redirect } from 'react-router-dom';
import appConfig from '../../configuration.js';
import axios from 'axios';
import AlertCard from '../partials/AlertCard';
import Grid from '../partials/Grid';

import './LabProfile.css';
import Loading from '../partials/Loading/Loading';

class ContainerEdit extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      containerId: "",
      loaded: false,
      redirect: false,
      path: [],
      lab: {},
      container: {},
      childContainers: []
    };

    this.updateLab = this.updateLab.bind(this);
    this.getContainer = this.getContainer.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
    this.updateField = this.updateField.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);    
  }

  updateLab(lab) {
    let config = {
      'headers': {  
        'authorization': `Bearer ${Auth.getToken()}`
      },
      'json': true
    };
    axios.post(`${appConfig.apiBaseUrl}/labs/${lab._id}/membership`, lab, config)
    .then(res => {     
      //console.log(res.data.data);
      this.getContainer();
    })
    .catch(error => {
      console.error(error);
    });
  }

  getContainer() {
    axios.get(`${appConfig.apiBaseUrl}/containers/${this.props.match.params.containerId}`)
    .then(res => {
      //console.log("response", res.data);
      let container = res.data.data;
      let childContainers = res.data.containers;
      axios.get(`${appConfig.apiBaseUrl}/labs/${container.lab._id}`)
      .then(response => {
        //console.log("response 2", response.data);
        let lab = response.data.data;
        let apiEndpoint = `${appConfig.apiBaseUrl}/labs/${lab._id}/container/${container._id}`;
        console.log(apiEndpoint);
        axios.get(apiEndpoint)
        .then(res => {
          console.log("response 3", res.data.data);
          this.setState({
            loaded: true,
            path: res.data.data,
            containerId: this.props.match.params.containerId,
            lab,
            container,
            childContainers            
          });
        })
        .catch(error => {
          console.error(error);        
        });
      })
      .catch(error => {
        console.error(error);        
      });  
    })
    .catch(error => {
      console.error(error);        
    });    
  }

  updateContainer(container) {
    let config = {
      'headers': {  
        'authorization': `Bearer ${Auth.getToken()}`
      },
      'json': true
    };
    let containerId = this.props.match.params.containerId;
    axios.post(`${appConfig.apiBaseUrl}/containers/${containerId}/edit`, container, config)
    .then(res => {     
      //console.log(res.data.data);
      this.setState({
        redirect: true
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  updateField(e) {
    const field = e.target.name;
    let container = this.state.container;
    if(field === 'rows' || field === 'columns') {
      container[field] = Number(e.target.value);
    } else {
      container[field] = e.target.value;
    }
    this.setState({
      container
    });    
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let container = this.state.container;
    this.updateContainer(container);
  }

  componentDidMount() {
    this.getContainer();
  }  

  componentDidUpdate() {
    let currentContainerId = this.props.match.params.containerId;
    let containerId = this.state.containerId;
    if (this.state.loaded && currentContainerId !== containerId){
      this.getContainer();
    }
  }

  render() { 
    let users = this.state.lab.users || [];
    let currentUserIsMember = false;
    const isLoaded = this.state.loaded;
    
    for(let i = 0; i < users.length; i++) {
      let userId = users[i]._id || null;
      if (userId === this.props.currentUser._id) {
        currentUserIsMember = true;
      }
    }

    if (this.state.redirect){
      return (
        <Redirect to={`/containers/${this.props.match.params.containerId}`}/>
      );
    }

    return (
      <div className="container-fluid pb-3">
        {(isLoaded) ? (
          <div className="row">  
            { (this.props.isLoggedIn && currentUserIsMember) ? (
              <div className="col-12 col-lg-7">

                <div className="card rounded-0 mt-3">
                  <div className="card-header bg-dark text-light rounded-0">
                    <div className="card-title mb-0 text-center text-lg-left">
                      <span><i className="mdi mdi-xl mdi-grid" />Edit {this.state.container.name}</span>
                    </div>
                  </div> 

                  { (Object.keys(this.state.container).length > 0) ? (
                    <div className="card-body text-center text-lg-left">
                      <form onSubmit={this.handleFormSubmit}>
                        
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input 
                            name="name"
                            className="form-control"
                            value={this.state.container.name}
                            onChange={this.updateField}
                            placeholder="Container Name"
                          />
                          <small className="form-text text-muted">Required - The name of your Lab. This will be public and visible to other Labs.</small>
                        </div>

                      </form> 

                    </div>
                  ) : null }
                </div>

              </div>
            ) : (
              <div className="col-12 col-lg-7 text-center">
                <AlertCard 
                  title="Lab Membership Required"
                  message="You must be logged in and a member of this Lab to view this content."
                />
              </div>
            ) }  
            
            { (this.props.isLoggedIn && currentUserIsMember) ? (
              <div className="col-12 col-lg-5 text-center text-lg-left">
                {(Object.keys(this.state.lab).length > 0) ? (
                  <Grid 
                    demo={false}
                    selectLocations={false}
                    recordType="Container"
                    record={this.state.container}
                    containers={this.state.childContainers}
                  />
                ) : null }
              </div>
            ) : null }  
            
          </div> 
    
        ) : (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-5">
              <Loading/>
            </div>
          </div> 
        )}

      </div>
    );
  }
}

export default ContainerEdit;