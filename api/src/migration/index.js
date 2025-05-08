const user=require('./user');
const book=require('./book');
const { pool } = require('../database/index.js');

const Schemas = [];

async function migration() {
    Schemas.push(user);
    Schemas.push(book);

    try {
        for (const schema of Schemas) {
            await pool.query(schema);
        }
        
        console.log('Migration feito');
        // await pool.end(); // Close the database connection
    } catch (err) {
        console.log('An error occurred: ' + err);
    }
}

module.exports = migration;