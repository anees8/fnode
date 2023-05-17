const express = require('express');
const router = express.Router();
const authenticateJWT  = require('../middleware/auth');
const permission = require('../middleware/permission');
const EmployeeController = require('../Controllers/EmployeeController')

router.get('/employee',[authenticateJWT,permission('employee_read')],EmployeeController.index);
router.get('/employee/:employeeID',[authenticateJWT,permission('employee_read')],EmployeeController.show);
router.post('/employee',[authenticateJWT,permission('employee_create')],EmployeeController.store);
router.put('/employee/:employeeID',[authenticateJWT,permission('employee_update')],EmployeeController.update);
router.delete('/employee/:employeeID',[authenticateJWT,permission('employee_delete')],EmployeeController.destroy);


module.exports=router;