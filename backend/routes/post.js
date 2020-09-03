const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const authProfile = require('../middleware/authProfile');
const multer = require('../middleware/multer-config');

router.get('/', authProfile, postCtrl.getPosts);
router.post('/new', auth, multer, postCtrl.createPost);

module.exports = router;