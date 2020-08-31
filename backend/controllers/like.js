const models = require('../models');


exports.likePost = (req,res) => {
    const postId = parseInt(req.params.postId);
    const userId = req.body.id; // ??

    if (postId <= 0) {
        return res.status(400).json({ 'error': 'invalid parameters' });
    }

    models.Post.findOne({
        where: { id: postId }
    }).then((post) => {
        if (post) {
            models.User.findOne({
                where: { id: userId } 
            })
            .then((user) => {
                if (user) {
                    models.Like.findOne({
                        where: {
                            userId: userId,
                            postId: postId
                        }
                    })
                    .then((isAlreadyLiked) => {
                        if (!isAlreadyLiked) {
                            post.addUser(user)
                            .then(() => {
                                post.update({
                                    likes: post.likes + 1
                                })
                                .then((updatedPost) => {
                                    if (updatedPost) {
                                        return res.status(201).json({'Ok': 'Post liké avec succès' });
                                    } else {
                                        return res.status(500).json({ 'error': 'cannot update message'});
                                    }
                                }).catch(() => res.status(500).json({ 'error': 'cannot update post like counter'}));
                            })
                            .catch(() => res.status(500).json({ 'error': 'unable to set user reaction' }));
                        } else {
                            // TODO: likes: post.likes - 1
                            return res.status(409).json({ 'error': 'post already liked' });
                        }
                    })
                } else {
                    return res.status(404).json({ 'error': 'user doesn\'t exist' });
                }
            })
            .catch(() => res.status(500).json({ 'error': 'unable to verify user' }));
        } else {
            return res.status(404).json({ 'error': 'post already liked' });
        }
    }).catch(() => res.status(500).json({ 'error': 'unable to verify post' }));
}