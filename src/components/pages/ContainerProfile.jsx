import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import { Link } from 'react-router-dom';
import appConfig from '../../configuration.js';
import axios from 'axios';
import shortid from 'shortid';
import AlertCard from '../partials/AlertCard';
import Grid from '../partials/Grid';

import './LabProfile.css';

class ContainerProfile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      lab: {},
      container: {},
      childContainers: []
    };
    this.onRequestLabMembership = this.onRequestLabMembership.bind(this);
    this.onCancelRequestLabMembership = this.onCancelRequestLabMembership.bind(this);
    this.updateLab = this.updateLab.bind(this);
    this.getContainer = this.getContainer.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
  }

  onRequestLabMembership(e) {
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      joinRequests.push(request._id);
    };
    joinRequests.push(this.props.currentUser._id);
    lab.users = users;
    lab.joinRequests = joinRequests;
    //console.log(lab);
    this.updateLab(lab);
  }

  onCancelRequestLabMembership(e) {
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      if (this.props.currentUser._id !== request._id){
        joinRequests.push(request._id);
      }
    };
    lab.users = users;
    lab.joinRequests = joinRequests;
    this.updateLab(lab);
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
      console.log("response", res.data);
      let container = res.data.data;
      let childContainers = res.data.containers;
      axios.get(`${appConfig.apiBaseUrl}/labs/${container.lab._id}`)
      .then(response => {
        console.log("response 2", response.data);
        this.setState({
          lab: response.data.data,
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
      this.getContainer();
    })
    .catch(error => {
      console.error(error);
    });
  }

  componentDidMount() {
    this.getContainer();
    //console.log(this.props.match);
  }  

  render() { 
    let users = this.state.lab.users || [];
    let joinRequests = this.state.lab.joinRequests || [];
    let currentUserIsMember = false;
    let currentUserPendingApproval = false;
    for(let i = 0; i < users.length; i++) {
      let userId = users[i]._id || null;
      if (userId === this.props.currentUser._id) {
        currentUserIsMember = true;
      }
    }
    for(let i = 0; i < joinRequests.length; i++) {
      let requesterId = joinRequests[i]._id;
      if (requesterId === this.props.currentUser._id) {
        currentUserPendingApproval = true;
      }
    }

    const childContainers = this.state.childContainers || [];

    const containers = childContainers.map((childContainer, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action"
          to={`/containers/${childContainer._id}`}
        >
          {childContainer.name}
        </Link>
      )
    });

    return (
      <div className="container-fluid pb-3">
        <div className="row">  
          { (this.props.isLoggedIn) ? (
            <div className="col-12 col-lg-7">

              <div className="card rounded-0 mt-3">
                <div className="card-header bg-dark text-light rounded-0">
                  <div className="card-title mb-0 text-center text-lg-left">
                    
                    <span><i className="mdi mdi-xl mdi-grid" /> {this.state.container.name}</span>
                      <div id="heading-toolbar" className="btn-group" role="group">
                        {(currentUserIsMember) ? (
                          <div className="btn-group" role="group">                           

                            <button 
                              id="add-button" 
                              type="button" 
                              className="btn btn-success dropdown-toggle rounded-0"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <i className="mdi mdi-lg mdi-plus-box mr-1" />
                              Add&nbsp;
                            </button>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="add-button"
                            >
                              <Link 
                                to={`/containers/${this.props.match.params.containerId}/add/container`}
                                className="dropdown-item"
                              >
                                <i className="mdi mdi-grid mr-2"/>
                                Container
                              </Link>
                              <Link 
                                to={`/containers/${this.props.match.params.containerId}/add/physical`}
                                className="dropdown-item"
                              >
                                <i className="mdi mdi-flask mr-2"/>
                                Physical
                              </Link>
                            </div>
                          </div>
                        ) : null }
                        {(currentUserIsMember) ? (  
                          <div className="btn-group" role="group">  
                            <button 
                              id="settings-button" 
                              type="button" 
                              className="btn btn-primary dropdown-toggle rounded-0"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <i className="mdi mdi-lg mdi-settings-box mr-1" />
                              Settings&nbsp;
                            </button>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="settings-button"
                            >
                              <Link 
                                to={`/containers/${this.props.match.params.containerId}/edit`}
                                className="dropdown-item"
                              >
                                <i className="mdi mdi-pencil mr-2"/>
                                Edit
                              </Link>
                              <Link 
                                to={`/labs/${this.props.match.params.containerId}/remove`}
                                className="dropdown-item"
                              >
                                <i className="mdi mdi-delete mr-2"/>
                                Delete
                              </Link>
                            </div>

                          </div> 
                        ) : null }
                        {(!currentUserIsMember && !currentUserPendingApproval) ? (
                          <div className="btn-group" role="group">
                            <button  
                              className="btn btn-success rounded-0"
                              onClick={this.onRequestLabMembership}
                            >
                              <i className="mdi mdi-account-plus mr-1" />
                              Request Membership
                            </button>

                          </div> 
                        ) : null }
                        {(currentUserPendingApproval) ? (
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-warning rounded-0 disabled"
                            >
                              <i className="mdi mdi-account-plus mr-1" />
                              Membership Pending Approval
                            </button>                             
                            <button 
                              className="btn btn-sm btn-secondary rounded-0"
                              onClick={this.onCancelRequestLabMembership}
                            >
                              <i className="mdi mdi-account-plus mr-1" />
                              Cancel Request
                            </button>
                          </div> 
                        ) : null }
                      </div>  
        
                  </div>
                </div>
                { (Object.keys(this.state.container).length > 0) ? (
                  <div className="card-body text-center text-lg-left">
                    {(this.state.container.description.length > 0) ? (
                      <p className="card-text">
                      {this.state.container.description}
                    </p>
                    ) : (
                      <p className="card-text">
                        No description provided.
                      </p>
                    )}
                  </div>
                ) : null }
              </div>
              
              {(containers.length > 0) ? (
                <div className="card rounded-0 mt-3 text-center text-lg-left">
                  <div className="card-header bg-dark text-light rounded-0">
                    <h4 className="card-title mb-0">
                      <i className="mdi mdi-grid mr-2" />
                      Containers
                    </h4>                      
                  </div>
                  <ul className="list-group list-group-flush">
                    {containers}
                  </ul>                  
                </div>
              ) : null }

            </div>
          ) : (
            <div className="col-12 col-lg-7 text-center">
              <AlertCard 
                title="Login Required"
                message="You must be logged in to view this content."
              />
            </div>
          ) }  
          
          { (this.props.isLoggedIn) ? (
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
      </div>
    );
  }
}

export default ContainerProfile;