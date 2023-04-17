const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { price_amount, price_currency, pay_currency } = req.body;
    console.log('Received parameters:', { price_amount, price_currency, pay_currency });
    const response = await axios.post(process.env.API_BASE_URL + '/payment', {
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
