import React, { Component } from 'react';
import "./Loading.css"

class Loading extends Component {
  state = {  }
  render() { 
    return ( 
    //all required for loading segments
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>  );
  }
}
 
export default Loading;