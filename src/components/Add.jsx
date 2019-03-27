import React from 'react';
import Grid from './Grid/Grid';
import  { Redirect } from 'react-router-dom';
import ContainerNewForm from './Container/ContainerNewForm';
import PhysicalNewForm from './Physical/PhysicalNewForm';
import Api from '../modules/Api';
import { getChildren, getLocations } from './Lab/LabHelpers';

class Add extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.getDataSync = this.getDataSync.bind(this);
    this.updateLab = this.updateLab.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
    this.updateFormData = this.updateFormData.bind(this);
  }

  async getData() {
    try {
      const labId = this.props.match.params.labId;
      const containerId = this.props.match.params.containerId;
      if (labId) {
        const labRes = await Api.get(`labs/${labId}`);
        const lab = labRes.data;      
        const { containers, physicals } = getChildren(lab);
        const locations = getLocations(lab, containers, physicals);      
        return { lab, containers, physicals, locations };
      } 
      if (containerId) {
        const containerRes = await Api.get(`containers/${containerId}`);
        const container = containerRes.data;      
        const lab = container.lab;
        const { containers, physicals } = getChildren(container);
        const locations = getLocations(container, containers, physicals);      
        return { lab, container, containers, physicals, locations }; 
      }
    } catch (error) {
      throw error;
    }
  }

  getDataSync() {
    this.getData()
    .then(res => {
      const labId = this.props.match.params.labId;
      if (labId) {
        const { lab, containers, physicals, locations } = res;
        this.setState({ lab, containers, physicals, locations });
      } else {
        const { lab, container, containers, physicals, locations } = res;
        this.setState({ lab, containers, container, physicals, locations });        
      }  
    })
    .catch(error => {
      throw error;
    });
  }

  updateLab(lab) {
    Api.post(`labs/${lab._id}/edit`, lab)
    .then((res) => {
      //console.log(res);
      this.getDataSync();
      this.props.refresh(this.props.currentUser);
    });
  }

  updateContainer(formData) {
    console.log('updating container', formData);
    Api.post('containers/new', formData)
    .then((res) => {
      this.props.debugging && console.log('post new container res', res);
      this.removeLocation(this.state.newItemLocations[0]);
      this.setState({
        redirect: true,
        redirectTo: `/labs/${this.props.match.params.labId}`
      });
      //this.props.refresh(this.props.currentUser);
    });
  }

  addLocation(newLocationArray) {
    let locations = this.state.newItemLocations;
    if (locations.length === 0) {
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

  updateFormData(formType, formData) {
    if (formType === 'Container') {
      this.setState({
        containerForm: formData
      });
    } else if (formType === 'Physical') {
      this.setState({
        physicalForm: formData
      });
    }
  }

  componentDidMount() {
    this.getDataSync();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const lab = this.state.lab;
    const container = this.state.container;
    const itemType = this.props.match.params.itemType || "container";
    const itemIconClasses = itemType === "container" ? "mdi mdi-grid mr-2" : "mdi mdi-flask mr-2";
    const labId = this.props.match.params.labId;
    const recordIsLab = labId ? true : false;

    let userIsMember = false;
    if (isLoggedIn && lab) {
      for (let i = 0; i < currentUser.labs.length; i++) {
        let userLab = currentUser.labs[i];
        if (userLab._id === lab._id) { userIsMember = true; }
      }
    }

    if (this.state.redirect === true) {
      return ( <Redirect to={this.state.redirectTo}/> )
    }

    return (
      <div className="Add container-fluid">
        <div className="row">
          {(isLoggedIn && userIsMember) ? (
            <>
              <div className="col-12 col-lg-7">
                <div className="card rounded-0 mt-3">
                  <div className="card-header rounded-0 bg-dark-green text-light">
                    <h4 className="card-title mb-0 text-capitalize">
                      <i className={itemIconClasses}/>Add {itemType}
                    </h4>
                  </div>
                  {(this.state.newItemLocations.length === 0) ? (
                    <div className="card-body">
                      {(itemType === 'container') ? (
                        <p className="card-text">
                          Select which cell the Container will occupy within {recordIsLab ? lab.name : container.name}.
                        </p>
                      ) : (
                        <p className="card-text">
                          Select which cell the Physical Sample will occupy within {recordIsLab ? lab.name : container.name}.
                        </p>
                      )}    
                    </div>
                  ) : (
                    <div className="card-body">
                      {(itemType === 'container') ? (
                        <ContainerNewForm 
                          {...this.props} 
                          {...this.state}
                          parentType={recordIsLab ? "Lab" : "Container"}
                          parentRecord={recordIsLab ? lab : container}
                          formData={this.state.containerForm}
                          updateFormData={this.updateFormData}
                          removeLocation={this.removeLocation}
                          updateContainer={this.updateContainer}
                        />
                      ) : null } 
                      {(itemType === 'physical') ? (
                        <PhysicalNewForm 
                          {...this.props} 
                          {...this.state}
                          parentType={recordIsLab ? "Lab" : "Container"}
                          parentRecord={recordIsLab ? lab : container}
                          formData={this.state.physicalForm}
                          updateFormData={this.updateFormData}
                          removeLocation={this.removeLocation}
                        />
                      ) : null }     
                    </div>
                  )} 
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <Grid 
                  record={recordIsLab ? lab : container}
                  recordType={recordIsLab ? "Lab" : "Container"}
                  addFormActive={true}
                  addFormType={itemType}
                  addForm={itemType === 'container' ? this.state.containerForm : this.state.physicalForm}
                  containers={this.state.containers}
                  physicals={this.state.physicals}
                  locations={this.state.locations}
                  newItemLocations={this.state.newItemLocations}
                  addLocation={this.addLocation}
                  removeLocation={this.removeLocation}
                />
              </div>
            </>
          ) : null }  
        </div>
      </div>
    );
  }
}

export default Add;

const initialState = {
  redirect: false,
  redirectTo: "",
  lab: {},
  container: {},
  containers: [],
  physicals: [],
  locations: {
    empty: [],
    full: []
  },
  newItemLocations: [],
  containerForm: {
    createdBy: "",
    lab: "",
    parent: "",
    name: "",
    description: "",
    rows: 1,
    columns: 1,
    category: "General",
    bgColor: "#00D1FD",
    row: 1,
    rowSpan: 1,
    column: 1,
    columnSpan: 1        
  },
  physicalForm: {
    createdBy: "",
    lab: "",
    parent: "",
    name: "",
    description: "",
    rowSpan: 1,
    columnSpan: 1,
    category: "General",
    bgColor: "#00D1FD",
    row: 1,
    column: 1,
    provenance: "",
    genotype: "",
    sequence: ""      
  }
};