const models = require('../models');

exports.getComments = (req, res) => {

    const postId = req.params.postId;
    console.log(postId)
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
            console.log("comments");
            console.log(comments);
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

    console.log('req.body:')
    console.log(req.body)

    console.log(content);
    console.log(userId);
    console.log(postId);
    
    models.Comment.create({
        UserId: userId,
        PostId: postId,
        content: content
    })
    .then((newComment) => {
        console.log('newComment');
        return res.status(201).json({ newComment });
    })
    .catch((error) => {
        return res.status(500).json({error});
    })
}