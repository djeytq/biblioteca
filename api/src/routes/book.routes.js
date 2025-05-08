const router = require('express').Router(); // Import express router
const CrudBook = require('../controllers/book'); // Import session controller
const crudBook = new CrudBook(); // Create an instance of the session controller

// Define routes for book operations
router.post('/insert', crudBook.createBook); // Route to create a new book
router.get('/get', crudBook.getBooks); // Route to get all books
router.delete('/delete/:id', crudBook.deleteBook); // Route to delete a book by ID

module.exports = router; // Export the router