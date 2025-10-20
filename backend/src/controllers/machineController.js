const { getMachineModel } = require('../models/Machine');
const thingSpeakService = require('../services/thingSpeakService');

class MachineController {
  async getAllMachines(req, res) {
    try {
      const MachineModel = getMachineModel();
      const dbType = process.env.DB_TYPE || 'mongodb';

      let machines;
      if (dbType === 'mongodb') {
        machines = await MachineModel.find().sort({ createdAt: -1 }).lean();
      } else {
        machines = await MachineModel.findAll({
          order: [['createdAt', 'DESC']],
        });
        machines = machines.map(m => m.toJSON());
      }

      return res.status(200).json(machines);
    } catch (error) {
      console.error('Get all machines error:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }

  async getMachineById(req, res) {
    try {
      const { id } = req.params;
      const MachineModel = getMachineModel();
      const dbType = process.env.DB_TYPE || 'mongodb';

      let machine;
      if (dbType === 'mongodb') {
        machine = await MachineModel.findById(id).lean();
      } else {
        machine = await MachineModel.findByPk(id);
        if (machine) machine = machine.toJSON();
      }

      if (!machine) {
        return res.status(404).json({ message: 'Machine not found' });
      }

      return res.status(200).json(machine);
    } catch (error) {
      console.error('Get machine by id error:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }

  async createMachine(req, res) {
    try {
      const { name, description, thresholds } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

      const MachineModel = getMachineModel();
      const dbType = process.env.DB_TYPE || 'mongodb';

      // All machines use Field 4 (single-prototype setup with one ESP32)
      const thingspeakFieldId = 4;

      // Default thresholds if not provided
      const defaultThresholds = {
        temperature: { warning: 10, critical: 25 },
        vibration: { warning: 2, critical: 5 },
        current: { warning: 5, critical: 10 }
      };

      let machine;
      if (dbType === 'mongodb') {
        machine = new MachineModel({
          name,
          description: description || '',
          thingspeakFieldId,
          status: 'off',
          thresholds: thresholds || defaultThresholds,
        });
        await machine.save();
        machine = machine.toObject();
      } else {
        machine = await MachineModel.create({
          name,
          description: description || '',
          thingspeakFieldId,
          status: 'off',
          thresholds: thresholds || defaultThresholds,
        });
        machine = machine.toJSON();
      }

      return res.status(201).json({
        message: 'Machine created successfully',
        machine,
      });
    } catch (error) {
      console.error('Create machine error:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }

  async updateMachine(req, res) {
    try {
      const { id } = req.params;
      const { name, description, thresholds } = req.body;

      const MachineModel = getMachineModel();
      const dbType = process.env.DB_TYPE || 'mongodb';

      const updateData = { name, description };
      if (thresholds) {
        updateData.thresholds = thresholds;
      }

      let machine;
      if (dbType === 'mongodb') {
        machine = await MachineModel.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
        ).lean();
      } else {
        machine = await MachineModel.findByPk(id);
        if (machine) {
          await machine.update(updateData);
          machine = machine.toJSON();
        }
      }

      if (!machine) {
        return res.status(404).json({ message: 'Machine not found' });
      }

      return res.status(200).json({
        message: 'Machine updated successfully',
        machine,
      });
    } catch (error) {
      console.error('Update machine error:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }

  async deleteMachine(req, res) {
    try {
      const { id } = req.params;
      const MachineModel = getMachineModel();
      const dbType = process.env.DB_TYPE || 'mongodb';

      let result;
      if (dbType === 'mongodb') {
        result = await MachineModel.findByIdAndDelete(id);
      } else {
        const machine = await MachineModel.findByPk(id);
        if (machine) {
          await machine.destroy();
          result = true;
        }
      }

      if (!result) {
        return res.status(404).json({ message: 'Machine not found' });
      }

      return res.status(200).json({ message: 'Machine deleted successfully' });
    } catch (error) {
      console.error('Delete machine error:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }

  async toggleMachine(req, res) {
    try {
      const { id } = req.params;
      const MachineModel = getMachineModel();
      const dbType = process.env.DB_TYPE || 'mongodb';

      let machine;
      if (dbType === 'mongodb') {
        machine = await MachineModel.findById(id);
      } else {
        machine = await MachineModel.findByPk(id);
      }

      if (!machine) {
        return res.status(404).json({ message: 'Machine not found' });
      }

      // Toggle status
      const newStatus = machine.status === 'on' ? 'off' : 'on';
      const gpioValue = newStatus === 'on' ? 1 : 0;

      // All machines use Field 4 (single-prototype setup)
      await thingSpeakService.controlGPIO(4, gpioValue);

      // Update database
      if (dbType === 'mongodb') {
        machine.status = newStatus;
        await machine.save();
        machine = machine.toObject();
      } else {
        await machine.update({ status: newStatus });
        machine = machine.toJSON();
      }

      return res.status(200).json({
        message: `Machine turned ${newStatus}`,
        machine,
      });
    } catch (error) {
      console.error('Toggle machine error:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }
}

module.exports = new MachineController();
