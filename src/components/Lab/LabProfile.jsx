import React from 'react';
import shortid from 'shortid';
import Grid from '../Grid/Grid';
import Containers from '../Container/Containers';
import Physicals from '../Physical/Physicals';
import LabToolbar from '../Lab/LabToolbar';
import Api from '../../modules/Api';

class LabProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: "",
      dragging: false,
      lab: {},
      containers: [],
      virtuals: []
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
  } 

  moveItem(item) {
    let itemType = Object.keys(item).indexOf('virtual') > -1 ? "Physical" : "Container";
    if (itemType === "Physical") {
      Api.post(`physicals/${item._id}/edit`, item)
      .then((res) => {
        this.props.refresh(this.props.currentUser);      
      })
      .catch((error) => {
        throw error;
      });
    } else {
      Api.post(`containers/${item._id}/edit`, item)
      .then((res) => {
        this.props.refresh(this.props.currentUser);    
      })
      .catch((error) => {
        throw error;
      });
    }
  }

  onCellDragStart(e) {
    console.log('onCellDragStart');
    // let selectedRecord = this.props.selectedRecord;
    // let children = selectedRecord.children || [];
    let children = this.state.containers.concat(this.props.physicals);
    //console.log(children);
    let originRow = Number(e.target.getAttribute('row'));
    let originColumn = Number(e.target.getAttribute('col'));
    //console.log('origin', originColumn, originRow);
    let draggedCell;
    for(let i = 0; i < children.length; i++){
      let child = children[i];
      if(String(child._id) === String(e.target.id)){
        draggedCell = child;
        for(let j = 0; j < draggedCell.locations.length; j++){
          let column = draggedCell.locations[j][0];
          let row = draggedCell.locations[j][1];
          if (column === originColumn && row === originRow){
            draggedCell['moveLocationIndex'] = j;
          }
        }
      }
    }
    //console.log('draggedCell: ', draggedCell);
    e.dataTransfer.setData("draggedCell", JSON.stringify(draggedCell));
  }

  onCellDragOver(e) {
    e.preventDefault();
  }

  onCellDragEnd(e) {
    //console.log('onCellDragEnd'); 
    this.setState({
      dragging: false
    }); 
  }

  onCellDrop(e) {
    console.log('onCellDrop');
    const draggedCell = JSON.parse(e.dataTransfer.getData("draggedCell"));
    //console.log('draggedCell+data', draggedCell);
    const targetCellRow = Number(e.target.getAttribute('row'));
    const targetCellColumn = Number(e.target.getAttribute('col'));
    draggedCell.locations[draggedCell.moveLocationIndex] = [targetCellColumn, targetCellRow];
    //const targetCellPosition = Number(e.target.getAttribute('pos'));
    //console.log(`Cell ${draggedCell.name} dragged and dropped to ${targetCellColumn}, ${targetCellRow}`);
    //console.log('updatedDraggedCell', draggedCell);
    this.moveItem(draggedCell);
    // this.setState({
    //   dragging: false
    // }); 
  }

  getData() {
    let labId = this.props.match.params.labId;
    Api.get(`labs/${labId}`)
    .then((res) => {
      this.setState({
        lab: res.data,
        virtuals: res.virtuals
      });      
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
    //console.log('LabProfile.onCancelRequestLabMembership.lab', lab);
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

  componentDidMount() {
    this.getData();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const lab = this.state.lab;
    const labUsers = lab.users || [];
    let userIsMember = false;
    if (isLoggedIn) {
      for (let i = 0; i < labUsers.length; i++) {
        let labUser = labUsers[i];
        console.log(`Lab user ${i}: `, labUser);
        console.log('CurrentUser', currentUser);
        if (String(labUser._id) === String(currentUser._id)) { 
          console.log('User is member of Lab');
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

    return (
      <div className="LabProfile container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">

            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark text-light">
                <div className="card-title mb-0 text-capitalize">
                  <span><i className="mdi mdi-xl mdi-teach" /> {lab.name}</span>
                  {isLoggedIn && ( 
                    <LabToolbar 
                      {...this.props}
                      type="Lab"
                      lab={this.state.lab}
                      onRevokeLabMembership={this.onRevokeLabMembership}
                      onRequestLabMembership={this.onRequestLabMembership}
                      onCancelRequestLabMembership={this.onCancelRequestLabMembership}
                    />
                  )}
                </div>
              </div>
            
              <div className="card-body">
                {(this.state.error.length > 0) ? (
                  <p className="card-text text-danger">
                    {this.state.error}
                  </p>
                ) : null}
                
                  {(lab.description && lab.description.length > 0) ? (
                    <p className="card-text">
                      {lab.description}
                    </p>
                  ) : (
                    <p className="card-text">
                      No description provided.
                    </p>
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
                containers={labContainers} 
                currentUser={this.props.currentUser}
                refresh={this.props.refresh}
                physicals={labPhysicals}                
              /> 

              <Physicals 
                isLoggedIn={isLoggedIn}
                userIsMember={userIsMember}
                containers={labContainers} 
                physicals={labPhysicals} 
                currentUser={this.props.currentUser}
                refresh={this.props.refresh}
              />

          </div>


          <div className="col-12 col-lg-5">
            <Grid 
              demo={false}
              selectLocations={false}
              recordType="Lab"
              record={this.state.lab}
              containers={labContainers}
              physicals={labPhysicals}
              dragging={this.state.dragging}
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

export default LabProfile;
