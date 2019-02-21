import React from 'react';
import Grid from '../Grid/Grid';
import ContainerNewForm from '../Container/ContainerNewForm';
import PhysicalNewForm from '../Physical/PhysicalNewForm';
import Api from '../../modules/Api';

class LabAdd extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lab: {},
      containers: [],
      physicals: [],
      newItemLocations: []
    };
    this.updateLab = this.updateLab.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
  }

  getData() {
    let labId = this.props.match.params.labId;
    Api.get(`labs/${labId}`)
    .then((res) => {
      console.log('LabAdd.getData.res', res);
      this.setState({
        lab: res.data
      });
    });
  }

  updateLab(lab) {
    Api.post(`labs/${lab._id}/edit`, lab)
    .then((res) => {
      console.log(res);
      this.getData();
      this.props.refresh(this.props.currentUser);
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

  componentDidMount() {
    this.getData();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const lab = this.state.lab;
    const itemType = this.props.match.params.itemType || "container";
    const itemIconClasses = itemType === "container" ? "mdi mdi-grid mr-2" : "mdi mdi-flask mr-2";

    let userIsMember = false;
    if (isLoggedIn) {
      for (let i = 0; i < currentUser.labs.length; i++) {
        let userLab = currentUser.labs[i];
        if (userLab._id === lab._id) { userIsMember = true; }
      }
    }

    const labExists = lab && Object.keys(lab).length > 0;
    const labChildrenExist = labExists && Object.keys(lab).indexOf('children') > -1;
    const labContainersExist = labChildrenExist && Object.keys(lab.children).indexOf('containers') > -1;
    const labPhysicalsExist = labChildrenExist && Object.keys(lab.children).indexOf('physicals') > -1;

    const labContainers = labExists && labChildrenExist && labContainersExist ? lab.children.containers : [];
    const labPhysicals = labExists && labChildrenExist && labPhysicalsExist ? lab.children.physicals : [];

    return (
      <div className="LabProfile container-fluid">
        <div className="row">
          {(isLoggedIn && userIsMember) ? (
            <>
              <div className="col-12 col-lg-7">
                <div className="card rounded-0 mt-3">
                  <div className="card-header rounded-0 bg-dark text-light">
                    <h4 className="card-title mb-0 text-capitalize">
                      <i className={itemIconClasses}/>Add {itemType}
                    </h4>
                  </div>
                  {(this.state.newItemLocations.length === 0) ? (
                    <div className="card-body">
                      {(itemType === 'container') ? (
                        <p className="card-text">
                          Select which cell the Container will occupy within {this.state.lab.name}.
                        </p>
                      ) : (
                        <p className="card-text">
                          Select which cell the Physical Sample will occupy within {this.state.lab.name}.
                        </p>
                      )}    
                    </div>
                  ) : (
                    <div className="card-body">
                      {(itemType === 'container') ? (
                        <ContainerNewForm 
                          {...this.props} 
                          {...this.state}
                          parentType="Lab"
                        />
                      ) : null } 
                      {(itemType === 'physical') ? (
                        <PhysicalNewForm 
                          {...this.props} 
                          {...this.state}
                          parentType="Lab"
                        />
                      ) : null }     
                    </div>
                  )} 
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <Grid 
                  demo={false}
                  selectLocations={true}
                  selectSingle={itemType === 'physical'}
                  newItemLocations={this.state.newItemLocations}
                  addLocation={this.addLocation}
                  removeLocation={this.removeLocation}
                  recordType="Lab"
                  record={this.state.lab}
                  containers={labContainers}
                  physicals={labPhysicals}
                />
              </div>
            </>
          ) : null }  
        </div>
      </div>
    );
  }
}

export default LabAdd;
