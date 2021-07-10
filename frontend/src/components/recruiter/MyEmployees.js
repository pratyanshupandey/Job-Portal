import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import RecruiterNavbar from "./RecruiterNavbar";
import { Form, FormGroup, Label, Input, Table } from "reactstrap";
import { useHistory } from "react-router-dom";

const MyEmployees = ({ userid }) => {
  let history = useHistory();
  const [appl, setAppl] = useState([]);
  const [display, setDisplay] = useState([]);
  const [sort, setSort] = useState("None");

  useEffect(() => {
    const getAppl = async () => {
      const request = await axios.get(
        `http://localhost:4000/application/accepted/${userid}`
      );
      setAppl(request.data);
      setDisplay(request.data);
    };
    userid = localStorage.getItem("userid");
    getAppl();
  }, []);

  const submit = (e) => {
    const formData = new FormData(e.target);
    e.preventDefault();
    var applicantrating;
    for (let [key, value] of formData.entries()) {
      if (key === "rating") {
        applicantrating = {
          israted: true,
          value: value,
        };
      }
      console.log(key, value);
    }
    axios
      .put(`http://localhost:4000/application/applicantrating/${e.target.id}`, {
        applicantrating,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
    window.location.href = "/recruiter/employees";
  };

  const loadForm = (obj) => {
    if (obj.applicantrating.israted) {
      return (
        <Form name={obj._id} id={obj._id} onSubmit={submit}>
          <FormGroup>
            <Input
              type="number"
              name="rating"
              min="0"
              max="5"
              disabled={obj.applicantrating.israted}
              id="exampleText"
              value={obj.applicantrating.value}
            />
          </FormGroup>
        </Form>
      );
    }
    return (
      <Form name={obj._id} id={obj._id} onSubmit={submit}>
        <FormGroup>
          <Input
            type="number"
            name="rating"
            min="0"
            max="5"
            disabled={obj.applicantrating.israted}
            id="exampleText"
          />
        </FormGroup>
        <input type="submit"></input>
      </Form>
    );
  };

  const searchnfilter = (e) => {
    e.preventDefault();
    var newDisplay = [...display];
    if (sort != "") {
      newDisplay.sort(function (a, b) {
        if (sort.search("Name") != -1)
          return a.applname.localeCompare(b.applname);
        if (sort.search("Title") != -1)
          return a.jobtitle.localeCompare(b.jobtitle);
        if (sort.search("Date") != -1)
          return Date.parse(a.joiningdate) - Date.parse(b.joiningdate);

        if (sort.search("Rating") != -1) {
          if (a.applicantrating.count == 0 && b.applicantrating.count == 0)
            return 0;
          if (a.applicantrating.count != 0 && b.applicantrating.count == 0)
            return 1;
          if (a.applicantrating.count == 0 && b.applicantrating.count != 0)
            return -1;
          const arating = a.applicantrating.sum / a.applicantrating.count;
          const brating = b.applicantrating.sum / b.applicantrating.count;
          return arating - brating;
        }
      });
      if (sort.search("Desc") != -1) newDisplay.reverse();
    }
    setDisplay(newDisplay);
  };

  return (
    <div>
      <RecruiterNavbar />
      <br></br>
      <br></br>
      <Form onSubmit={searchnfilter}>
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
            <option>Name Asc</option>
            <option>Name Desc</option>
            <option>Job Title Asc</option>
            <option>Job Title Desc</option>
            <option>Date of Joining Asc</option>
            <option>Date of Joining Desc</option>
            <option>Applicant Rating Asc</option>
            <option>Applicant Rating Desc</option>
          </Input>
        </FormGroup>
        <input type="submit"></input>
      </Form>
      <br></br>
      <br></br>
      <Table bordered>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Date of Joining</th>
            <th>Job Type</th>
            <th>Job Title</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {display.map((obj) => (
            <tr key={obj._id}>
              <td>{obj.applname}</td>
              <td>
                {obj.joiningdate.toString().slice(0, 10) +
                  " " +
                  obj.joiningdate.toString().slice(11, 16)}
              </td>
              <td>{obj.jobtype}</td>
              <td>{obj.jobtitle}</td>
              <td>{loadForm(obj)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

MyEmployees.defaultProps = {
  userid: localStorage.getItem("userid"),
};

export default MyEmployees;
