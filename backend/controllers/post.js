const models = require('../models');

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

    console.log(fields);
    console.log(limit);
    console.log(offset);
    console.log(order);

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
            attributes: [ 'username' ],
        },
        {
            model: models.Comment,
            as: 'commentPost',
            attributes: [ 'id', 'content' ],
            include: {
                model: models.User,
                attributes: [ 'username' ]
            }
        }]
    }).then((posts) => {
        if (posts) {
            res.status(200).json({posts});
        } else {
            res.status(404).json({ 'error': 'no posts found'});
        }
    }).catch((e) => {
        console.log(e);
        return res.status(500).json({ 'error': 'invalid fields'});
    });
};