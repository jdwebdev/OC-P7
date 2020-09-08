const models = require('../models');

exports.getComments = (req, res) => {

    const postId = req.params.postId;
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const order = req.query.order;

    models.Comment.findAll({
        order: [(order != null) ? order.split(':') : ['createdAt', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        include: [{
            model: models.User,
            attributes: [ 'username' ]
        }],
        where: { postId: postId }
    }).then((comments) => {
        if (comments) {
            return res.status(200).json({comments});
        } else {
            return res.status(404).json({ 'error': 'Aucun commentaire disponible' });
        }
    }).catch((e) => res.status(500).json({e}));
}

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