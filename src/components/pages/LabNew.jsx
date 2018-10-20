import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Auth from '../../modules/Auth';
import appConfig from '../../configuration.js';
import axios from 'axios';

import Grid from '../partials/Grid';

class LabNew extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      lab: {},
      form: {
        name: "",
        description: "",
        rows: 1, 
        columns: 1
      }
    };
    this.updateField = this.updateField.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  updateField(e) {
    const field = e.target.name;
    let form = this.state.form;
    if(field === 'rows' || field === 'columns') {
      form[field] = Number(e.target.value);
    } else {
      form[field] = e.target.value;
    }
    this.setState({
      form
    });    
  }

  submitForm(formData) {
    if(formData.name.length > 0){
      let config = {
        'headers': {
          'authorization': `Bearer ${Auth.getToken()}`
        },
        'json': true
      };  
      axios.post(`${appConfig.apiBaseUrl}/labs/new`, formData, config)
      .then(res => {     
        this.setState({ 
          lab: res.data.data,
          redirect: true 
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ form: formData });
      });      
    }  
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let form = this.state.form;
    this.setState({
      form: {
        name: "",
        description: "",
        rows: 1, 
        columns: 1            
      }
    });
    this.submitForm(form);
  }

  render() { 
    let form = this.state.form;
    let formValid = form.name.length > 0 && form.rows > 1 && form.columns > 1;
    if (this.state.redirect === true) {
      return ( <Redirect to={`/`}/> )
    }
    return (
      <div className="container-fluid">
        <div className="row">
          
          <div className="col-12 col-md-7">
            { (this.props.isLoggedIn) ? (
              <div className="card mt-3">
                <div className="card-header bg-dark text-light">
                  <h4 className="card-title mb-0">New Lab</h4>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    Let's setup a new Lab! Your Lab will need:
                  </p>  
                  <form onSubmit={this.handleFormSubmit}>
                    <input 
                      name="creator"
                      type="hidden"
                      value={this.props.currentUser._id}
                    />
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input 
                        name="name"
                        className="form-control"
                        value={this.state.form.name}
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
                        value={this.state.form.description}
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
                        value={this.state.form.columns}
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
                        value={this.state.form.rows}
                        onChange={this.updateField}
                        min="1"
                        max="50"
                        step="1"
                      />
                      <small className="form-text text-muted">Required - The number of rows in the grid representing your Lab area from a top-down view. Change to a value greater than 1.</small>
                    </div>

                    <div className="form-group text-center">
                      <div className="btn-group" role="group" aria-label="Basic example">
                        <Link to="/" className="btn btn-secondary mt-3">Back</Link>
                        <button 
                          type="submit" 
                          className="btn btn-success mt-3"
                          disabled={!formValid}
                        >Submit</button>
                      </div>  
                    </div>                    

                  </form>
                </div>
              </div>
            ) : null }  
          </div>

          <div className="col-12 col-md-5">
            <Grid 
              demo={true}
              recordType="Lab"
              record={this.state.form}
            />
          </div>
          
        </div>
      </div>
    );
  }
}

export default LabNew;