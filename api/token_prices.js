const axios = require('axios');

export default async (req, res) => {
  try {
    // Get the list of available currencies
    const coinListResponse = await axios.get('/api/coinList');
    const coinList = coinListResponse.data.currencies;
    
    // Fetch token prices for available currencies
    const tokenPrices = await fetchTokenPrices(coinList);
    res.status(200).json(tokenPrices);
  } catch (error) {
    console.error('Error fetching token prices:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
