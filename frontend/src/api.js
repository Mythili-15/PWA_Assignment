import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const submitText = async (text) => {
  try {
    const response = await api.post('/api/submit-text', { text });
    return response.data.result;
  } catch (error) {
    throw error;
  }
};
export const getConnectionCount = async () => {
  try {
    const response = await api.get('/api/connection-count');
    return response.data.connectionCount;
  } catch (error) {
    throw error;
  }
};
export const getNgramsComparison = async () => {
  try {
    const response = await api.get('/api/process-ngrams');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default api;
