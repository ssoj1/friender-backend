"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for interests. */

class Interest {
    /** Create a interests (from data), update db, return new interests data.
     *
     * data should be { user_id, interests }
     *
     * Returns { id, user_id, interests }
    **/
    static async add(id, interests) {
        const result = await db.query(
            `INSERT INTO interests (
                user_id,
                interest)
            VALUES ($1, $2)
            RETURNING id, user_id, interest`,
            [
                id,
                interests,
            ]);

        let interest = result.rows[0];

        return interest;
    }
}

module.exports = Interest;