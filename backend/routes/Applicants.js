var express = require("express");
var router = express.Router();

// Load Applicant model
const Applicant = require("../models/Applicant");

// GET request
// Getting all the applicants
router.get("/", function (req, res) {
  Applicant.find(function (err, applicants) {
    if (err) {
      console.log(err);
    } else {
      res.json(applicants);
    }
  });
});

//GET request
// Get an applicant by id
router.get("/:id", (req, res) => {
  Applicant.findById(req.params.id)
    .then((applicant) => res.json(applicant))
    .catch((err) => res.status(404).send(err));
});

// POST request
// Add an applicant to db
router.post("/", (req, res) => {
  const newApplicant = new Applicant({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    education: req.body.education,
    skills: req.body.skills,
    rating: req.body.rating,
  });

  newApplicant
    .save()
    .then((applicant) => {
      res.status(200).json(applicant);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// POST request
// Login
router.post("/login", (req, res) => {
  const email = req.body.email;
  // Find user by email
  Applicant.findOne({ email }).then((applicant) => {
    // Check if applicant email exists
    if (!applicant) {
      return res.status(404).json({
        error: "Email not found",
      });
    } else {
      if (req.body.password === applicant.password) {
        return res.json(applicant);
      } else {
        return res.status(404).json({
          error: "Wrong password",
        });
      }
    }
  });
});

//UPDATE request
//Update an application
router.put("/:id", (req, res) => {
  Applicant.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(() => {
      Applicant.findOne({ _id: req.params.id }).then((applicant) => {
        res.json(applicant);
      });
    })
    .catch((err) => res.status(404).send(err));
});

// DELETE request
//Delete an Applicant by id
router.delete("/:id", (req, res) => {
  Applicant.findById(req.params.id)
    .then((item) => item.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).send(err));
});

module.exports = router;
