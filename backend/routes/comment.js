const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

router.get('/:postId', auth, commentCtrl.getComments);
router.post('/new', auth, commentCtrl.createComment);

module.exports = router;