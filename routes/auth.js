"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");
const fs = require('fs');
const multer  = require('multer');
const upload = multer({ dest: './photos' });
const {uploadToS3} = require("../aws.js");

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  const validator = jsonschema.validate(req.body, userAuthSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const { username, password } = req.body;
  const user = await User.authenticate(username, password);
  const token = createToken(user);
  return res.json({ token });
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include 
 * { username, password, firstName, lastName, email, zipcode, photo, hobbies, interests  }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", upload.single('photo'), async function (req, res, next) {
  // const validator = jsonschema.validate(req.body, userRegisterSchema);
  // if (!validator.valid) {
  //   const errs = validator.errors.map(e => e.stack);
  //   throw new BadRequestError(errs);
  // }
  console.log("req is ", req)
  console.log("req.body is ", req.body);
  console.log("req.file is ", req.file);

  const fileLocation = await uploadToS3(req.file.filename);


  const newUser = await User.register({ ...req.body });
  const token = createToken(newUser);

  // const addPhotoToAws = await upload(req.body.name)
  const newPhoto = await Photo.add(newUser.id, fileLocation);

  // return res.status(201).json({ token });
});


module.exports = router;
