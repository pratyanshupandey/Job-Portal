import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import RecruiterNavbar from "./RecruiterNavbar";
import { Button, Table } from "reactstrap";
import { useHistory } from "react-router-dom";

const Jobs = ({ userid }) => {
  let history = useHistory();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const getJobs = async () => {
      const request = await axios.get(
        `http://localhost:4000/job/myjobs/${userid}`
      );
      var data = [];
      const d = new Date();
      for (let i = 0; i < request.data.length; i++) {
        const element = request.data[i];
        if (Date.parse(element.deadline) > d) data.push(element);
      }
      setJobs(data);
    };
    userid = localStorage.getItem("userid");

    getJobs();
  }, []);

  const edit = (jobid) => {
    localStorage.setItem("jobid", jobid);
    // history.push("/recruiter/job/edit");
    window.location.href = "/recruiter/job/edit";
  };

  const onDelete = (jobid) => {
    axios
      .delete(`http://localhost:4000/job/delete/${jobid}`)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
    // history.push("/recruiter/jobs");
    window.location.href = "/recruiter/jobs";
  };
  const open = (jobid) => {
    localStorage.setItem("jobid", jobid);
    window.location.href = "/recruiter/job/view";
    // history.push("/recruiter/job/view");
  };

  return (
    <div>
      <RecruiterNavbar />
      <br></br>
      <br></br>
      <br></br>
      <p>Jobs that already have some accepted employees cannot be deleted.</p>
      <Table bordered>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date of Post</th>
            <th>No of Applicants</th>
            <th>MaxPositions</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Open</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((obj) => (
            <tr key={obj._id}>
              <td>{obj.title}</td>
              <td>
                {obj.dateofpost.toString().slice(0, 10) +
                  " " +
                  obj.dateofpost.toString().slice(11, 16)}
              </td>
              <td>{obj.activeapplicants}</td>
              <td>{obj.positions}</td>
              <td>
                <Button
                  color="warning"
                  name={obj._id}
                  onClick={(e) => edit(e.target.getAttribute("name"))}
                >
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  name={obj._id}
                  disabled={obj.acceptedapplicants != 0}
                  onClick={(e) => onDelete(e.target.getAttribute("name"))}
                >
                  Delete
                </Button>
              </td>
              <td>
                <Button
                  color="primary"
                  name={obj._id}
                  onClick={(e) => open(e.target.getAttribute("name"))}
                >
                  Open
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

Jobs.defaultProps = {
  userid: localStorage.getItem("userid"),
};

export default Jobs;
