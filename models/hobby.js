"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for hobbies. */

class Hobby {
    /** Create a hobby (from data), update db, return new hobby data.
     *
     * data should be { user_id, hobby }
     *
     * Returns { id, user_id, hobby }
    **/
    static async add(id, hobbies) {
        const result = await db.query(
            `INSERT INTO hobbies (
                user_id,
                hobby)
            VALUES ($1, $2)
            RETURNING id, user_id, hobby`,
            [
                id,
                hobbies,
            ]);

        let hobby = result.rows[0];

        return hobby;
    }
}
//     /** Delete given hobby from database; returns undefined.
//      *
//      * Throws NotFoundError if hobby not found.
//     **/
    
//     static async remove(id) {
//         const result = await db.query(
//             `DELETE
//             FROM jobs
//             WHERE id = $1
//             RETURNING id`, [id]
//         );
//         const job = result.rows[0];

//         if (!job) throw new NotFoundError(`No job: ${id}`);
//     }
// }

module.exports = Hobby;