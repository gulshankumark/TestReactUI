import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import photo1 from '../components/logo of bbs.png'
import RegisterTrialUser from './RegisterTrialUser';


class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      change: true,
      visible: false,
    };
    this.openModal = this.openModal.bind(this);
  }

  openModal(e) {
    this.setState({ visible: !this.state.visible });
  }
  render() {
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <div className="container">
            <a className="navbar-brand" href="/Homepage/pages/Home"><img
              src={photo1}
              className="d-block w-100"
              alt="Sunset Over the City"
            /></a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <NavLink className="nav-link" to="/">Home
                    <span className="sr-only">(current)</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/Homepage/pages/Features">Features
                    <span className="sr-only">(current)</span>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/Homepage/pages/ContactUs">ContactUs
                    <span className="sr-only">(current)</span>
                  </NavLink>
                </li>

                <li className="nav-item contact_form_submit">
                  <NavLink className="nav-link contact_form_submit" to="/pages/auth/SignIn">Login
                    <span className="sr-only">(current)</span>
                  </NavLink>
                </li>

                <button
                  onClick={this.openModal}
                  className='contact_form_submit'>
                  Free Trial
                </button>
                {this.state.visible &&
                  <RegisterTrialUser />
                }

              </ul>
            </div>
          </div>
        </nav>

      </>
    );
  }
}
export default Navbar