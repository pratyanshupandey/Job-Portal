import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./components/Common/Home";
import Register from "./components/Common/Register";
import Login from "./components/Common/Login";
import Profile from "./components/applicant/Profile";
import RecruiterProfile from "./components/recruiter/RecruiterProfile";
import MyApplications from "./components/applicant/MyApplications";
import Listings from "./components/applicant/Listings";
import EditProfile from "./components/applicant/EditProfile";
import EditRecruiterProfile from "./components/recruiter/EditRecruiterProfile";
import CreateJob from "./components/recruiter/CreateJob";
import Jobs from "./components/recruiter/Jobs";
import Apply from "./components/applicant/Apply";
import EditJob from "./components/recruiter/EditJob";
import ViewJob from "./components/recruiter/ViewJob";
import MyEmployees from "./components/recruiter/MyEmployees";

const App = () => {
  // localStorage.clear();

  return (
    <Router>
      <div className="container">
        <br />
        <Route path="/" exact component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/applicant/profile" component={Profile} />
        <Route path="/recruiter/profile" component={RecruiterProfile} />
        <Route path="/applicant/myapplications" component={MyApplications} />
        <Route path="/applicant/listings" component={Listings} />
        <Route path="/applicant/editprofile" component={EditProfile} />
        <Route path="/applicant/apply" component={Apply} />
        <Route path="/recruiter/editprofile" component={EditRecruiterProfile} />
        <Route path="/recruiter/createjob" component={CreateJob} />
        <Route path="/recruiter/jobs" component={Jobs} />
        <Route path="/recruiter/job/edit" component={EditJob} />
        <Route path="/recruiter/job/view" component={ViewJob} />
        <Route path="/recruiter/employees" component={MyEmployees} />
      </div>
    </Router>
  );
};

export default App;
