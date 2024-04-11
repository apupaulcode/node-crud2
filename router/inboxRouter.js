// external imports 

const express = require('express');
const router = express.Router();

// internal imports 
const {getInbox} = require('../controller/inboxController.js');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse.js');

router.get('/',decorateHtmlResponse('Inbox'), getInbox);



module.exports = router;