const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

router.get('/:postId', auth, commentCtrl.getComments);
router.post('/new', auth, commentCtrl.createComment);
router.put('/', auth, commentCtrl.updateComment);
router.delete('/', auth, commentCtrl.deleteComment);

module.exports = router;