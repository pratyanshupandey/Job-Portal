var express = require("express");
var router = express.Router();

// Load Application model
const Application = require("../models/Application");
const Job = require("../models/Job");
const Applicant = require("../models/Applicant");

// GET request
// Getting all the applications
router.get("/", function (req, res) {
  Application.find(function (err, applications) {
    if (err) {
      console.log(err);
    } else {
      res.json(applications);
    }
  });
});

//GET request
// Get an application by id
router.get("/:id", (req, res) => {
  Application.findById(req.params.id)
    .then((application) => res.json(application))
    .catch((err) => res.status(404).send(err));
});

//GET request
// Get an application by userid and jobid
router.get("/multi/:userid/:jobid", (req, res) => {
  console.log(req.params.userid, req.params.jobid);
  Application.find({ userid: req.params.userid, jobid: req.params.jobid })
    .then((application) => res.json(application))
    .catch((err) => res.status(404).send(err));
});

// GET request
// Get all applications by an applicant
router.get("/applicant/:userid", (req, res) => {
  Application.find({ userid: req.params.userid })
    .then((applications) => res.json(applications))
    .catch((err) => res.status(404).send(err));
});

// GET request
// Get count of active applications by an applicant
router.get("/count/:userid", (req, res) => {
  Application.find({ userid: req.params.userid })
    .then((applications) => {
      var active = 0;
      for (let i = 0; i < applications.length; i++) {
        const appl = applications[i];
        if (appl.status == "Applied" || appl.status == "Shortlisted") active++;
      }
      res.json({ activenum: active });
    })
    .catch((err) => res.status(404).send(err));
});

// GET request
// Get all applications for a job
router.get("/applicant/job/:jobid", (req, res) => {
  Application.find({ jobid: req.params.jobid })
    .then((applications) => res.json(applications))
    .catch((err) => res.status(404).send(err));
});

// GET request
// Get page details for MyApplications
router.get("/myapplications/:userid", (req, res) => {
  var promises = [];
  const p = Application.find({ userid: req.params.userid })
    .lean()
    .then((appls) => {
      for (let i = 0; i < appls.length; i++) {
        const k = Job.find({ _id: appls[i].jobid })
          .lean()
          .then((jobs) => {
            const job = jobs[0];
            appls[i] = {
              ...appls[i],
              recname: job.recname,
              title: job.title,
              salary: job.salary,
              deadline: job.deadline,
              requiredskills: job.requiredskills,
              typeofjob: job.typeofjob,
              duration: job.duration,
            };
          });
        promises.push(k);
      }
      Promise.all(promises).then(() => res.json(appls));
    })
    .catch((err) => res.status(404).send(err));
});

// GET request
// Get page details for JobView
router.get("/viewjob/:jobid", (req, res) => {
  var promises = [];
  const p = Application.find({
    jobid: req.params.jobid,
    status: { $ne: "Rejected" },
  })
    .lean()
    .then((appls) => {
      for (let i = 0; i < appls.length; i++) {
        const k = Applicant.find({ _id: appls[i].userid })
          .lean()
          .then((applicants) => {
            const applicant = applicants[0];
            appls[i] = {
              ...appls[i],
              applname: applicant.name,
              education: applicant.education,
              userrating: applicant.rating,
              skills: applicant.skills,
            };
          });
        promises.push(k);
      }
      Promise.all(promises).then(() => res.json(appls));
    })
    .catch((err) => res.status(404).send(err));
});

