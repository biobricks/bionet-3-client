import React, { Component } from 'react';

export const ContainerFluid = class ContainerFluid extends Component {
  render() {
    return (
      <div className="container-fluid">
        {this.props.children}
      </div>
    );
  }
}

export const Container = class Container extends Component {
  render() {
    let classes = "container";
<<<<<<< HEAD
=======
    if (this.props.className) { classes += ` ${this.props.className}` }
>>>>>>> 33ec7c4c5ddd8f53b73e7dc83423a0a8c2c8c1de
    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

export const Row = class Row extends Component {
  render() {
    let classes = "row";
    if (this.props.alignItems) {
      classes += ` align-items-${this.props.alignItems}`;
    }
<<<<<<< HEAD
=======
    if (this.props.className) { classes += ` ${this.props.className}` }
>>>>>>> 33ec7c4c5ddd8f53b73e7dc83423a0a8c2c8c1de
    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

export const Column = class Column extends Component {
  render() {
    let classes = "";
    if (this.props.col) { 
      classes += `col-${this.props.col}`
    } else {
<<<<<<< HEAD
      classes += 'col-12'
=======
      classes += 'col'
>>>>>>> 33ec7c4c5ddd8f53b73e7dc83423a0a8c2c8c1de
    }
    if (this.props.colSm) { classes += ` col-sm-${this.props.colSm}`}
    if (this.props.colMd) { classes += ` col-md-${this.props.colMd}`}
    if (this.props.colLg) { classes += ` col-lg-${this.props.colLg}`}
    if (this.props.colXl) { classes += ` col-xl-${this.props.colXl}`}
    if (this.props.alignSelf) { classes += ` align-self-${this.props.alignSelf}`}
<<<<<<< HEAD
    if (this.props.addClass) { classes += ` ${this.props.addClass}` }
=======
    if (this.props.className) { classes += ` ${this.props.className}` }
>>>>>>> 33ec7c4c5ddd8f53b73e7dc83423a0a8c2c8c1de
    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}
