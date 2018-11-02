import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import Api from '../../../../modules/Api';
import './LabProfile.css';

class LabProfile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      lab: props.itemSelected || {}
    };
    this.updateLab = this.updateLab.bind(this);
    this.onRequestLabMembership = this.onRequestLabMembership.bind(this);
    this.onCancelRequestLabMembership = this.onCancelRequestLabMembership.bind(this);
    this.onAcceptRequestLabMembership = this.onAcceptRequestLabMembership.bind(this);
    this.onDenyRequestLabMembership = this.onDenyRequestLabMembership.bind(this);
    this.onRevokeLabMembership = this.onRevokeLabMembership.bind(this);
  }

  async updateLab(lab) {
    console.log('updateLab', lab)
    let postLabUpdate =  await Api.updateLab(lab);
    if (postLabUpdate.success) {
      return postLabUpdate.result;
    } else {
      this.props.setAlert('error', `${postLabUpdate.message}: ${postLabUpdate.error.code} - ${postLabUpdate.error.message}`);
      return [];
    }
  }

  onRequestLabMembership(e) {
    let lab = this.state.lab;
    console.log('onRequestLabMembershipStart', lab);
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
    this.updateLab(lab)
    .then((updatedLab) => {
      console.log(updatedLab);
      this.setState({ lab: updatedLab });
      this.props.refresh();
    });;
    
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
    this.updateLab(lab)
    .then((lab) => {
      console.log(lab);
      this.setState({ lab });
      this.props.refresh();
    });;
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
    this.updateLab(lab)
    .then((updatedLab) => {
      console.log(updatedLab);
      this.setState({ lab: updatedLab });
    });;
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
    this.updateLab(lab)
    .then((updatedLab) => {
      console.log(updatedLab);
      this.setState({ lab: updatedLab });
    });;
  }

  onRevokeLabMembership(e) {
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      if (user._id !== this.props.currentUser._id){
        users.push(user._id);
      }  
    };
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      joinRequests.push(request._id);
    };
    lab.users = users;
    lab.joinRequests = joinRequests;
    this.updateLab(lab)
    .then((updatedLab) => {
      console.log(updatedLab);
      this.setState({ lab: updatedLab });
    });;   
  }

  componentDidMount() {
    this.setState({
      lab: this.props.itemSelected
    });
  }

  render() {
    const lab = this.state.lab;
    let currentUserIsMember = false;
    let currentUserPendingApproval = false;
    if (this.props.isLoggedIn) {
      for(let i = 0; i < this.props.currentUser.labs.length; i++){
        let userLab = this.props.currentUser.labs[i];
        if (userLab._id === lab._id){
          currentUserIsMember = true;
        }
      }
      for(let i = 0; i < lab.joinRequests.length; i++) {
          let requesterId = lab.joinRequests[i]._id;
        if (requesterId === this.props.currentUser._id) {
          currentUserPendingApproval = true;
        }
      }      
    }

    const membershipRequests = lab.joinRequests.map((user, index) => {
      return (
        <div 
          key={shortid.generate()}
          className="card-body"
        >
          <p className="card-text">{user.username} is requesting to join {this.state.lab.name}.</p>
          {currentUserIsMember ? (
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
          ) : null }   
        </div>
      )
    });

    return (
      <div className="LabProfile">
        <div className="card mt-3 rounded-0">
          <div className="card-header rounded-0 bg-info text-light">
            <div className="card-title mb-0 text-capitalize">
              <span>
                <i className="mdi mdi-teach mr-2"/>
                {this.props.itemSelected.name}
              </span>  
              <div id="heading-toolbar" className="btn-group" role="group">
                {(currentUserIsMember) ? (
                  <div className="btn-group" role="group">                           
                    <button 
                      id="add-button" 
                      type="button" 
                      className="btn btn-sm btn-success dropdown-toggle rounded-0"
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
                        to={`/actions/${lab._id}/add/container`}
                        className="dropdown-item"
                      >
                        <i className="mdi mdi-grid mr-2"/>
                        Container
                      </Link>
                      <Link 
                        to={`/labs/${lab._id}/add/physical`}
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
                        className="btn btn-sm btn-primary dropdown-toggle rounded-0"
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
                          to={`/labs/${lab._id}/edit`}
                          className="dropdown-item"
                        >
                          <i className="mdi mdi-pencil mr-2"/>
                          Edit
                        </Link>
                        <Link 
                          to={`/labs/${lab._id}/remove`}
                          className="dropdown-item"
                        >
                          <i className="mdi mdi-delete mr-2"/>
                          Delete
                        </Link>
                        <button 
                          className="dropdown-item bg-danger text-light"
                          onClick={this.onRevokeLabMembership}
                        >
                          <i className="mdi mdi-account-minus mr-2"/>
                          Leave Lab                              
                        </button>
                      </div>

                    </div> 
                  ) : null }
                  {(this.props.isLoggedIn && !currentUserIsMember && !currentUserPendingApproval) ? (
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
          {(currentUserIsMember) ? (
            <div>
              {membershipRequests}
            </div>
          ) : null }
          <div className="card-body">
            <p className="card-text">
              {lab.description}
            </p>
            {(currentUserIsMember) ? (
              <p className="card-text">
                <i className="mdi mdi-account-multiple mr-2"/>Members: <del>{lab.users.length -1}</del> <span className="text-success">+ 1 </span>
                <i className="mdi mdi-account mr-2"/>{this.props.currentUser.username}
              </p>
            ) : (
              <p className="card-text">
                <i className="mdi mdi-account-multiple mr-2"/>Members: {lab.users.length}
              </p>
            )}

          </div>
        </div>    
      </div>
    );
  }
}

export default LabProfile;  