// GET request
// Get page details for MyEmployees
// router.get("/accepted/:userid", (req, res) => {
//   var applications = [];
//   var promises = [];
//   console.log(req.params.userid);
//   const p = Job.find({ recid: req.params.userid })
//     .lean()
//     .then((jobs) => {
//       for (let i = 0; i < jobs.length; i++) {
//         const k = Application.find({ jobid: jobs[i]._id, status: "Accepted" })
//           .lean()
//           .then((appls) => {
//             for (let j = 0; j < appls.length; j++) {
//               const t = Applicant.find({ _id: appls[j].userid })
//                 .lean()
//                 .then((applicants) => {
//                   const applicant = applicants[0];
//                   appls[j] = {
//                     ...appls[j],
//                     jobtype: jobs[i].typeofjob,
//                     jobtitle: jobs[i].title,
//                     applname: applicant.name,
//                     education: applicant.education,
//                     userrating: applicant.rating,
//                     skills: applicant.skills,
//                   };
//                   applications.push(appls[j]);
//                 });
//               promises.push(t);
//             }
//           });
//         promises.push(k);
//       }
//       Promise.all(promises).then(() => res.json(applications));
//     })
//     .catch((err) => res.status(404).send(err));
// });

router.get("/accepted/:userid", (req, res) => {
  var applications = [];
  var promises = [];
  const p = Job.find({ recid: req.params.userid })
    .lean()
    .then(async function (jobs) {
      for (let i = 0; i < jobs.length; i++) {
        const k = await Application.find({
          jobid: jobs[i]._id,
          status: "Accepted",
        })
          .lean()
          .then((appls) => {
            for (let j = 0; j < appls.length; j++) {
              const t = Applicant.find({ _id: appls[j].userid })
                .lean()
                .then((applicants) => {
                  const applicant = applicants[0];
                  appls[j] = {
                    ...appls[j],
                    jobtype: jobs[i].typeofjob,
                    jobtitle: jobs[i].title,
                    applname: applicant.name,
                    education: applicant.education,
                    userrating: applicant.rating,
                    skills: applicant.skills,
                  };
                  applications.push(appls[j]);
                });
              promises.push(t);
            }
          });
        promises.push(k);
      }
      Promise.all(promises)
        .then(() => {
          res.json(applications);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(404).send(err));
});

// POST request
// Add an application to db
router.post("/", (req, res) => {
  const newApplication = new Application({
    userid: req.body.userid,
    jobid: req.body.jobid,
    dateofapplication: req.body.dateofapplication,
    sop: req.body.sop,
    status: req.body.status,
    jobrating: req.body.jobrating,
    applicantrating: req.body.applicantrating,
    joiningdate: req.body.joiningdate,
  });

  newApplication
    .save()
    .then((application) => {
      res.status(200).json(application);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//UPDATE request
//Update an application
router.put("/:id", (req, res) => {
  Application.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(() => {
      Application.findOne({ _id: req.params.id }).then((application) => {
        res.json(application);
      });
    })
    .catch((err) => res.status(404).send(err));
});

//UPDATE request
// Update Applicant Rating
router.put("/applicantrating/:id", (req, res) => {
  Application.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(() => {
      Application.findOne({ _id: req.params.id }).then((application) => {
        console.log(application);
        Applicant.findOne({ _id: application.userid }).then((applicant) => {
          console.log(applicant);
          const rating = {
            sum: applicant.rating.sum + application.applicantrating.value,
            count: applicant.rating.count + 1,
          };
          Applicant.findByIdAndUpdate(
            { _id: applicant._id },
            { rating }
          ).then(() => res.json(application));
        });
      });
    })
    .catch((err) => res.status(404).send(err));
});

//UPDATE request
// Update Job Rating
router.put("/jobrating/:id", (req, res) => {
  Application.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(() => {
      Application.findOne({ _id: req.params.id }).then((application) => {
        Job.findOne({ _id: application.jobid }).then((job) => {
          const rating = {
            sum: job.rating.sum + application.jobrating.value,
            count: job.rating.count + 1,
          };
          Job.findByIdAndUpdate({ _id: job._id }, { rating }).then(() =>
            res.json(application)
          );
        });
      });
    })
    .catch((err) => res.status(404).send(err));
});

// DELETE request
//Delete an Application by id
router.delete("/:id", (req, res) => {
  Application.findById(req.params.id)
    .then((item) => item.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).send(err));
});

module.exports = router;
