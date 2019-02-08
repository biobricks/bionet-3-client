import React, { Component } from 'react';
import Loading from '../partials/Loading/Loading';
import FadeIn from 'react-fade-in';

class Template extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  render() {
    const documentReady = this.state.loaded;
    return (
      <div className="Template viewport-container">
        {documentReady ? (
          <FadeIn>

          </FadeIn>
        ) : (
          <FadeIn>
            <Loading />
          </FadeIn>          
        )}  
      </div>
    );
  }

}

export default Template;  