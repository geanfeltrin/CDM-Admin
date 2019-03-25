import React, { Component, Fragment } from "react";
import logo from "../assets/cdmlogo.png";
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
  MDBRow,
  MDBBtn
} from "mdbreact";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AuthActions from "../store/ducks/auth";

import TopNavigation from "../components/topNavigation";

class SideNavigation extends Component {
  static propTypes = {
    signOut: PropTypes.func.isRequired
  };

  render() {
    const { signOut } = this.props;

    return (
      <Fragment>
        <TopNavigation />
        <div className="sidebar-fixed position-fixed">
          <a href="#!" className="logo-wrapper waves-effect">
            <img alt="MDB React Logo" className="img-fluid" src={logo} />
          </a>
          <MDBListGroup className="list-group-flush">
            <NavLink exact={true} to="/" activeClassName="activeClass">
              <MDBListGroupItem>
                <MDBIcon icon="chart-pie" className="mr-3" />
                Dashboard
              </MDBListGroupItem>
            </NavLink>
            <NavLink to="/users" activeClassName="activeClass">
              <MDBListGroupItem>
                <MDBIcon icon="user" className="mr-3" />
                Usuários
              </MDBListGroupItem>
            </NavLink>
            <NavLink to="/category" activeClassName="activeClass">
              <MDBListGroupItem>
                <MDBIcon icon="book" className="mr-3" />
                Categorias
              </MDBListGroupItem>
            </NavLink>
            <NavLink to="/post" activeClassName="activeClass">
              <MDBListGroupItem>
                <MDBIcon icon="list-alt" className="mr-3" />
                Publicações
              </MDBListGroupItem>
            </NavLink>
            <NavLink to="/404" activeClassName="activeClass">
              <MDBListGroupItem>
                <MDBIcon icon="exclamation" className="mr-3" />
                404
              </MDBListGroupItem>
            </NavLink>
            <a href="/" onClick={signOut}>
              <MDBListGroupItem>
                <MDBIcon icon="sign-out-alt" className="mr-3" />
                Sair
              </MDBListGroupItem>
            </a>
          </MDBListGroup>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(AuthActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideNavigation);
