import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import appConfig from '../../configuration.js';
import AlertCard from '../partials/AlertCard';
import shortid from 'shortid';

class LabList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      labs: [],
      labsJoined: [],
      labsNotJoined: []
    };
    this.getAllLabs = this.getAllLabs.bind(this);
  }

  getAllLabs() {
    axios.get(`${appConfig.apiBaseUrl}/labs`)
    .then(res => {
      let labArray = res.data.data;
      let labsJoined = [];
      let labsNotJoined = [];
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
        if (!userExistsInLab) {
          labsAll.push(lab);
          labsNotJoined.push(lab);
        } else {
          labsAll.push(lab);
          labsJoined.push(lab)
        }
      }
      this.setState({
        labs: labsAll,
        labsJoined,
        labsNotJoined
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
          className="list-group-item list-group-item-action"
          to={`/labs/${lab._id}`}
        >
          {lab.name}
        </Link>
      )
    });
    
    // const labsNotJoined = this.state.labsNotJoined.map((lab, index) => {
    //   return (
    //     <Link 
    //       key={shortid.generate()}
    //       className="list-group-item list-group-item-action"
    //       to={`/labs/${lab._id}`}
    //     >
    //       {lab.name}
    //     </Link>
    //   )
    // });    

    return (
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto text-center">
            {(!this.props.isLoggedIn) ? (
              <div className="col-12 col-md-7">
                <AlertCard 
                  title="Login Required"
                  message="You must be logged in to view this content."
                />
              </div>   
            ) : null }
            {(this.props.isLoggedIn) ? (
              <div className="card">
                <div className="card-header bg-dark text-light">
                  <h4 className="card-title mb-0 text-capitalize">Labs Joined</h4>
                </div>
                {(this.state.labsJoined.length > 0) ? (
                  <ul className="list-group list-group-flush">
                    {labsJoined}
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
