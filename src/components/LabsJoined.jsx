import React from 'react';
import shortid from 'shortid';
import { Link } from 'react-router-dom';

class LabsJoined extends React.Component {
  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUserLabs = this.props.currentUserLabs;
    const labsJoined = isLoggedIn ? currentUserLabs.map((lab, index) => {
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
            Your {currentUserLabs.length === 1 ? "Lab" : "Labs"} ({currentUserLabs.length})
          </h5>
        </div>                 
        <ul className="list-group list-group-flush">
          {labsJoined}
          <Link
            to="/labs/new"
            className="list-group-item list-group-item-action rounded-0 bg-success text-light"
          >
            <i className="mdi mdi-plus mr-2"/>Create New Lab
          </Link>
        </ul>
      </>
    );
  }
}

export default LabsJoined;