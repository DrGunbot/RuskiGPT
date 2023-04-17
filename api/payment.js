const axios = require('axios');
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;

const apiClient = axios.create({
  baseURL: 'https://api.nowpayments.io/v1',
  headers: {
    'x-api-key': NOWPAYMENTS_API_KEY,
  },
});

module.exports = async (req, res) => {
  try {
    const { price_amount, price_currency, pay_currency, payment_id, check_status } = req.body;

    if (check_status && payment_id) {
      const response = await apiClient.get(`/payment/${payment_id}`);
      res.json(response.data);
    } else {
      const response = await apiClient.post('/payment', {
        price_amount,
        price_currency,
        pay_currency,
      });
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};
