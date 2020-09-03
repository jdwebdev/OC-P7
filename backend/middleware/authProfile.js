const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodedToken.userId;

        if(req.params.id && req.params.id != userId) {
            throw 'ID utilisateur non valable !';
        } else {
            next();
        }
    } catch (error) {
        console.log('authProfile error !');
        res.status(401).json({ error });
    }
};