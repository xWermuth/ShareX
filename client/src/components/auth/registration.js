import React, { Component } from "react";
import { login, register } from "../util/UserFunctions";
import login_logo from "../../resources/donut.svg";

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      password: "",
      repeated_password: "",
      handle: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    // if (this.state.password !== this.state.repeated_password) {
    //   console.log("PASSWORDS DOESN'T MATCH!");
    //   return;
    // }

    const User = {
      name: this.state.name,
      password: this.state.password,
      handle: this.state.handle,
    };

    register(User).then((res) => {
      if (res) {
        this.props.history.push(`../profile.js`);
      }
    });
  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
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

            <div className="form-group">
              <label htmlFor="name">Enter handle</label>
              <input
                type="text"
                className="form-control"
                name="handle"
                placeholder="Handle"
                value={this.state.handle}
                onChange={this.onChange}
              />
            </div>
            <div className="footer">
              <button type="submit" className="login-btn">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
