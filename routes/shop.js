const path = require('path');

const express = require('express');

const shopController = require('../controller/shop');
const isAuth = require('../middelware/auth');

const router = express.Router();

// router.get('/', shopController.getIndex);

// router.get('/products', shopController.getProducts);

// router.get('/products/:productId', shopController.getProduct);

 router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/order',isAuth,shopController.postOrder);


// router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

// router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;