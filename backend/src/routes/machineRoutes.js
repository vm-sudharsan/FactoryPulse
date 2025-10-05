const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const { authMiddleware, ownerOnly } = require('../middleware/authMiddleware');

// GET /api/machines - Get all machines (protected)
router.get('/', authMiddleware, machineController.getAllMachines);

// GET /api/machines/:id - Get machine by ID (protected)
router.get('/:id', authMiddleware, machineController.getMachineById);

// POST /api/machines - Create new machine (owner only)
router.post('/', authMiddleware, ownerOnly, machineController.createMachine);

// PUT /api/machines/:id - Update machine (owner only)
router.put('/:id', authMiddleware, ownerOnly, machineController.updateMachine);

// DELETE /api/machines/:id - Delete machine (owner only)
router.delete('/:id', authMiddleware, ownerOnly, machineController.deleteMachine);

// POST /api/machines/:id/toggle - Toggle machine on/off (protected)
router.post('/:id/toggle', authMiddleware, machineController.toggleMachine);

module.exports = router;
