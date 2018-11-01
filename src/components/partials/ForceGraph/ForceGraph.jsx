import React, { Component } from 'react';
import FadeIn from 'react-fade-in';
//import Graph from '../../../modules/Graph';
import { ForceGraph3D } from 'react-force-graph';
import './ForceGraph.css';

class ForceGraph extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      width: 1
    };
    this.setWidth = this.setWidth.bind(this);
  }

  setWidth() {
    let width = window.$('#graph').innerWidth();
    this.setState({ width });
  }

  handleClick = node => {
    // Aim at node from outside it
    const distance = 60;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    this.fg.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      3000  // ms transition duration
    );
    this.props.handleNodeClick(node, );
  };

  componentDidMount() {
    if (this.props.ready) {
      // console.log('users', this.props.users);
      // console.log('labs', this.props.labs);
      //console.log('view mode', this.props.viewMode);
      this.setWidth();
      window.$(window).resize(() => {
        this.setWidth();
      });    
    }
  }

  render() {
    const documentReady = this.props.ready;
    const viewMode = this.props.viewMode;
    const graphData = this.props.graphData;
    return (
      <div className="ForceGraph">
        {documentReady ? (
          <FadeIn>
          
              <div id="graph" className="graph-container pt-3">

                <ForceGraph3D
                  ref={el => { this.fg = el; }}
                  height={window.innerHeight - 60 - 60}
                  width={this.state.width}
                  graphData={graphData}
                  nodeLabel="name"
                  nodeAutoColorBy="group"
                  numDimensions={viewMode === '3D' ? 3 : 2}
                  linkDirectionalParticles={2}
                  linkDirectionalParticleSpeed={0.001}
                  linkDirectionalParticleWidth={1}
                  // linkDirectionalParticleColor="green"
                  onNodeClick={this.handleClick}
                  onNodeHover={this.props.handleNodeHover}
                />
              </div>  
         
          </FadeIn>
        ) : null }  
      </div>
    );
  }

}

export default ForceGraph;  