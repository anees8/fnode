
const roles = {
    admin: {
      permissions: ['users_read','user_update','user_pw_update','employee_read','employee_create','employee_update','employee_delete','product_read','product_create','product_update','product_delete'],
    },
    user: {
      permissions: ['users_read','user_update','user_pw_update','employee_read','employee_create','employee_update','employee_delete','product_read','product_create','product_update','product_delete'],
    },
  };
  
  module.exports = roles;