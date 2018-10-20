import React, { Component } from 'react';
import axios from "axios";
import appConfig from '../../configuration.js';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      labs: [],
      labsJoined: []
    };
    this.getAllLabs = this.getAllLabs.bind(this);
  }  

  getAllLabs() {
    axios.get(`${appConfig.apiBaseUrl}/labs`)
    .then(res => {
      console.log("response", res.data);
      let labArray = res.data.data;
      let labsJoined = [];
      let labs = [];
      for(let i = 0; i < labArray.length; i++){
        let lab = labArray[i];
        let userId = this.props.currentUser._id;
        let userExistsInLab = false;
        for(let j = 0; j < lab.users.length; j++){
          let labUserId = lab.users[j]._id;
          if (labUserId === userId){
            userExistsInLab = true;
          }
        }
        if (!userExistsInLab) {
          labs.push(lab);
        } else {
          labsJoined.push(lab)
        }
      }
      this.setState({
        labs,
        labsJoined
      });        
    })
    .catch(error => {
      console.error(error);        
    });    
  }

  getAllUsers() {
    axios.get(`${appConfig.apiBaseUrl}/users`)
    .then(res => {
      this.setState({
        users: res.data.data
      });        
    })
    .catch(error => {
      console.error(error);        
    });    
  }

  componentDidMount() {
    this.getAllLabs();
    this.getAllUsers();
  }

  render() {
    
    return (
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto text-center">
            <div className="card">
              <div className="card-header bg-info text-light">
                <h4 className="card-title mb-0">BioNet</h4>
              </div>
              <div className="card-body">

                {(this.props.isLoggedIn) ? (
                  <p className="card-text">
                    Welcome back to the BioNet <strong>{this.props.currentUser.username}</strong>!
                  </p>                  
                ) : (
                  <p className="card-text">
                    Welcome to the BioNet!
                  </p>
                )}
                <p className="card-text">
                  There are currently {this.state.users.length} Users at {this.state.labs.length} Labs listed.
                </p>
                {(this.props.isLoggedIn) ? (
                  <p className="card-text">
                    You currently belong to {this.state.labsJoined.length} Labs.
                  </p>                  
                ) : null }
              </div>
            </div>
          </div>
        </div>

      </div>
    );

  }
}

export default Landing;
