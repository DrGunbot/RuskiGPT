const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { payment_id } = req.query;
    const response = await axios.get(process.env.API_BASE_URL + `/payment/${payment_id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ message: 'Error getting payment status' });
  }
};
