import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import axios from "axios";
import appConfig from '../../configuration.js';
import TreeGraph from '../partials/TreeGraph';
import Loading from '../partials/Loading/Loading';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      users: [],
      labs: [],
      labsJoined: [],
      labsNotJoined: [],
      labsRequestPending: []
    };
    this.getData = this.getData.bind(this);
  }  

  getData() {
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
      axios.get(`${appConfig.apiBaseUrl}/users`)
      .then(res => {
        this.setState({
          loaded: true,
          users: res.data.data,
          labs: labsAll,
          labsJoined,
          labsNotJoined,
          labsRequestPending
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

  componentDidMount() {
    this.getData();
  }

  render() {

    const isLoaded = this.state.loaded;

    const labs = this.state.labs || [];

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

    let treeDataArray = [];

    let treeData = {
      name: 'BioNet',
      children: []      
    };

    for(let labIndex = 0; labIndex < labs.length; labIndex++){
      let lab = labs[labIndex];
      let labNode = {
        name: lab.name,
        children: []
      };
      for(let labUserIndex = 0; labUserIndex < lab.users.length; labUserIndex++){
        let labUser = lab.users[labUserIndex];
        let labUserNode = {
          name: labUser.username
        };
        labNode.children.push(labUserNode);
      }
      treeData.children.push(labNode);
    }
    treeDataArray.push(treeData);
  

    return (
      <div className="container-fluid pb-3">
        {(isLoaded) ? (
        <div className="row">
          <div className="col-12 col-lg-7"> 
            <div className="card rounded-0 mt-3">
              <div className="card-header bg-dark text-light rounded-0">
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
                    You currently belong to {this.state.labsJoined.length} {this.state.labsJoined.length > 1 ? "Labs" : "Lab"}.
                  </p>
                ) : null }
              </div>
              <div className="card-body">
                <div style={{'border': '1px solid #ccc', 'height': '400px', 'width': '100%', 'overflow': 'hidden'}}>
                  
                  <TreeGraph 
                    data={treeDataArray}
                    height="400px"
                    width="100%"
                  />

                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5"> 
            {(this.props.isLoggedIn) ? (
              <div className="card mt-3 rounded-0">
                <div className="card-header bg-dark text-light rounded-0">
                  <h4 className="card-title mb-0 text-capitalize">Your Labs</h4>
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
                    <Link to="/labs/new" className="list-group-item list-group-item-action bg-success text-light rounded-0">+ Add New Lab</Link>
                  </ul>
                ) : (
                  <ul className="list-group list-group-flush">
                    <Link to="/labs/new" className="list-group-item list-group-item-action bg-success text-light rounded-0">+ Add New Lab</Link>
                  </ul>                  
                )}

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

export default Landing;
