var express = require("express");
var router = express.Router();

// Load Job model
const Job = require("../models/Job");
const Applicant = require("../models/Applicant");
const Recruiter = require("../models/Recruiter");
const Application = require("../models/Application");

//GET request
//listings data
router.get("/listings/:userid", (req, res) => {
  var promises = [];
  Job.find()
    .lean()
    .then((jobs) => {
      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        const p = Application.find({
          userid: req.params.userid,
          jobid: job._id,
        })
          .lean()
          .then((appl) => {
            if (appl.length) job["isApplied"] = true;
            else job["isApplied"] = false;
          });
        promises.push(p);
        if (!job.isApplied) {
          const k = Application.find({ jobid: job._id })
            .lean()
            .then((jobs) => {
              var accepted = 0;
              var active = 0;
              for (let j = 0; j < jobs.length; j++) {
                const apln = jobs[j];
                if (apln.status != "Rejected") active++;
                if (apln.status == "Accepted") accepted++;
              }
              if (accepted >= job.positions || active >= job.maxappl)
                job.isFull = true;
              else job["isFull"] = false;
            });
          promises.push(k);
        }
      }
      Promise.all(promises).then(() => {
        res.json(jobs);
      });
    })
    .catch((err) => res.status(404).send(err));
});

// GET request
// MyJobs Page
router.get("/myjobs/:userid", (req, res) => {
  var promises = [];
  const p = Job.find({ recid: req.params.userid })
    .lean()
    .then((jobs) => {
      for (let i = 0; i < jobs.length; i++) {
        const k = Application.find({
          jobid: jobs[i]._id,
          status: { $ne: "Rejected" },
        })
          .lean()
          .then((appls) => {
            var accepted = 0;
            for (let i = 0; i < appls.length; i++) {
              if (appls[i].status == "Accepted") accepted++;
            }
            jobs[i] = {
              ...jobs[i],
              activeapplicants: appls.length,
              acceptedapplicants: accepted,
            };
          });
        promises.push(k);
      }
      Promise.all(promises).then(() => res.json(jobs));
    })
    .catch((err) => res.status(404).send(err));
});

// GET request
// Getting all the jobs
router.get("/", function (req, res) {
  Job.find(function (err, jobs) {
    if (err) {
      console.log(err);
    } else {
      res.json(jobs);
    }
  });
});

//GET request
// Get a job by id
router.get("/:id", (req, res) => {
  Job.findById(req.params.id)
    .then((job) => res.json(job))
    .catch((err) => res.status(404).send(err));
});

//GET request
// Get all jobs by recruiterid
router.get("/recruiter/:id", (req, res) => {
  Job.find({ recid: req.params.id })
    .then((jobs) => res.json(jobs))
    .catch((err) => res.status(404).send(err));
});

// POST request
// Add a job to db
router.post("/", (req, res) => {
  const newJob = new Job({
    title: req.body.title,
    recname: req.body.recname,
    recemail: req.body.recemail,
    recid: req.body.recid,
    maxappl: req.body.maxappl,
    positions: req.body.positions,
    emptypositions: req.body.emptypositions,
    dateofpost: req.body.dateofpost,
    deadline: req.body.deadline,
    requiredskills: req.body.requiredskills,
    typeofjob: req.body.typeofjob,
    duration: req.body.duration,
    salary: req.body.salary,
    rating: req.body.rating,
  });

  newJob
    .save()
    .then((job) => {
      res.status(200).json(job);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//UPDATE request
//Update a job
router.put("/:id", (req, res) => {
  Job.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(() => {
      Job.findOne({ _id: req.params.id }).then((job) => {
        res.json(job);
      });
    })
    .catch((err) => res.status(404).send(err));
});

// DELETE request
//Delete a job by id
router.delete("/:id", (req, res) => {
  Job.findById(req.params.id)
    .then((item) => item.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).send(err));
});

// DELETE request
//Delete all details about a job
router.delete("/delete/:id", (req, res) => {
  Job.findByIdAndDelete(req.params.id)
    .then(() => {
      Application.deleteMany({ jobid: req.params.id }).then(() =>
        res.json({ success: true })
      );
    })
    .catch((err) => res.status(404).send(err));
});

module.exports = router;
