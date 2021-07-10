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
} from "reactstrap";
import { useHistory } from "react-router-dom";

const MyApplications = ({ userid }) => {
  let history = useHistory();
  const [appl, setAppl] = useState([]);

  useEffect(() => {
    const getAppl = async () => {
      const request = await axios.get(
        `http://localhost:4000/application/myapplications/${userid}`
      );
      setAppl(request.data);
    };

    userid = localStorage.getItem("userid");

    getAppl();
  }, []);

  const submit = (e) => {
    const formData = new FormData(e.target);
    e.preventDefault();
    var jobrating;
    for (let [key, value] of formData.entries()) {
      if (key === "rating") {
        jobrating = {
          israted: true,
          value: value,
        };
      }
      console.log(key, value);
    }
    axios
      .put(`http://localhost:4000/application/jobrating/${e.target.id}`, {
        jobrating,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
    window.location.href = "/applicant/myapplications";
  };

  const loadForm = (obj) => {
    if (obj.jobrating.israted) {
      return (
        <Form name={obj._id} id={obj._id} onSubmit={submit}>
          <FormGroup>
            <Input
              type="number"
              name="rating"
              min="0"
              max="5"
              disabled={obj.jobrating.israted}
              id="exampleText"
              value={obj.jobrating.value}
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
            disabled={obj.jobrating.israted}
            id="exampleText"
          />
        </FormGroup>
        <input type="submit"></input>
      </Form>
    );
  };

  return (
    <div>
      <ApplicantNavbar />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Table bordered>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Recruiter</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Joining Date</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {appl.map((obj) => (
            <tr key={obj._id}>
              <td>{obj.title}</td>
              <td>{obj.recname}</td>
              <td>{obj.salary}</td>
              <td>{obj.status}</td>
              <td>
                {obj.status == "Accepted"
                  ? obj.joiningdate.toString().slice(0, 10)
                  : "NA"}
              </td>
              <td>{loadForm(obj)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

MyApplications.defaultProps = {
  userid: localStorage.getItem("userid"),
};

export default MyApplications;
