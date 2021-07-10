import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import RecruiterNavbar from "./RecruiterNavbar";
import { Button, Form, FormGroup, Label, Input, Table } from "reactstrap";
import { useHistory } from "react-router-dom";

const ViewJob = ({ userid, jobid }) => {
  let history = useHistory();
  const [appls, setAppls] = useState([]);
  const [display, setDisplay] = useState([]);
  const [sort, setSort] = useState("None");

  useEffect(() => {
    const getAppls = async () => {
      const request = await axios.get(
        `http://localhost:4000/application/viewjob/${jobid}`
      );
      console.log(request.data);
      setAppls(request.data);
      setDisplay(request.data);
    };

    userid = localStorage.getItem("userid");
    jobid = localStorage.getItem("jobid");

    getAppls();
  }, []);

  const educationDetails = (education) => {
    if (education.length == 0) return "";
    return (
      <ul>
        {education.map((obj) => (
          <li key={obj.institute}>
            {obj.institute +
              "(" +
              obj.startyear +
              "," +
              (obj.endyear ? obj.endyear : "NA") +
              ")"}
          </li>
        ))}
      </ul>
    );
  };

  const statusChange = (applid, initStatus) => {
    var status;
    if (initStatus == "Applied") status = "Shortlisted";
    if (initStatus == "Shortlisted") status = "Accepted";

    if (initStatus == "Applied") {
      axios
        .put(`http://localhost:4000/application/${applid}`, {
          status,
        })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (initStatus == "Shortlisted") {
      const joiningdate = new Date();
      axios
        .put(`http://localhost:4000/application/${applid}`, {
          status,
          joiningdate,
        })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // history.push("/recruiter/job/view");
    window.location.href = "/recruiter/job/view";
  };

  const onReject = (applid) => {
    const status = "Rejected";
    axios
      .put(`http://localhost:4000/application/${applid}`, {
        status,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
    // history.push("/recruiter/job/view");
    window.location.href = "/recruiter/job/view";
  };

  const renderButton = (status) => {
    if (status == "Applied") return "Shortlist";
    if (status == "Shortlisted") return "Accept";
    if (status == "Accepted") return "Accepted";
  };

  const searchnfilter = (e) => {
    e.preventDefault();
    var newDisplay = [...display];
    if (sort != "") {
      newDisplay.sort(function (a, b) {
        if (sort.search("Name") != -1)
          return a.applname.localeCompare(b.applname);
        if (sort.search("Date") != -1)
          return (
            Date.parse(a.dateofapplication) - Date.parse(b.dateofapplication)
          );

        if (sort.search("Rating") != -1) {
          if (a.userrating.count == 0 && b.userrating.count == 0) return 0;
          if (a.userrating.count != 0 && b.userrating.count == 0) return 1;
          if (a.userrating.count == 0 && b.userrating.count != 0) return -1;
          const auserrating = a.userrating.sum / a.userrating.count;
          const buserrating = b.userrating.sum / b.userrating.count;
          return auserrating - buserrating;
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
      <h2>Job View</h2>
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
            <option>Date of Application Asc</option>
            <option>Date of Application Desc</option>
            <option>Applicant Rating Asc</option>
            <option>Applicant Rating Desc</option>
          </Input>
        </FormGroup>
        <input type="submit"></input>
      </Form>
      <br></br>
      {/* <p>An accepted application cannot be rejected.</p> */}
      <p>Education displayed in institution(startyear, endyear) format.</p>
      <Table bordered>
        <thead>
          <tr>
            <th>Applicant Name</th>
            <th>Skills</th>
            <th>Date of application</th>
            <th>Education</th>
            <th>SOP</th>
            <th>Rating</th>
            <th>Stage</th>
            <th>Accept/Shortlist</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {display.map((obj) => (
            <tr key={obj._id}>
              <td>{obj.applname}</td>
              <td>
                <ul>
                  {obj.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </td>
              <td>
                {obj.dateofapplication.toString().slice(0, 10) +
                  " " +
                  obj.dateofapplication.toString().slice(11, 16)}
              </td>
              <td>{educationDetails(obj.education)}</td>
              <td>{obj.sop}</td>
              <td>
                {obj.userrating.count != 0
                  ? obj.userrating.sum / obj.userrating.count
                  : "Unrated"}
              </td>
              <td>{obj.status}</td>

              <td>
                <Button
                  color="primary"
                  name={obj._id}
                  id={obj.status}
                  disabled={obj.status == "Accepted"}
                  onClick={(e) =>
                    statusChange(e.target.getAttribute("name"), e.target.id)
                  }
                >
                  {renderButton(obj.status)}
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  name={obj._id}
                  disabled={obj.status == "Accepted"}
                  onClick={(e) => onReject(e.target.getAttribute("name"))}
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

ViewJob.defaultProps = {
  userid: localStorage.getItem("userid"),
  jobid: localStorage.getItem("jobid"),
};

export default ViewJob;
