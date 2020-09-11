const models = require('../models');

exports.getLike = (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    models.Like.findOne({
        where: {
            postId: postId,
            userId: userId
        }
    })
    .then( likeFound => {
        models.Dislike.findOne({
            where: {
                postId: postId,
                userId: userId
            }
        })
        .then( dislikeFound => {
            return res.status(200).json({ likeFound, dislikeFound });
        })
        .catch(() => res.status(404).json({ 'Error': 'Avis introuvables' })) 
    })
    .catch(() => res.status(404).json({ 'Error': 'Avis introuvables' })) 
}

exports.getDislike = (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    models.Dislike.findOne({
        where: {
            postId: postId,
            userId: userId
        }
    })
    .then( dislikeFound => {
        models.Like.findOne({
            where: {
                postId: postId,
                userId: userId
            }
        })
        .then( likeFound => {
            return res.status(200).json({ likeFound, dislikeFound });
        })
        .catch(() => res.status(404).json({ 'Error': 'Avis introuvables' })) 
    })
    .catch(() => res.status(404).json({ 'Error': 'Avis introuvables' })) 
}

/*
    LikePost :
    Cherche le post correspondant à celui qu'on a aimé
    Cherche l'utilisateur actuel, celui qui a cliqué
    Vérifier dans la table likes s'il n'existe pas déjà un like correspondant à la fois à ce post ET à cet utilisateur
        S'il n'y en a pas on peut créer le nouveau like dans la table likes, puis incrémentation de la colonne likes du post
        S'il y en a déjà un cela signifie que cet utilisateur a déjà aimé ce post, on supprime donc le like de la table likes, puis décrémentation de la colonne likes du post
*/
exports.likePost = (req,res) => {
    const postId = req.body.postId;
    const userId = req.body.userId; 

    models.Post.findOne({
        where: { id: postId }
    })
    .then( post => {
        models.User.findOne({
            where: { id: userId }
        })
        .then( user => {
            if (user) {
                models.Like.findOne({
                    where: {
                        userId: user.id,
                        postId: post.id 
                    }
                })
                .then( likeFound => {
                    if (!likeFound) {
                        models.Like.create({
                            userId: user.id,
                            postId: post.id
                        })
                        .then( r => {
                            post.increment('likes')
                            .then( r => {
                                return res.status(200).json({ r });
                            })
                            .catch(() => res.status(500).json({ 'Error': 'Impossible d\'incrémenter'}));
                        })
                        .catch(() => res.status(500).json({ 'Error': 'Impossible de liker'}));
                    } else {
                        likeFound.destroy()
                        .then( r => {
                            post.decrement('likes')
                            .then( r => {
                                return res.status(200).json({ r });
                            })
                            .catch(() => res.status(500).json({ 'Error': 'Impossible de décrémenter'}));
                        })
                        .catch(() => res.status(500).json({ 'Error': 'Impossible d\'enlever le like'}));
                    }
                })
                .catch(() => res.status(404).json({ 'Error': 'Avis introuvable' }));
            }
        })
        .catch(() => res.status(404).json({ 'Error': 'Utilisateur introuvable' }));
    })
    .catch(() => res.status(404).json({ 'Error': 'Post introuvable' }));
}

exports.dislikePost = (req,res) => {
    const postId = req.body.postId;
    const userId = req.body.userId; 
    
    models.Post.findOne({
        where: { id: postId }
    })
    .then( post => {
        models.User.findOne({
            where: { id: userId }
        })
        .then( user => {
            if (user) {
                models.Dislike.findOne({
                    where: {
                        userId: user.id,
                        postId: post.id 
                    }
                })
                .then( dislikeFound => {
                    if (!dislikeFound) {
                        models.Dislike.create({
                            userId: user.id,
                            postId: post.id
                        })
                        .then( r => {
                            post.increment('dislikes')
                            .then( r => {
                                return res.status(200).json({ r });
                            })
                            .catch(() => res.status(500).json({ 'Error': 'Impossible d\'incrémenter'}));
                        })
                        .catch(() => res.status(500).json({ 'Error': 'Impossible de disliker'}));
                    } else {
                        dislikeFound.destroy()
                        .then( r => {
                            post.decrement('dislikes')
                            .then( r => {
                                return res.status(200).json({ r });
                            })
                            .catch(() => res.status(500).json({ 'Error': 'Impossible de décrémenter'}));
                        })
                        .catch(() => res.status(500).json({ 'Error': 'Impossible d\'enlever le dislike'}));
                    }
                })
                .catch(() => res.status(404).json({ 'Error': 'Avis introuvable' }));
            }
        })
        .catch(() => res.status(404).json({ 'Error': 'Utilisateur introuvable' }));
    })
    .catch(() => res.status(404).json({ 'Error': 'Post introuvable' }));
}