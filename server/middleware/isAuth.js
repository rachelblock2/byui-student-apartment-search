require('dotenv').config();
const jwt = require('jsonwebtoken'); 

module.exports = (req, res, next) => {
    let authHeader = req.headers['authorization'];
    let token;

    // First condition for general web requests and Postman
    if (authHeader.includes(' ')) {
        token = authHeader && authHeader.split(' ')[1];
    // Second condition specifically for Swagger documentation
    } else {
        token = authHeader;
    }
    if (token === null) return res.sendStatus(401);

    // Verifies the JWT sent in request
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // Need to check if token is expired and then to go onto refreshToken method
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}
