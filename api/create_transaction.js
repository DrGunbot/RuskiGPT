const axios = require('axios');
const NOWPAYMENTS_API_KEY = process.env.REACT_APP_NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

const apiClient = axios.create({
  baseURL: 'https://api.nowpayments.io/v1',
  headers: {
    'x-api-key': `${NOWPAYMENTS_API_KEY}`,
  },
});

export default async (req, res) => {
  const { currency, price, walletAddress } = req.body;

  try {
    const response = await axios.post(
      `${NOWPAYMENTS_API_URL}/invoice`,
      {
        price_amount: price,
        price_currency: currency,
        pay_currency: currency,
        order_id: 'your-unique-order-id',
        success_url: 'https://your-website.com/success',
        cancel_url: 'https://your-website.com/cancel',
        ipn_callback_url: 'https://your-website.com/ipn-callback',
      },
      {
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error creating transaction with NOWPayments API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
