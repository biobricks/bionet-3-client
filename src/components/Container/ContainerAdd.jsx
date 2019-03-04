import React from 'react';
import Grid from '../Grid/Grid';
import ContainerNewForm from '../Container/ContainerNewForm';
import PhysicalNewForm from '../Physical/PhysicalNewForm';
import Api from '../../modules/Api';

class ContainerAdd extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lab: {},
      container: {},
      newItemLocations: []
    };
    this.updateContainer = this.updateContainer.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
  }

  getData() {
    let containerId = this.props.match.params.containerId;
    Api.get(`containers/${containerId}`)
    .then((res) => {
      console.log('ContainerAdd.getData.res', res);
      this.setState({
        lab: res.data.lab,
        container: res.data
      });
    });
  }

  updateContainer(container) {
    let containerRecord = container;
    containerRecord['parent'] = container._id;
    Api.postContainer('containers/new', containerRecord)
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
    const container = this.state.container;
    const itemType = this.props.match.params.itemType || "container";
    const itemIconClasses = itemType === "container" ? "mdi mdi-grid mr-2" : "mdi mdi-flask mr-2";

    let userIsMember = false;
    if (isLoggedIn) {
      for (let i = 0; i < currentUser.labs.length; i++) {
        let userLab = currentUser.labs[i];
        if (userLab._id === lab._id) { userIsMember = true; }
      }
    }

    const containerExists = container && Object.keys(container).length > 0;
    const containerChildrenExist = containerExists && Object.keys(container).indexOf('children') > -1;
    const containerContainersExist = containerChildrenExist && Object.keys(container.children).indexOf('containers') > -1;
    const containerPhysicalsExist = containerChildrenExist && Object.keys(container.children).indexOf('physicals') > -1;

    const containerContainers = containerChildrenExist && containerContainersExist ? container.children.containers : [];
    const containerPhysicals = containerChildrenExist && containerPhysicalsExist ? container.children.physicals : [];

    return (
      <div className="ContainerAdd container-fluid">
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
                          Select which cell the Container will occupy within {this.state.container.name}.
                        </p>
                      ) : (
                        <p className="card-text">
                          Select which cell the Physical Sample will occupy within {this.state.container.name}.
                        </p>
                      )}    
                    </div>
                  ) : (
                    <div className="card-body">
                      {(itemType === 'container') ? (
                        <ContainerNewForm 
                          parentType="Container"
                          lab={this.state.lab}
                          container={this.state.container}
                          newItemLocations={this.state.newItemLocations}
                          {...this.props}
                        />
                      ) : null } 
                      {(itemType === 'physical') ? (
                        <PhysicalNewForm 
                          parentType="Container"
                          {...this.props} 
                          {...this.state}
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
                  recordType="Container"
                  record={this.state.container}
                  containers={containerContainers}
                  physicals={containerPhysicals}
                />
              </div>
            </>
          ) : null }  
        </div>
      </div>
    );
  }
}

export default ContainerAdd;
