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

const EditJob = ({ userid, jobid, dis }) => {
  let history = useHistory();
  const [title, setTitle] = useState("");
  const [maxappl, setMaxappl] = useState("");
  const [positions, setPositions] = useState("");
  const [typeofjob, setTypeofjob] = useState("Work from Home");
  const [duration, setDuration] = useState("");
  const [salary, setSalary] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");

  useEffect(() => {
    const getJobData = async () => {
      const request = await axios.get(`http://localhost:4000/job/${jobid}`);
      const data = request.data;
      setTitle(data.title);
      setMaxappl(data.maxappl);
      setPositions(data.positions);
      setTypeofjob(data.typeofjob);
      setDuration(data.duration);
      setSalary(data.salary);
      setDeadlineDate(data.deadline.toString().slice(0, 10));
      setDeadlineTime(data.deadline.toString().slice(11, 16));
    };

    userid = localStorage.getItem("userid");
    jobid = localStorage.getItem("jobid");
    dis = true;
    getJobData();
  }, []);

  const onSubmit = (e) => {
    if (Number(maxappl) < Number(positions)) {
      alert(
        "Maximum number of applicants cannot be less than number of positions."
      );
      return;
    }

    const deadline = new Date(deadlineDate + "T" + deadlineTime + ":00+05:30");

    const present = new Date();
    if (deadline <= present) {
      alert("Deadline cannot be in the past for present");
      return;
    }

    axios
      .put(`http://localhost:4000/job/${jobid}`, {
        maxappl,
        positions,
        deadline,
      })
      .then((res) => {
        console.log(res.data);
        window.location.href = "/recruiter/jobs";
      })
      .catch((err) => {
        console.log(err);
        alert("Failed");
      });
    setTitle("");
    setMaxappl("");
    setPositions("");
    setTypeofjob("");
    setDuration("");
    setSalary("");
    setDeadlineDate("");
    setDeadlineTime("");

    localStorage.removeItem("jobid");
    // history.push("/recruiter/jobs");
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
            disabled={dis}
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
            disabled={dis}
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
            disabled={dis}
            name="contact"
            id="exampleEmail"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </FormGroup>
        <input type="submit"></input>
        <br></br>
        <br></br>
      </Form>
    </div>
  );
};

EditJob.defaultProps = {
  userid: localStorage.getItem("userid"),
  jobid: localStorage.getItem("jobid"),
  dis: true,
};

export default EditJob;
