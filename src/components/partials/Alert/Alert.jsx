import React, { Component } from 'react';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Alert.css';

class Alert extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      autoClose: 3000,
      pauseOnFocusLoss: false,
      draggable: false,
      transition: null
    };
  }

  componentDidMount() {
    this.setState({
      autoClose: this.props.autoClose || 3000,
      pauseOnFocusLoss: this.props.pauseOnFocusLoss || true,
      draggable: this.props.draggable || true,
      transition: Zoom
    });
  }

  render() {
    return (
      <ToastContainer {...this.state}/>
    );
  }
}

export default Alert;  