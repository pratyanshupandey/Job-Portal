import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import ApplicantNavbar from "./ApplicantNavbar";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useHistory } from "react-router-dom";

const Listings = ({ userid }) => {
  let history = useHistory();
  const [jobs, setJobs] = useState([]);

  const [display, setDisplay] = useState([]);
  const [sort, setSort] = useState("None");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(100000000);
  const [durationFilter, setDurationFilter] = useState("All");

  const apply = (jobid) => {
    localStorage.setItem("jobid", jobid);
    // history.push("/applicant/apply");
    window.location.href = "/applicant/apply";
  };

  useEffect(() => {
    const getJobs = async () => {
      const request = await axios.get(
        `http://localhost:4000/job/listings/${userid}`
      );
      var data = [];
      const d = new Date();
      for (let i = 0; i < request.data.length; i++) {
        const element = request.data[i];
        if (Date.parse(element.deadline) > d) data.push(element);
      }
      setJobs(data);
      setDisplay(data);
    };

    userid = localStorage.getItem("userid");

    getJobs();
  }, []);

  const renderButton = (job) => {
    if (job.isApplied) return <Button color="secondary">Applied</Button>;
    if (job.isFull) return <Button color="warning">Full</Button>;
    return (
      <Button
        color="primary"
        name={job._id}
        onClick={(e) => apply(e.target.getAttribute("name"))}
      >
        Apply
      </Button>
    );
  };

  const searchnfilter = (e) => {
    e.preventDefault();
    if (Number(salaryMin > salaryMax)) {
      alert("Min Salary greater than Max Salary");
      return;
    }
    var newDisplay = [];
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      if (
        (typeFilter == "All" || job.typeofjob == typeFilter) &&
        Number(job.salary) >= Number(salaryMin) &&
        Number(job.salary) <= Number(salaryMax) &&
        (durationFilter == "All" ||
          (Number(job.duration) != 0 &&
            Number(job.duration) < Number(durationFilter))) &&
        (search == "" || job.title.search(search) != -1)
      )
        newDisplay.push(job);
    }
    if (sort != "") {
      newDisplay.sort(function (a, b) {
        if (sort.search("Salary") != -1) return a.salary - b.salary;

        if (sort.search("Rating") != -1) {
          if (a.rating.count == 0 && b.rating.count == 0) return 0;
          if (a.rating.count != 0 && b.rating.count == 0) return 1;
          if (a.rating.count == 0 && b.rating.count != 0) return -1;
          const arating = a.rating.sum / a.rating.count;
          const brating = b.rating.sum / b.rating.count;
          return arating - brating;
        }
        if (sort.search("Duration") != -1) {
          if (a.duration == 0 && b.duration == 0) return 0;
          if (a.duration != 0 && b.duration == 0) return -1;
          if (a.duration == 0 && b.duration != 0) return 1;
          return a.duration - b.duration;
        }
      });
      if (sort.search("Desc") != -1) newDisplay.reverse();
    }
    setDisplay(newDisplay);
  };

  return (
    <div>
      <ApplicantNavbar />
      <br></br>
      <br></br>
      <Form onSubmit={searchnfilter}>
        <FormGroup>
          <Label for="exampleSearch">Search Jobs by Title</Label>
          <Input
            type="search"
            name="search"
            id="exampleSearch"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleSelect">Sort By</Label>
          <Input
            type="select"
            name="select"
            id="exampleSelect"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option></option>
            <option>Salary Asc</option>
            <option>Salary Desc</option>
            <option>Duration Asc</option>
            <option>Duration Desc</option>
            <option>Job Rating Asc</option>
            <option>Job Rating Desc</option>
          </Input>
        </FormGroup>
        Filters:
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="exampleSelect">Job Type</Label>
              <Input
                type="select"
                name="select"
                id="exampleSelect"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option>All</option>
                <option>Work from Home</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup>
              <Label for="examplePassword">Min Salary</Label>
              <Input
                type="number"
                min="0"
                name="password"
                id="examplePassword"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup>
              <Label for="examplePassword">Max Salary</Label>
              <Input
                type="number"
                min="0"
                name="password"
                id="examplePassword"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="exampleSelect">Duration</Label>
              <Input
                type="select"
                name="select"
                id="exampleSelect"
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
              >
                <option>All</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <input type="submit"></input>
      </Form>
      <br></br>
      <br></br>
      <Table bordered>
        <thead>
          <tr>
            <th>Title</th>
            <th>Recruiter</th>
            <th>Job Rating</th>
            <th>Job Type</th>
            <th>Salary</th>
            <th>Duration</th>
            <th>Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {display.map((obj) => (
            <tr key={obj._id}>
              <td>{obj.title}</td>
              <td>{obj.recname}</td>
              <td>
                {obj.rating.count == 0
                  ? "Not Rated"
                  : obj.rating.sum / obj.rating.count}
              </td>
              <td>{obj.typeofjob}</td>
              <td>{obj.salary}</td>
              <td>{obj.duration ? obj.duration : "Indefinite"}</td>
              <td>
                {obj.deadline.toString().slice(0, 10) +
                  " " +
                  obj.deadline.toString().slice(11, 16)}
              </td>
              <td>{renderButton(obj)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

Listings.defaultProps = {
  userid: localStorage.getItem("userid"),
};

export default Listings;
