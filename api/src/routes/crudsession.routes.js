const router = require('express').Router(); // Import express router
const CrudSession = require('../controllers/crudSession'); // Import session controller
const crudSession = new CrudSession(); // Create an instance of the session controller

// Define routes for session operations
router.post('/register', crudSession.signUp); 
router.post('/', crudSession.signIn); 

module.exports = router; // Export the router