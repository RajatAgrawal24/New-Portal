const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const checkUserAuth = async (req,res,next) => {
    // console.log('Hello Middleware');
    const{token}=req.cookies
    // console.log(token)
    if(!token){
        req.flash('error', 'Unauthorised user please login')
        res.redirect('/')
    }else{
        const verifyLogin = jwt.verify(token,'guptchabi@123456')
        // console.log(verifyLogin)
        const data = await userModel.findOne({_id:verifyLogin.ID})
        // console.log(data)
        if(!(data.isVerified==1)) {
            req.flash('error', 'Please Verify your Email First')
            res.redirect('/')
        }else{
            req.userData = data
            next();
        }
    }
}

module.exports = checkUserAuth;