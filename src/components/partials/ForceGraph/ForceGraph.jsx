import React, { Component } from 'react';
// import '../../../loader.js';
//import $ from 'jquery';
import FadeIn from 'react-fade-in';
//import Graph from '../../../modules/Graph';
import { ForceGraph2D, ForceGraph3D } from 'react-force-graph';
//import SpriteText from 'three-spritetext';
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
    console.log(width);
    this.setState({
      width: window.$('#graph').innerWidth()
    });
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
            {(viewMode === 'simple') ? (
              <div id="graph" className="graph-container">
              <ForceGraph2D
                ref={el => { this.fg = el; }}
                height={window.innerHeight - 60 - 60}
                width={this.state.width}
                graphData={graphData}
                nodeAutoColorBy="group"
                linkDirectionalParticleColor="green"
              />  
              </div>
            ) : null }
            {(this.props.mode === '3D') ? (
              <div>3D</div>
            ) : null }
          </FadeIn>
        ) : null }  
      </div>
    );
  }

}

export default ForceGraph;  