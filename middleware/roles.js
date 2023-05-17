
const roles = {
    admin: {
      permissions: ['user_update','user_pw_update','employee_read','employee_create','employee_update','employee_delete'],
    },
    user: {
      permissions: ['user_update','user_pw_update','employee_read','employee_create','employee_update','employee_delete'],
    },
  };
  
  module.exports = roles;