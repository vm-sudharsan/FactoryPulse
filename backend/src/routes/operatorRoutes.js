const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');
const { authMiddleware, ownerOnly } = require('../middleware/authMiddleware');

// All operator routes are owner-only
router.use(authMiddleware, ownerOnly);

// GET /api/operators - Get all operators
router.get('/', operatorController.getAllOperators);

// POST /api/operators - Create new operator
router.post('/', operatorController.createOperator);

// PUT /api/operators/:id - Update operator
router.put('/:id', operatorController.updateOperator);

// DELETE /api/operators/:id - Delete operator
router.delete('/:id', operatorController.deleteOperator);

module.exports = router;
