const jwt = require('jsonwebtoken');
const authenticateJWT = (req, res, next) => {
  const bearerToken = req.header('Authorization');

  if (!bearerToken) {
    res.status(401).json({ success : false , error:"Unauthorized" })
  }
  const token = bearerToken.split(' ')[1];
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ success : false , error:"Forbidden" })

    }
    req.user = user;
    next();
  });

};


module.exports = authenticateJWT;