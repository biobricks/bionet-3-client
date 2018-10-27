import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import { Link, Redirect } from 'react-router-dom';
import appConfig from '../../configuration.js';
import axios from 'axios';
import AlertCard from '../partials/AlertCard';
import Grid from '../partials/Grid';
import Loading from '../partials/Loading/Loading';

import './LabProfile.css';

class LabEdit extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      redirect: false,
      lab: {},
      containers: []
    };
    this.getLab = this.getLab.bind(this);
    this.updateLab = this.updateLab.bind(this);
    this.updateField = this.updateField.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  getLab() {
    axios.get(`${appConfig.apiBaseUrl}/labs/${this.props.match.params.labId}`)
    .then(res => {
      console.log("response", res.data);
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

  
  updateLab(lab) {
    let config = {
      'headers': {  
        'authorization': `Bearer ${Auth.getToken()}`
      },
      'json': true
    };
    let labId = this.props.match.params.labId;
    axios.post(`${appConfig.apiBaseUrl}/labs/${labId}/edit`, lab, config)
    .then(res => {     
      //console.log(res.data.data);
      this.props.setAlert("success", `${this.state.lab.name} was successfully updated.`);
      this.setState({
        redirect: true
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  updateField(e) {
    const field = e.target.name;
    let lab = this.state.lab;
    if(field === 'rows' || field === 'columns') {
      lab[field] = Number(e.target.value);
    } else {
      lab[field] = e.target.value;
    }
    this.setState({
      lab
    });    
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let lab = this.state.lab;
    this.updateLab(lab);
  }

  componentDidMount() {
    this.getLab();
    //console.log(this.props.match);
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
        <Redirect to={`/labs/${this.props.match.params.labId}`}/>
      );
    }

    return (
      <div className="container-fluid pb-3">
        {(isLoaded) ? (
          <div className="row">  
            { (this.props.isLoggedIn && currentUserIsMember) ? (
              <div className="col-12 col-lg-7">

                <div className="card rounded-0 mt-3">
                  <div className="card-header bg-dark text-light rounded-0">
                    <div className="card-title mb-0 text-center text-lg-left">
                      <span><i className="mdi mdi-xl mdi-teach" /> Edit {this.state.lab.name}</span>
                    </div>
                  </div>
                  <div className="card-body text-center text-lg-left">
                    <p className="card-text">
                    
                      <form onSubmit={this.handleFormSubmit}>
                        
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input 
                            name="name"
                            className="form-control"
                            value={this.state.lab.name}
                            onChange={this.updateField}
                            placeholder="Lab Name"
                          />
                          <small className="form-text text-muted">Required - The name of your Lab. This will be public and visible to other Labs.</small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="name">Description</label>
                          <input 
                            name="description"
                            type="text"
                            className="form-control"
                            value={this.state.lab.description}
                            onChange={this.updateField}
                            placeholder="A short description of the Lab."
                          />
                          <small className="form-text text-muted">Optional - Share a bit more detail on your Lab. Visible to the public and other Labs.</small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="name">Columns</label>
                          <input 
                            name="columns"
                            type="number"
                            className="form-control"
                            value={this.state.lab.columns}
                            onChange={this.updateField}
                            min="1"
                            max="50"
                            step="1"
                          />
                          <small className="form-text text-muted">
                            Required - The number of columns in the grid representing your Lab area from a top-down view. Change to a value greater than 1.
                          </small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="name">Rows</label>
                          <input 
                            name="rows"
                            type="number"
                            className="form-control"
                            value={this.state.lab.rows}
                            onChange={this.updateField}
                            min="1"
                            max="50"
                            step="1"
                          />
                          <small className="form-text text-muted">Required - The number of rows in the grid representing your Lab area from a top-down view. Change to a value greater than 1.</small>
                        </div>

                        <div className="form-group text-center">
                          <div className="btn-group" role="group" aria-label="Basic example">
                            <Link to={`/labs/${this.props.match.params.labId}`} className="btn btn-secondary mt-3">Back</Link>
                            <button 
                              type="submit" 
                              className="btn btn-success mt-3"
                            >Save Changes</button>
                          </div>  
                        </div>   

                      </form>

                    </p>
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
                    recordType="Lab"
                    record={this.state.lab}
                    containers={this.state.containers}
                  />
                ) : null }
              </div>
            ) : null }  
            
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

export default LabEdit;