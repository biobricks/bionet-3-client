import React, { Component } from 'react';
import "./inputText.css";

class InputText extends Component {
  constructor(){
    super();
    this.state={
      text: '',
      isValid: false
    }
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  handleTextChange = e => {
    const text = e.target.value
    this.setState({text})
  }

  showMessage = () => {
    let textType = this.props.type
    
    switch(textType){
      case 'text':
      if(this.props.text.length > 0){
        return (
          <label className="valid">{this.props.inputName} looks good!</label>
        )
      } else {
        return (
          <label className="notValid">{this.props.inputName} is required!</label>
        )
      } 
      case 'email':
      if (this.props.text.includes('@')){
        return (
          <label className="valid">{this.props.inputName} looks Good</label>
        )        
      } else {
        return (
          <label className="notValid">@ is required!</label>
        )
      }
      default:
        return (
          <label/>
        )
    }
  }

  showName = () => {
    return(
      <label className="label">{this.props.inputName}</label>
    )
  }

  render() {
    return (
      <div>
        {this.showName()}
        <input type="text" 
          className="form-control" 
          onChange={this.props.retrieveText}
          placeholder={this.props.placeholder}
        />
        {this.showMessage()}
      </div>
    );
  }
}
 
export default InputText;