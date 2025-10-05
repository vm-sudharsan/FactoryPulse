import api from './api';

const machineService = {
  getRecentData: async () => {
    const response = await api.get('/data/recent');
    return response.data;
  },

  getAllData: async () => {
    const response = await api.get('/data/all');
    return response.data;
  },

  getAllMachines: async () => {
    const response = await api.get('/machines');
    return response.data;
  },

  getMachineById: async (id) => {
    const response = await api.get(`/machines/${id}`);
    return response.data;
  },

  createMachine: async (machineData) => {
    const response = await api.post('/machines', machineData);
    return response.data;
  },

  updateMachine: async (id, machineData) => {
    const response = await api.put(`/machines/${id}`, machineData);
    return response.data;
  },

  deleteMachine: async (id) => {
    const response = await api.delete(`/machines/${id}`);
    return response.data;
  },

  toggleMachine: async (id) => {
    const response = await api.post(`/machines/${id}/toggle`);
    return response.data;
  },

  getAllOperators: async () => {
    const response = await api.get('/operators');
    return response.data;
  },

  createOperator: async (operatorData) => {
    const response = await api.post('/operators', operatorData);
    return response.data;
  },

  updateOperator: async (id, operatorData) => {
    const response = await api.put(`/operators/${id}`, operatorData);
    return response.data;
  },

  deleteOperator: async (id) => {
    const response = await api.delete(`/operators/${id}`);
    return response.data;
  }
};

export default machineService;
