const axios = require('axios');
const NOWPAYMENTS_API_KEY = process.env.REACT_APP_NOWPAYMENTS_API_KEY;

const apiClient = axios.create({
  baseURL: 'https://api.nowpayments.io/v1',
  headers: {
    'x-api-key': `${NOWPAYMENTS_API_KEY}`,
  },
});

module.exports = async (req, res) => {
  const { payment_id } = req.query;

  try {
    const response = await apiClient.get(`/payment/${payment_id}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ message: 'Error getting payment status' });
  }
};
