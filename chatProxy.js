require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createClient } = require('@supabase/supabase-js');
const logFolderPath = path.join(__dirname, 'logs');
const axios = require('axios');
const NOWPAYMENTS_API_KEY = process.env.REACT_APP_NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';


const apiClient = axios.create({
  baseURL: 'https://api.nowpayments.io/v1',
  headers: {
    'x-api-key': `${NOWPAYMENTS_API_KEY}`,
  },
});


if (!fs.existsSync(logFolderPath)) {
  fs.mkdirSync(logFolderPath, { recursive: true });
}

const app = express();
const port = process.env.PORT || 5000;

const openaiConfiguration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API
);

const openai = new OpenAIApi(openaiConfiguration);

app.use(cors());
app.use(express.json());


  
  app.use(cors({ origin: allowedOrigins }));


app.get('/api/payment-status/:payment_id', async (req, res) => {
  try {
    const { payment_id } = req.params;
    const response = await apiClient.get(`/payment/${payment_id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ message: 'Error getting payment status' });
  }
});

// backend payments API

app.post('/credit-tokens', async (req, res) => {
  const { walletAddress, tokensToCredit } = req.body;

  const { data: user_tokens, error } = await supabase
    .from('user_tokens')
    .select('*')
    .eq('wallet_address', walletAddress);

  if (error) {
    console.error('Error fetching user tokens:', error);
    res.status(500).send('Error fetching user tokens');
    return;
  }

  if (!user_tokens || user_tokens.length === 0) {
    console.error('No user token entry found for the connected wallet address');
    res.status(400).send('No user token entry found for the connected wallet address');
    return;
  }

  const userToken = user_tokens[0];

  const updatedTokensOwned = (userToken.tokens_owned || 0) + tokensToCredit;
  const updatedTokensPurchased = (userToken.tokens_purchased || 0) + tokensToCredit;

  const { error: updateError } = await supabase
    .from('user_tokens')
    .update({ tokens_owned: updatedTokensOwned, tokens_purchased: updatedTokensPurchased })
    .eq('wallet_address', walletAddress);

  if (updateError) {
    console.error('Error updating user tokens:', updateError);
    res.status(500).send('Error updating user tokens');
    return;
  }

  res.send(`Credited ${tokensToCredit} tokens to wallet address ${walletAddress}`);
});

app.listen(port, () => {
console.log(`Server running on port ${port}`);
});