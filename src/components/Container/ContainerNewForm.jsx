import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { generateRandomName } from '../../modules/Wu';
import GridSmall from '../Grid/GridSmall';
import { getSpanMax, locationExistsInArray, getLocationRange } from '../Helpers';

class ContainerNewForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      redirectTo: "",
      errors: {
        name: ""
      }
    };
    this.updateField = this.updateField.bind(this);
    this.wuGenerate = this.wuGenerate.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  updateField(e) {
    let form = this.props.formData;
    const locations = this.props.locations;
    const fieldType = e.target.getAttribute('type');
    const field = e.target.getAttribute('name');
    const isSpanField = field === 'rowSpan' || field === 'columnSpan';
    let performUpdate = true;
    if (isSpanField) {
      const newItemLocation = this.props.newItemLocations[0];
      // const locations = this.props.locations;
      const { rowSpan, columnSpan } = form;
      const locationRange = getLocationRange(newItemLocation, rowSpan, columnSpan, true, field);
      for(let i = 0; i < locationRange.length; i++){
        let locationOccupied = locationExistsInArray(locationRange[i], locations.full);
        if (locationOccupied) { performUpdate = false; }
      }
    }
    if (performUpdate) {
      if (fieldType === 'number') {
        form[field] = Number(e.target.value);
      } else {
        form[field] = e.target.value;
      }
      this.props.updateFormData('Container', form);
    }    
  }

  wuGenerate(e) {
    e.preventDefault();
    let form = this.props.formData;
    form.name = generateRandomName();
    this.props.updateFormData('Container', form);
  }

  onFormSubmit(e) {
    e.preventDefault();
    let formData = this.props.formData;
    let errors = this.state.errors;
    formData.createdBy = this.props.currentUser._id;
    formData.row = this.props.newItemLocations[0][0];
    formData.column = this.props.newItemLocations[0][1];
    let isContainer = this.props.parentType && this.props.parentType === "Container";
    formData.lab = isContainer ? this.props.container.lab._id : this.props.lab._id;
    formData.parent = isContainer ? this.props.container._id : null;
    // form validation attributes
    const nameIsValid = formData.name && formData.name.length > 2;
    if (!nameIsValid) { errors.name = "Please enter a name with at least 3 letters."; } else { errors.name = "" };
    // validate
    const formIsValid = nameIsValid;
    if (formIsValid) { 
      this.submitForm(formData); 
      // this.setState({
      //   redirect: true,
      //   redirectTo: `labs/${this.props.match.params.labId}`
      // });
    } else {
      // if form isn't valid, display errors
      this.setState({errors});      
    }
  }

  submitForm(formData) {
    this.props.updateContainer(formData);
  }

  render() { 
    const errors = this.state.errors;
    const nameErrorExists = errors.name && errors.name.length > 0; 
    const form = this.props.formData;
    const newItemLocations = this.props.newItemLocations;
    const locations = this.props.locations;
    const parentRecord = this.props.parentRecord;

    const { rowSpanMax, columnSpanMax } = getSpanMax(form, newItemLocations, locations, parentRecord);

    if (this.state.redirect === true) {
      return ( <Redirect to={this.state.redirectTo}/> )
    }    
    return (
      <div className="row">
        <div className="col-12 col-lg-6">
          <form onSubmit={this.onFormSubmit}>
            
            {(this.props.parentType && this.props.parentType === "Container") ? (
              <input type="hidden" name="parent" value={this.props.container._id}/>
            ) : null }  
            
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control text-capitalize"
                  id="form-name"
                  name="name" 
                  placeholder="Container Name"
                  value={form.name}
                  onChange={this.updateField}
                />
                <div className="input-group-append">
                  <button 
                    className="btn btn-warning"
                    onClick={this.wuGenerate}
                  >Wu Generate</button>
                </div>
              </div>
              { nameErrorExists && <small className="form-text text-danger">{this.state.errors.name}</small> }
            </div>
            <div className="form-group">
              <label htmlFor="bgColor">Background Color</label>       
              <input 
                type="color" 
                className="form-control"
                style={{'height': '50px'}}
                name="bgColor" 
                value={form.bgColor}
                onChange={this.updateField}
              />
            </div>            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                type="textarea"
                className="form-control"
                name="description"
                placeholder="A short description of the Container."
                value={form.description}
                onChange={this.updateField}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                type="select"
                className="form-control"
                name="category"
                value={form.category}
                onChange={this.updateField}
              >
                <option value="General">General</option>
                <option value="Freezer">Freezer</option>
                <option value="Plate">Plate</option>
              </select>
            </div>            
            <div className="row">
              <div className="col">
                <label htmlFor="columns">Columns</label>
                <input
                  type="number"
                  className="form-control"
                  name="columns"
                  min="1"
                  max="50"
                  step="1"
                  value={form.columns}
                  onChange={this.updateField}
                />
              </div>
              <div className="col">
                <label htmlFor="rows">Rows</label>
                <input
                  type="number"
                  className="form-control"
                  name="rows"
                  min="1"
                  max="50"
                  step="1"
                  value={form.rows}
                  onChange={this.updateField}
                />
              </div>  
            </div>
            <div className="row mt-3">
              <div className="col">
                <label htmlFor="columnSpan">Width</label>
                <input
                  type="number"
                  className="form-control"
                  name="columnSpan"
                  min="1"
                  max={columnSpanMax}
                  step="1"
                  value={form.columnSpan}
                  onChange={this.updateField}
                />
              </div>
              <div className="col">
                <label htmlFor="rowSpan">Height</label>
                <input
                  type="number"
                  className="form-control"
                  name="rowSpan"
                  min="1"
                  max={rowSpanMax}
                  step="1"
                  value={form.rowSpan}
                  onChange={this.updateField}
                />
              </div>  
            </div>
            <div className="form-group text-center">
              <div className="btn-group">
                {(this.props.parentType && this.props.parentType === "Container") ? (
                  <Link to={`/containers/${this.props.container._id}`} className="btn btn-secondary mt-5">Cancel</Link>
                ) : (
                  <Link to={`/labs/${this.props.lab._id}`} className="btn btn-secondary mt-5">Cancel</Link>
                )}  
                
                <button type="submit" className="btn btn-success mt-5">Save Container</button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-12 col-lg-6">
          <div className="form-group">
            {(form.name.length > 0) ? (
              <label className="text-capitalize">{form.name} Preview</label>
            ) : (
              <label>Container Preview</label>
            )}
            <GridSmall
              demo={true}
              selectLocations={false}
              recordType="Container"
              record={form}
            />
          </div>
        </div>
      </div>    
    );
  }
}

export default ContainerNewForm;