import axios from "axios";
import React from "react";
import { useState } from "react";
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

const Register = ({ aView, dis, isdata, data }) => {
  const [name, setName] = useState(isdata ? data.name : "");
  const [email, setEmail] = useState(isdata ? data.email : "");
  const [password, setPassword] = useState(isdata ? data.password : "");
  const [contact, setContact] = useState(isdata ? data.contact : "");
  const [bio, setBio] = useState(isdata ? data.bio : "");
  const [applicantView, setApplicantView] = useState(aView);
  const [addLangBox, setAddLangBox] = useState("");

  const [education, setEducation] = useState(isdata ? data.education : []);
  const [skills, setSkills] = useState(isdata ? data.skills : []);
  const [institute, setInstitute] = useState("");
  const [syear, setSyear] = useState("");
  const [eyear, setEyear] = useState("");

  const [langArr, setLangArr] = useState(["C", "C++", "Javascript"]);
  const addLang = () => {
    if (addLangBox != "") langArr.push(addLangBox);
    setAddLangBox("");
  };

  const addEducation = () => {
    var obj = {
      institute: institute,
      startyear: syear,
      endyear: eyear,
    };
    education.push(obj);
    setInstitute("");
    setSyear("");
    setEyear("");
  };

  const validateName = (name) => {
    for (let i = 0; i < name.length; i++) {
      let n = name.charCodeAt(i);
      if ((n >= 65 && n < 91) || (n >= 97 && n < 123) || n === 32) {
      } else return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const onSubmit = (e) => {
    const formData = new FormData(e.target);
    e.preventDefault();
    var skillarr = [];
    for (let [key, value] of formData.entries()) {
      if (key === "selectMulti") {
        skillarr.push(value);
      }
      console.log(key, value);
    }
    setSkills(skillarr);

    const rating = {
      sum: 0,
      count: 0,
    };

    if (!validateName(name)) {
      alert("Name can only consist of characters and spaces");
      return;
    }
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
        .post("http://localhost:4000/applicant", {
          name,
          email,
          password,
          education,
          skills,
          rating,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      if (bio != "" && bio.match(/(\w+)/g).length > 250) {
        alert("bio can only be of 250 words");
        return;
      }

      if (
        contact != "" &&
        (Number(contact) < 1111111111 || Number(contact) > 9999999999)
      ) {
        alert("Invalid Contact");
        return;
      }

      axios
        .post("http://localhost:4000/recruiter", {
          name,
          email,
          password,
          contact,
          bio,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }

    setName("");
    setEmail("");
    setPassword("");
    setContact("");
    setSkills([]);
    setEducation([]);
    setBio("");
    window.location.href = "/register";
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
                defaultChecked={aView}
                disabled={dis}
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
                disabled={dis}
                name="radio1"
                defaultChecked={!aView}
                onChange={(e) =>
                  setApplicantView(e.target.value === "on" ? false : true)
                }
              />{" "}
              Job Recruiter
            </Label>
          </FormGroup>
        </FormGroup>

        <FormText color="muted">Fields marked * are necessary to fill</FormText>

        <FormGroup>
          <Label for="name">Name*</Label>
          <Input
            type="text"
            name="name"
            disabled={dis}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Email*</Label>
          <Input
            type="email"
            name="email"
            disabled={dis}
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        {!applicantView && (
          <FormGroup>
            <Label for="exampleEmail">Contact Number</Label>
            <Input
              type="number"
              name="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </FormGroup>
        )}
        {!applicantView && (
          <FormGroup>
            <Label for="exampleEmail">Bio</Label>
            <Input
              type="textarea"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </FormGroup>
        )}
        {applicantView && (
          <FormGroup>
            <Label for="exampleSelectMulti">Select Languages</Label>
            <Input type="select" name="selectMulti" multiple>
              {langArr.map((lang, index) => (
                <option
                  value={lang}
                  onSelect={(e) => skills.push(e.target.value)}
                  key={index}
                >
                  {lang}
                </option>
              ))}
            </Input>
            <Input
              type="text"
              name="addlang"
              value={addLangBox}
              onChange={(e) => setAddLangBox(e.target.value)}
            />
            <Button onClick={addLang}>Add</Button>
            <FormText color="muted">
              Select one or Multiple Languages using Ctrl key. Add a language if
              it is not already present by typing in the textbox above and
              clicking Add.
            </FormText>
          </FormGroup>
        )}
        {applicantView && (
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="exampleCity">Institution and Degree</Label>
                <Input
                  type="text"
                  name="institute"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Label for="exampleState">Start Year</Label>
                <Input
                  type="number"
                  name="syear"
                  value={syear}
                  onChange={(e) => setSyear(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Label for="exampleZip">End Year</Label>
                <Input
                  type="number"
                  name="eyear"
                  value={eyear}
                  onChange={(e) => setEyear(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        )}
        {applicantView && <Button onClick={addEducation}>Add</Button>}
        {applicantView && (
          <FormText color="muted">
            Enter the details in the fields and click on Add.
          </FormText>
        )}
        <br></br>
        <br></br>
        {applicantView && (
          <Table bordered>
            <thead>
              <tr>
                <th>Institute and Degree</th>
                <th>Start Year</th>
                <th>End Year</th>
              </tr>
            </thead>
            <tbody>
              {education.map((obj) => (
                <tr key={obj.institute}>
                  <td>{obj.institute}</td>
                  <td>{obj.startyear}</td>
                  <td>{obj.endyear}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <input type="submit"></input>
        <br></br>
        <br></br>
      </Form>
    </div>
  );
};

Register.defaultProps = {
  aView: false,
  dis: false,
  isdata: false,
  data: {},
};

export default Register;
