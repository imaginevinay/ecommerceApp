const express = require('express');
const router = express.Router();
// controller required
const userController = require('../controllers/userController');
const itemsController = require('../controllers/itemsController');

// authenticated middleware;
const {ensureAuthenticated} = require("../config/authguard");

router.post('/api/v1/user/login',userController.login)
router.post('/api/v1/user/register',userController.register)
router.get('/api/v1/user/logout',userController.logout);

// protected routes
router.get('/api/v1/dashboard',ensureAuthenticated, itemsController.getAllItems)

module.exports = router;