import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { css } from "glamor";
import "./Toasty.css";
import InputText from "../../UIComponentLibrary/Text/InputText";
import Form from "../../UIComponentLibrary/Form/Form";
import Card from "../../UIComponentLibrary/Card/Card";

class Toasty extends Component {
  setCardAlert(alertType, alertMessage) {
    const Message = () => {
      return (
        <div>
          <h4>{alertType}</h4>
          <p>{alertMessage}</p>
        </div>
      );
    };
    switch (alertType) {
      case "success":
        toast(<Message />, {
          className: css({
            color: "white",
            borderRadius: "5px",
            padding: "1.25rem",
            backgroundColor: "#5cb85c",
            fontFamily: "Helvetica"
          })
        });
        break;
      case "error":
        toast(<Message />, {
          className: css({
            color: "#d9534f",
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: "#d9534f",
            backgroundColor: "black",
            borderRadius: "5px",
            padding: "1.25rem",
            fontFamily: "Helvetica"
          })
        });
        break;
      case "default":
        toast(<Message />, {
          className: css({
            color: "white",
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: "white",
            backgroundColor: "black",
            borderRadius: "5px",
            padding: "1.25rem",
            fontFamily: "Helvetica"
          })
        });
        break;
      default:
        toast.info(alertMessage);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      nameValid: false,
      name: "",
      email: ""
    };
  }

  handleNameChange = e => {
    const name = e.target.value;
    this.setState({ name });
  };

  handleEmailChange = e => {
    const email = e.target.value;
    this.setState({ email });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setCardAlert("success", "You did the thing!!!");
  };

  submitIfValidated = () => {
    if (this.state.name.length > 0 && this.state.email.includes("@")) {
      return (
        <button
          className="btn btn-primary"
          type="submit"
          onClick={this.handleSubmit}
        >
          Submit form
        </button>
      );
    } else {
      return (
        <button className="btn btn-primary" type="submit" disabled>
          Submit form
        </button>
      );
    }
  };

  componentDidMount() {
    // this.setCardAlert("success", "Holy cow it worked")
    // this.setCardAlert("error", "Holy cow it worked")
    // this.setCardAlert("default", "Holy cow it worked")
  }

  render() {
    return (
      <div>
        <Form sm={"12"} md={"12"} lg={"4"}>
          <InputText
            inputName={"Name"}
            type={"text"}
            placeholder={"Please enter name"}
            handleChange={this.handleNameChange}
            text={this.state.name}
          />
          <InputText
            inputName={"Email"}
            type={"email"}
            placeholder={"Please enter email"}
            handleChange={this.handleEmailChange}
            text={this.state.email}
          />
          {this.submitIfValidated()}
          <Card
            rounded={"0"}
            spacing={"mt-3"}
            icon={<i className="mdi mdi-grid mr-2" />}
            title={"Container List"}
          >
            <p className="card-text">
              Select from the Containers listed below.
            </p>
          </Card>
        </Form>
      </div>
    );
  }
}

export default Toasty;
