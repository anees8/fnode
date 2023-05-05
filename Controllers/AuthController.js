const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


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
   return res.status(200).json({ success : true , message: 'User registered successfully' , data  })
    } catch (error) {
        return res.status(400).json({ success : false , error })
    }

}

const login = async (req,res,next)=>{
        try {
            
            const { email, password } = req.body;

            const user = await User.findOne({email});
            if (user) {
                const matches = await bcrypt.compare(password, user.password);
                    if (matches) {
                    const token = jwt.sign({ userId: user._id },process.env.ACCESS_TOKEN_SECRET,{
                    expiresIn:process.env.ACCESS_TOKEN_EXPIRE_TIME,
                    });
                    return res.status(200).json({ success : true , token })
                  } else {
                    return res.status(401).json({success : false, error: 'Invalid email or password' });
                  }
                } else {
                    return res.status(401).json({success : false, error: 'Invalid email or password' });
                }
            
           
        } catch (error) {
            return res.status(400).json({ success : false , error })
        }

}


    

    
    const forgetPassword= async (req,res,next)=>{
        
    try {

        const { email} = req.body;

        const user = await User.findOne({email});
        if (user) {
            const randomtoken=Math.floor(100000 + Math.random() * 900000);
        const data = await User.updateOne({email:email },
        { $set: { token : randomtoken } });

    
     
    const transporter = nodemailer.createTransport({
    host:process.env.MAIL_HOST,
    port:process.env.MAIL_PORT,
    secure:true,
    requireTLS:true,
    auth:{
    user:process.env.MAIL_USERNAME,
    pass:process.env.MAIL_PASSWORD
    }
    });

    const mailOptions={
    from:process.env.MAIL_FROM_ADDRESS,
    to:user.email,
    subject:'For Reset Password',
    html:'<p> Hi '+user.name+', Please copy the link <a href="http://localhost:3000/api/ResetPassword?token='+randomtoken+'&email='+user.email+'"</a> and Reset Your Password</p>'
    }

    

    let info = await transporter.sendMail(mailOptions, (error, info) => {
   console.log("error",error);
    });


        
       
       return res.status(200).json({ success : true , message: 'The token has been successfully sent to your email address',data})
        }else {
        return res.status(401).json({success : false, error: 'Please provide a valid email address' });
        }

    } catch (error) {
    return  res.status(400).json({ success : false , error })
    }

}

const ResetPassword= async (req,res,next)=>{  
    try {
        const token=req.query.token;
        return res.status(200).json({ success : true ,token})
    } catch (error) {
        return  res.status(400).json({ success : false , error })
        }
    
    }






module.exports = {register, login,forgetPassword,ResetPassword}