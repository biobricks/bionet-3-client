import React, { Component } from 'react';

class BioVideo extends Component {
  render() {
    return (
      <iframe 
      title="Bionet Demo Video"
      width="100%" 
      height="315" 
      src="https://www.youtube.com/embed/t29-RGggSU8" 
      frameBorder="0" 
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
    ></iframe>
    );
  }
}

export default BioVideo;