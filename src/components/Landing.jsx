import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LabsJoined from './LabsJoined';
import LabsPending from './LabsPending';
import LabsToJoin from './LabsToJoin';
import Search from './Search';

class Landing extends Component {
  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const welcomeMessage = isLoggedIn ? `Welcome Back To Bionet ${currentUser.username}` : `Bionet`;
    const currentUserLabs = this.props.currentUserLabs;
    return (
      <div className="Landing">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-lg-7">

              <div className="card mt-3">
                <div className="card-header bg-dark text-light">
                  <h4 className="card-title mb-0">{welcomeMessage}</h4>
                </div>
                {isLoggedIn ? (
                  <>
                    <div className="card-body">
                      <img 
                        src={currentUser.gravatarUrl} 
                        className="user-img rounded d-block float-left" 
                        alt={`${currentUser.username}`}
                      />
                      <div className="d-block float-left ml-3">
                        <div className="card-text">
                          You currently belong to {currentUserLabs.length} {currentUserLabs.length === 1 ? "Lab" : "Labs"}.
                        </div>  
                      </div>
                    </div>
                    <LabsJoined {...this.props} />
                    <LabsPending {...this.props} />
                    <LabsToJoin {...this.props} />
                  </>
                ) : (
                  <div className="card-body">
                    <h5 className="card-title mb-2">
                      <strong>Open Source Biological Inventory Management</strong>
                    </h5>
                    <p className="card-text">
                      Welcome to Bionet. Keep track of your stuff, find what you need, and share as you like. The Bionet supports searching for biological material across multiple labs — all your inventory information is controlled locally by you. You decide if others can see what you wish to share. All Bionet software and associated materials are open source and free to use.
                    </p>
                    <div className="btn-group" role="group" aria-label="Login Or Sign Up">
                      <Link to="/login" className="btn btn-success">Login</Link>
                      <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                    </div>
                  </div>
                )}  
              </div>  
            </div>

            <div className="col-12 col-lg-5">
              <Search {...this.props}/>
            </div>

          </div>
        </div>      
      </div>
    );
  }
}

export default Landing;
