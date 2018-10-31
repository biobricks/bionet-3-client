import React, { Component } from 'react';
import FadeIn from 'react-fade-in';
//import Graph from '../../../modules/Graph';
import { ForceGraph2D, ForceGraph3D } from 'react-force-graph';
import SpriteText from 'three-spritetext';
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
      <div className="ForceGraph viewport-container">
        {documentReady ? (
          <FadeIn>
          
              <div id="graph" className="graph-container">
                <ForceGraph3D
                  ref={el => { this.fg = el; }}
                  height={window.innerHeight - 60 - 60}
                  width={this.state.width}
                  graphData={graphData}
                  // nodeThreeObject={this.state.textMode === true ? node => {
                  //   const sprite = new SpriteText(node.name);
                  //   sprite.color = node.color;
                  //   sprite.textHeight = 8;
                  //   return sprite;
                  // } : null } 
                  nodeLabel="name"
                  nodeAutoColorBy="group"
                  numDimensions={viewMode === '3D' ? 3 : 2}
                  linkDirectionalParticles={2}
                  linkDirectionalParticleSpeed={0.001}
                  linkDirectionalParticleWidth={1}
                  // linkDirectionalParticleColor="green"
                  //onNodeClick={this.handleNodeClick}
                  //onNodeHover={this.handleNodeHover}
                />
              </div>  
         
          </FadeIn>
        ) : null }  
      </div>
    );
  }

}

export default ForceGraph;  