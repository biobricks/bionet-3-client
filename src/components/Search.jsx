import React from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      fullSequence: false,
      physicals: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleFullSequence = this.toggleFullSequence.bind(this);
  }

  handleChange(selectedArray) {
    let allPhysicals = this.props.physicals;
    let selected = selectedArray[0];
    let physicals = [];
    for(let i = 0; i < allPhysicals.length; i++){
      let physical = allPhysicals[i];
      if (selected && physical.virtual && physical.virtual._id === selected._id){
        physicals.push(physical);
      }
    }
    this.setState({
      selected,
      physicals
    });
  }

  toggleFullSequence() {
    this.setState({
      fullSequence: !this.state.fullSequence
    });
  }

  render() {
    const virtuals = this.props.virtuals;
    const virtualIsSelected = this.state.selected && Object.keys(this.state.selected).length > 0;
    const virtualSelected = this.state.selected;

    const physicals = this.state.physicals.map((physical) => {
      const hasParentAttr = Object.keys(physical).indexOf('parent') > -1;
      const hasLabParent = hasParentAttr && physical.parent === null;
      const hasContainerParent = hasParentAttr && !hasLabParent;
      const parentIsValid = hasLabParent || hasContainerParent;
      const parentRoute = hasLabParent ? `/labs/${physical.lab._id}` : `/containers/${physical.parent._id}`;
      if (parentIsValid) {
        return (
          <Link 
            key={shortid.generate()}
            className="list-group-item list-group-item-action rounded-0 bg-info text-light"
            to={parentRoute}
          >
            <i className="mdi mdi-flask mr-2"/>{physical.name}
          </Link>
        );
      } else {
        return null;
      } 
    });

    return (
      <>
        <div className="Search card mt-3">
          <div className="card-header bg-dark text-light">
            <h4 className="card-title mb-0">Search BioNet</h4>
          </div>
          <form className="form">
            <div className="input-group rounded-0 ">
              <Typeahead
                id="search-bar"
                labelKey="name"
                name="search"
                onChange={(selected) => {this.handleChange(selected)}}
                onPaginate={(e) => console.log('Results paginated')}
                options={virtuals}
                paginate={true}
                placeholder="Search BioNet"
                className="border-0"
                maxResults={50}
              />
              <div className="input-group-append">
                <button className="btn btn-info rounded-0" type="button" id="search-submit" disabled={true}>Search</button>
              </div>
            </div>
          </form>
          {(!virtualIsSelected) ? (
            <div className="card-body">
              <p className="card-text">Search from {virtuals.length} Virtual Samples</p>
            </div>
          ) : null}  
        </div>
        
        {(virtualIsSelected) ? (
          <div className="card search-result mt-3 mb-3">
            <div className="card-header bg-dark text-light">
              <h4 className="card-title mb-0 text-capitalize">
                <i className="mdi mdi-dna mr-2"/>{virtualSelected.name}
              </h4>
            </div>
            <div className="card-body">
              <p className="card-text">{virtualSelected.description}</p>
              <p className="card-text">
                Available: {virtualSelected.isAvailable ? "Yes" : "No"}<br/>
                Provenance: {virtualSelected.provenance}<br/>
                Genotype: {virtualSelected.genotype}<br/>
                Sequence: {virtualSelected.sequence}
              </p>
              {/* <Sequence 
                fullSequence={this.state.fullSequence} 
                virtual={virtualSelected}
                toggleFullSequence={this.toggleFullSequence}
              /> */}
            </div>
            <div className="card-header bg-dark text-light">
              <h4 className="card-title mb-0 text-capitalize">
                <i className="mdi mdi-flask mr-2"/>Instances Of {virtualSelected.name}
              </h4>
            </div>
            {(physicals.length > 0) ? (
              <ul className="list-group list-group-flush">
                {physicals}
              </ul>
            ) : (
              <div className="card-body">
                <p className="card-text">There are currently no physical instances of {virtualSelected.name}</p>
              </div>
            )}  
          </div>
        ) : null }  
      </>
    );
  }
}

export default Search;

// function Sequence(props) {
//   return (
//     <>
//       {(props.fullSequence) ? (
//         <>
//           <div>{props.virtual.sequence}</div>
//           <div className="btn btn-sm btn-primary ml-3" onClick={props.toggleFullSequence}>Collapse</div>
//         </>
//       ) : (
//         <div>
//           {truncString(props.virtual.sequence, 80)}
//           <div className="btn btn-sm btn-primary ml-3" onClick={props.toggleFullSequence}>Expand</div>
//         </div>
//       )}
//     </>
//   );
// };

// function truncString(str, len) {
//   return (str.length > len) ? str.substr(0, len - 1) + '...' : str;
// }

