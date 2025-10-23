import api from './api';

const mlService = {
  analyzeCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/ml/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
    });

    return response.data;
  },

  validateCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/ml/validate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },

  checkMLService: async () => {
    const response = await api.get('/ml/health');
    return response.data;
  }
};

export default mlService;
