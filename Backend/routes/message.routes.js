const express = require('express');
const router = express.Router();

const {
  sendPrivateMessage,
  getPrivateMessages,
  sendGroupMessage,
  getGroupMessages,
} = require('../controllers/message.controller');

const isAuthenticated = require('../middlewares/isAuthenticated');
const singleUpload = require('../middlewares/multer');


router.post('/group/send/:id', isAuthenticated, singleUpload, sendGroupMessage);
router.get('/group/get/:id', isAuthenticated, getGroupMessages);
router.post('/send/:id', isAuthenticated, singleUpload, sendPrivateMessage);
router.get('/get/:id', isAuthenticated, getPrivateMessages);

module.exports = router;
