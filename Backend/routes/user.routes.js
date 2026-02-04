const express = require('express');
const router = express.Router();
const { registerUser,
    login,
    logout,
    getOtherUsers,
    getUserprofileById,
    getMyprofile,
    resetPassword,
    updateUserprofile } = require('../controllers/user.controller');
const singleUpload = require('../middlewares/multer');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.post('/register',singleUpload, registerUser);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);
router.get('/users', isAuthenticated, getOtherUsers);
router.get('/myprofile', isAuthenticated, getMyprofile);
router.put('/update', isAuthenticated, singleUpload, updateUserprofile);
router.post('/reset-password', resetPassword);
router.get('/profile/:id', isAuthenticated, getUserprofileById);

module.exports = router;

