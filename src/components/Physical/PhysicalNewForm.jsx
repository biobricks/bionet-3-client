import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
//import { generateRandomName } from '../../modules/Wu';
import Api from '../../modules/Api';

class PhysicalNewForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      redirectTo: "",
      virtual: {},
      form: {
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
        column: 1,
        provenance: "",
        genotype: "",
        sequence: ""
      },
      errors: {
        name: "",
        provenance: "",
        genotype: "",
        sequence: ""
      }
    };
    this.handleVirtualChange = this.handleVirtualChange.bind(this);
    this.updateField = this.updateField.bind(this);
    //this.wuGenerate = this.wuGenerate.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  handleVirtualChange(selectedArray) {
    let virtual = selectedArray[0] || {};
    this.setState({
      virtual
    });
  }

  updateField(e) {
    let form = this.state.form;
    let fieldType = e.target.getAttribute('type');
    let field = e.target.getAttribute('name');
    if (fieldType === 'number') {
      form[field] = Number(e.target.value);
    } else {
      form[field] = e.target.value;
    }
    this.setState({
      form
    });
  }

  // wuGenerate(e) {
  //   e.preventDefault();
  //   let form = this.state.form;
  //   form.name = generateRandomName();
  //   this.setState({
  //     form
  //   });
  // }

  onFormSubmit(e) {
    e.preventDefault();
    let formData = this.state.form;
    let errors = this.state.errors;
    this.props.debugging && console.log('physical form data', formData);
    // add data to form
    formData.createdBy = this.props.currentUser._id;
    formData.row = this.props.newItemLocations[0][1];
    formData.column = this.props.newItemLocations[0][0];
    const isContainer = this.props.parentType && this.props.parentType === "Container";
    formData.lab = isContainer ? this.props.container.lab._id : this.props.lab._id;
    formData.parent = isContainer ? this.props.container._id : null;    
    const virtualExists = Object.keys(this.state.virtual).length > 0;
    // form validation attributes
    const nameIsValid = formData.name && formData.name.length > 2;
    if (!nameIsValid) { errors.name = "Please enter a name with at least 3 letters."; } else { errors.name = "" };
    const provenanceIsValid = formData.provenance && formData.provenance.length > 6;
    if (!provenanceIsValid) { errors.provenance = "Please enter a valid provenance with at least 7 characters."; } else { errors.provenance = "" };
    const genotypeIsValid = formData.genotype && formData.genotype.length > 3;
    if (!genotypeIsValid) { errors.genotype = "Please enter a valid genotype with at least 4 characters."; } else { errors.genotype = "" };
    const sequenceIsValid = formData.sequence && formData.sequence.length > 3;
    if (!sequenceIsValid) { errors.sequence = "Please enter a valid sequence with at least 4 characters."; } else { errors.sequence = "" };
    // validate
    const formIsValid = nameIsValid && provenanceIsValid && genotypeIsValid && sequenceIsValid;
    if (formIsValid) {
      if (virtualExists) {
        // if virtual exists add to form and proceed
        this.props.debugging && console.log('virtual exists. form:', formData);
        formData.virtual = this.state.virtual._id;
        
        this.props.debugging && console.log('Form Submitted', formData);
        this.submitForm(formData);
      } else {
        // if virtual does not exist, create and on response add id to form and proceed
        this.props.debugging && console.log('virtual doesn\'t exist - form:', formData);
        let newVirtual = {
          createdBy: this.props.currentUser._id,
          name: formData.name,
          description: formData.description,
          provenance: formData.provenance,
          genotype: formData.genotype,
          sequence: formData.sequence,
          category: formData.category
        };
        Api.post('virtuals/new', newVirtual)
        .then((res) => {
          let virtual = res.data;
          formData.virtual = virtual._id;
          this.props.debugging && console.log('virtual created and added - form:', formData);
          this.submitForm(formData);
        });      
      }
    } else {
      // if form isn't valid, display errors
      this.setState({errors});
    }  
  }

  submitForm(formData) {
    let parentIsContainer = this.props.parentType && this.props.parentType === "Container";
    Api.post('physicals/new', formData)
    .then((res) => {
      this.props.debugging && console.log('PhysicalNewForm.submitForm.res', res);
      this.setState({
        redirect: true,
        redirectTo: parentIsContainer ? `/containers/${formData.parent}` : `/labs/${formData.lab}`
      });
      this.props.refresh(this.props.currentUser);
    });
  }

  render() {
    const virtuals = this.props.virtuals || [];
    const virtualsExist = virtuals && virtuals.length > 0;
    const errors = this.state.errors;
    const nameErrorExists = errors.name && errors.name.length > 0;
    const provenanceErrorExists = errors.provenance && errors.provenance.length > 0;
    const genotypeErrorExists = errors.genotype && errors.genotype.length > 0;
    const sequenceErrorExists = errors.sequence && errors.sequence.length > 0;
    if (this.state.redirect === true) {
      return ( <Redirect to={this.state.redirectTo}/> )
    }
    return (
      <div className="row mb-3">
        <div className="col-12">
          <form onSubmit={this.onFormSubmit}>
            { virtualsExist && (
              <div className="form-group">
                <label htmlFor="virtual">Instance Of:</label>
                <Typeahead
                  labelKey="name"
                  name="virtual"
                  onChange={(selected) => {this.handleVirtualChange(selected)}}
                  onPaginate={(e) => console.log('Results paginated')}
                  options={this.props.virtuals}
                  paginate={true}
                  placeholder="Select Existing Virtual Sample (optional)"
                  className="border-0"
                  maxResults={50}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name</label>
              
              <input 
                type="text" 
                className="form-control"
                id="form-name"
                name="name" 
                placeholder="Physical Name"
                value={this.state.form.name}
                onChange={this.updateField}
              />
              { nameErrorExists && <small className="form-text text-danger">{this.state.errors.name}</small> }
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                type="textarea"
                className="form-control"
                name="description"
                placeholder="A short description of the Physical."
                value={this.state.form.description}
                onChange={this.updateField}
              ></textarea>
            </div>

            {(Object.keys(this.state.virtual).length === 0) ? (
              <>
                <div className="form-group">
                  <label htmlFor="provenance">Provenance</label>
                  <input 
                    type="text" 
                    className="form-control"
                    id="form-name"
                    name="provenance" 
                    placeholder="Sample Provenance"
                    value={this.state.form.provenance}
                    onChange={this.updateField}
                  />
                  { provenanceErrorExists && <small className="form-text text-danger">{this.state.errors.provenance}</small> }
                </div>

                <div className="form-group">
                  <label htmlFor="genotype">Genotype</label>
                  <input 
                    type="text" 
                    className="form-control"
                    id="form-name"
                    name="genotype" 
                    placeholder="Sample Genotype"
                    value={this.state.form.genotype}
                    onChange={this.updateField}
                  />
                  { genotypeErrorExists && <small className="form-text text-danger">{this.state.errors.genotype}</small> }
                </div>            

                <div className="form-group">
                  <label htmlFor="sequence">Sequence</label>
                  <textarea
                    type="textarea"
                    className="form-control"
                    name="sequence"
                    placeholder="AGTCAGTCAG..."
                    value={this.state.form.sequence}
                    onChange={this.updateField}
                    rows="5"
                  ></textarea>
                  { sequenceErrorExists && <small className="form-text text-danger">{this.state.errors.sequence}</small> }
                </div>
              </>
            ) : null }

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                type="select"
                className="form-control"
                name="category"
                value={this.state.form.category}
                onChange={this.updateField}
              >
                <option value="Sample">Sample</option>
                <option value="DNA Sample">DNA Sample</option>
                <option value="OrganismSample">Organism Sample</option>
              </select>
            </div>

            <div className="form-group text-center">
              <div className="btn-group">
                {(this.props.parentType && this.props.parentType === "Container") ? (
                  <Link to={`/containers/${this.props.container._id}`} className="btn btn-secondary mt-5">Cancel</Link>
                ) : (
                  <Link to={`/labs/${this.props.lab._id}`} className="btn btn-secondary mt-5">Cancel</Link>
                )}  
                <button type="submit" className="btn btn-success mt-5">Save Physical</button>
              </div>
            </div>
          </form>
        </div>
      </div>    
    );
  }
}

export default PhysicalNewForm;