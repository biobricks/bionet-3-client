import React, { Component } from 'react';
import axios from "axios";
import appConfig from '../../configuration.js';
import Loading from '../partials/Loading/Loading';
import FadeIn from 'react-fade-in';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';
import SpriteText from 'three-spritetext';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      labContainers: [],
      level3Containers: [],
      users: [],
      labs: [],
      labsJoined: [],
      labsNotJoined: [],
      labsRequestPending: [],
      data: {
        nodes: [],
        links: []
      },
      textMode: false
    };
    this.getData = this.getData.bind(this);
    this.setGraphData = this.setGraphData.bind(this);
    this.toggleTextMode = this.toggleTextMode.bind(this);
  }  

  getData() {
    axios.get(`${appConfig.apiBaseUrl}/labs`)
    .then(res => {
      let labArray = res.data.data;
      let labsJoined = [];
      let labsNotJoined = [];
      let labsRequestPending = [];
      let labsAll = [];
      for(let i = 0; i < labArray.length; i++){
        let lab = labArray[i];
        let userId = this.props.currentUser._id;
        let userExistsInLab = false;
        for(let j = 0; j < lab.users.length; j++){
          let labUserId = lab.users[j]._id;
          if (labUserId === userId){
            userExistsInLab = true;
          }
        }
        let userRequestPending = false;
        for(let k = 0; k < lab.joinRequests.length; k++){
          let requesterId = lab.joinRequests[k]._id;
          if (requesterId === userId){
            userRequestPending = true;
          }
        }
        if (!userExistsInLab && !userRequestPending) {
          labsNotJoined.push(lab);
        } else if (!userExistsInLab && userRequestPending) {
          labsRequestPending.push(lab);
        } else {
          labsJoined.push(lab)
        }
        labsAll.push(lab);         
      }
      axios.get(`${appConfig.apiBaseUrl}/users`)
      .then(res => {
        let users = res.data.data;
        axios.get(`${appConfig.apiBaseUrl}/containers`)
        .then(res => {
          let containersAll = res.data.data;
          let labContainers = [];
          let level3Containers = [];
          for(let i = 0; i < containersAll.length; i++){
            let container = containersAll[i];
            if (container.parent === null) {
              labContainers.push(container);
            } else {
              level3Containers.push(container);
            }
          }
          this.setState({
            labContainers,
            level3Containers,
            users,
            labs: labsAll,
            labsJoined,
            labsNotJoined,
            labsRequestPending
          });
          this.setGraphData();
        })
        .catch(error => {
          console.error(error);        
        }); 
      })
      .catch(error => {
        console.error(error);        
      });       
    })
    .catch(error => {
      console.error(error);        
    });    
  }

  setGraphData() {
    let data = this.state.data;
    let labs = this.state.labs;
    let users = this.state.users;
    // add users
    for(let i = 0; i < users.length; i++){
      let user = users[i];
      let userNode = {
        id: user._id,
        name: user.username,
        value: 30,
        group: "user"
      };
      data.nodes.push(userNode);
    }
    // add labs
    for(let i = 0; i < labs.length; i++){
      let lab = labs[i];
      let labNode = {
        id: lab._id,
        name: lab.name,
        value: 30,
        group: lab._id
      };
      data.nodes.push(labNode);
      // connect labs to labs
      for(let j = 0; j < labs.length; j++){
        let targetLab = labs[j];
        let link = {
          source: lab._id, 
          target: targetLab._id          
        };
        if (targetLab._id !== lab._id) {
          data.links.push(link);
        }
      }
      for(let k = 0; k < lab.users.length; k++){
        // connect lab to its members
        let member = lab.users[k];
        let memberLink = {
          source: member._id, 
          target: lab._id   
        };
        data.links.push(memberLink);
      }
    }
    this.setState({
      loaded: true,
      data
    })
  }

  toggleTextMode(e) {
    this.setState({
      textMode: !this.state.textMode
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {

    const isLoaded = this.state.loaded;

    // const labs = this.state.labs || [];
    // const labContainers = this.state.labContainers || [];
    // const level3Containers = this.state.level3Containers || [];
    const myData = this.state.data;
    return (      
      <FadeIn>
        {(isLoaded) ? (
          <div className="graph-container">
            <div className="panel">
              <h4 className="text-info text-center mb-0">Welcome To BioNet</h4>
              <ul className="list-group list-group-flush">
                {(this.state.textMode) ? (
                  <button 
                    className="list-group-item list-group-item-action btn bg-info text-light"
                    onClick={this.toggleTextMode}
                  ><i className="mdi mdi-circle-slice-8 mr-3"/>Round Nodes</button>
                ) : (
                  <button 
                    className="list-group-item list-group-item-action btn bg-info text-light"
                    onClick={this.toggleTextMode}
                  ><i className="mdi mdi-format-letter-case mr-3"/>Text Nodes</button>
                )}
              </ul>
            </div>
            <ForceGraph3D
              graphData={myData}
              nodeThreeObject={this.state.textMode === true ? node => {
                const sprite = new SpriteText(node.name);
                sprite.color = node.color;
                sprite.textHeight = 8;
                return sprite;
              } : null } 
              nodeAutoColorBy="group"
              linkDirectionalParticles={3}
              linkDirectionalParticleSpeed={0.005}
              linkDirectionalParticleWidth={1}
              linkDirectionalParticleColor="green"
            />
          </div>
        ) : (
          <div 
            className="row justify-content-center align-items-center"
            style={{'minHeight': '100vh'}}
          >
            <Loading />
          </div>
        )}  
      </FadeIn>
    );

  }
}

export default Landing;
