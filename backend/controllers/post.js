const models = require('../models');
const fs = require('fs');


const ITEMS_LIMIT = 50;

exports.createPost = (req, res, next) => {
    const userId = req.body.id;
    const content = req.body.content;
    const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : null;
    

    models.User.findOne({
        where: { id: userId }
    }).then ((user) => {
        if (user) {
            models.Post.create({
                content: content,
                imageUrl: imageUrl,
                likes: 0,
                dislikes: 0,
                UserId: user.id
            })
            .then((newPost) => {
                return res.status(201).json(newPost);
            })
            .catch(() => res.status(500).json({ 'error': 'Impossible de poster le message'}));
        } else {
            return res.status(500).json({ 'error': `L'utilisateur n'a pas pu être vérifié`});
        }
    }).catch(() => res.status(404).json({ 'error': 'Utilisateur introuvable'}));
};

exports.getPosts = (req, res, next) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > ITEMS_LIMIT) {
        limit = ITEMS_LIMIT;
    }

    models.Post.findAll({
        order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: models.User,
            attributes: [ 'username', 'imageUrl' ],
        },
        {
            model: models.Comment,
            as: 'commentPost',
            attributes: [ 'id', 'content' ],
            include: {
                model: models.User,
                attributes: [ 'username', 'imageUrl' ]
            }
        }]
    }).then((posts) => {
        if (posts) {
            res.status(200).json({posts});
        } else {
            res.status(404).json({ 'error': 'no posts found'});
        }
    }).catch((e) => {
        return res.status(500).json({ 'error': 'invalid fields'});
    });
};


exports.updatePost = (req, res) => {

    const postId = req.body.id;
    const postContent = req.body.content;
    
    models.Post.findOne({
        attributes: ['id', 'content', 'imageUrl'],
        where: { id: postId }
    }).then((post) => {
        
        let imgUrl = null; 
        if (req.file) {
            if (post.imageUrl) {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlinkSync(`images/${filename}`);
            }
            imgUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }
        
        post.update({
            content: postContent,
            imageUrl: (imgUrl ? imgUrl : post.imageUrl),
            id: post.id
        }).then(() => {
            return res.status(200).json({ message: 'Post modifié avec succès' });
        }).catch(() => { res.status(400).json({ 'error': 'Impossible de modifier le post' }) });

    }).catch((e) => res.status(400).json({ 'error': 'Post introuvable' }));
}

exports.deletePost = (req, res) => {

    const postId = req.body.postId;

    models.Post.findOne({
        where: { id: postId }
    }).then((post) => {
        if (post) {
            if (post.imageUrl) {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlinkSync(`images/${filename}`);
            }
            post.destroy()
            .then(() => {
                res.status(200).json({'Ok:': 'Post supprimé avec succès'});
            })
        }
    }).catch((e) => res.status(500).json({e}));
}