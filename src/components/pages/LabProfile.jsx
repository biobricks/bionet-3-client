import React, { Component } from 'react';
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
      containers: [],
      form: {
        name: "",
        description: "",
        rows: 1, 
        columns: 1
      }
    };
    this.getLab = this.getLab.bind(this);
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

  componentDidMount() {
    this.getLab();
  }  

  render() { 
    let users = this.state.lab.users || [];
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

              <div className="card mt-3">
                <div className="card-header bg-dark text-light">
                  <h4 className="card-title mb-0">
                    <i className="mdi mdi-teach mr-2" />
                    {this.state.lab.name}
                    <small className="float-right btn-toolbar" role="toolbar">
                      <div className="btn-group" role="group">
                        <Link 
                          to={`/labs/${this.props.match.params.labId}/edit`}
                          type="button" 
                          className="btn btn-sm btn-primary"
                        >
                          <i className="mdi mdi-playlist-edit mr-1" />
                          Edit
                        </Link>
                        <div className="btn-group" role="group">
                          <button 
                            id="add-button" 
                            type="button" 
                            className="btn btn-sm btn-success dropdown-toggle"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="mdi mdi-plus-box mr-1" />
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
                        <button type="button" className="btn btn-sm btn-danger">
                          <i className="mdi mdi-minus-box mr-1" />
                          Remove
                        </button>
                      </div>  
                    </small>
                  </h4>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    {this.state.lab.description}
                  </p>
                </div>
              </div>
              
              {(childContainers.length > 0) ? (
                <div className="card mt-3">
                  <div className="card-header bg-dark text-light">
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
                <div className="card mt-3">
                  <div className="card-header bg-dark text-light">
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