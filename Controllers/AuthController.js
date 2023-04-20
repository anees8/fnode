const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const register = async (req,res,next)=> {

    try {
        const { name,email,phone,password } = req.body;

    const hashedPwd = await bcrypt.hash(password, 10); 
    let user=new User({
    name,
    email,
    phone,
    password:hashedPwd,
    }); 
    const data = await user.save();
    res.status(200).json({ success : true , message: 'User registered successfully' , data  })
    } catch (error) {
    res.status(400).json({ success : false , error })
    }

}

const login = async (req,res,next)=>{
        try {
            
            const { email, password } = req.body;

            const user = await User.findOne({email});
            if (user) {
                const matches = await bcrypt.compare(password, user.password);
                if (matches) {
                
                    const token = jwt.sign({ userId: user._id },config.get("ACCESS_TOKEN_SECRET"), { expiresIn:config.get("ACCESS_TOKEN_EXPIRE_TIME")});
                    res.status(200).json({ success : true , token })
                  } else {
                    return res.status(401).json({success : false, error: 'Invalid email or password' });
                  }
                } else {
                    return res.status(401).json({success : false, error: 'Invalid email or password' });
                }
            
           
        } catch (error) {
        res.status(400).json({ success : false , error })
        }

}




module.exports = {register, login, }