import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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

const ApplicantNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const logout = () => {
    localStorage.removeItem("userid");
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand>Applicant</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink
                to="/applicant/listings"
                activeClassName="active"
                tag={RRNavLink}
              >
                Listings
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/applicant/profile"
                activeClassName="active"
                tag={RRNavLink}
              >
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/applicant/myapplications"
                activeClassName="active"
                tag={RRNavLink}
              >
                My Applications
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={logout}>Logout</NavLink>
            </NavItem>
          </Nav>
          <NavbarText>Job Application Portal</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default ApplicantNavbar;
