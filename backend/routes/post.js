const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const likeCtrl = require('../controllers/like');
const auth = require('../middleware/auth');
const authProfile = require('../middleware/authProfile');
const multer = require('../middleware/multer-config');

router.get('/', authProfile, postCtrl.getPosts);
router.post('/new', auth, multer, postCtrl.createPost);
router.put('/', auth, multer, postCtrl.updatePost);
router.delete('/', auth, multer, postCtrl.deletePost);

router.get('/like/:userId/:postId', auth, likeCtrl.getLike);
router.post('/like/new', auth, likeCtrl.likePost); 
router.post('/dislike/new', auth, likeCtrl.dislikePost); 

module.exports = router;