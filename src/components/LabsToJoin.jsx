import React from 'react';
import shortid from 'shortid';
import { Link } from 'react-router-dom';

class LabsToJoin extends React.Component {
  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUserLabsToJoin = this.props.currentUserLabsToJoin;
    const labsToJoin = isLoggedIn ? currentUserLabsToJoin.map((lab, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action rounded-0 bg-info text-light"
          to={`/labs/${lab._id}`}
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </Link>
      )
    }) : [];   
    return (
      <>
        <div className="card-header bg-dark text-light">
          <h5 className="card-title mb-0">
            Other Labs {currentUserLabsToJoin.length}
          </h5>
        </div>
        {currentUserLabsToJoin.length > 0 ? (                 
          <ul className="list-group list-group-flush">
            {labsToJoin}
          </ul>
        ) : (
          <div className="card-body">
            <p className="card-text">
              There are currently no other labs listed to join.
            </p>
          </div>
        )} 
      </>
    );
  }
}

export default LabsToJoin;