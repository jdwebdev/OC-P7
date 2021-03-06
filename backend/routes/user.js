const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const authProfile = require('../middleware/authProfile');
const multer = require('../middleware/multer-config');

router.get('/user/other/:id', auth, userCtrl.getProfile); 
router.get('/user/:id', authProfile, userCtrl.getMyProfile); 
router.put('/user/:id', auth, multer, userCtrl.updateProfile);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/user', auth, userCtrl.deleteUser);

module.exports = router;