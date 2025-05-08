const express = require('express'); // Import express
const router = express.Router(); // Create a new router instance
const sessionRouter=require('./crudsession.routes'); // Import session routes
const bookRouter=require('./book.routes'); // Import book routes
const ensureAuth = require('../middleware/ensureAuth'); // Import authentication middleware

const bookController = require('../controllers/book'); // Import book controller
const crudBook = new bookController(); // Create an instance of the book controller
router.get('/books', crudBook.getBooks);// Define a root route



// Use session routes
router.use('/session', sessionRouter);
router.use('/book',ensureAuth, bookRouter); // Use book routes

module.exports = router; // Export the router