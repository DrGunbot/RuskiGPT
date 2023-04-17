const axios = require('axios');

const NOWPAYMENTS_API_KEY = process.env.REACT_APP_NOWPAYMENTS_API_KEY;

module.exports = async (req, res) => {
  try {
    const response = await axios.get('https://api.nowpayments.io/v1/currencies', {
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error getting available currencies:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

