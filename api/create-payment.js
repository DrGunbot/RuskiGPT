const axios = require('axios');
const NOWPAYMENTS_API_KEY = process.env.REACT_APP_NOWPAYMENTS_API_KEY;

const apiClient = axios.create({
  baseURL: 'https://api.nowpayments.io/v1',
  headers: {
    'x-api-key': `${NOWPAYMENTS_API_KEY}`,
  },
});

export default async (req, res) => {
  try {
    const { price_amount, price_currency, pay_currency } = req.body;
    console.log('Received parameters:', { price_amount, price_currency, pay_currency });
    const response = await apiClient.post('/payment', {
      price_amount,
      price_currency,
      pay_currency,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Error creating payment' });
  }
};