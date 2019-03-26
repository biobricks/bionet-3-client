import React, { Component } from 'react';
import { Treebeard } from 'react-treebeard';
//import { Link } from 'react-router-dom';
//import shortid from 'shortid';;

class Tree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cursor: {},
      data: {}
    };
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled){
    let cursor = this.state.cursor;
    console.log(node, toggled, cursor);
    if(cursor){
      cursor.active = false;
      this.setState({cursor});
    }
    node.active = true;
    if(node.children){ node.toggled = toggled; }
    this.setState({ cursor: node });
  }

  render() {
    const record = this.props.record;
    const treeData = {
      name: record.name,
      toggled: true,
      children: [
        {
          name: 'Child 1',
          children: [
            { name: 'Grandchild 1' },
            { name: 'Grandchild 2' }
          ]
        },
        {
          name: 'Child 2',
          children: [
            { name: 'Grandchild 3' },
            { name: 'Grandchild 4' }
          ]
        }
      ]
    };
    return (
      <div className="LabTree card rounded-0 mt-3 mb-3">
        <div className="card-header bg-dark-green text-light rounded-0">
          <h5 className="card-title mb-0 text-capitalize">
            <i className="mdi mdi-file-tree mr-2"/>{record.name} Contents
          </h5>
        </div>
        <div className="card-body">
          <Treebeard
            data={treeData}
            onToggle={this.onToggle}
          />
        </div>
      </div>
    );
  }
}

export default Tree;