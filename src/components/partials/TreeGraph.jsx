import React, { Component } from 'react';
import Tree from "react-d3-tree";

class TreeGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: dimensions.height / 8
      }
    });    
  }

  render() {
    return (
      <div style={{'width': this.props.width, 'height': this.props.height}} ref={tc => (this.treeContainer = tc)}>
        <Tree 
          data={this.props.data} 
          translate={this.state.translate} 
          orientation={'vertical'}
        />
      </div>
    );
  }
}

export default TreeGraph;
