import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { useHistory } from "react-router-dom";
import RecruiterNavbar from "./RecruiterNavbar";

const EditRecruiterProfile = ({ aView, dis, isdata, userid }) => {
  let history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [bio, setBio] = useState("");
  const [applicantView, setApplicantView] = useState(aView);

  useEffect(() => {
    const getUserData = async () => {
      const request = await axios.get(
        `http://localhost:4000/recruiter/${userid}`
      );
      setName(request.data.name);
      setEmail(request.data.email);
      setPassword(request.data.password);
      setContact(request.data.contact);
      setBio(request.data.bio);
      console.log(request.data);
    };

    userid = localStorage.getItem("userid");

    getUserData();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (password.length < 4 || password.length > 12) {
      alert("Password Can only be between 5 and 12 characters");
      return;
    }

    if (bio != "" && bio.match(/(\w+)/g).length > 250) {
      alert("bio can only be of 250 words");
      return;
    }

    if (Number(contact) < 1111111111 || Number(contact) > 9999999999) {
      alert("Invalid Contact");
      return;
    }

    axios
      .put(`http://localhost:4000/recruiter/${userid}`, {
        password,
        contact,
        bio,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));

    setName("");
    setEmail("");
    setPassword("");
    setContact("");
    setBio("");

    // history.push("/recruiter/profile");
    window.location.href = "/recruiter/profile";
  };

  return (
    <div>
      <RecruiterNavbar />
      <br></br>
      <br></br>

      <Form onSubmit={onSubmit}>
        <FormText color="muted">Fields marked * are necessary to fill</FormText>

        <FormGroup>
          <Label for="name">Name*</Label>
          <Input
            type="text"
            name="name"
            disabled={dis}
            id="exampleEmail"
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
        {!applicantView && (
          <FormGroup>
            <Label for="exampleEmail">Contact Number</Label>
            <Input
              type="number"
              name="contact"
              id="exampleEmail"
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
              id="exampleEmail"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </FormGroup>
        )}
        <input type="submit"></input>
        <br></br>
        <br></br>
      </Form>
    </div>
  );
};

EditRecruiterProfile.defaultProps = {
  aView: false,
  dis: true,
  isdata: true,
  userid: localStorage.getItem("userid"),
};

export default EditRecruiterProfile;
