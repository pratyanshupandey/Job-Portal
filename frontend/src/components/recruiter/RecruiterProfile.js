import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RecruiterNavbar from "./RecruiterNavbar";
import { Button } from "reactstrap";
import axios from "axios";

const RecruiterProfile = ({ userid }) => {
  let history = useHistory();
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

  const toEditProfile = () => {
    // history.push("/recruiter/editprofile");
    window.location.href = "/recruiter/editprofile";
  };

  return (
    <div>
      <RecruiterNavbar />
      <br></br>
      <br></br>
      <br></br>

      <h5>Name: {userData.name}</h5>
      <br></br>

      <h5>EmailID: {userData.email}</h5>
      <br></br>
      <h5>Contact: {userData.contact}</h5>

      <br></br>
      <h5>Bio</h5>
      <p>{userData.bio}</p>
      <br></br>
      <br></br>
      <br></br>
      <Button color="primary" size="lg" block onClick={toEditProfile}>
        Edit Details
      </Button>
    </div>
  );
};

RecruiterProfile.defaultProps = {
  userid: localStorage.getItem("userid"),
};

export default RecruiterProfile;
