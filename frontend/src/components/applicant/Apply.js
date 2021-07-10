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
import axios from "axios";

const Apply = ({ userid, jobID }) => {
  let history = useHistory();
  const [jobData, setJobData] = useState({
    _id: "",
    title: "",
    recname: "",
    dateofpost: "",
    deadline: "",
    typeofjob: "",
    duration: "",
    salary: "",
    rating: { sum: 0, count: 0 },
    requiredskills: [""],
  });
  const [sop, setSop] = useState("");
  const [dis, setDis] = useState(false);

  useEffect(() => {
    const getJobData = async () => {
      const request = await axios.get(`http://localhost:4000/job/${jobID}`);
      setJobData(request.data);
      console.log(request.data);
    };

    const getNoAppl = async () => {
      const request = await axios.get(
        `http://localhost:4000/application/count/${userid}`
      );
      setDis(request.data.activenum >= 10);
      console.log(request.data);
    };

    userid = localStorage.getItem("userid");
    jobID = localStorage.getItem("jobid");

    getJobData();
    getNoAppl();
  }, []);

  const submit = () => {
    if (sop == "") {
      alert("SoP is needed for application");
      return;
    }
    if (sop.match(/(\w+)/g).length > 250) {
      alert("SoP can only be of 250 words");
      return;
    }

    const dateofapplication = new Date();
    const status = "Applied";
    const jobrating = {
      israted: false,
      value: 0,
    };
    const applicantrating = {
      israted: false,
      value: 0,
    };
    const joiningdate = new Date();
    const jobid = jobData._id;
    console.log(
      JSON.stringify({
        userid,
        jobid,
        dateofapplication,
        sop,
        status,
        jobrating,
        applicantrating,
        joiningdate,
      })
    );
    axios
      .post("http://localhost:4000/application", {
        userid,
        jobid,
        dateofapplication,
        sop,
        status,
        jobrating,
        applicantrating,
        joiningdate,
      })
      .then((res) => {
        console.log(res.data);
        // alert("Application Successful");
      })
      .catch((err) => {
        console.log(err.response.data);
        // alert("Application Failed due to server issues.");
        // return;
      });
    localStorage.removeItem("jobid");

    setSop("");
    setJobData({
      _id: "",
      title: "",
      recname: "",
      dateofpost: "",
      deadline: "",
      typeofjob: "",
      duration: "",
      salary: "",
      rating: { sum: 0, count: 0 },
      requiredskills: [""],
    });
    // history.push("/applicant/listings");
    window.location.href = "/applicant/listings";
  };

  const cancel = () => {
    localStorage.removeItem("jobid");
    setSop("");
    setJobData({
      _id: "",
      title: "",
      recname: "",
      dateofpost: "",
      deadline: "",
      typeofjob: "",
      duration: "",
      salary: "",
      rating: { sum: 0, count: 0 },
      requiredskills: [""],
    });
    // history.push("/applicant/listings");
    window.location.href = "/applicant/listings";
  };

  return (
    <div>
      <h1>Job Application</h1>
      <br></br>
      <br></br>
      <h5>Job Title: {jobData.title}</h5>
      <br></br>

      <h5>Recruiter: {jobData.recname}</h5>
      <br></br>

      <h5>
        Rating:{" "}
        {jobData.rating.count == 0
          ? "Unrated"
          : jobData.rating.sum / jobData.rating.count}
      </h5>
      <br></br>

      <h5>Posted On: {jobData.dateofpost}</h5>
      <br></br>
      <h5>Deadline: {jobData.deadline}</h5>
      <br></br>
      <h5>Type: {jobData.typeofjob}</h5>
      <br></br>
      <h5>
        Duration: {jobData.duration == 0 ? "Indefinite" : jobData.duration}
      </h5>
      <br></br>
      <h5>Salary: {jobData.salary}</h5>
      <br></br>
      <h5>Required Skills</h5>
      <ul>
        {jobData.requiredskills.map((obj) => (
          <li key={obj}>{obj}</li>
        ))}
      </ul>

      <br></br>
      <br></br>
      <Form>
        <FormGroup>
          <Label for="exampleText">Enter SoP</Label>
          <Input
            type="textarea"
            name="text"
            id="exampleText"
            value={sop}
            onChange={(e) => setSop(e.target.value)}
          />
        </FormGroup>
        <FormText color="muted">Word Limit of 250 words.</FormText>
      </Form>
      <br></br>
      <br></br>

      <Button disabled={dis} color="primary" size="lg" block onClick={submit}>
        Apply
      </Button>

      <Button color="secondary" size="lg" block onClick={cancel}>
        Cancel
      </Button>
      <FormText color="muted">
        User cannot fill form if there are already 10 pending applications.
      </FormText>

      <br></br>
      <br></br>

      <br></br>
    </div>
  );
};

Apply.defaultProps = {
  userid: localStorage.getItem("userid"),
  jobID: localStorage.getItem("jobid"),
};

export default Apply;
