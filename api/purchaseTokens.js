const { Configuration, OpenAIApi } = require('openai');
const { body, validationResult } = require('express-validator');
const { createClient } = require('@supabase/supabase-js');

const openaiConfiguration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API
);

const openai = new OpenAIApi(openaiConfiguration);

const purchaseTokens = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { connectedAccountAddress, token, amount } = req.body;
  creditUserTokens(connectedAccountAddress, token, amount);
  res.status(200).send({ message: `Credited ${amount} ${token} to ${connectedAccountAddress}` });
};

module.exports = [
  body('connectedAccountAddress').isString().withMessage('connectedAccountAddress must be a string'),
  body('token').isString().withMessage('token must be a string'),
  body('amount').isNumeric().withMessage('amount must be a number'),
  purchaseTokens,
];
