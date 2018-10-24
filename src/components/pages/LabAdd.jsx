import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import { Link } from 'react-router-dom';
import appConfig from '../../configuration.js';
import axios from 'axios';
import shortid from 'shortid';
import AlertCard from '../partials/AlertCard';
import Grid from '../partials/Grid';
import ContainerNewForm from '../partials/ContainerNewForm';
import Loading from '../partials/Loading/Loading';

class LabAdd extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      newItemLocations: [],
      lab: {},
      containers: [],
      loaded: true
    };
    this.getLab = this.getLab.bind(this);
    this.updateLab = this.updateLab.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
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

  addLocation(newLocationArray) {
    console.log('add location called');
    let locations = this.state.newItemLocations;
    let locationExists = false;
    for(let i = 0; i < locations.length; i++){
      let locationArray = locations[i];
      if (locationArray[0] === newLocationArray[0] && locationArray[1] === newLocationArray[1]) {
        locationExists = true;
      }
    }
    if (!locationExists) {
      locations.push(newLocationArray);
    }
    this.setState({
      newItemLocations: locations
    });
  }

  removeLocation(locationArrayToRemove) {
    //console.log('remove location called', locationArrayToRemove);
    let locations = this.state.newItemLocations;
    //console.log('Locations', locations);
    let updatedLocations = [];
    for(let i = 0; i < locations.length; i++){
      let locationArray = locations[i];
      let firstIndexMatches = locationArray[0] === locationArrayToRemove[0];
      let secondIndexMatches = locationArray[1] === locationArrayToRemove[1];
      let isMatch = firstIndexMatches && secondIndexMatches;
      if (!isMatch) {
        updatedLocations.push(locationArray);
      }
    }
    //console.log('Update Locations', updatedLocations);
    this.setState({
      newItemLocations: updatedLocations
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
  }  

  render() { 
    let users = this.state.lab.users || [];
    let currentUserIsMember = false;
    let itemType = this.props.match.params.itemType || "container";
    const isLoaded = this.state.loaded;
    for(let i = 0; i < users.length; i++) {
      let userId = users[i]._id || null;
      if (userId === this.props.currentUser._id) {
        currentUserIsMember = true;
      }
    }

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

        {(isLoaded) ? (

        <div className="row">  
          { (this.props.isLoggedIn && currentUserIsMember) ? (
            <div className="col-12 col-md-7">

              <div className="card rounded-0 mt-3">
                <div className="card-header bg-dark text-light rounded-0">
                  {(itemType === 'container') ? (
                    <div className="card-title mb-0">
                      <i className="mdi mdi-xl mdi-grid" />
                      <span>Add Container</span>
                    </div>
                  ) : (
                    <div className="card-title mb-0">
                      <i className="mdi mdi-xl mdi-flask" />
                      <span>Add Physical</span>
                    </div>
                  )}
                </div>
                {(this.state.newItemLocations.length === 0) ? (
                  <div className="card-body">
                    <p className="card-text">
                      Select one or more cells for the <span className="text-capitalize">{itemType}</span> to occupy within {this.state.lab.name}.
                    </p>       
                  </div>
                ) : (
                  <div className="card-body">
                    {(itemType === 'container') ? (
                      <ContainerNewForm 
                        {...this.props} 
                        {...this.state}
                      />
                    ) : null } 
                    {(itemType === 'physical') ? (<div>Physical Form</div>) : null }      
                  </div>
                )}
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

            </div>
          ) : (
            <div className="col-12 col-md-7 ml-auto mr-auto text-center">
              <AlertCard 
                title="Lab Membership Required"
                message="You must be logged in and a member of this lab to view this content."
              />
            </div>
          ) }  
          

          <div className="col-12 col-md-5">
            {(Object.keys(this.state.lab).length > 0) ? (
              <Grid 
                demo={false}
                selectLocations={true}
                newItemLocations={this.state.newItemLocations}
                addLocation={this.addLocation}
                removeLocation={this.removeLocation}
                recordType="Lab"
                record={this.state.lab}
                containers={this.state.containers}
              />
            ) : null }
          </div>
          
        </div>

        ) : (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-5">
              <Loading />
            </div>
          </div> 
        )}
      </div>
    );
  }
}

export default LabAdd;