// permissionsMiddleware.js
const roles = require('./roles');
const jwt = require('jsonwebtoken');



const permission = (requiredPermission) => {
  return (req, res, next) => {

    const bearerToken = req.header('Authorization');
    const token = bearerToken.split(' ')[1];

    // Assuming you have the JWT token stored in a variable called 'token'
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { role } = decodedToken;


    if (role && roles[role]) {
      if (roles[role].permissions.includes(requiredPermission)) {
        // User has the required permission
        next();
      } else {
        // User doesn't have the required permission
        res.status(403).json({ error: 'Forbidden' });
      }
    } else {
      // User role not found or invalid
      res.status(401).json({ error: 'Unauthorized1' });
    }
  };
};


module.exports = permission;
