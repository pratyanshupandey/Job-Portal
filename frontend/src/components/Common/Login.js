import axios from "axios";
import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Table,
} from "reactstrap";
import NavbarMain from "../templates/NavbarMain";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [applicantView, setApplicantView] = useState(false);

  let history = useHistory();

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert("Invalid Email");
      return;
    }
    if (password.length < 4 || password.length > 12) {
      alert("Password Can only be between 5 and 12 characters");
      return;
    }

    if (applicantView) {
      axios
        .post("http://localhost:4000/applicant/login", {
          email,
          password,
        })
        .then((res) => {
          console.log(res.data);
          localStorage.setItem("userid", res.data._id);
          // history.push("/applicant/listings");
          window.location.href = "/applicant/listings";
        })
        .catch((err) => {
          console.log(err);
          alert("Incorrect details");
        });
    } else {
      axios
        .post("http://localhost:4000/recruiter/login", {
          email,
          password,
        })
        .then((res) => {
          console.log(res.data);
          localStorage.setItem("userid", res.data._id);
          // history.push("/recruiter/profile");
          window.location.href = "/recruiter/profile";
        })
        .catch((err) => {
          console.log(err);
          alert("Incorrect details.");
        });
    }
  };

  return (
    <div>
      <NavbarMain />
      <br></br>
      <br></br>
      <Form onSubmit={onSubmit}>
        <FormGroup tag="fieldset">
          <legend>User Type</legend>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="radio1"
                onChange={(e) =>
                  setApplicantView(e.target.value === "on" ? true : false)
                }
              />{" "}
              Job Applicant
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="radio1"
                defaultChecked="true"
                onChange={(e) =>
                  setApplicantView(e.target.value === "on" ? false : true)
                }
              />{" "}
              Job Recruiter
            </Label>
          </FormGroup>
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Email*</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password*</Label>
          <Input
            type="password"
            name="userpassword"
            id="examplePassword"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>

        <input type="submit"></input>
      </Form>
    </div>
  );
};

export default Login;
