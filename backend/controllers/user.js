const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const models = require('../models');
const { Op } = require('sequelize');
require("dotenv").config();

//Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;


exports.signup = (req, res, next) => {
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || username == null || password == null) {
        return res.status(400).json({ 'error': 'Paramètres manquants' });
    }

    if (username.length <= 3 || username.length >= 16) {
        return res.status(400).json({ 'error': `Longueur du pseudo incorrecte, longueur acceptée : 4 à 15 caractères`});
    }
    
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'error': `Format de l'email non valide`});
    }
    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ 'error': `Mot de passe non valide : entre 4 et 8 lettres sans caractère spécial, incluant au minimum un chiffre)`});
    }

    models.User.findOne({
        attributes: ['username', 'email'],
        where: { 
            [Op.or]: [
                { username: username },
                { email: email }
            ]
        }
    })
    .then((user) => {
        if (!user) {
            bcrypt.hash(password, 10)
                .then(hash => {
                    const newUser = models.User.create({
                        username: username,
                        email: email,
                        password: hash,
                        isAdmin: 0
                    })
                    .then((newUser) => {
                        return res.status(201).json({
                            'userId': newUser.id
                        });
                    })
                    .catch(() => res.status(500).json({'error': 'Impossible de créer un nouvel utilisateur' }))
                })
        } else {
            return res.status(409).json({ 'error': 'Cet utilisateur existe déjà' });
        }
    })
    .catch(() => { return res.status(500).json({ 'error': `Impossible de vérifier l'utilisateur` }) });
}

exports.login = (req, res, next) => {

    const email  = req.body.email;
    const password = req.body.password;
    
    if (email == null || password == null) {
        return res.status(400).json({ 'error': 'Paramètres manquants' });
    }

    models.User.findOne({
        where: { email: email }
    })
    .then((user) => {

        if (user) {
            bcrypt.compare(password, user.password)
                .then( valid => {
                    if (!valid) {
                        return res.status(401).json({ 'error': 'Mot de passe incorrect'});
                    } 
                    res.status(200).json({
                        userId: user.id,
                        username: user.username,
                        token: jwt.sign({ 
                                userId: user.id,
                                isAdmin: user.isAdmin 
                            },
                            process.env.SECRET_TOKEN,
                            { expiresIn: "1h" }
                        )
                    })
                })
        } else {
            return res.status(404).json({ 'error': `Cet utilisateur n'existe pas`});
        }
    })
    .catch(() => {
        return res.status(500).json({ 'error': `Impossible de vérifier l'utilisateur`});
    })
}

exports.getMyProfile = (req, res) => {
    
    models.User.findOne({
        attributes: ['id', 'username', 'email', 'imageUrl', 'aboutMe'],
        where: { id: req.params.id }
    }).then((user) => {
        if (user) {
            res.status(201).json(user);
        } else {
            res.status(404).json({ 'error': 'Utilisateur introuvable' });
        }
    }).catch(() => res.status(500).json({ 'error': 'cannot fetch user' }));
}

exports.updateProfile = (req, res) => {

    models.User.findOne({
        attributes: ['id', 'username', 'imageUrl', 'aboutMe'],
        where: { id: req.body.id }
    }).then((user) => {

        let imgUrl = null; 
        if (req.file) {
            if (user.imageUrl) {
                const filename = user.imageUrl.split('/images/')[1];
                fs.unlinkSync(`images/${filename}`);
            }
            imgUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }

        // Vérifier si le username a été modifié
        if (req.body.username && req.body.username !== user.username) {

            if (req.body.username.length <= 3 || req.body.username.length >= 16) {
                return res.status(400).json({ 'error': `Longueur du pseudo incorrecte, longueur acceptée : 4 à 15 caractères`});
            }
            
            models.User.findOne({
                attributes : ['username'],
                where: { 
                    username: req.body.username
                }
            }).then((userFound) => {
                if (userFound) {
                    return res.status(409).json({ 'error': 'Cet utilisateur existe déjà' });
                } else {
                    updateUser(user, imgUrl, req.body, res);
                }
            }).catch(() => res.status(404).json({'Error': 'UserFound'}))
        } else {
            updateUser(user, imgUrl, req.body, res);
        }        
    }).catch((e) => res.status(400).json({ 'error': 'Utilisateur introuvable' }));
}

function updateUser(user, imgUrl, reqBody, res) {
    user.update({
        ...reqBody,
        imageUrl: (imgUrl ? imgUrl : user.imageUrl),
        id: user.id
    }).then(() => {
        return res.status(200).json({ message: 'Profil modifié avec succès' });
    }).catch(() => { res.status(400).json({ 'error': 'Impossible de modifier le profil' }) });
}

exports.deleteUser = (req, res) => {
    
    const userId = req.body.userId;

    models.User.findOne({
        where: { id: userId }
    }).then((user) => {
        if (user) {
            if (user.imageUrl) {
                const filename = user.imageUrl.split('/images/')[1];
                fs.unlinkSync(`images/${filename}`);
            }
            user.destroy()
            .then(() => {
                res.status(200).json({'Ok:': 'Utilisateur supprimé avec succès'});
            })
        }
    }).catch((e) => res.status(500).json({e}));
}