import React, { Component } from 'react';
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
    this.handleClick = this.handleClick.bind(this);
    this.handleLinkHover = this.handleLinkHover.bind(this);
  }

  setWidth() {
    let width = window.$('#graph').innerWidth();
    this.setState({ width });
  }

  handleClick = node => {
    // Aim at node from outside it
    if (this.props.viewMode === '3D') {
      const distance = 60;
      const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
      this.fg.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        2000  // ms transition duration
      );
    }
    this.props.handleNodeClick(node);
  };

  handleLinkHover() {
    
  }

  shouldComponentUpdate() {
    //console.log('should update');
    return true;
  }

  componentWillReceiveProps() {
    //console.log('will receive props');
    //this.forceUpdate();
  }

  componentDidMount() {
      this.setWidth();
      window.$(window).resize(() => {
        this.setWidth();
      });    
  }

  render() {
    const viewMode = this.props.viewMode;
    const graphData = this.props.graphData;
    return (
      <div className="ForceGraph">
          <div id="graph" className="graph-container">
            <ForceGraph3D
              ref={el => { this.fg = el; }}
              height={window.innerHeight - 60 - 60 - 150}
              width={this.state.width}
              graphData={graphData}
              nodeLabel="name"
              nodeAutoColorBy="group"
              numDimensions={viewMode === '3D' ? 3 : 2}
              //nodeOpacity={.9}
              linkWidth={1.3}
              //linkOpacity={.35}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.001}
              linkDirectionalParticleWidth={1}
              // linkDirectionalParticleColor="green"
              //onNodeClick={this.handleClick}
              //onNodeHover={this.props.handleNodeHover}
              //onLinkHover={this.handleLinkHover}
              dagMode="td"
            />
          </div>  
      </div>
    );
  }

}

export default ForceGraph;  