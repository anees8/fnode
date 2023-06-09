const express = require('express');
const router = express.Router();
const ImapController = require('../Controllers/ImapController');


router.get('/imap',ImapController.index);


module.exports=router;