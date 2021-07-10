import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink as RRNavLink } from "react-router-dom";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";
import { useState } from "react";

const NavbarMain = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand to="/" activeClassName="active" tag={RRNavLink}>
          Home
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink to="/login" activeClassName="active" tag={RRNavLink}>
                Login
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/register" activeClassName="active" tag={RRNavLink}>
                Register
              </NavLink>
            </NavItem>
          </Nav>
          <NavbarText>Job Application Portal</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavbarMain;
