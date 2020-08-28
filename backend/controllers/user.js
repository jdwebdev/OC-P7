const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const { Op } = require('sequelize');
require("dotenv").config();

exports.signup = (req, res, next) => {
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || username == null || password == null) {
        return res.status(400).json({ 'error': 'Paramètres manquants' });
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
                        return res.status(401).json({ 'error': 'Mot de passe incorrect '});
                    } 
                    res.status(200).json({
                        userId: user.id,
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