import React, { Component } from 'react';
import { generateRandomName } from '../../modules/Wu';

class ContainerNewForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      form: {
        creator: "",
      }
    };
    this.updateField = this.updateField.bind(this);
    this.wuGenerate = this.wuGenerate.bind(this);
  }

  updateField(e) {
    let form = this.state.form;
    let fieldType = e.target.getAttribute('type');
    let field = e.target.getAttribute('name');
    if (fieldType === 'number') {
      form[field] = Number(e.target.value);
    } else {
      form[field] = e.target.value;
    }
  }

  wuGenerate(e) {
    e.preventDefault();
    document.getElementById('form-name').value = generateRandomName();
    // wuname((error, name) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     document.getElementById('form-name').value = name;
    //   }
    // });
  }

  render() { 
    return (
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <div className="input-group">
            <input 
              type="text" 
              className="form-control"
              id="form-name"
              name="name" 
              placeholder="Container Name"
              value={this.state.form.name}
            />
            <div className="input-group-append">
              <button 
                className="btn btn-warning"
                onClick={this.wuGenerate}
              >Wu Generate</button>
            </div>
          </div>
        </div>
        <div className="form-group text-center">
          <div className="btn-group">
            <button type="submit" className="btn btn-success">Submit</button>
          </div>
        </div>
      </form>
    );
  }
}

export default ContainerNewForm;