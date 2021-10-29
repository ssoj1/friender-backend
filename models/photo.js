"use strict";

const db = require("../db");
// const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


// const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for photos. */

class Photo {
  /** adds a photo url to the database
   * 
   * returns userId and photoUrl
   * 
   **/

  /** Add a photo URL to photos table in DB */
  static async add(userId, photoUrl) {
    // console.log("in add photo function ", {userId, photoUrl});

    const result = await db.query(
          `INSERT INTO photos (user_id, url)
            VALUES ($1, $2)
            RETURNING id, user_id, url`,
        [userId, photoUrl],
    );
    return result;
  }
}

module.exports = Photo;