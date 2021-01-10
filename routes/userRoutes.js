const express = require('express');

const ctrl = require('../controllers/userController');

const router = express.Router();

router.post('/signup', ctrl.signupPost);

router.post('/signin', ctrl.signinPost);

module.exports = router;
