const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Rotas de relatórios
router.get('/expenses-by-category', reportController.getExpensesByCategory);
router.get('/monthly-summary', reportController.getMonthlySummary);
router.get('/period-analysis', reportController.getPeriodAnalysis);
router.get('/financial-health', reportController.getFinancialHealth);

module.exports = router;