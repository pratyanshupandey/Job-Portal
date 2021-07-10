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

const RecruiterNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const logout = () => {
    localStorage.removeItem("userid");
    window.location.href = "/";
  };

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand>Recruiter</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink
                to="/recruiter/jobs"
                activeClassName="active"
                tag={RRNavLink}
              >
                My Jobs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/recruiter/profile"
                activeClassName="active"
                tag={RRNavLink}
              >
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/recruiter/createjob"
                activeClassName="active"
                tag={RRNavLink}
              >
                Create A Job
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/recruiter/employees"
                activeClassName="active"
                tag={RRNavLink}
              >
                My Employees
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

export default RecruiterNavbar;
