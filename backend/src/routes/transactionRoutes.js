const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Rotas de transações
router.post('/', transactionController.create);
router.get('/', transactionController.list);
router.get('/balance', transactionController.getBalance);
router.get('/:id', transactionController.getById);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.delete);

module.exports = router;