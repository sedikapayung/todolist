const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("authHeader:", authHeader); 
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token:", token); // Cetak nilai token
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCES_TOKEN_SECCRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };
