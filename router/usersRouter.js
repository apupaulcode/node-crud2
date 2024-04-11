// external imports 

const express = require('express');
const router = express.Router();

// internal imports 
const {getUsers, addUser} = require('../controller/usersController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse.js');
const avatarUpload = require('../middlewares/users/avatarUpload.js');
const {addUserValidators,addUserValidationHandler} = require('../middlewares/users/usersValidator.js')
router.get('/',decorateHtmlResponse('Users'), getUsers);
router.post(
    '/',
    avatarUpload,
    addUserValidators,
    addUserValidationHandler,
    addUser
);



module.exports = router;