const express = require('express');
const router = express.Router();
const {createGroup,
  getMyGroups,
  addMember,
  removeMember} = require('../controllers/group.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');
const singleUpload = require('../middlewares/multer');

router.post('/create', isAuthenticated, singleUpload, createGroup);
router.get('/my-groups', isAuthenticated, getMyGroups);
router.post('/:groupId/add', isAuthenticated, addMember);
router.put('/:groupId/remove', isAuthenticated, removeMember);

module.exports = router;