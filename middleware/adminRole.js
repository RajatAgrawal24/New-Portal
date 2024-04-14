const jwt = require('jsonwebtoken')

const authRole = (roles) => {
    return (req, res, next) => {
        // console.log(req.userData.role);
        if (!roles.includes(req.userData.role)) {
            res.redirect('/home');
        }
        next();
    };
};

module.exports = authRole