import React, { Component } from 'react';
import Api from '../../modules/Api';
import Graph from '../../modules/Graph';
import Menu from '../partials/Menu/Menu';
import Loading from '../partials/Loading/Loading';
import ForceGraph from '../partials/ForceGraph/ForceGraph';
import './Landing.css';

class Landing extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      errors: [],
      users: [],
      labs: [],
      virtuals: [],
      physicals: [],
      containers: [],
      graphData: {},
      itemIsHovered: false,
      itemTypeHovered: "",
      itemHovered: {}
    };
    this.getData = this.getData.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleNodeHover = this.handleNodeHover.bind(this);
  }

  async getData() {
    let state = this.state;
    
    let getUsers = await Api.getAll('users');
    if (!getUsers.success) { 
      this.state.errors.push(getUsers.error); 
      this.props.setAlert('error', `${getUsers.message}: ${getUsers.error.code} - ${getUsers.error.message}`)
    } else { state.users = getUsers.users; }
    
    let getLabs = await Api.getAll('labs');
    if (!getLabs.success) { this.state.errors.push(getLabs.error); this.props.setAlert('error', `${getLabs.message}: ${getLabs.error.code} - ${getLabs.error.message}`)} else { state.labs = getLabs.labs; }

    let getVirtuals = await Api.getAll('virtuals');
    if (!getVirtuals.success) { this.state.errors.push(getVirtuals.error); this.props.setAlert('error', `${getVirtuals.message}: ${getVirtuals.error.code} - ${getVirtuals.error.message}`)} else { state.virtuals = getVirtuals.virtuals; }

    let getPhysicals = await Api.getAll('physicals');
    if (!getPhysicals.success) { this.state.errors.push(getPhysicals.error); this.props.setAlert('error', `${getPhysicals.message}: ${getPhysicals.error.code} - ${getPhysicals.error.message}`)} else { 
      //console.log('getData physicals', getPhysicals.physicals);
      state.physicals = getPhysicals.physicals; 
    }

    let getContainers = await Api.getAll('containers');
    if (!getContainers.success) { this.state.errors.push(getContainers.error); this.props.setAlert('error', `${getContainers.message}: ${getContainers.error.code} - ${getContainers.error.message}`)} else { state.containers = getContainers.containers; }
    
    if (state.errors.length === 0){
      state.success = true;
    }

    state.graphData = Graph.getOverview(state.users, state.labs, state.virtuals, state.containers, state.physicals);
    return state;
  }

  handleNodeClick(node) {
    console.log('handleNodeClick', node);
  }
  
  handleNodeHover(node) {
    if (node && Object.keys(node).length > 0) {
      //let hoveredItem = {};
      let {id, type} = node;
      let response;
      //console.log('handleNodeHover', type, id);
      switch(type) {
        case "User":
          for(let i = 0; i < this.state.users.length; i++){
            let user = this.state.users[i];
            if (user._id === id){
              response = user;
            }
          }
          break;
        case "Lab":
          for(let i = 0; i < this.state.labs.length; i++){
            let lab = this.state.labs[i];
            if (lab._id === id){
              response = lab;
            }
          }
          break; 
        case "Container":
          for(let i = 0; i < this.state.containers.length; i++){
            let container = this.state.containers[i];
            if (container._id === id){
              response = container;
            }
          }
          break;
        case "Virtual":
          for(let i = 0; i < this.state.virtuals.length; i++){
            let virtual = this.state.virtuals[i];
            if (virtual._id === id){
              response = virtual;
            }
          }
          break;
        case "Physical":
          for(let i = 0; i < this.state.physicals.length; i++){
            let physical = this.state.physicals[i];
            
            if (physical._id === id){
              response = physical;
            }
          }
          break;
        default:
          // response = null;         
      }
      this.setState({
        itemIsHovered: true,
        itemTypeHovered: type, 
        itemHovered: response 
      });
    } else {
      // this.setState({
      //   itemIsHovered: false,
      //   itemTypeHovered: "",
      //   itemHovered: {} 
      // });
    }  
  }

  componentDidMount() {
    this.getData()
    .then((res) => {
      this.setState(res);
      this.props.setReady(true);
      //console.log(res.graphData);
    });
  }

  render() {
    //const viewMode = this.props.viewMode;
    return (
      <Loading {...this.props}>
        <div className="Landing graph container-fluid" style={{'backgroundColor': 'black'}}>
          <div className="row">
            <div className="col-12 col-lg-5">
              <Menu 
                {...this.props}
                {...this.state}
              />
              {(this.state.itemIsHovered && Object.keys(this.state.itemHovered).length > 0) ? (
                <div className="card mt-3 rounded-0">
                  <div className="card-header rounded-0 bg-info text-light">
                    {(this.state.itemTypeHovered === 'User') ? (
                      <h4 className="card-title mb-0 text-capitalize">
                        <i className="mdi mdi-account mr-2"/>{this.state.itemHovered.username}
                      </h4>
                    ) : null }
                    {(this.state.itemTypeHovered === 'Lab') ? (
                      <h4 className="card-title mb-0 text-capitalize">
                        <i className="mdi mdi-teach mr-2"/>{this.state.itemHovered.name}
                      </h4>
                    ) : null }
                    {(this.state.itemTypeHovered === 'Container') ? (
                      <h4 className="card-title mb-0 text-capitalize">
                        <i className="mdi mdi-grid mr-2"/>{this.state.itemHovered.name}
                      </h4>
                    ) : null }
                    {(this.state.itemTypeHovered === 'Physical') ? (
                      <h4 className="card-title mb-0 text-capitalize">
                        <i className="mdi mdi-flask mr-2"/>{this.state.itemHovered.name}
                      </h4>
                    ) : null }
                    {(this.state.itemTypeHovered === 'Virtual') ? (
                      <h4 className="card-title mb-0 text-capitalize">
                        <i className="mdi mdi-dna mr-2"/>{this.state.itemHovered.name}
                      </h4>
                    ) : null }
                  </div>
                  <div className="card-body">
                    <p className="card-text">{this.state.itemHovered.description}</p>
                  </div>
                </div>
              ) : (
                <div className="card mt-3 rounded-0">
                  <div className="card-header rounded-0 bg-info text-light">
                    <h4 className="card-title mb-0 text-capitalize">Select Item</h4>
                  </div>
                  <div className="card-body">
                    Hover over an item on the graph to display details.
                  </div>
                </div>
              )}  
            </div>
            <div className="col-12 col-lg-7">
              <ForceGraph 
                {...this.props}
                {...this.state}
                graphData={this.state.graphData}
                handleNodeClick={this.handleNodeClick}
                handleNodeHover={this.handleNodeHover}
              />
            </div>  
          </div>
        </div>
      </Loading>
    );
  }

}

export default Landing;  