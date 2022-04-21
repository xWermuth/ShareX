import React, { Component } from "react";
import { Router, withRouter } from "react-router-dom";
import { login } from "../util/UserFunctions";
import login_logo from "../../resources/donut.svg";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      password: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const User = {
      name: this.state.name,
      password: this.state.password,
    };

    login(User).then((res) => {
      if (res) {
        this.context.history.push(`/Profile`);
      }
    });
  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={login_logo} />
          </div>

          <form onSubmit={this.onSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">Username</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Username"
                value={this.state.name}
                onChange={this.onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.onChange}
              />
            </div>
            <div className="footer">
              <button type="submit" className="login-btn">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
