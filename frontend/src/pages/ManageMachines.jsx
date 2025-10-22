import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import machineService from '../services/machineService';

const ManageMachines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thingspeakFieldId: '',
    thresholds: {
      temperature: { warning: 10, critical: 25 },
      vibration: { warning: 2, critical: 5 },
      current: { warning: 5, critical: 10 }
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      setLoading(true);
      const data = await machineService.getAllMachines();
      setMachines(data);
    } catch (err) {
      setError('Failed to load machines');
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

  const handleThresholdChange = (sensor, level, value) => {
    setFormData({
      ...formData,
      thresholds: {
        ...formData.thresholds,
        [sensor]: {
          ...formData.thresholds[sensor],
          [level]: parseFloat(value) || 0
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingMachine) {
        await machineService.updateMachine(editingMachine.id || editingMachine._id, formData);
        setSuccess('Machine updated successfully');
      } else {
        await machineService.createMachine(formData);
        setSuccess('Machine created successfully');
      }
      
      resetForm();
      loadMachines();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
    setFormData({
      name: machine.name,
      description: machine.description || '',
      thingspeakFieldId: machine.thingspeakFieldId,
      thresholds: machine.thresholds || {
        temperature: { warning: 10, critical: 25 },
        vibration: { warning: 2, critical: 5 },
        current: { warning: 5, critical: 10 }
      }
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this machine?')) {
      return;
    }

    try {
      await machineService.deleteMachine(id);
      setSuccess('Machine deleted successfully');
      loadMachines();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete machine');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      thingspeakFieldId: '',
      thresholds: {
        temperature: { warning: 10, critical: 25 },
        vibration: { warning: 2, critical: 5 },
        current: { warning: 5, critical: 10 }
      }
    });
    setEditingMachine(null);
    setShowForm(false);
  };

  return (
    <div className="manage-page">
      <Navbar />
      
      <div className="manage-container">
        <div className="manage-header">
          <h1>Manage Machines</h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Machine'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {showForm && (
          <div className="form-card">
            <h3>{editingMachine ? 'Edit Machine' : 'Add New Machine'}</h3>
            <form onSubmit={handleSubmit} className="manage-form">
              <div className="form-group">
                <label htmlFor="name">Machine Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter machine name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter machine description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="thingspeakFieldId">ThingSpeak Field ID *</label>
                <input
                  type="number"
                  id="thingspeakFieldId"
                  name="thingspeakFieldId"
                  value={formData.thingspeakFieldId}
                  onChange={handleInputChange}
                  placeholder="Enter field ID (e.g., 4 for field4)"
                  required
                />
              </div>

              <div className="form-section">
                <h4 style={{ marginTop: '20px', marginBottom: '15px', color: '#333' }}>Sensor Thresholds</h4>
                
                <div className="threshold-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                  {/* Temperature Thresholds */}
                  <div className="threshold-group">
                    <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Temperature (°C)</label>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label htmlFor="temp-warning" style={{ fontSize: '13px' }}>Warning</label>
                      <input
                        type="number"
                        id="temp-warning"
                        value={formData.thresholds.temperature.warning}
                        onChange={(e) => handleThresholdChange('temperature', 'warning', e.target.value)}
                        step="0.1"
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="temp-critical" style={{ fontSize: '13px' }}>Critical</label>
                      <input
                        type="number"
                        id="temp-critical"
                        value={formData.thresholds.temperature.critical}
                        onChange={(e) => handleThresholdChange('temperature', 'critical', e.target.value)}
                        step="0.1"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Vibration Thresholds */}
                  <div className="threshold-group">
                    <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Vibration (Hz)</label>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label htmlFor="vib-warning" style={{ fontSize: '13px' }}>Warning</label>
                      <input
                        type="number"
                        id="vib-warning"
                        value={formData.thresholds.vibration.warning}
                        onChange={(e) => handleThresholdChange('vibration', 'warning', e.target.value)}
                        step="0.1"
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vib-critical" style={{ fontSize: '13px' }}>Critical</label>
                      <input
                        type="number"
                        id="vib-critical"
                        value={formData.thresholds.vibration.critical}
                        onChange={(e) => handleThresholdChange('vibration', 'critical', e.target.value)}
                        step="0.1"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Current Thresholds */}
                  <div className="threshold-group">
                    <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Current (A)</label>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label htmlFor="curr-warning" style={{ fontSize: '13px' }}>Warning</label>
                      <input
                        type="number"
                        id="curr-warning"
                        value={formData.thresholds.current.warning}
                        onChange={(e) => handleThresholdChange('current', 'warning', e.target.value)}
                        step="0.1"
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="curr-critical" style={{ fontSize: '13px' }}>Critical</label>
                      <input
                        type="number"
                        id="curr-critical"
                        value={formData.thresholds.current.critical}
                        onChange={(e) => handleThresholdChange('current', 'critical', e.target.value)}
                        step="0.1"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingMachine ? 'Update Machine' : 'Create Machine'}
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
                  <th>Description</th>
                  <th>Field ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {machines.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No machines found</td>
                  </tr>
                ) : (
                  machines.map((machine) => (
                    <tr key={machine.id || machine._id}>
                      <td>{machine.name}</td>
                      <td>{machine.description || '-'}</td>
                      <td>{machine.thingspeakFieldId}</td>
                      <td>
                        <span className={`status-badge ${machine.status}`}>
                          {machine.status?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleEdit(machine)}
                          className="btn btn-sm btn-secondary"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(machine.id || machine._id)}
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

export default ManageMachines;
