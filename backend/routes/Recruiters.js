var express = require("express");
var router = express.Router();

// Load Recruiter model
const Recruiter = require("../models/Recruiter");

// GET request
// Getting all the recruiters
router.get("/", function (req, res) {
  Recruiter.find(function (err, recruiters) {
    if (err) {
      console.log(err);
    } else {
      res.json(recruiters);
    }
  });
});

//GET request
// Get a recruiter by id
router.get("/:id", (req, res) => {
  Recruiter.findById(req.params.id)
    .then((recruiter) => res.json(recruiter))
    .catch((err) => res.status(404).send(err));
});

// POST request
// Add a recruiter to db
router.post("/", (req, res) => {
  const newRecruiter = new Recruiter({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    contact: req.body.contact,
    bio: req.body.bio,
  });

  newRecruiter
    .save()
    .then((recruiter) => {
      res.status(200).json(recruiter);
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
  Recruiter.findOne({ email }).then((recruiter) => {
    // Check if recruiter email exists
    if (!recruiter) {
      return res.status(404).json({
        error: "Email not found",
      });
    } else {
      if (req.body.password === recruiter.password) {
        return res.json(recruiter);
      } else {
        return res.status(404).json({
          error: "Wrong password",
        });
      }
    }
  });
});

//UPDATE request
//Update a recruiter
router.put("/:id", (req, res) => {
  Recruiter.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(() => {
      Recruiter.findOne({ _id: req.params.id }).then((recruiter) => {
        res.json(recruiter);
      });
    })
    .catch((err) => res.status(404).send(err));
});

// DELETE Request
//Delete a Recruiter by id
router.delete("/delete/:id", (req, res) => {
  Recruiter.findById(req.params.id)
    .then((item) => item.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).send(err));
});
module.exports = router;
