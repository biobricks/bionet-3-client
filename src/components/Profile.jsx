import React from 'react';
import shortid from 'shortid';
import Grid from './Grid';
//import Tree from './Tree';
import Containers from './Containers';
import Physicals from './Physicals';
import LabToolbar from './LabToolbar';
import Api from '../modules/Api';
import Breadcrumbs from './Breadcrumbs';
import Loading from './Loading';
import { getItemById, getChildren, getLocations } from './LabHelpers';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recordLoaded: false,
      error: "",
      path: [],
      lab: {},
      container: {},
      containers: [],
      physicals: [],
      locations: {
        empty: [],
        full: []
      },
      virtuals: [],
      allContainers: [],
      isDragging: false,
      draggingOver: [],
      draggedRecord: {}
    };
    this.getData = this.getData.bind(this);
    this.onRequestLabMembership = this.onRequestLabMembership.bind(this);
    this.onCancelRequestLabMembership = this.onCancelRequestLabMembership.bind(this);
    this.onAcceptRequestLabMembership = this.onAcceptRequestLabMembership.bind(this);
    this.onDenyRequestLabMembership = this.onDenyRequestLabMembership.bind(this);
    this.onRevokeLabMembership = this.onRevokeLabMembership.bind(this);
    this.updateLab = this.updateLab.bind(this);
    this.onCellDrag = this.onCellDrag.bind(this);
    this.onCellDragStart = this.onCellDragStart.bind(this);
    this.onCellDragOver = this.onCellDragOver.bind(this);
    this.onCellDragEnd = this.onCellDragEnd.bind(this);
    this.onCellDrop = this.onCellDrop.bind(this);
    this.moveItem = this.moveItem.bind(this);
  } 

  moveItem(item) {
    let itemType = Object.keys(item).indexOf('virtual') > -1 ? "Physical" : "Container";
    if (itemType === "Physical") {
      Api.post(`physicals/${item._id}/edit`, item)
      .then((res) => { 
        this.getData();     
      })
      .catch((error) => {
        throw error;
      });
    } else {
      Api.post(`containers/${item._id}/edit`, item)
      .then((res) => {
        this.getData();    
      })
      .catch((error) => {
        throw error;
      });
    }
  }

  onCellDragStart(e) {
    this.props.debugging && console.log('onCellDragStart');
    const itemId = e.target.getAttribute('id');
    let labContainers = this.state.containers;
    let labPhysicals = this.state.physicals;
    let draggedCell = getItemById(itemId, labContainers, labPhysicals);
    //this.props.debugging && console.log('draggedCell: ', draggedCell);
    e.dataTransfer.setData("draggedCell", JSON.stringify(draggedCell));
  }

  onCellDrag(e) {
    const draggedRecord = this.state.draggedRecord;
    let draggedRecordExists = Object.keys(draggedRecord).length > 0;
    if (!draggedRecordExists) {
      const itemId = e.target.getAttribute('id');
      let labContainers = this.state.containers;
      let labPhysicals = this.state.physicals;
      let draggedCell = getItemById(itemId, labContainers, labPhysicals);
      this.setState({
        isDragging: true,
        draggedRecord: draggedCell
      });
    }  
  }

  onCellDragOver(e) {
    e.preventDefault(); 
    //const row = Number(e.target.getAttribute('row'));
    //const column = Number(e.target.getAttribute('column'));
    // const draggedCell = this.state.draggedRecord;
    // const width = draggedCell.columnSpan;
    // const height = draggedCell.rowSpan;
    // console.log('hovered', [hoveredRow, hoveredColumn]);
    // console.log(`Dragged cell width/height`, width, height);
    //let location = [row, column];
    //console.log(`dragging over`, location);

    //this.setState({draggingOver: location});
  }

  onCellDragEnd(e) {
    // this.setState({
    //   isDragging: false,
    //   draggedRecord: {}
    // });
  }

  onCellDrop(e) {
    console.log('onCellDrop');
    const draggedCell = JSON.parse(e.dataTransfer.getData("draggedCell"));
    draggedCell.row = Number(e.target.getAttribute('row'));
    draggedCell.column = Number(e.target.getAttribute('column'));
    this.moveItem(draggedCell);
    this.setState({
      isDragging: false,
      draggedRecord: {}
    });
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
        return { lab, allContainers, virtuals, containers, physicals, locations, recordLoaded: true };
      }
      if (containerId) {
        const getContainerRes = await Api.get(`containers/${containerId}`);
        let container = getContainerRes.data;
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
          recordLoaded: true
        };        
      }
    } catch (error) {
      throw error;
    }
  }

  getData() {
    this.setState({recordLoaded: false});
    this.getDataAsync()
    .then((res) => {
      const labId = this.props.match.params.labId;
      const containerId = this.props.match.params.containerId;
      if (labId || containerId){
        this.setState(res);
      }        
    })
    .catch((error) => {
      throw error;
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
    Api.post(`labs/${lab._id}/membership`, lab)
    .then((res) => {
      this.getData();      
    })
    .catch((error) => {
      throw error;
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const labId = this.props.match.params.labId;
    const containerId = this.props.match.params.containerId;
    //console.log('Lab ID', labId);
    const prevLabId = prevProps.match.params.labId;
    const prevContainerId = prevProps.match.params.containerId;
    //console.log('Previous Lab ID', prevLabId);
    const labIdHasChanged = String(labId) !== String(prevLabId);
    if (labIdHasChanged) { 
      this.getData() 
    }
    const containerIdHasChanged = String(containerId) !== String(prevContainerId);
    if (containerIdHasChanged) { 
      this.getData() 
    }
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;

    const labId = this.props.match.params.labId;
    const recordIsLab = labId ? true : false;

    const lab = this.state.lab;
    const container = this.state.container;
    const labUsers = lab ? lab.users : [];
    let userIsMember = false;
    if (isLoggedIn && labUsers) {
      for (let i = 0; i < labUsers.length; i++) {
        let labUser = labUsers[i];
        //this.props.debugging && console.log(`Lab user ${i}: `, labUser);
        //this.props.debugging && console.log('CurrentUser', currentUser);
        if (String(labUser._id) === String(currentUser._id)) { 
          //this.props.debugging && console.log('User is member of Lab');
          userIsMember = true; 
        }
      }
    }
    
    const labExists = lab && Object.keys(lab).length > 0;
    const labChildrenExist = labExists && Object.keys(lab).indexOf('children') > -1;
    const labContainersExist = labChildrenExist && Object.keys(lab.children).indexOf('containers') > -1;
    const labPhysicalsExist = labChildrenExist && Object.keys(lab.children).indexOf('physicals') > -1;
    const labContainers = labExists && labChildrenExist && labContainersExist ? lab.children.containers : [];
    const labPhysicals = labExists && labChildrenExist && labPhysicalsExist ? lab.children.physicals : [];

    const containerExists = container && Object.keys(container).length > 0;
    const containerChildrenExist = containerExists && Object.keys(container).indexOf('children') > -1;
    const containerContainersExist = containerChildrenExist && Object.keys(container.children).indexOf('containers') > -1;
    const containerPhysicalsExist = containerChildrenExist && Object.keys(container.children).indexOf('physicals') > -1;

    const containerContainers = containerChildrenExist && containerContainersExist ? container.children.containers : [];
    const containerPhysicals = containerChildrenExist && containerPhysicalsExist ? container.children.physicals : [];

    const membershipRequests = isLoggedIn && lab && lab.joinRequests ? lab.joinRequests.map((user, index) => {
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

    if (!this.state.recordLoaded) {
      return <Loading />
    }

    return (
      <div className="Profile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">

            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <span style={{'fontSize': '1.4em'}}>
                    <i className={recordIsLab ? "mdi mdi-xl mdi-teach mr-2" : "mdi mdi-xl mdi-grid mr-2"} />
                    {recordIsLab ? lab ? lab.name : 'Error' : container ? container.name : 'Error'}
                  </span>
                  {isLoggedIn && ( 
                    <LabToolbar 
                      {...this.props}
                      type={recordIsLab ? "Lab" : "Container"}
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
                
                {lab && (
                  <>
                  {(lab.description && lab.description.length > 0) ? (
                    <p className="card-text">
                      {lab.description}
                    </p>
                  ) : (
                    <p className="card-text">
                      No description provided.
                    </p>
                  )}
                  </>
                )}  
                {(isLoggedIn && userIsMember && lab && lab.joinRequests && lab.joinRequests.length > 0) ? (
                  <>
                  <h5>Membership Requests</h5> 
                  {membershipRequests}
                  </>
                ) : null }
              </div>
    
            </div>

              {/* <Tree record={lab} /> */}

              <Containers 
                isLoggedIn={isLoggedIn}
                userIsMember={userIsMember}
                containers={recordIsLab ? labContainers : containerContainers} 
                currentUser={this.props.currentUser}
                refresh={this.getData}
                physicals={recordIsLab ? labPhysicals : containerPhysicals}  
                allContainers={this.state.allContainers} 
                lab={this.state.lab}               
              /> 

              <Physicals 
                isLoggedIn={isLoggedIn}
                userIsMember={userIsMember}
                containers={labContainers} 
                physicals={labPhysicals} 
                currentUser={this.props.currentUser}
                refresh={this.getData}
                allContainers={this.state.allContainers} 
                lab={this.state.lab} 
              />

          </div>

          
          <div className="col-12 col-lg-5">
            <Grid 
              record={recordIsLab ? this.state.lab : this.state.container}
              recordType={recordIsLab ? "Lab" : "Container"}
              moveActive={this.props.isLoggedIn}
              containers={this.state.containers}
              physicals={this.state.physicals}
              locations={this.state.locations}
              isDragging={this.state.isDragging}
              draggingOver={this.state.draggingOver}
              draggedRecord={this.state.draggedRecord}
              onCellDrag={this.onCellDrag}
              onCellDragStart={this.onCellDragStart}
              onCellDragOver={this.onCellDragOver}
              onCellDrop={this.onCellDrop}
              onCellDragEnd={this.onCellDragEnd}
            />            
          </div>

        </div>
      </div>
    );
  }
}

export default Profile;
