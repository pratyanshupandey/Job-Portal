import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ApplicantNavbar from "./ApplicantNavbar";
import { Button, Table } from "reactstrap";
import axios from "axios";

const Profile = ({ userid }) => {
  let history = useHistory();
  const [userData, setUserData] = useState({
    rating: { sum: 0, count: 0 },
    skills: [""],
    _id: "",
    name: "",
    email: "",
    password: "",
    education: [],
  });
  useEffect(() => {
    const getUserData = async () => {
      const request = await axios.get(
        `http://localhost:4000/applicant/${userid}`
      );
      setUserData(request.data);
      console.log(request.data);
    };

    userid = localStorage.getItem("userid");
    getUserData();
  }, []);

  const toEditProfile = () => {
    // history.push("/applicant/editprofile");
    window.location.href = "/applicant/editprofile";
  };

  return (
    <div>
      <ApplicantNavbar />
      <br></br>
      <br></br>
      <br></br>

      <h5>Name: {userData.name}</h5>
      <br></br>

      <h5>EmailID: {userData.email}</h5>
      <br></br>

      <h5>
        Rating:{" "}
        {userData.rating.count == 0
          ? "Unrated"
          : userData.rating.sum / userData.rating.count}
      </h5>
      <br></br>

      <h5>Skills</h5>
      <ul>
        {userData.skills.map((obj) => (
          <li key={obj}>{obj}</li>
        ))}
      </ul>

      <br></br>

      <h5>Educational Details: </h5>
      <Table bordered>
        <thead>
          <tr>
            <th>Institute and Degree</th>
            <th>Start Year</th>
            <th>End Year</th>
          </tr>
        </thead>
        <tbody>
          {userData.education.map((obj) => (
            <tr key={obj.institute}>
              <td>{obj.institute}</td>
              <td>{obj.startyear}</td>
              <td>{obj.endyear}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <br></br>
      <br></br>
      <br></br>
      <Button color="primary" size="lg" block onClick={toEditProfile}>
        Edit Details
      </Button>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

Profile.defaultProps = {
  userid: localStorage.getItem("userid"),
};

export default Profile;
