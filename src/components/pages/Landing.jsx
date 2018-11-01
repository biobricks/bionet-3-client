import React, { Component } from 'react';
import shortid from 'shortid';
import moment from 'moment';
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
      graphData: {},
      itemIsHovered: false,
      itemIsClicked: false,
      itemTypeHovered: "",
      itemTypeClicked: "",
      itemHovered: {},
      itemClicked: {}
    };
    this.getItemByType = this.getItemByType.bind(this);
    this.getData = this.getData.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleNodeHover = this.handleNodeHover.bind(this);
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

    state.graphData = Graph.getOverview(this.props.currentUser, state.users, state.labs, state.virtuals, state.containers, state.physicals);
    return state;
  }

  handleNodeClick(node) {
    // change state
    let {id, type} = node;
    let response = this.getItemByType(id,type);
    this.setState({
      itemIsClicked: true,
      itemTypeClicked: type,
      itemClicked: response,
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
          itemHovered: response 
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
    this.getData()
    .then((res) => {
      this.setState(res);
      this.props.setReady(true);
      //console.log(res.graphData);
    });
  }

  render() {
    let item = this.state.itemIsClicked ? this.state.itemClicked : this.state.itemIsHovered ? this.state.itemHovered : null;
    let itemAttrArray = item ? Object.keys(item) : [];
    let itemType = this.state.itemIsClicked ? this.state.itemTypeClicked : this.state.itemIsHovered ? this.state.itemTypeHovered : null;
    let itemIconClasses, itemTitle;
    switch(itemType) {
      case 'User':
        itemTitle = item.username;
        itemIconClasses = 'mdi mdi-account mr-2';
        break;
      case 'Lab':
        itemTitle = item.name;
        itemIconClasses = 'mdi mdi-teach mr-2';
        break;  
      case 'Container':
        itemTitle = item.name;
        itemIconClasses = 'mdi mdi-grid mr-2';
        break;
      case 'Physical':
        itemTitle = item.name;
        itemIconClasses = 'mdi mdi-flask mr-2';
        break;
      case 'Virtual':
        itemTitle = item.name;
        itemIconClasses = 'mdi mdi-dna mr-2';
        break;  
      default: 
        itemTitle = 'Navigate BioNet';
        itemIconClasses = 'mdi mdi-map-outline mr-2';
    }

    let itemAttributes;
    if (item && item !== false && Object.keys(item).length > 0) {
      let keyValArray = [];
      for(let i = 0; i < itemAttrArray.length; i++) {
        let itemAttr = itemAttrArray[i];
        let key = itemAttr;
        let val = item[itemAttr];
        if (key !== 'email' && key !== 'name' && key !== 'datName' && key !== 'datKey' && key !== 'bgColor' && key !== '_id' && typeof val == 'string'){
          keyValArray.push({ key, val });
        }
      }
    
      itemAttributes = keyValArray.map((attr, attrIndex) => {
        if (attr.key === 'createdAt' || attr.key === 'updatedAt') {
          let attrDate = new Date(attr.val);
          let fromNow = moment(attrDate).fromNow();
          return (
            <p key={shortid.generate()} className="card-text">
              <strong className="text-capitalize">{attr.key}</strong>: {fromNow}
            </p>
          );
        } else {
          return (
            <p key={shortid.generate()} className="card-text">
              <strong className="text-capitalize">{attr.key}</strong>: {attr.val}
            </p>
          );
        }
      });
    }

    return (
      <Loading {...this.props}>
        <div className="Landing graph container-fluid" style={{'backgroundColor': 'black'}}>
          <div className="row">
            <div className="col-12 col-lg-5">
              
              <Menu 
                {...this.props}
                {...this.state}
              />

            <div className="card mt-3 rounded-0">
              <div className="card-header rounded-0 bg-info text-light">
                <h4 className="card-title mb-0 text-capitalize">
                  <i className={itemIconClasses}/>{itemTitle}
                </h4>
              </div>
              {(item && item !== false && Object.keys(item).length > 0) ? (
                <div className="card-body">
                  {itemAttributes}
                </div>
              ) : (
                <div className="card-body"> 
                  <p className="card-text">
                    Hover or Click on any BioNode for details.
                  </p>
                </div>                
              )}  
            </div>

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
