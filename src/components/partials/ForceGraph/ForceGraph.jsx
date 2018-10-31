import React, { Component } from 'react';
import FadeIn from 'react-fade-in';
//import Graph from '../../../modules/Graph';
import './ForceGraph.css';

class ForceGraph extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    if (this.props.ready) {
      console.log('users', this.props.users);
      console.log('labs', this.props.labs);
    }
  }

  render() {
    const documentReady = this.props.ready;
    
    return (
      <div className="Template viewport-container">
        {documentReady ? (
          <FadeIn>

          </FadeIn>
        ) : null }  
      </div>
    );
  }

}

export default ForceGraph;  