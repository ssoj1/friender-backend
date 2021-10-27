"use strict";
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
  /** 
   * 
   **/

  /** Add a photo URL to photos table in DB */
  static async add(userId, photoUrl) {

    const result = await db.query(
          `INSERT INTO photos (user_id, url),
            VALUES ($1, $2)
            RETURNING id, user_id, url`,
        [userId, photoUrl],
    );

  }
}