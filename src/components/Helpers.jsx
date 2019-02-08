import React, { Component } from 'react';

export const Stringify = class Stringify extends Component {
  render() {
    return (
      <pre className="Stringify">
        {JSON.stringify(this.props.data, null, 2)}
      </pre>
    );
  }
}

export const RouteBoundary = class ErrorBoundary extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      message: "",
      error: null, 
      errorInfo: null 
    };
  }

  // static getDerivedStateFromError(error) {
  //   // Update state so the next render will show the fallback UI.
  //   return { hasError: true, error };
  // }

  componentDidCatch(error, errorInfo) {
    this.setState({
      message: this.props.message,
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>{this.props.message}</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}