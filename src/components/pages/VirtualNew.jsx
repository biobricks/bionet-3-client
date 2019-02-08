import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import appConfig from '../../configuration.js';

class VirtualNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      virtual: {
        creator: "",
        name: "",
        description: "",
        provenance: "",
        genotype: "",
        sequence: "",
        category: "sample"
      }
    };
    this.updateField = this.updateField.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  updateField(e) {
    const field = e.target.name;
    let virtual = this.state.virtual;
    if(field === 'rows' || field === 'columns') {
      virtual[field] = Number(e.target.value);
    } else {
      virtual[field] = e.target.value;
    }
    this.setState({
      virtual
    });    
  }

  submitForm(virtual) {
    let creator = document.getElementById('creator-id').value;
    virtual['creator'] = creator;
    //console.log('Form Data', virtual);
    let config = {
      'headers': {  
        'authorization': `Bearer ${Auth.getToken()}`
      },
      'json': true
    };
    axios.post(`${appConfig.apiBaseUrl}/virtuals/new`, virtual, config)
    .then(res => {     
      //console.log(res.data.data);
      this.setState({
        redirect: true
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  
  onFormSubmit(e) {
    e.preventDefault();
    let virtual = this.state.virtual;
    this.submitForm(virtual);
  }

  render() { 
    if (this.state.redirect){ return ( <Redirect to={`/virtuals`} /> ); }
    return ( 
      <div className="container-fluid pb-3">

        <div className="row">
          <div className="col-12 col-lg-7"> 
            <div className="card rounded-0 mt-3">
              <div className="card-header bg-dark text-light rounded-0">
                <h4 className="card-title mb-0">
                  <i className="mdi mdi-dna mr-2" />Virtual List
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={this.onFormSubmit}>

                  <input 
                    id="creator-id"
                    name="creator"
                    type="hidden"
                    defaultValue={this.props.currentUser._id}
                  />

                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                      name="name"
                      type="text"
                      className="form-control"
                      value={this.state.virtual.name}
                      onChange={this.updateField}
                      placeholder="Virtual Name"
                    />
                    <small className="form-text text-muted">Required - The name of your Virtual. This will be public and visible to other Labs.</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="name">Description</label>
                    <input 
                      name="description"
                      type="text"
                      className="form-control"
                      value={this.state.virtual.description}
                      onChange={this.updateField}
                      placeholder="A short description of the Virtual."
                    />
                    <small className="form-text text-muted">Optional - Share a bit more detail on your Virtual. Visible to the public and other Labs.</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="provenance">Provenance</label>
                    <input 
                      name="provenance"
                      type="text"
                      className="form-control"
                      value={this.state.virtual.provenance}
                      onChange={this.updateField}
                      placeholder="Virtual Provenance."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="genotype">Genotype</label>
                    <input 
                      name="genotype"
                      type="text"
                      className="form-control"
                      value={this.state.virtual.genotype}
                      onChange={this.updateField}
                      placeholder="Virtual Genotype"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="sequence">Sequence</label>
                    <textarea 
                      name="sequence"
                      type="textarea"
                      className="form-control"
                      value={this.state.virtual.sequence}
                      onChange={this.updateField}
                      placeholder="AGTCAGTCAGTCAGTC..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select 
                      name="category"
                      type="select"
                      className="form-control"
                      value={this.state.virtual.category}
                      onChange={this.updateField}
                    >
                      <option value="sample">Sample</option>
                      <option value="part">Part</option>
                      <option value="plasmid">Plasmid</option>
                      <option value="vector">Vector</option>
                    </select>
                  </div>

                  <div className="form-group text-center">
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <Link to={`/virtuals`} className="btn btn-secondary mt-3">Back</Link>
                      <button 
                        type="submit" 
                        className="btn btn-success mt-3"
                      >Save Virtual</button>
                    </div>  
                  </div>   

                </form>                
              </div>

            </div>
          </div>               
        </div>

      </div> 
    );
  }
}
 
export default VirtualNew;