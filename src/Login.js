import React, { Component } from "react";
import { Redirect } from "react-router";
import { withCookies } from "react-cookie";
import { Form } from "semantic-ui-react";

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      username: "",
      password: "",
      authenticated: false
    };
  }

  handleChange = e => {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  submitForm = () => {
    const { cookies } = this.props;
    this.setState({ loading: true });
    fetch("http://localhost:8000/authenticate", {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        res.json().then(data => {
          if (!res.ok) {
            this.setState({ loading: false });
            this.showError(data.message);
          } else {
            cookies.set("user", data, { path: "/", maxAge: 86400 });
            this.setState({ authenticated: true });
          }
        });
      })
      .catch(err => {
        this.setState({ uploading: false });
        this.showError(err);
      });
  };

  showError = msg => {
    this.setState({
      error: true,
      error_msg: msg
    });
  };

  render() {
    return (
      <div className="LoginPage">
        {this.state.error && (
          <div style={{ backgroundColor: "red", color: "white" }}>
            <p style={{ color: "black", margin: "0", padding: "15px 0" }}>
              {this.state.error_msg}
            </p>
          </div>
        )}
        {this.state.authenticated && <Redirect to="/upload" push={true} />}
        <h1>Login</h1>
        <Form style={{ maxWidth: "600px", width: "80%", margin: "0 auto" }}>
          <label>Username</label>
          <Form.Input
            name="username"
            type="text"
            onChange={this.handleChange}
          />
          <label>Password</label>
          <Form.Input
            name="password"
            type="password"
            onChange={this.handleChange}
          />
          <Form.Button onClick={this.submitForm} primary fluid>
            Log in
          </Form.Button>
        </Form>
      </div>
    );
  }
}

export default withCookies(Login);
