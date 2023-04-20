const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const register = async (req,res,next)=> {

    const { name,email,phone,password } = req.body;
    try {
     
    const hashedPwd = await bcrypt.hash(password, 10); 
    let user=new User({
    name,
    email,
    phone,
    password:hashedPwd,
    }); 
    const data = await user.save();
    return res.status(200).json({ success : true , message: 'User registered successfully' , data  })
    } catch (error) {
        return  res.status(400).json({ success : false , error })
    }

}

const login = async (req,res,next)=>{
    const { email, password } = req.body;
       
        try {
            
            const user = await User.findOne({email});
            if (user) {
                const matches = await bcrypt.compare(password, user.password);
                if (matches) {

                    const token = jwt.sign({ userId: user._id },process.env.ACCESS_TOKEN_SECRET, { expiresIn:process.env.ACCESS_TOKEN_EXPIRE_TIME});
                    res.status(200).json({ success : true ,message: 'User Login successfully', token })
                  } else {
                    return res.status(401).json({success : false, error: 'Invalid email or password' });
                  }
                } else {
                    return res.status(401).json({success : false, error: 'Invalid email or password' });
                }
            
           
        } catch (error) {
            return  res.status(400).json({ success : false , error })
        }

}




module.exports = {register, login, }