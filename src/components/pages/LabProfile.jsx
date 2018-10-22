import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import { Link } from 'react-router-dom';
import appConfig from '../../configuration.js';
import axios from 'axios';
import shortid from 'shortid';
import AlertCard from '../partials/AlertCard';
import Grid from '../partials/Grid';

class LabProfile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      lab: {},
      containers: []
    };
    this.getLab = this.getLab.bind(this);
    this.onRequestLabMembership = this.onRequestLabMembership.bind(this);
    this.onCancelRequestLabMembership = this.onCancelRequestLabMembership.bind(this);
    this.onAcceptRequestLabMembership = this.onAcceptRequestLabMembership.bind(this);
    this.onDenyRequestLabMembership = this.onDenyRequestLabMembership.bind(this);
    this.updateLab = this.updateLab.bind(this);
  }

  getLab() {
    axios.get(`${appConfig.apiBaseUrl}/labs/${this.props.match.params.labId}`)
    .then(res => {
      //console.log("response", res.data);
      this.setState({
        lab: res.data.data,
        containers: res.data.children
      });        
    })
    .catch(error => {
      console.error(error);        
    });    
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

  onAcceptRequestLabMembership(e) {
    let acceptedRequestId = e.target.getAttribute('userid');
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    users.push(acceptedRequestId);
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      if (acceptedRequestId !== request._id){
        joinRequests.push(request._id);
      }
    };
    lab.users = users;
    lab.joinRequests = joinRequests;
    this.updateLab(lab);
  }

  onDenyRequestLabMembership(e) {
    let deniedRequestId = e.target.getAttribute('userid');
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      if (deniedRequestId !== request._id){
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
    let labId = this.props.match.params.labId;
    axios.post(`${appConfig.apiBaseUrl}/labs/${labId}/membership`, lab, config)
    .then(res => {     
      //console.log(res.data.data);
      this.getLab();
    })
    .catch(error => {
      console.error(error);
    });
  }

  componentDidMount() {
    this.getLab();
    console.log(this.props.match);
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
    const members = users.map((user, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action"
          to={`/users/${user._id}`}
        >
          {user.username}
        </Link>
      )
    });

    const membershipRequests = joinRequests.map((user, index) => {
      return (
        <div 
          key={shortid.generate()}
          className="card-body"
        >
          <p className="card-text">{user.username} is requesting to join {this.state.lab.name}.</p>
          <div className="btn-group">
            <button          
              className="btn btn-success"
              userid={user._id}
              onClick={this.onAcceptRequestLabMembership}
            >
              Accept
            </button>
            <button          
              className="btn btn-danger"
              userid={user._id}
              onClick={this.onDenyRequestLabMembership}
            >
              Deny
            </button>
          </div>  
        </div>
      )
    });

    let containers = this.state.containers || [];
    const childContainers = containers.map((container, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action"
          to={`/containers/${container._id}`}
        >
          {container.name}
        </Link>
      )
    }); 

    return (
      <div className="container-fluid">
        <div className="row">  
          { (this.props.isLoggedIn) ? (
            <div className="col-12 col-md-7">

              <div className="card rounded-0 mt-3">
                <div className="card-header bg-dark text-light rounded-0">
                  <div className="card-title mb-0">
                    <i className="mdi mdi-xl mdi-teach" />
                    <span>{this.state.lab.name}</span>
                      <div className="btn-group border-0 float-right" role="group">
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
                                to={`/labs/${this.props.match.params.labId}/add/container`}
                                className="dropdown-item"
                              >
                                <i className="mdi mdi-grid mr-2"/>
                                Container
                              </Link>
                              <Link 
                                to={`/labs/${this.props.match.params.labId}/add/physical`}
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
                                to={`/labs/${this.props.match.params.labId}/edit`}
                                className="dropdown-item"
                              >
                                <i className="mdi mdi-pencil mr-2"/>
                                Edit
                              </Link>
                              <Link 
                                to={`/labs/${this.props.match.params.labId}/remove`}
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
                <div className="card-body">
                  <p className="card-text">
                    {this.state.lab.description}
                  </p>
                </div>
              </div>
              
              {(childContainers.length > 0) ? (
                <div className="card rounded-0 mt-3">
                  <div className="card-header bg-dark text-light rounded-0">
                    <h4 className="card-title mb-0">
                      <i className="mdi mdi-teach mr-2" />
                      Containers
                    </h4>                      
                  </div>
                  <ul className="list-group list-group-flush">
                    {childContainers}
                  </ul>                  
                </div>
              ) : null }

              {(members.length > 0) ? (
                <div className="card rounded-0 mt-3">
                  <div className="card-header bg-dark text-light rounded-0">
                    <h5 className="card-title mb-0">
                      <i className="mdi mdi-account-multiple mr-2" />
                      Members
                    </h5>                      
                  </div>
                  <ul className="list-group list-group-flush">
                    {members}
                  </ul>                  
                </div>
              ) : null }

              {(membershipRequests.length > 0) ? (
                <div className="card rounded-0 mt-3">
                  <div className="card-header bg-dark text-light rounded-0">
                    <h5 className="card-title mb-0">
                      <i className="mdi mdi-account-multiple mr-2" />
                      Incoming Member Requests
                    </h5>                      
                  </div>
                  <ul className="list-group list-group-flush">
                    {membershipRequests}
                  </ul>                  
                </div>
              ) : null }

            </div>
          ) : (
            <div className="col-12 col-md-7">
              <AlertCard 
                title="Login Required"
                message="You must be logged in to view this content."
              />
            </div>
          ) }  
          

          <div className="col-12 col-md-5">
            {(Object.keys(this.state.lab).length > 0) ? (
              <Grid 
                demo={false}
                selectLocations={true}
                recordType="Lab"
                record={this.state.lab}
              />
            ) : null }
          </div>
          
        </div>
      </div>
    );
  }
}

export default LabProfile;