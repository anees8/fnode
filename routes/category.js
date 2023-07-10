const express = require('express');
const router = express.Router();
const authenticateJWT  = require('../middleware/auth');
const permission = require('../middleware/permission');
const CategoryController = require('../Controllers/CategoryController')


router.get('/categories',[authenticateJWT,permission('category_read')],CategoryController.index);
router.post('/category',[authenticateJWT,permission('category_create')],CategoryController.store);
router.get('/category/:categoryID',[authenticateJWT,permission('category_read')],CategoryController.show);
router.delete('/category/:categoryID',[authenticateJWT,permission('category_delete')],CategoryController.destroy);
router.patch('/category/:categoryID',[authenticateJWT,permission('category_update')],CategoryController.update);
router.patch('/categoryStatus/:categoryID',[authenticateJWT,permission('category_update')],CategoryController.updatestatus);

module.exports=router;