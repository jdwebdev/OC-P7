const models = require('../models');

exports.createComment = (req, res) => {
    const content = req.body.content;
    const userId = req.body.userId;
    const postId = req.body.postId;
    
    models.Comment.create({
        UserId: userId,
        PostId: postId,
        content: content
    })
    .then((newComment) => {
        return res.status(201).json({ newComment });
    })
    .catch((error) => {
        return res.status(500).json({error});
    })
}

exports.updateComment = (req, res) => {
    
    const commentId = req.body.commentId;
    const commentContent = req.body.content;
    
    models.Comment.findOne({
        attributes: ['id', 'content'],
        where: { id: commentId }
    }).then((comment) => {
        
        comment.update({
            content: commentContent,
            id: comment.id
        }).then(() => {
            return res.status(200).json({ message: 'Commentaire modifié avec succès' });
        }).catch(() => { res.status(400).json({ 'error': 'Impossible de modifier le commentaire' }) });

    }).catch((e) => res.status(400).json({ 'error': 'Commentaire introuvable' }));
}

exports.deleteComment = (req, res) => {

    const commentId = req.body.commentId;

    models.Comment.findOne({
        where: { id: commentId }
    }).then((comment) => {
        if (comment) {
            comment.destroy()
            .then(() => {
                res.status(200).json({'Ok:': 'Commentaire supprimé avec succès'});
            })
        }
    }).catch((e) => res.status(500).json({e}));
}