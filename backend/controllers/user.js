const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const { Op } = require('sequelize');

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
    // FindOne.. bcrypt.compare ...
    const email  = req.body.email;
    const password = req.body.password;
    
}