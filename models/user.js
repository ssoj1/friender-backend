"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, zipcode }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT id, 
                  username,
                  password,
                  firstname,
                  lastname,
                  email, 
                  zipcode
          FROM users
          WHERE username = $1`,
      [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
    { username,
      password,
      firstName,
      lastName,
      email,
      zipcode,
      hobbies,
      interests }) {

    const duplicateCheck = await db.query(
      `SELECT username
        FROM users
        WHERE username = $1`,
      [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);


    const userResult = await db.query(
      `INSERT INTO users (
        username,
        password,
        firstname,
        lastname,
        email,
        zipcode
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, username, firstName, lastName, email, zipcode`,
      [
        username,
        hashedPassword,
        firstName,
        lastName,
        email,
        zipcode,
      ],
    );

    const user = userResult.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAllUsers() {
    const result = await db.query(
      `SELECT users.id,
          username,
          firstname,
          lastname,
          email,
          zipcode,
          url as photoUrl,
          hobby,
          interest
      FROM users
      JOIN photos ON photos.user_id = users.id
      JOIN hobbies ON hobbies.user_id = users.id
      JOIN interests ON interests.user_id = users.id
      ORDER BY lastname, firstname`
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(id) {
    console.log("in get user by id")
    const userRes = await db.query(
      `SELECT id, 
                  username,
                  firstname,
                  lastname,
                  email,
                  zipcode
          FROM users
          WHERE id = $1`,
      [id],
    );

    const user = userRes.rows[0];
    console.log("user is ", user)

    if (!user) throw new NotFoundError(`User not found`);

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "firstName",
        lastName: "lastName",
        email: "email",
        zipcode: "zipcode",
      });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                firstName,
                                lastName",
                                email,
                                zipcode`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  // static async remove(username) {
  //   let result = await db.query(
  //         `DELETE
  //          FROM users
  //          WHERE username = $1
  //          RETURNING username`,
  //       [username],
  //   );
  //   const user = result.rows[0];

  //   if (!user) throw new NotFoundError(`No user: ${username}`);
  // }

}


module.exports = User;
