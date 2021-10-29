"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
// const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** GET / => { users: [ {id, username, firstname, lastname, email, zipcode, photoUrl, hobby, interest }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: loggedIn
 **/

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAllUsers();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id] => { user }
 *
 * Returns { id, username, firstname, lastname, email, zipcode }
 *
 * Authorization required: logged in
 **/

 router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = await User.get(req.params.id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;