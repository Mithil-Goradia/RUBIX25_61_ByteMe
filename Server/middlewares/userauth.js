const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
dotenv.config();
const JWT_SECRET = process.env.jwt;

const authUser = async (req,res,next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        console.log(token);
        const decode = jwt.verify(token, JWT_SECRET)
        console.log("Decoded user",decode);

        const user = await User.findOne({_id: decode._id, email: decode.email})
        if(!user){
            return res.status(403).json({message: 'Unauthorized access: Not a valid user'})
        }
        console.log('Found user',user);
        req.user = user
        next()
    }catch(e){
        res.json({
            message: "Could not authenticate user",
            error: e
        })
    }
}

const passAuthUser = (req, res, next) => {
    console.log(req.user);
    console.log('passport middleware called');
    if(!req.isAuthenticated()){  
        return res.redirect('/');
    }
    next();
};

module.exports = {authUser,passAuthUser};