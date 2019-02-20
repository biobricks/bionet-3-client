import React from 'react';
import shortid from 'shortid';
import Grid from '../Grid/Grid';
import Containers from '../Container/Containers';
import Physicals from '../Physical/Physicals';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import LabToolbar from '../Lab/LabToolbar';
import Api from '../../modules/Api';

class ContainerProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: "",
      path: [],
      lab: {},
      container: {},
      containers: [],
      physicalsMode: "List",
      physicals: [],
      physical: {},
      allContainers: []
    };
    this.getData = this.getData.bind(this);
    this.onRequestLabMembership = this.onRequestLabMembership.bind(this);
    this.onCancelRequestLabMembership = this.onCancelRequestLabMembership.bind(this);
    this.onAcceptRequestLabMembership = this.onAcceptRequestLabMembership.bind(this);
    this.onDenyRequestLabMembership = this.onDenyRequestLabMembership.bind(this);
    this.onRevokeLabMembership = this.onRevokeLabMembership.bind(this);
    this.updateLab = this.updateLab.bind(this);
    this.onCellDragStart = this.onCellDragStart.bind(this);
    this.onCellDragOver = this.onCellDragOver.bind(this);
    this.onCellDragEnd = this.onCellDragEnd.bind(this);
    this.onCellDrop = this.onCellDrop.bind(this);
    this.moveItem = this.moveItem.bind(this);
    this.changePhysicalsMode = this.changePhysicalsMode.bind(this);
  }

  changePhysicalsMode(mode, physical) {
    switch(mode) {
      case 'List':
        this.setState({
          physicalsMode: "List",
          physical: {}
        });
        break;
      case 'View': 
        this.setState({
          physicalsMode: "View",
          physical
        });
        break;
      case 'Edit':
        this.setState({
          physicalsMode: "Edit",
          physical
        });
        break;      
      case 'Delete':
        this.setState({
          physicalsMode: "Delete",
          physical
        });
        break;       
      default:
        this.setState({
          physicalsMode: "List",
          physical: {}
        });
    }
  }

  onPhysicalModeChangeClick(e) {
    //let physicalId = e.target.getAttribute('id');
    //console.log(physicalId);
  }

  moveItem(item) {
    let itemType = Object.keys(item).indexOf('virtual') > -1 ? "Physical" : "Container";
    if (itemType === "Physical") {
      Api.post(`physicals/${item._id}/edit`, item)
      .then((res) => {
        //this.props.refresh(this.props.currentUser);
        this.getData();
      });
    } else {
      Api.post(`containers/${item._id}/edit`, item)
      .then((res) => {
        //this.props.refresh(this.props.currentUser);
        this.getData();
      });
    }
  }

  onCellDragStart(e) {
    this.props.debugging && console.log('onCellDragStart');
    const container = this.state.container;
    const itemId = e.target.getAttribute('id');
    let draggedCell;
    const containerExists = container && Object.keys(container).length > 0;
    const containerChildrenExist = containerExists && Object.keys(container).indexOf('children') > -1;
    const containerContainersExist = containerChildrenExist && Object.keys(container.children).indexOf('containers') > -1;
    const containerPhysicalsExist = containerChildrenExist && Object.keys(container.children).indexOf('physicals') > -1;
    const containerContainers = containerChildrenExist && containerContainersExist ? container.children.containers : [];
    const containerPhysicals = containerChildrenExist && containerPhysicalsExist ? container.children.physicals : [];
    for(let i = 0; i < containerContainers.length; i++){
      let childContainer = containerContainers[i];
      if (childContainer._id === itemId) {
        draggedCell = childContainer;
      }
    }
    for(let i = 0; i < containerPhysicals.length; i++){
      let childPhysical = containerPhysicals[i];
      if (childPhysical._id === itemId) {
        draggedCell = childPhysical;
      }
    }
    this.props.debugging && console.log('draggedCell: ', draggedCell);
    e.dataTransfer.setData("draggedCell", JSON.stringify(draggedCell));
  }

  onCellDragOver(e) {
    e.preventDefault();
  }

  onCellDragEnd(e) {
    this.setState({
      dragging: false
    }); 
  }

  onCellDrop(e) {
    console.log('onCellDrop');
    const draggedCell = JSON.parse(e.dataTransfer.getData("draggedCell"));
    console.log('draggedCell+data', draggedCell);
    draggedCell.row = Number(e.target.getAttribute('row'));
    draggedCell.column = Number(e.target.getAttribute('col'));
    this.moveItem(draggedCell);
  }

  async getDataAsync() {
    try {
      const containerId = this.props.match.params.containerId;
      const getContainerRes = await Api.get(`containers/${containerId}`);
      let container = getContainerRes.data;
      const getContainersRes = await Api.get('containers');
      const allContainers = getContainersRes.data || [];
      const containerExists = container && Object.keys(container).length > 0;
      const containerChildrenExist = containerExists && Object.keys(container).indexOf('children') > -1;
      const containerContainersExist = containerChildrenExist && Object.keys(container.children).indexOf('containers') > -1;
      const containerPhysicalsExist = containerChildrenExist && Object.keys(container.children).indexOf('physicals') > -1;
      const containers = containerChildrenExist && containerContainersExist ? container.children.containers : [];
      const physicals = containerChildrenExist && containerPhysicalsExist ? container.children.physicals : [];
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
      return {
        path,
        lab,
        container,
        containers,
        physicals,
        allContainers
      };
    } catch (error) {
      throw error;
    }
  }

  getData() {
    this.getDataAsync()
    .then((res) => {
      this.setState(res);
    });
  }

  onRequestLabMembership(e) {
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      joinRequests.push(request._id);
    };
    joinRequests.push(this.props.currentUser._id);
    lab.users = users;
    lab.joinRequests = joinRequests;
    //console.log(lab);
    this.updateLab(lab);
  }

  onCancelRequestLabMembership(e) {
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      if (this.props.currentUser._id !== request._id){
        joinRequests.push(request._id);
      }
    };
    lab.users = users;
    lab.joinRequests = joinRequests;
    console.log('LabProfile.onCancelRequestLabMembership.lab', lab);
    this.updateLab(lab);
  }

  onAcceptRequestLabMembership(e) {
    let acceptedRequestId = e.target.getAttribute('userid');
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    users.push(acceptedRequestId);
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      if (acceptedRequestId !== request._id){
        joinRequests.push(request._id);
      }
    };
    lab.users = users;
    lab.joinRequests = joinRequests;
    this.updateLab(lab);
  }

  onDenyRequestLabMembership(e) {
    let deniedRequestId = e.target.getAttribute('userid');
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    for(let i = 0; i < lab.users.length; i++){
      let user = lab.users[i];
      users.push(user._id);
    };
    for(let i = 0; i < lab.joinRequests.length; i++){
      let request = lab.joinRequests[i];
      if (deniedRequestId !== request._id){
        joinRequests.push(request._id);
      }
    };
    lab.users = users;
    lab.joinRequests = joinRequests;
    this.updateLab(lab);
  }

  onRevokeLabMembership(e) {
    let lab = this.state.lab;
    let users = [];
    let joinRequests = [];
    if (lab.users.length === 1){
      this.setState({ 
        error: "You are the last member of this Lab. You must Delete the Lab to leave it."
      });
    } else {
      for(let i = 0; i < lab.users.length; i++){
        let user = lab.users[i];
        if (user._id !== this.props.currentUser._id){
          users.push(user._id);
        }  
      };
      for(let i = 0; i < lab.joinRequests.length; i++){
        let request = lab.joinRequests[i];
        joinRequests.push(request._id);
      };
      lab.users = users;
      lab.joinRequests = joinRequests;
      this.updateLab(lab);
    }      
  }
  
  updateLab(lab) {
    Api.post(`labs/${lab._id}/edit`, lab)
    .then((res) => {
      this.getData();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const containerId = this.props.match.params.containerId;
    //console.log('Container ID', containerId);
    const prevContainerId = prevProps.match.params.containerId;
    //console.log('Previous Container ID', prevContainerId);
    const containerIdHasChanged = String(containerId) !== String(prevContainerId);
    if (containerIdHasChanged) { this.getData() }
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const lab = this.state.lab;
    const container = this.state.container;
    const labUsers = lab.users || [];
    let userIsMember = false;
    if (isLoggedIn) {
      for (let i = 0; i < labUsers.length; i++) {
        let labUser = labUsers[i];
        if (String(labUser._id) === String(currentUser._id)) { 
          userIsMember = true; 
        }
      }
    }

    const membershipRequests = isLoggedIn && lab.joinRequests ? lab.joinRequests.map((user, index) => {
      return (
        <div 
          key={shortid.generate()}
          className="join-request d-block"
        >
          <span className="float-left"><i className="mdi mdi-account mr-2"/>{user.username}</span>
          <div className="btn-group float-right ml-2">
            <button 
              className="btn btn-sm btn-success"
              userid={user._id}
              onClick={this.onAcceptRequestLabMembership}
            >
              <i className="mdi mdi-account-check mr-2" />Approve
            </button>
            <button 
              className="btn btn-sm btn-danger"
              userid={user._id}
              onClick={this.onDenyRequestLabMembership}
            >
              <i className="mdi mdi-account-minus mr-2" />Deny
            </button>
          </div>
        </div>
      )
    }) : [];

    const containerExists = container && Object.keys(container).length > 0;
    const containerChildrenExist = containerExists && Object.keys(container).indexOf('children') > -1;
    const containerContainersExist = containerChildrenExist && Object.keys(container.children).indexOf('containers') > -1;
    const containerPhysicalsExist = containerChildrenExist && Object.keys(container.children).indexOf('physicals') > -1;

    const containerContainers = containerChildrenExist && containerContainersExist ? container.children.containers : [];
    const containerPhysicals = containerChildrenExist && containerPhysicalsExist ? container.children.physicals : [];


    return (
      <div className="ContainerProfile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">

            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <span><i className="mdi mdi-xl mdi-grid" />{container.name}</span>
                  {isLoggedIn && (
                    <LabToolbar 
                      {...this.props}
                      type="Container"
                      lab={this.state.lab}
                      onRevokeLabMembership={this.onRevokeLabMembership}
                      onRequestLabMembership={this.onRequestLabMembership}
                      onCancelRequestLabMembership={this.onCancelRequestLabMembership}
                    />
                  )}
                </div>
              </div>


              {(this.state.path.length > 0) ? (
                <Breadcrumbs 
                  path={this.state.path}
                  lab={lab}
                  item={container}
                />
              ) : null }
              <div className="card-body">
                {(this.state.error.length > 0) ? (
                  <p className="card-text text-danger">
                    {this.state.error}
                  </p>
                ) : null}
                
                  {container.description && container.description.length > 0 ? (
                    <p className="card-text">{container.description}</p>
                  ) : (
                    <p className="card-text">No description provided.</p>
                  )}
                {(isLoggedIn && userIsMember && lab && lab.joinRequests && lab.joinRequests.length > 0) ? (
                  <>
                  <h5>Membership Requests</h5> 
                  {membershipRequests}
                  </>
                ) : null }
              </div>
 
            </div>

              <Containers 
                isLoggedIn={isLoggedIn}
                userIsMember={userIsMember}
                containers={containerContainers} 
                currentUser={this.props.currentUser}
                refresh={this.getData}
                physicals={containerPhysicals} 
                allContainers={this.state.allContainers} 
                lab={this.state.lab}              
              /> 
              
              <Physicals 
                isLoggedIn={isLoggedIn}
                userIsMember={userIsMember}
                containers={containerContainers} 
                physicals={containerPhysicals} 
                currentUser={this.props.currentUser}
                refresh={this.props.refresh}
              />   

          </div>


          <div className="col-12 col-lg-5">
            <Grid 
              demo={false}
              selectLocations={false}
              recordType="Container"
              record={this.state.container}
              containers={containerContainers}
              physicals={containerPhysicals}
              dragging={this.state.dragging}
              onCellDragStart={this.onCellDragStart}
              onCellDragOver={this.onCellDragOver}
              onCellDrop={this.onCellDrop}
              onCellDragEnd={this.onCellDragEnd}
              {...this.state}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default ContainerProfile;
