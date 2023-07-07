
const roles = {
    admin: {
      permissions: ['users_read','user_update','user_pw_update','employee_read','employee_create','employee_update','employee_delete','product_read','product_create','product_update','product_delete','category_read','category_create','category_update','category_delete'],
    },
    user: {
      permissions: ['users_read','user_update','user_pw_update','employee_read','employee_create','employee_update','employee_delete','product_read','product_create','product_update','product_delete','category_read','category_create','category_update','category_delete'],
    },
  };
  
  module.exports = roles;