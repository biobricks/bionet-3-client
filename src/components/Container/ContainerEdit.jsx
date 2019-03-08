import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Grid from '../Grid/Grid';
import Api from '../../modules/Api';

class ContainerEdit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      lab: {},
      container: {},
      form: {
        name: "",
        description: "",
        rows: 0,
        columns: 0
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
    const containerId = this.props.match.params.containerId;
    Api.post(`containers/${containerId}/edit`, formData)
    .then((res) => {
      console.log(res);
      this.setState({
        redirect: true
      });
      this.props.refresh(this.props.currentUser);
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let formData = this.state.form;
    this.submitForm(formData);
  }

  componentDidMount() {
    let containerId = this.props.match.params.containerId;
    Api.get(`containers/${containerId}`)
    .then((res) => {
      //console.log('getContainer.res', res);
      this.setState({
        lab: res.data.lab,
        container: res.data,
        form: res.data
      });
    });
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const form = this.state.form;
    const container = this.state.container;
    const containerExists = container && Object.keys(container).length > 0;
    const containerChildrenExist = containerExists && Object.keys(container).indexOf('children') > -1;
    const containerContainersExist = containerChildrenExist && Object.keys(container.children).indexOf('containers') > -1;
    const containerPhysicalsExist = containerChildrenExist && Object.keys(container.children).indexOf('physicals') > -1;

    const containerContainers = containerChildrenExist && containerContainersExist ? container.children.containers : [];
    const containerPhysicals = containerChildrenExist && containerPhysicalsExist ? container.children.physicals : [];

    if (this.state.redirect === true) {
      return ( <Redirect to={`/containers/${this.props.match.params.containerId}`}/> )
    }
    return (
      <div className="ContainerEdit container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">
            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark-green text-light">
                <div className="card-title mb-0 text-capitalize">
                  <h4 className="card-title mb-0 text-capitalize">
                    <i className="mdi mdi-grid mr-2"/ >Edit Container
                  </h4>
                </div>
              </div>
              {(isLoggedIn) ? (
                <>
                  <div className="card-body">
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
                          placeholder="Containre Name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="name">Description</label>
                        <input 
                          name="description"
                          type="text"
                          className="form-control"
                          value={this.state.form.description}
                          onChange={this.updateField}
                          placeholder="A short description of the Container."
                        />
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
                      </div>

                      <div className="form-group text-center">
                        <div className="btn-group" role="group" aria-label="Basic example">
                          <Link to={`/containers/${this.props.match.params.containerId}`} className="btn btn-secondary mt-3">Back</Link>
                          <button 
                            type="submit" 
                            className="btn btn-success mt-3"
                          >Submit</button>
                        </div>  
                      </div>                    

                    </form>
                  </div>
                </>
              ) : null}   
            </div>
          </div>
          {(isLoggedIn) ? (
            <div className="col-12 col-lg-5">
              {/* <Grid 
                demo={true}
                editMode={true}
                formData={this.state.form}
                selectLocations={false}
                recordType="Container"
                record={this.state.container}
                containers={containerContainers}
                physicals={containerPhysicals}
              /> */}
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

export default ContainerEdit;
