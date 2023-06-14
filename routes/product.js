const express = require('express');
const router = express.Router();
const authenticateJWT  = require('../middleware/auth');
const permission = require('../middleware/permission');
const ProductController = require('../Controllers/ProductController')


router.get('/products',[authenticateJWT,permission('product_read')],ProductController.index);
router.post('/products',[authenticateJWT,permission('product_create')],ProductController.store);
router.get('/products/:productID',[authenticateJWT,permission('product_read')],ProductController.show);
router.delete('/products/:productID',[authenticateJWT,permission('product_delete')],ProductController.destroy);
router.patch('/products/:productID',[authenticateJWT,permission('product_update')],ProductController.update);


module.exports=router;