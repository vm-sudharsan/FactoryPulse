const { getUserModel } = require('../models/User');

class OperatorController {
  async getAllOperators(req, res) {
    try {
      const UserModel = getUserModel();
      const dbType = process.env.DB_TYPE || 'mongodb';

      let operators;
      if (dbType === 'mongodb') {
        operators = await UserModel.find({ role: 'operator' })
          .select('-password')
          .sort({ createdAt: -1 })
          .lean();
      } else {
        operators = await UserModel.findAll({
          where: { role: 'operator' },
          attributes: { exclude: ['password'] },
          order: [['createdAt', 'DESC']],
        });
        operators = operators.map(op => op.toJSON());
      }

      return res.status(200).json(operators);
    } catch (error) {
      console.error('Get all operators error:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }

  async createOperator(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const UserModel = getUserModel();
      const dbType = process.env.DB_TYPE || 'mongodb';

      // Check if user already exists
      let existingUser;
      if (dbType === 'mongodb') {
        existingUser = await UserModel.findOne({ email });
      } else {
        existingUser = await UserModel.findOne({ where: { email } });
      }

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new operator
      let operator;
      if (dbType === 'mongodb') {
        operator = new UserModel({
          name,
          email,
          password,
          role: 'operator',
        });
        await operator.save();
        operator = operator.toObject();
      } else {
        operator = await UserModel.create({
          name,
          email,
          password,
          role: 'operator',
        });
        operator = operator.toJSON();
      }

      // Remove password from response
      delete operator.password;

      return res.status(201).json({
        message: 'Operator created successfully',
        operator,
      });
    } catch (error) {
      console.error('Create operator error:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }

  async updateOperator(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const UserModel = getUserModel();
      const dbType = process.env.DB_TYPE || 'mongodb';

      let operator;
      if (dbType === 'mongodb') {
        operator = await UserModel.findByIdAndUpdate(
          id,
          { name, email },
          { new: true }
        ).select('-password').lean();
      } else {
        operator = await UserModel.findByPk(id);
        if (operator) {
          await operator.update({ name, email });
          operator = operator.toJSON();
          delete operator.password;
        }
      }

      if (!operator) {
        return res.status(404).json({ message: 'Operator not found' });
      }

      return res.status(200).json({
        message: 'Operator updated successfully',
        operator,
      });
    } catch (error) {
      console.error('Update operator error:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }

  async deleteOperator(req, res) {
    try {
      const { id } = req.params;
      const UserModel = getUserModel();
      const dbType = process.env.DB_TYPE || 'mongodb';

      let result;
      if (dbType === 'mongodb') {
        result = await UserModel.findByIdAndDelete(id);
      } else {
        const operator = await UserModel.findByPk(id);
        if (operator) {
          await operator.destroy();
          result = true;
        }
      }

      if (!result) {
        return res.status(404).json({ message: 'Operator not found' });
      }

      return res.status(200).json({ message: 'Operator deleted successfully' });
    } catch (error) {
      console.error('Delete operator error:', error.message);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }
}

module.exports = new OperatorController();
