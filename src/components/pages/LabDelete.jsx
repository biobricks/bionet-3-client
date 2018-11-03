import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import { Link, Redirect } from 'react-router-dom';
import appConfig from '../../configuration.js';
import axios from 'axios';
import Grid from '../partials/Grid';
import Loading from '../partials/Loading/Loading';
import FadeIn from 'react-fade-in';

import './LabProfile.css';

class LabDelete extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      redirect: false,
      lab: {},
      containers: []
    };
    this.getLab = this.getLab.bind(this);
    this.deleteLab = this.deleteLab.bind(this);
  }

  getLab() {
    axios.get(`${appConfig.apiBaseUrl}/labs/${this.props.match.params.labId}`)
    .then(res => {
      //console.log("response", res.data);
      let allChildContainers = res.data.children;
      let containers = [];
      for(let i = 0; i < allChildContainers.length; i++){
        let childContainer = allChildContainers[i];
        if (childContainer.parent === null) {
          containers.push(childContainer);
        }
      }
      this.setState({
        loaded: true,
        lab: res.data.data,
        containers
      });        
    })
    .catch(error => {
      console.error(error);        
    });    
  }

  
  deleteLab() {
    let config = {
      'headers': {  
        'authorization': `Bearer ${Auth.getToken()}`
      },
      'json': true
    };
    let labId = this.props.match.params.labId;
    axios.post(`${appConfig.apiBaseUrl}/labs/${labId}/remove`, this.state.lab, config)
    .then(res => {     
      //console.log(res.data.data);
      this.props.setAlert("success", `${this.state.lab.name} was successfully deleted.`);
      this.setState({
        redirect: true
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  componentDidMount() {
    this.getLab();
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
        <Redirect to={`/`}/>
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
                        <span><i className="mdi mdi-xl mdi-teach" /> Delete {this.state.lab.name}</span>
                      </div>
                    </div>
                    <div className="card-body text-center text-lg-left">
                      <p className="card-text">
                        <strong>Warning!</strong> This cannot be undone. Are you absolutely sure you want to <strong>Delete {this.state.lab.name}</strong>?
                      </p>
                      <div className="btn-group rounded-0">
                        <Link 
                          to={`/labs/${this.props.match.params.labId}`}
                          className="btn btn-secondary rounded-0"
                        >Cancel</Link>
                        <button 
                          className="btn btn-danger rounded-0"
                          onClick={this.deleteLab}
                        >Delete {this.state.lab.name}!</button>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                null
              ) }  
              
              { (this.props.isLoggedIn && currentUserIsMember) ? (
                <div className="col-12 col-lg-5 text-center text-lg-left">
                  {(Object.keys(this.state.lab).length > 0) ? (
                    <Grid 
                      demo={false}
                      selectLocations={false}
                      recordType="Lab"
                      record={this.state.lab}
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

export default LabDelete;