import React, { Component } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBNavLink,
  MDBIcon
} from "mdbreact";

import PropTypes from "prop-types";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AuthActions from "../store/ducks/auth";

class TopNavigation extends Component {
  static propTypes = {
    signOut: PropTypes.func.isRequired
  };
  state = {
    collapse: false
  };

  onClick = () => {
    this.setState({
      collapse: !this.state.collapse
    });
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  render() {
    const { signOut } = this.props;
    return (
      <MDBNavbar className="flexible-navbar" light expand="md" scrolling>
        <MDBNavbarBrand href="/">
          <strong>MDB</strong>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={this.onClick} />
        <MDBCollapse isOpen={this.state.collapse} navbar>
          <MDBNavbarNav left>
            <MDBNavItem active>
              <MDBNavLink to="/">
                <MDBIcon icon="chart-pie" className="mr-3" />
                Home
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="/users" activeClassName="activeClass">
                <MDBIcon icon="user" className="mr-3" />
                Usuários
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="/category" activeClassName="activeClass">
                <MDBIcon icon="book" className="mr-3" />
                Categorias
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="/post" activeClassName="activeClass">
                <MDBIcon icon="list-alt" className="mr-3" />
                Publicações
              </MDBNavLink>
            </MDBNavItem>
          </MDBNavbarNav>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBNavLink to="/" onClick={signOut}>
                <MDBIcon icon="sign-out-alt" className="mr-3" />
                Sair
              </MDBNavLink>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(AuthActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopNavigation);
