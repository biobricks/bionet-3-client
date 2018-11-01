import React, { Component } from 'react';
import Api from '../../modules/Api';
import Graph from '../../modules/Graph';
import Menu from '../partials/Menu/Menu';
import Loading from '../partials/Loading/Loading';
import ForceGraph from '../partials/ForceGraph/ForceGraph';
import VRForceGraph from '../partials/ForceGraph/VRForceGraph';
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
      graphDataType: "all",
      graphDataId: "",
      graphData: {},
      itemAction: "",
      itemEndpoint: "",
      itemIsHovered: false,
      itemIsClicked: false,
      itemTypeHovered: "",
      itemTypeClicked: "",
      itemHovered: {},
      itemClicked: {},
      itemSelected: {}
    };
    this.sortUsers = this.sortUsers.bind(this);
    this.getItemByType = this.getItemByType.bind(this);
    this.getData = this.getData.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleNodeHover = this.handleNodeHover.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  sortUsers(users) {

  }

  getItemByType(id, type) {
    let response = null;
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
    return response;    
  }

  async getAll(endpoint) {
    let getItems =  await Api.getAll(endpoint);
    if (getItems.success) {
      return getItems.result;
    } else {
      this.props.setAlert('error', `${getItems.message}: ${getItems.error.code} - ${getItems.error.message}`);
      return [];
    }
  }

  async getData() {
    let state = this.state;
    
    if (state.errors.length === 0){
      state.success = true;
    }

    let isLoggedIn = this.props.isLoggedIn;
    let params = this.props.match.params;
    let paramsExist = Object.keys(params).length > 0;

    if((isLoggedIn && !paramsExist) || !isLoggedIn){
      
      state.users = await this.getAll('users');
      state.labs  = await this.getAll('labs');
      state.virtuals  = await this.getAll('virtuals');
      state.physicals  = await this.getAll('physicals');
      state.containers  = await this.getAll('containers');
      state.graphData = Graph.getOverview(this.props.currentUser, state.users, state.labs, state.virtuals, state.containers, state.physicals);
      return state;
    } else if (isLoggedIn && paramsExist) {
      
      console.log('params', params);
      let {actionType, modelEndpoint} = params;
      state.itemAction = actionType;
      state.itemEndpoint = modelEndpoint;
      
      // view
      if (state.itemAction === 'list') {
        switch(state.itemEndpoint) {
          case 'labs':
            state.users = await this.getAll('users');
            state.labs  = await this.getAll('labs');
            state.graphData = Graph.getLabsByUser(this.props.currentUser, state.users, state.labs);
        }
      }
      return state;
    }
    
  }

  handleNodeClick(node) {
    // change state
    let {id, type} = node;
    let response = this.getItemByType(id,type);
    this.setState({
      itemIsClicked: true,
      itemTypeClicked: type,
      itemClicked: response,
      itemSelected: response
    });
    setTimeout(() => {
      this.setState({
        itemIsClicked: false
      });
    }, 2000);
  }
  
  handleNodeHover(node) {
    if (node && Object.keys(node).length > 0) {
      //let hoveredItem = {};
      let {id, type} = node;
      let response = this.getItemByType(id,type);
      //console.log('handleNodeHover', type, id);
      if(!this.state.itemIsClicked) {
        this.setState({
          itemIsHovered: true,
          itemTypeHovered: type, 
          itemHovered: response,
          itemSelected: response
        });
      }
    } else {
      // this.setState({
      //   itemIsHovered: false,
      //   itemTypeHovered: "",
      //   itemHovered: {} 
      // });
    }  
  }

  componentDidMount() {
    console.log('this.props.match.params: ', this.props.match.params);
    this.getData()
    .then((res) => {
      this.setState(res);
      this.props.setReady(true);
      //console.log(res.graphData);
    });
  }

  render() {

    return (
      <Loading {...this.props}>
        <div className="Landing graph container-fluid" style={{'backgroundColor': 'black'}}>
          <div className="row">
            <div className="col-12 col-lg-5">
              
              <Menu 
                {...this.props}
                {...this.state}
              />

            </div>
            {(Object.keys(this.state.graphData).length > 0) ? (
              <div className="col-12 col-lg-7">
                {(this.props.viewMode === 'VR') ? (
                  <VRForceGraph 
                    {...this.props}
                    {...this.state}
                    graphData={this.state.graphData}
                    handleNodeClick={this.handleNodeClick}
                    handleNodeHover={this.handleNodeHover}
                  />
                ) : (
                  <ForceGraph 
                    {...this.props}
                    {...this.state}
                    graphData={this.state.graphData}
                    handleNodeClick={this.handleNodeClick}
                    handleNodeHover={this.handleNodeHover}
                  />
                )}  
              </div> 
            ) : null }
          </div>
        </div>
      </Loading>
    );
  }

}

export default Landing;  
