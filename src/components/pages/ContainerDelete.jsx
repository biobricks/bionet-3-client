import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import { Link, Redirect } from 'react-router-dom';
import appConfig from '../../configuration.js';
import axios from 'axios';
import AlertCard from '../partials/AlertCard';
import Grid from '../partials/Grid';
import Loading from '../partials/Loading/Loading';
import FadeIn from 'react-fade-in';

class ContainerDelete extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      redirect: false,
      lab: {},
      container: {},
      containers: []
    };
    this.getContainer = this.getContainer.bind(this);
    this.deleteContainer = this.deleteContainer.bind(this);
  }

  getContainer() {
    axios.get(`${appConfig.apiBaseUrl}/containers/${this.props.match.params.containerId}`)
    .then(res => {   
      this.setState({
        loaded: true,
        lab: res.data.data.lab,
        container: res.data.data,
        containers: res.data.containers
      });        
    })
    .catch(error => {
      console.error(error);        
    });    
  }

  
  deleteContainer() {
    let config = {
      'headers': {  
        'authorization': `Bearer ${Auth.getToken()}`
      },
      'json': true
    };
    let containerId = this.props.match.params.containerId;
    axios.post(`${appConfig.apiBaseUrl}/containers/${containerId}/remove`, this.state.container, config)
    .then(res => {     
      //console.log(res.data.data);
      this.props.setAlert("success", `${this.state.container.name} was successfully deleted.`);
      this.setState({
        redirect: true
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  componentDidMount() {
    this.getContainer();
  }  

  render() { 
    let users = this.state.lab.users || [];
    let currentUserIsMember = false;
    const isLoaded = this.state.loaded;

    for(let i = 0; i < users.length; i++) {
      let userId = users[i]._id || users[i] || null;
      if (userId === this.props.currentUser._id) {
        currentUserIsMember = true;
      }
    }

    if (this.state.redirect){
      return (
        <Redirect to={this.state.container.parent === null ? `/labs/${this.state.container.lab._id}` : `/containers/${this.state.container.parent._id}`}/>
      );
    }

    return (
      <div className="container-fluid pb-3">
        {(isLoaded) ? (
          <FadeIn>
          <div className="row">  
            { (this.props.isLoggedIn && currentUserIsMember) ? (
              <div className="col-12 col-lg-7">
                <div className="card rounded-0 mt-3">
                  <div className="card-header bg-dark text-light rounded-0">
                    <div className="card-title mb-0 text-center text-lg-left">
                      <span><i className="mdi mdi-xl mdi-teach" /> Delete {this.state.container.name}</span>
                    </div>
                  </div>
                  <div className="card-body text-center text-lg-left">
                    <p className="card-text">
                      <strong>Warning!</strong> This cannot be undone. Are you absolutely sure you want to <strong>Delete {this.state.container.name}</strong>?
                    </p>
                    <div className="btn-group rounded-0">
                      <Link 
                        to={`/containers/${this.props.match.params.containerId}`}
                        className="btn btn-secondary rounded-0"
                      >Cancel</Link>
                      <button 
                        className="btn btn-danger rounded-0"
                        onClick={this.deleteContainer}
                      >Delete {this.state.container.name}!</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-12 col-lg-7 text-center">
                <AlertCard 
                  title="Lab Membership Required"
                  message="You must be logged in and a member of this lab to view this content."
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
                    containers={this.state.containers}
                  />
                ) : null }
              </div>
            ) : null }  
            
          </div>
          </FadeIn>
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

export default ContainerDelete;