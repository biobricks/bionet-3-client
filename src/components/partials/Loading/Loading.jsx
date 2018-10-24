import React, { Component } from 'react';
import "./Loading.css"

class Loading extends Component {
  state = {  }
  render() { 
    return ( 
      <div className="card rounded-0 mt-3">
        <div className="card-header bg-dark text-light rounded-0">
          <div className="card-title mb-0">
            <span> 
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div> 
              BioNet Loading Data...
            </span>
          </div>
        </div>
      </div>    
    );
  }
}
 
export default Loading;