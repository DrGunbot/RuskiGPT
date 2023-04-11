require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const logFolderPath = path.join(__dirname, 'logs');

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

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests. Please try again later or you will be blocked.' });
  },
});

// Middleware for logging and blocking attackers
const blockedIPs = new Set();
const MAX_FAILED_REQUESTS = 3;
const WINDOW_SIZE = 60 * 1000; // 1 minute

const shouldBlock = (ip) => {
  if (blockedIPs.has(ip)) {
    return true;
  }

  const now = Date.now();
  const recentFailedRequests = failedRequests.filter((req) => req.ip === ip && now - req.timestamp < WINDOW_SIZE);

  if (recentFailedRequests.length >= MAX_FAILED_REQUESTS) {
    blockedIPs.add(ip);
    console.warn(`Blocked IP address: ${ip}`);
    logToFile(`Blocked IP address: ${ip}\n`);
    return true;
  }

  return false;
};

const failedRequests = [];

const logToFile = (message) => {
    const filePath = 'logs/server_errors.log';
    fs.appendFile(filePath, message, (err) => {
      if (err) {
        console.error('Failed to write error to file:', err);
      }
    });
  };
  
app.use((err, req, res, next) => {
  console.error(err.stack);
  logToFile(`${err.stack}\n`);

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const requestBody = JSON.stringify(req.body);
  const message = 'Internal Server Error. Your request has been logged and will be investigated.';

  console.error(`IP Address: ${ip}`);
  console.error(`User-Agent: ${userAgent}`);
  console.error(`Request Body: ${requestBody}`);

  logToFile(`IP Address: ${ip}\n`);
  logToFile(`User-Agent: ${userAgent}\n`);
  logToFile(`Request Body: ${requestBody}\n`);

  if (shouldBlock(ip)) {
    console.error(`Blocking IP Address: ${ip}`);
    logToFile(`Blocking IP Address: ${ip}\n`);
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();

  return res.status(500).json({ message });

});

const allowedOrigins = ['https://wiki.ninj.ai', 'http://localhost:5000'];

app.use(cors({ origin: allowedOrigins }));

app.post('/api/chat',
  body('messages').isArray().withMessage('messages must be an array'),
  body('connectedAccountAddress').isString().withMessage('connectedAccountAddress must be a string'),
  limiter,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { messages, connectedAccountAddress } = req.body;

    // Fetch the user's tokens from the database
    const { data: user, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('wallet_address', connectedAccountAddress)
      .single();

    if (error || !user) {
      console.error('Error fetching user from the database:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (user.tokens_owned <= 0) {
      return res.status(403).json({ message: 'You have no tokens left. Please purchase more tokens to continue using the chatbot.' });
    }

    const giveBirthToFrank = `You are an AI assistant named Frank.`;
    try {
      const initialSystemMessage = {
        role: 'system',
        content: giveBirthToFrank,
      };
      const openAIResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          initialSystemMessage,
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
      });
      const response = openAIResponse.data.choices[0].message.content;

      // Deduct a token from the user's balance
      const { data: updatedUser, error } = await supabase
        .from('user_tokens')
        .update({ tokens_owned: user.tokens_owned - 1 })
        .eq('wallet_address', connectedAccountAddress);

      if (error) {
        console.error('Error updating user tokens in the database:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      res.json(response);
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      logToFile(`Error communicating with OpenAI: ${error}\n`);
      res.status(500).json({ message: 'Internal Server Error. Your request has been logged and will be investigated.' });
    }
  }
);

//add wallet address to database when user connects wallet proxy server

app.post('/api/wallet-connect', async (req, res) => {
  const { walletAddress } = req.body;

  // Check if the user already exists in the database
  const { data: existingUser, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error) {
    console.error('Error fetching user from the database:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  if (!existingUser) {
    // Create a new user in the database
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ wallet_address: walletAddress, tokens: 0 });

    if (error) {
      console.error('Error inserting user into the database:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.status(200).json({ message: 'Wallet connected successfully' });
});

app.post('/api/purchase', async (req, res) => {
  const { walletAddress, transactionHash, tokensBought } = req.body;

  // Verify the transaction
  // Here you should verify the transaction details using your preferred method (e.g., Etherscan API)
  // Make sure the transaction is confirmed and the amount of ETH matches the tokensBought value
  // For simplicity, we'll assume the transaction is valid in this example

  // Check if the user already exists in the database
  const { data: existingUser, error } = await supabase
    .from('user_tokens')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error) {
    console.error('Error fetching user from the database:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  if (existingUser) {
    // Update the existing user's token balance
    const { data: updatedUser, error } = await supabase
      .from('user_tokens')
      .update({
        tokens_owned: existingUser.tokens_owned + tokensBought,
        tokens_purchased: existingUser.tokens_purchased + tokensBought,
      })
      .eq('wallet_address', walletAddress);

    if (error) {
      console.error('Error updating user in the database:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(200).json(updatedUser);
  } else {
    // Create a new user in the database
    const { data: newUser, error } = await supabase
      .from('user_tokens')
      .insert({
        wallet_address: walletAddress,
        tokens_owned: tokensBought,
        tokens_purchased: tokensBought,
      });

    if (error) {
      console.error('Error inserting user into the database:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(201).json(newUser);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});