import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.nowpayments.io',
  headers: {
    'x-api-key': process.env.NOW_PAYMENTS_API_KEY,
  },
});

export default async function handler(req, res) {
  const { method, body, query } = req;

  try {
    if (method === 'POST' && body) {
      const { price_amount, price_currency, pay_currency } = body;
      console.log('Received parameters:', { price_amount, price_currency, pay_currency });
      const response = await apiClient.post('/payment', {
        price_amount,
        price_currency,
        pay_currency,
      });
      res.json(response.data);
    } else if (method === 'GET' && query.payment_id) {
      const { payment_id } = query;
      const response = await apiClient.get(`/payment/${payment_id}`);
      res.json(response.data);
    } else {
      res.status(400).json({ message: 'Invalid request' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Error handling request' });
  }
}
