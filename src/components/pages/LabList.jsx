import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import appConfig from '../../configuration.js';
import shortid from 'shortid';

class LabList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      labs: [],
      labsJoined: [],
      labsNotJoined: [],
      labsRequestPending: []
    };
    this.getAllLabs = this.getAllLabs.bind(this);
  }

  getAllLabs() {
    axios.get(`${appConfig.apiBaseUrl}/labs`)
    .then(res => {
      let labArray = res.data.data;
      let labsJoined = [];
      let labsNotJoined = [];
      let labsRequestPending = [];
      let labsAll = [];
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
        let userRequestPending = false;
        for(let k = 0; k < lab.joinRequests.length; k++){
          let requesterId = lab.joinRequests[k]._id;
          if (requesterId === userId){
            userRequestPending = true;
          }
        }
        if (!userExistsInLab && !userRequestPending) {
          labsNotJoined.push(lab);
        } else if (!userExistsInLab && userRequestPending) {
          labsRequestPending.push(lab);
        } else {
          labsJoined.push(lab)
        }
        labsAll.push(lab);         
      }
      this.setState({
        labs: labsAll,
        labsJoined,
        labsNotJoined,
        labsRequestPending
      });        
    })
    .catch(error => {
      console.error(error);        
    });    
  }

  componentDidMount() {
    this.getAllLabs();
  }

  render() {

    const labsJoined = this.state.labsJoined.map((lab, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action bg-info text-light rounded-0"
          to={`/labs/${lab._id}`}
        >
          {lab.name}
        </Link>
      )
    });
    
    const labsNotJoined = this.state.labsNotJoined.map((lab, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action"
          to={`/labs/${lab._id}`}
        >
          {lab.name}
        </Link>
      )
    });    

    const labsRequestPending = this.state.labsRequestPending.map((lab, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action"
          to={`/labs/${lab._id}`}
        >
          {lab.name}
        </Link>
      )
    }); 

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto text-center">
            {(this.props.isLoggedIn) ? (
              <div className="card mt-3 rounded-0">
                <div className="card-header bg-dark text-light rounded-0">
                  <h4 className="card-title mb-0 text-capitalize">Labs Joined</h4>
                </div>
                {(this.state.labsJoined.length === 0) ? (
                  <div className="card-body">
                    <p className="card-text">
                      You have not joined any Labs.
                    </p>
                  </div>                  
                ) : null }
                {(this.state.labsJoined.length > 0) ? (
                  <ul className="list-group list-group-flush">
                    {labsJoined}
                  </ul>
                ) : null }

              </div>
            ) : null }

            {(this.props.isLoggedIn) ? (
              <div className="card mt-3 rounded-0">
                <div className="card-header bg-dark text-light rounded-0">
                  <h4 className="card-title mb-0 text-capitalize">Labs To Join</h4>
                </div>
                {(this.state.labsNotJoined.length === 0) ? (
                  <div className="card-body">
                    <p className="card-text">
                      There are currently no Labs for you to Join.
                    </p>
                  </div>
                ) : null }
                {(this.state.labsNotJoined.length > 0) ? (
                  <ul className="list-group list-group-flush">
                    {labsNotJoined}
                  </ul>
                ) : null }
              </div>
            ) : null }

            {(this.props.isLoggedIn) ? (
              <div className="card mt-3 rounded-0">
                <div className="card-header bg-dark text-light rounded-0">
                  <h4 className="card-title mb-0 text-capitalize">Membership Requests Pending</h4>
                </div>
                {(this.state.labsRequestPending.length === 0) ? (
                  <div className="card-body">
                    <p className="card-text">
                      You currently have no pending membership requests to join other Labs.
                    </p>
                  </div>
                ) : null }
                {(this.state.labsRequestPending.length > 0) ? (
                  <ul className="list-group list-group-flush">
                    {labsRequestPending}
                  </ul>
                ) : null }
              </div>
            ) : null }

          </div>
        </div>
      </div>
    );
  }
}

export default LabList;
