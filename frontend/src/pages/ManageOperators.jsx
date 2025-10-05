import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import machineService from '../services/machineService';

const ManageOperators = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOperator, setEditingOperator] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadOperators();
  }, []);

  const loadOperators = async () => {
    try {
      setLoading(true);
      const data = await machineService.getAllOperators();
      setOperators(data);
    } catch (err) {
      setError('Failed to load operators');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingOperator) {
        const updateData = { name: formData.name, email: formData.email };
        await machineService.updateOperator(editingOperator.id || editingOperator._id, updateData);
        setSuccess('Operator updated successfully');
      } else {
        if (!formData.password) {
          setError('Password is required for new operators');
          return;
        }
        await machineService.createOperator(formData);
        setSuccess('Operator created successfully');
      }
      
      resetForm();
      loadOperators();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (operator) => {
    setEditingOperator(operator);
    setFormData({
      name: operator.name,
      email: operator.email,
      password: ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this operator?')) {
      return;
    }

    try {
      await machineService.deleteOperator(id);
      setSuccess('Operator deleted successfully');
      loadOperators();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete operator');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setEditingOperator(null);
    setShowForm(false);
  };

  return (
    <div className="manage-page">
      <Navbar />
      
      <div className="manage-container">
        <div className="manage-header">
          <h1>Manage Operators</h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Operator'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {showForm && (
          <div className="form-card">
            <h3>{editingOperator ? 'Edit Operator' : 'Add New Operator'}</h3>
            <form onSubmit={handleSubmit} className="manage-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              {!editingOperator && (
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    required
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingOperator ? 'Update Operator' : 'Create Operator'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {operators.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No operators found</td>
                  </tr>
                ) : (
                  operators.map((operator) => (
                    <tr key={operator.id || operator._id}>
                      <td>{operator.name}</td>
                      <td>{operator.email}</td>
                      <td>
                        <span className="role-badge">
                          {operator.role?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleEdit(operator)}
                          className="btn btn-sm btn-secondary"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(operator.id || operator._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOperators;
