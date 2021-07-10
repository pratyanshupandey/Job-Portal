import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
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
import ApplicantNavbar from "./ApplicantNavbar";

const EditProfile = ({ aView, dis, isdata, userid }) => {
  let history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [applicantView, setApplicantView] = useState(aView);
  const [addLangBox, setAddLangBox] = useState("");

  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [institute, setInstitute] = useState("");
  const [syear, setSyear] = useState("");
  const [eyear, setEyear] = useState("");

  const [langArr, setLangArr] = useState(["C", "C++", "Javascript"]);
  const addLang = () => {
    if (addLangBox != "") langArr.push(addLangBox);
    setAddLangBox("");
  };

  useEffect(() => {
    const getUserData = async () => {
      const request = await axios.get(
        `http://localhost:4000/applicant/${userid}`
      );
      setName(request.data.name);
      setEmail(request.data.email);
      setPassword(request.data.password);
      setEducation(request.data.education);
      setSkills(request.data.skills);
      setLangArr(request.data.skills);
      console.log(request.data);
    };

    userid = localStorage.getItem("userid");

    getUserData();
  }, []);

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

    if (password.length < 4 || password.length > 12) {
      alert("Password Can only be between 5 and 12 characters");
      return;
    }

    if (applicantView) {
      axios
        .put(`http://localhost:4000/applicant/${userid}`, {
          password,
          education,
          skills,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
    setName("");
    setEmail("");
    setPassword("");
    setSkills([]);
    setEducation([]);
    // history.push("/applicant/profile");
    window.location.href = "/applicant/profile";
  };

  return (
    <div>
      <ApplicantNavbar />
      <br></br>
      <br></br>
      <h3>Edit Profile Details</h3>
      <Form onSubmit={onSubmit}>
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
        {/* <Button>Submit</Button> */}
        <input type="submit"></input>
        <br></br>
        <br></br>
      </Form>
    </div>
  );
};

EditProfile.defaultProps = {
  aView: true,
  dis: true,
  isdata: true,
  userid: localStorage.getItem("userid"),
};

export default EditProfile;
