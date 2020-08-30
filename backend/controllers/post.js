const models = require('../models');

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

// exports.getPost = (req, res, next) => {

// };