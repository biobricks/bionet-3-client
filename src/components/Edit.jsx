import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Grid from './Grid';
import Api from '../modules/Api';
import { getChildren, getLocations } from './LabHelpers';

class Edit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      error: "",
      lab: {},
      container: {},
      containers: [],
      physicals: [],
      locations: {
        empty: [],
        full: []
      },
      path: [],
      form: {
        name: "",
        description: "",
        rows: 0,
        columns: 0
      },
      virtuals: [],
      allContainers: [],
      isDragging: false,
      draggingOver: [],
      draggedRecord: {}
    };
    this.getData = this.getData.bind(this);
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
    let labId = this.props.match.params.labId;
    let containerId = this.props.match.params.containerId;
    const recordIsLab = labId ? true : false;
    const route = recordIsLab ? `labs/${labId}/edit` : `containers/${containerId}/edit`;
    Api.post(route, formData)
    .then((res) => {
      this.props.debugging && console.log(`update ${recordIsLab ? 'lab' : 'container'} res`, res);
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

  async getDataAsync() {
    // get labs and containers
    try {
      const labId = this.props.match.params.labId;
      const containerId = this.props.match.params.containerId;
      if (labId) {
        const getLabRes = await Api.get(`labs/${labId}`);
        const lab = getLabRes.data;
        const getContainersRes = await Api.get('containers');
        const allContainers = getContainersRes.data || [];
        const getVirtualsRes = await Api.get('virtuals');
        const virtuals = getVirtualsRes.data || [];
        const { containers, physicals } = getChildren(lab);
        const locations = getLocations(lab, containers, physicals); 
        const form = lab; 
        return { lab, allContainers, virtuals, containers, physicals, locations, form };
      }
      if (containerId) {
        const getContainerRes = await Api.get(`containers/${containerId}`);
        let container = getContainerRes.data;
        const form = container;
        const getContainersRes = await Api.get('containers');
        const allContainers = getContainersRes.data || [];
        const labId = container.lab._id;
        const getLabRes = await Api.get(`labs/${labId}`);
        const lab = getLabRes.data;
        const getPathRes = await Api.get(`labs/${lab._id}/container/${container._id}`);
        let pathArray = getPathRes.data || [];
        let path = [];
        for(let i = 0; i < pathArray.length; i++){
          if (pathArray[i] !== null) {
            path.push(pathArray[i]);
          }
        }
        const { containers, physicals } = getChildren(container);
        const locations = getLocations(container, containers, physicals); 
        return {
          path,
          lab,
          container,
          containers,
          physicals,
          allContainers,
          locations,
          form
        };        
      }  
    } catch (error) {
      throw error;
    }
  }

  getData() {
    this.getDataAsync()
    .then((res) => {
      this.setState(res);      
    })
    .catch((error) => {
      throw error;
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    let form = this.state.form;
    //let formValid = form.name.length > 0 && form.rows > 1 && form.columns > 1;
    const labId = this.props.match.params.labId;
    const containerId = this.props.match.params.containerId;
    const isLab = labId && labId.length > 0;
    const isContainer = containerId && containerId.length > 0;
    let formValid = this.state.form && this.state.form.name.length > 0;
    const recordIsLab = labId ? true : false;

    if (isLab && this.state.redirect === true) {
      return ( <Redirect to={`/labs/${labId}`}/> )
    }
    if (isContainer && this.state.redirect === true) {
      return ( <Redirect to={`/containers/${containerId}`}/> )
    }

    return (
      <div className="Edit container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">
            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <h4 className="card-title mb-0 text-capitalize">
                    <i className={`mdi mdi-${recordIsLab ? 'teach' : 'grid'} mr-2`}/>Edit {recordIsLab ? "Lab" : "Container"}
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
                          placeholder={recordIsLab ? 'Lab Name' : 'Container Name'}
                        />
                        <small className="form-text text-muted">Required - The name of your {recordIsLab ? 'Lab' : 'Container'}. This will be public and visible to other {recordIsLab ? 'Lab' : 'Container'}s.</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="name">Description</label>
                        <input 
                          name="description"
                          type="text"
                          className="form-control"
                          value={this.state.form.description}
                          onChange={this.updateField}
                          placeholder={`A short description of the ${recordIsLab ? 'Lab' : 'Container'}.`}
                        />
                        <small className="form-text text-muted">Optional - Share a bit more detail on your {recordIsLab ? 'Lab' : 'Container'}. Visible to the public and other {recordIsLab ? 'Lab' : 'Container'}s.</small>
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
                          Required - The number of columns in the grid representing your {recordIsLab ? 'Lab' : 'Container'} area from a top-down view. Change to a value greater than 1.
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
                        <small className="form-text text-muted">Required - The number of rows in the grid representing your {recordIsLab ? 'Lab' : 'Container'} area from a top-down view. Change to a value greater than 1.</small>
                      </div>

                      <div className="form-group text-center">
                        <div className="btn-group" role="group" aria-label="Basic example">
                          <Link to={`/labs/${this.props.match.params.labId}`} className="btn btn-secondary mt-3">Back</Link>
                          <button 
                            type="submit" 
                            className="btn btn-success mt-3"
                            disabled={!formValid}
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
                recordType="Lab"
                record={this.state.form}
                containers={labContainers}
                physicals={labPhysicals}
              /> */}
              <Grid 
                record={recordIsLab ? this.state.lab : this.state.container}
                recordType={recordIsLab ? 'Lab' : 'Container'}
                moveActive={this.props.isLoggedIn}
                containers={this.state.containers}
                physicals={this.state.physicals}
                locations={this.state.locations}
                //isDragging={this.state.isDragging}
                //draggingOver={this.state.draggingOver}
                //draggedRecord={this.state.draggedRecord}
                //onCellDrag={this.onCellDrag}
                //onCellDragStart={this.onCellDragStart}
                //onCellDragOver={this.onCellDragOver}
                //onCellDrop={this.onCellDrop}
                //onCellDragEnd={this.onCellDragEnd}
              /> 
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

export default Edit;
