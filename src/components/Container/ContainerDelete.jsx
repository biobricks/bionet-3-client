import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Auth from "../../modules/Auth";
import appConfig from '../../configuration.js';
import Grid from '../Grid/Grid';
import Api from '../../modules/Api';

class ContainerDelete extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      lab: {},
      container: {},
      containers: [],
      physicals: [],
      form: {}
    };
    this.getContainer = this.getContainer.bind(this);
    this.deleteContainer = this.deleteContainer.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async getContainer(containerId) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/containers/${containerId}`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let res = await fetch(request);
      let response = res.json();
      return response;
    } catch (error) {
      console.log('ContainerProfile.getContainer', error);
    }  
  }

  async deleteContainer(containerId) {
    try {  
      let request = new Request(`${appConfig.apiBaseUrl}/containers/${containerId}/remove`, {
        method: 'POST',
        // body: "deleteit",
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        })
      });
      let res = await fetch(request);
      let response = res.json();
      return response;
    } catch (error) {
      console.log('ContainerDelete.deleteContainer', error);
    }   
  }

  handleDelete() {
    let containerId = this.props.match.params.containerId;
    this.deleteContainer(containerId)
    .then((res) => {
      this.props.debugging && console.log('ContainerDelete.getContainer.res', res);
      this.setState({
        redirect: true
      });
    });
  }

  componentDidMount() {
    let containerId = this.props.match.params.containerId;
    Api.get(`containers/${containerId}`)
    .then((res) => {
      this.props.debugging && console.log('ContainerDelete.getContainer.res', res);
      this.setState({
        lab: res.data.lab,
        container: res.data,
        form: res.data
      });
    });
  }

  render() {
    const container = this.state.container;
    const containerExists = container && Object.keys(container).length > 0;
    const containerChildrenExist = containerExists && Object.keys(container).indexOf('children') > -1;
    const containerContainersExist = containerChildrenExist && Object.keys(container.children).indexOf('containers') > -1;
    const containerPhysicalsExist = containerChildrenExist && Object.keys(container.children).indexOf('physicals') > -1;

    const containerContainers = containerChildrenExist && containerContainersExist ? container.children.containers : [];
    const containerPhysicals = containerChildrenExist && containerPhysicalsExist ? container.children.physicals : [];
    if (this.state.redirect === true) {
      let route = this.state.container.parent === null ? `/labs/${container.lab._id}` : `/containers/${container.parent._id}`;
      return ( <Redirect to={route}/> )
    }    
    const isLoggedIn = this.props.isLoggedIn;
    return (
      <div className="LabProfile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">
            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <h4 className="card-title mb-0 text-capitalize">
                    <i className="mdi mdi-grid mr-2"/>Delete Container
                  </h4>
                </div>
              </div>
              {(isLoggedIn) ? (         
                <div className="card-body">
                  <p className="card-text">
                    Warning! This action cannot be undone. Are you sure you want to delete this Container and <strong>all of it's content</strong>?
                  </p>
                  <div className="text-center">
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <Link to={`/containers/${this.props.match.params.containerId}`} className="btn btn-secondary mt-3">Back</Link>
                      <button 
                        type="submit" 
                        className="btn btn-danger mt-3"
                        onClick={this.handleDelete}
                      >Delete Container</button>
                    </div>  
                  </div>                    
                </div>
              ) : null }   
            </div>
          </div>
          {(isLoggedIn) ? (
            <div className="col-12 col-lg-5">
              <Grid 
                demo={true}
                editMode={false}
                formData={this.state.form}
                selectLocations={false}
                recordType="Container"
                record={this.state.form}
                containers={containerContainers}
                physicals={containerPhysicals}
              />
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

export default ContainerDelete;
