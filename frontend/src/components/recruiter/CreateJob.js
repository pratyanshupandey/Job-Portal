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
import RecruiterNavbar from "./RecruiterNavbar";

const CreateJob = ({ dis, userid }) => {
  let history = useHistory();
  const [title, setTitle] = useState("");
  const [maxappl, setMaxappl] = useState("");
  const [positions, setPositions] = useState("");
  const [typeofjob, setTypeofjob] = useState("Work from Home");
  const [duration, setDuration] = useState("");
  const [salary, setSalary] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");

  const [addLangBox, setAddLangBox] = useState("");

  const [requiredskills, setRequiredSkills] = useState([]);

  const [langArr, setLangArr] = useState(["C", "C++", "Javascript"]);
  const addLang = () => {
    if (addLangBox != "") langArr.push(addLangBox);
    setAddLangBox("");
  };

  const validateTitle = (title) => {
    for (let i = 0; i < title.length; i++) {
      let n = title.charCodeAt(i);
      if ((n >= 65 && n < 91) || (n >= 97 && n < 123) || n === 32) {
      } else return false;
    }
    return true;
  };

  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    bio: "",
    contact: 0,
  });
  useEffect(() => {
    const getUserData = async () => {
      const request = await axios.get(
        `http://localhost:4000/recruiter/${userid}`
      );
      setUserData(request.data);
      console.log(request.data);
    };

    userid = localStorage.getItem("userid");

    getUserData();
  }, []);

  const onSubmit = (e) => {
    const formData = new FormData(e.target);
    e.preventDefault();
    let skillarr = [];
    for (let [key, value] of formData.entries()) {
      if (key === "selectMulti") {
        skillarr.push(value);
      }
      console.log(key, value);
    }
    setRequiredSkills(skillarr);

    const rating = {
      sum: 0,
      count: 0,
    };

    if (!validateTitle(title)) {
      alert("Name can only consist of characters and spaces");
      return;
    }

    if (Number(maxappl) < Number(positions)) {
      alert(
        "Maximum number of applicants cannot be less than number of positions."
      );
      return;
    }

    const recname = userData.name;
    const recemail = userData.email;
    const recid = userData._id;
    const dateofpost = new Date();
    const emptypositions = positions;
    const deadline = new Date(deadlineDate + "T" + deadlineTime + ":00+05:30");

    if (deadline <= dateofpost) {
      alert("Deadline cannot be in the past for present");
      return;
    }
    console.log(requiredskills);
    axios
      .post("http://localhost:4000/job", {
        title,
        recname,
        recemail,
        recid,
        maxappl,
        positions,
        dateofpost,
        emptypositions,
        deadline,
        requiredskills,
        typeofjob,
        duration,
        salary,
        rating,
      })
      .then((res) => {
        console.log(res.data);
        alert("Job Created Successfully");
      })
      .catch((err) => {
        console.log(err);
        alert("Job Failed");
      });
    setTitle("");
    setMaxappl("");
    setPositions("");
    setTypeofjob("");
    setDuration("");
    setSalary("");
    setDeadlineDate("");
    setDeadlineTime("");
    setRequiredSkills([]);
    // history.push("/recruiter/createjob");
    window.location.href = "/recruiter/createjob";
  };

  return (
    <div>
      <RecruiterNavbar />
      <br></br>
      <br></br>

      <Form onSubmit={onSubmit}>
        <FormText color="muted">Fields marked * are necessary to fill</FormText>

        <FormGroup>
          <Label for="name">Title*</Label>
          <Input
            type="text"
            name="name"
            disabled={dis}
            id="exampleEmail"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleSelect">Type of Job*</Label>
          <Input
            type="select"
            name="select"
            required
            id="exampleSelect"
            value={typeofjob}
            onChange={(e) => setTypeofjob(e.target.value)}
          >
            <option>Work from Home</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Max Number of Applicants*</Label>
          <Input
            type="number"
            name="contact"
            required
            id="exampleEmail"
            min="1"
            value={maxappl}
            onChange={(e) => setMaxappl(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Available Positions*</Label>
          <Input
            type="number"
            name="contact"
            required
            id="exampleEmail"
            min="1"
            value={positions}
            onChange={(e) => setPositions(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleDate">Deadline Date*</Label>
          <Input
            type="date"
            name="date"
            required
            id="exampleDate"
            value={deadlineDate}
            onChange={(e) => setDeadlineDate(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleTime">Deadline Time*</Label>
          <Input
            type="time"
            required
            name="time"
            id="exampleTime"
            value={deadlineTime}
            onChange={(e) => setDeadlineTime(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Duration (in months)*</Label>
          <Input
            type="number"
            name="contact"
            id="exampleEmail"
            required
            min="0"
            max="6"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <FormText color="muted">
            Only duration of 1 to 6 months is allowed. Fill 0 for indefinite.
          </FormText>
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Salary*</Label>
          <Input
            type="number"
            min="0"
            required
            name="contact"
            id="exampleEmail"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="exampleSelectMulti">Select Required Languages</Label>
          <Input
            type="select"
            name="selectMulti"
            id="exampleSelectMulti"
            multiple
          >
            {langArr.map((lang, index) => (
              <option
                value={lang}
                onSelect={(e) => requiredskills.push(e.target.value)}
                key={index}
              >
                {lang}
              </option>
            ))}
          </Input>
          <Input
            type="text"
            name="addlang"
            id="exampleEmail"
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
        <input type="submit"></input>
        <br></br>
        <br></br>
      </Form>
    </div>
  );
};

CreateJob.defaultProps = {
  userid: localStorage.getItem("userid"),
  dis: false,
};

export default CreateJob;
