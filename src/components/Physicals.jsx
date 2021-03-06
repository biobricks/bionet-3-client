import React, { Component } from 'react';
import shortid from 'shortid';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import Grid from './Grid';
import Api from '../modules/Api';

class Physicals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'List',
      physicals: [],
      physical: {},
      physicalForm: {},
      virtualForm: {},
      currentParent: {},
      newParent: {},
      newItemLocations: []
    };
    this.onDeletePhysical = this.onDeletePhysical.bind(this);
    this.onDeleteVirtual = this.onDeleteVirtual.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.handleNewParentChange = this.handleNewParentChange.bind(this);
    this.updatePhysicalField = this.updatePhysicalField.bind(this);
    this.submitPhysicalForm = this.submitPhysicalForm.bind(this);
    this.handlePhysicalFormSubmit = this.handlePhysicalFormSubmit.bind(this);
    this.updateVirtualField = this.updateVirtualField.bind(this);
    this.submitVirtualForm = this.submitVirtualForm.bind(this);
    this.handleVirtualFormSubmit = this.handleVirtualFormSubmit.bind(this);
  }

  handleNewParentChange(selectedArray) {
    const newParent = selectedArray[0];
    const newParentIsLab = Object.keys(newParent).indexOf('parent') === -1;
    const recordEndpoint = newParentIsLab ? `labs/${newParent._id}` : `containers/${newParent._id}`;
    Api.get(recordEndpoint)
    .then((res) => {
      this.setState({
        newParent: res.data,
        mode: "Move Step 2"
      });
    })
    .catch((error) => {
      throw error;
    });
  }

  addLocation(newLocationArray) {
    //console.log('add location called');
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

  updateLocation() {
    if (this.props.isLoggedIn) {
      let physical = this.state.physical;
      physical.parent = this.state.newParent._id;
      physical.updatedBy = this.props.currentUser._id;
      physical.column = this.state.newItemLocations[0][0];
      physical.row = this.state.newItemLocations[0][1];
      Api.post(`physicals/${physical._id}/edit`, physical)
      .then((res) => {
        this.props.refresh();
        this.setState({ mode: 'List' });
      });
    }
  }

  onDeletePhysical() {
    if (this.props.isLoggedIn) {
      Api.post(`physicals/${this.state.physical._id}/remove`)
      .then((res) => {
        console.log('Delete Physical Res', res);
        this.props.refresh();
        this.setState({ mode: 'List' });
      }); 
    }     
  }

  onDeleteVirtual() {
    if (this.props.isLoggedIn) {
      Api.post(`virtuals/${this.state.virtual._id}/remove`)
      .then((res) => {
        console.log('Delete Virtual Res', res);
        this.props.refresh();
      });  
    }  
  }

  onChangeMode(e) {
    let physicals = this.props.physicals;
    let physical = {};
    let physicalForm = {};
    let virtual = {};
    let virtualForm = {};
    let mode = e.target.getAttribute('mode');
    for(let i = 0; i < physicals.length; i++){
      let thisPhysical = physicals[i];
      if (thisPhysical._id === e.target.id){
        physical = thisPhysical;
        physicalForm = thisPhysical;
        virtual = thisPhysical.virtual;
        virtualForm = thisPhysical.virtual;
      }
    }
    // console.log('Physicals', physicals);
    // console.log('Physical', physical);
    // console.log('Form', form);
    // console.log('Mode', mode);
    this.setState({ 
      physicals,
      physical,
      mode,
      physicalForm,
      virtual,
      virtualForm 
    });
  }

  changeMode(mode) {
    this.setState({mode});
  }

  updatePhysicalField(e) {
    const field = e.target.name;
    let physicalForm = this.state.physicalForm;
    physicalForm[field] = e.target.value;
    this.setState({
      physicalForm
    });    
  }

  submitPhysicalForm(formData) {
    if (this.props.isLoggedIn) {
      formData.updatedBy = this.props.currentUser._id;
      Api.post(`physicals/${this.state.physical._id}/edit`, formData)
      .then((res) => {
        console.log('Post Physical Res', res);
        this.changeMode('View');
      });
    }
  }

  handlePhysicalFormSubmit(e) {
    e.preventDefault();
    let formData = this.state.physicalForm;
    this.submitPhysicalForm(formData);
  }

  updateVirtualField(e) {
    const field = e.target.name;
    let virtualForm = this.state.virtualForm;
    virtualForm[field] = e.target.value;
    this.setState({
      virtualForm
    });    
  }

  submitVirtualForm(formData) {
    if (this.props.isLoggedIn) {
      formData.updatedBy = this.props.currentUser._id;
      Api.post(`virtuals/${this.state.physical.virtual._id}/edit`, formData)
      .then((res) => {
        console.log('Post Virtual Res', res);
        this.changeMode('List');
      });
    }
  }

  handleVirtualFormSubmit(e) {
    e.preventDefault();
    let formData = this.state.virtualForm;
    this.submitVirtualForm(formData);
  } 

  render() {
    //const isLoggedIn = this.props.isLoggedIn;
    const mode = this.state.mode;
    const physicals = this.props.physicals || [];
    const physical = this.state.physical;
    const physicalExists = Object.keys(physical).length > 0;
    const virtual = this.state.virtual;
    const containers = this.props.containers || [];
    //const userIsMember = this.props.userIsMember;

    let title;
    let titleClasses = "mdi mdi-flask mr-2";
    switch(mode) {
      case 'List':
        title = `Samples (${physicals.length})`;
        break;
      case 'View':
        title = physical.name || "";
        break;
      case 'Edit':
        title = `Edit ${physical.name}`;
        break;
      case 'Delete':
        title = `Delete ${physical.name}`;
        break;
      case 'Edit Virtual':
        title = `Edit ${virtual.name}`;
        titleClasses = "mdi mdi-dna mr-2";
        break;
      case 'Delete Virtual':
        title = `Delete ${virtual.name}`;
        titleClasses = "mdi mdi-dna mr-2";
        break;    
      default:
        title = 'List Physicals';  
    }

    const physicalsList = physicals.map((thisPhysical, index) => {
      return (
        <div 
          key={shortid.generate()}
          className="list-group-item list-group-item-action rounded-0"
        >
          <h4 className="mb-0">
            <i className="mdi mdi-flask mr-2" />{thisPhysical.name}
            <div className="btn-group float-right">
              <div 
                id={thisPhysical._id}
                mode='View'
                className="btn btn-sm btn-info rounded-0"
                onClick={this.onChangeMode}
              >View Details</div>
              {/* {isLoggedIn && userIsMember && (
                <div 
                  id={thisPhysical._id}
                  mode='Move Step 1'
                  className="btn btn-sm btn-primary rounded-0"
                  onClick={this.onChangeMode}
                >Move</div>
              )}   */}
            </div>  
          </h4>
        </div>        
      );
    });

    //let allParentOptions = [physical.lab].concat(containers);
    const allParentOptions = this.props.allContainers;
    let filteredOptions = [];
    for (let i = 0; i < allParentOptions.length; i++){
      let option = allParentOptions[i];
      if (physicalExists) {
        //console.log(option.lab._id, physical.lab._id);
        if (option.lab._id === physical.lab._id) { filteredOptions.push(option) }
      } else {
        //console.log(option.lab._id);
      }  
    }
    let newParentOptions = [];
    if(Object.keys(physical).length > 0 && containers.length > 0) {
      if (containers && containers.length > 0) {
        for (let i = 0; i < filteredOptions.length; i++){
          let option = filteredOptions[i];
          //console.log(option.lab._id);
          if (option._id !== physical._id) {
            newParentOptions.push(option);
          }
        }
      }
    } 
    newParentOptions = [physical.lab].concat(newParentOptions);

    return (
      <div className="card rounded-0 mt-3 mb-3">
        <div className="card-header bg-dark text-light rounded-0">
          <h5 className="card-title mb-0 text-capitalize">
            <i className={titleClasses}/>{title}
          </h5>
        </div>

        {(mode === 'List') ? (
          <ul className="list-group list-group-flush">
            {physicalsList}
          </ul>
        ) : null }

        {(mode === 'View') ? (
          <div className="card-body">
            <p className="card-text">{physical.description}</p>
            <p className="card-text">Provenance: {physical.virtual.provenance}</p>
            <p className="card-text">Genotype: {physical.virtual.genotype}</p>
            <p className="card-text">Sequence: {physical.virtual.sequence}</p>
            <div className="btn-group">
              <button 
                className="btn btn-secondary"
                onClick={this.onChangeMode}
                mode="List"
              >
                Back To List
              </button>
              <button 
                id={physical._id}
                className="btn btn-primary"
                onClick={this.onChangeMode}
                mode="Edit"
              >
                Edit
              </button>
            </div>
          </div>
        ) : null }

        {(mode === 'Edit') ? (
          <div className="card-body">
            <form className="form" onSubmit={this.handlePhysicalFormSubmit}>
              
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text" 
                  className="form-control"
                  name="name"
                  value={this.state.physicalForm.name}
                  onChange={this.updatePhysicalField}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  className="form-control"
                  name="description"
                  value={this.state.physicalForm.description}
                  rows="1"
                  onChange={this.updatePhysicalField}
                ></textarea>
              </div>

              <h5 className="card-title">Inherited From Virtual Sample {virtual.name}</h5>
              
              <div className="form-group">
                <label htmlFor="provenance">Provenance</label>
                <input
                  type="text" 
                  className="form-control"
                  value={virtual.provenance}
                  disabled={true}
                />
              </div>

              <div className="form-group">
                <label htmlFor="genotype">Genotype</label>
                <input
                  type="text" 
                  className="form-control"
                  value={virtual.genotype}
                  disabled={true}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sequence">Sequence</label>
                <input
                  type="text" 
                  className="form-control"
                  value={virtual.sequence}
                  disabled={true}
                />
              </div>

              <div className="btn-group mr-3">
                <button 
                  id={physical._id}
                  className="btn btn-secondary"
                  onClick={this.onChangeMode}
                  mode="View"
                >
                  Back To Profile
                </button>
                <button 
                  type="submit"
                  className="btn btn-success"
                >
                  Save Changes
                </button>
                <button 
                  id={physical._id}
                  className="btn btn-danger"
                  onClick={this.onChangeMode}
                  mode="Delete"
                >
                  Delete
                </button>
                
              </div>

              <div className="btn-group">
                <button 
                  id={physical._id}
                  className="btn btn-primary"
                  onClick={this.onChangeMode}
                  mode="Edit Virtual"
                >
                  Edit Virtual Sample
                </button>
              </div>

            </form>
          </div>
        ) : null }

        {(mode === 'Delete') ? (
          <div className="card-body">
            <p className="card-text">
              Warning! This action cannot be undone. Are you sure you want to delete {physical.name}?
            </p>
            <div className="btn-group">
              <button 
                id={physical._id}
                className="btn btn-secondary"
                onClick={this.onChangeMode}
                mode="Edit"
              >
                Cancel
              </button>
              <button 
                id={physical._id}
                className="btn btn-danger"
                onClick={this.onDeletePhysical}
              >
                Delete
              </button>
            </div>
          </div>
        ) : null }

        {(mode === 'Edit Virtual') ? (
          <div className="card-body">
            <form className="form" onSubmit={this.handleVirtualFormSubmit}>
              
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text" 
                  className="form-control"
                  name="name"
                  value={this.state.virtualForm.name}
                  onChange={this.updateVirtualField}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  className="form-control"
                  name="description"
                  value={this.state.virtualForm.description}
                  rows="1"
                  onChange={this.updateVirtualField}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="provenance">Provenance</label>
                <input
                  type="text" 
                  className="form-control"
                  name="provenance"
                  value={this.state.virtualForm.provenance}
                  onChange={this.updateVirtualField}
                />
              </div>

              <div className="form-group">
                <label htmlFor="genotype">Genotype</label>
                <input
                  type="text" 
                  className="form-control"
                  name="genotype"
                  value={this.state.virtualForm.genotype}
                  onChange={this.updateVirtualField}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sequence">Sequence</label>
                <textarea 
                  className="form-control"
                  name="sequence"
                  value={this.state.virtualForm.sequence}
                  rows="3"
                  onChange={this.updateVirtualField}
                ></textarea>
              </div>

              <div className="btn-group mr-3">
                <button 
                  id={physical._id}
                  className="btn btn-secondary"
                  onClick={this.onChangeMode}
                  mode="View"
                >
                  Back To {this.state.physical.name}
                </button>
                <button 
                  type="submit"
                  className="btn btn-success"
                >
                  Save Changes
                </button>
                <button 
                  id={physical._id}
                  className="btn btn-danger"
                  onClick={this.onChangeMode}
                  mode="Delete Virtual"
                >
                  Delete Virtual Sample
                </button>
                
              </div>

            </form>
          </div>
        ) : null }

        {(mode === 'Delete Virtual') ? (
          <div className="card-body">
            <p className="card-text">
              Warning! This action cannot be undone. Are you sure you want to delete {virtual.name}?
            </p>
            <div className="btn-group">
              <button 
                id={physical._id}
                className="btn btn-secondary"
                onClick={this.onChangeMode}
                mode="Edit Virtual"
              >
                Cancel
              </button>
              <button 
                id={physical._id}
                className="btn btn-danger"
                onClick={this.onDeleteVirtual}
              >
                Delete
              </button>
            </div>
          </div>
        ) : null }        

        {(mode === 'Move Step 1') ? (
          <div className="card-body">
            <p className="card-text">
              What container would you like to move {physical.name} to?
            </p>
            <form onSubmit={this.onFormSubmit}>
              <div className="form-group">
                <label htmlFor="newparent">New Location:</label>
                <Typeahead
                  labelKey="name"
                  name="newparent"
                  onChange={(selected) => {this.handleNewParentChange(selected)}}
                  onPaginate={(e) => console.log('Results paginated')}
                  options={newParentOptions}
                  paginate={true}
                  placeholder="Select New Location"
                  className="border-0"
                  maxResults={50}
                />
              </div>
            </form>  
          </div>
        ) : null }  

        {(mode === 'Move Step 2') ? (
          <div className="card-body">
            <p className="card-text">
              Where would you like to move {physical.name} to within {this.state.newParent.name}?<br/>
              Click on an empty location within {this.state.newParent.name}.<br/>
              Click on your selected location to unselect.
            </p>
            {(this.state.newItemLocations.length > 0) ? (
              <>
                <p className="card-text">
                  Move {physical.name} to {this.state.newParent.name} Column {this.state.newItemLocations[0][0]} Row {this.state.newItemLocations[0][1]} ?  
                </p>
                <div className="btn-group mb-3">
                  <button 
                    className="btn btn-success rounded-0"
                    onClick={this.updateLocation}
                  >Yes, Move {physical.name}</button> 
                  <button 
                    className="btn btn-secondary rounded-0"
                    onClick={this.onMoveCancel}
                  >Cancel</button>
                </div>
              </> 
            ) : null }
            <Grid 
              demo={false}
              selectLocations={true}
              selectSingle={true}
              newItemLocations={this.state.newItemLocations}
              addLocation={this.addLocation}
              removeLocation={this.removeLocation}
              recordType="Container"
              record={Object.keys(this.state.newParent).length > 0 ? this.state.newParent : this.state.container}
              containers={this.props.containers}
              physicals={this.props.physicals}
            />
          </div>
        ) : null } 

      </div>
    );
  }
}

export default Physicals;
