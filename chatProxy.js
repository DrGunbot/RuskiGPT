// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { Configuration, OpenAIApi } = require('openai');
// const { body, validationResult } = require('express-validator');
// const rateLimit = require('express-rate-limit');
// const fs = require('fs');
// const path = require('path');
// const os = require('os');
// const { createClient } = require('@supabase/supabase-js');
// const logFolderPath = path.join(__dirname, 'logs');
// const axios = require('axios');
// const NOWPAYMENTS_API_KEY = process.env.REACT_APP_NOWPAYMENTS_API_KEY;
// const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';


// const apiClient = axios.create({
//   baseURL: 'https://api.nowpayments.io/v1',
//   headers: {
//     'x-api-key': `${NOWPAYMENTS_API_KEY}`,
//   },
// });


// if (!fs.existsSync(logFolderPath)) {
//   fs.mkdirSync(logFolderPath, { recursive: true });
// }

// const app = express();
// const port = process.env.PORT || 5000;

// const openaiConfiguration = new Configuration({
//   apiKey: process.env.REACT_APP_OPENAI_API_KEY,
// });

// const supabase = createClient(
//   process.env.REACT_APP_SUPABASE_URL,
//   process.env.REACT_APP_SUPABASE_API
// );

// const openai = new OpenAIApi(openaiConfiguration);

// app.use(cors());
// app.use(express.json());

// const limiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 5, // limit each IP to 5 requests per minute
//   handler: (req, res) => {
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     const userAgent = req.headers['user-agent'];
//     // const requestBody = JSON.stringify(req.body);
//     const walletID = req.body.connectedAccountAddress;
//     const message = `If you continue to try and spam me, ${walletID} will lose all credits and be added to the blacklist. You are on a cooldown period and have been warned.`;
    

//     console.warn(`Rate limit exceeded: ${ip}`);
//     logToFile(`Rate limit exceeded: ${ip}\n`);

//     console.warn(`IP Address: ${ip}`);
//     console.warn(`User-Agent: ${userAgent}`);
//     // console.warn(`Request Body: ${requestBody}`);

//     logToFile(`IP Address: ${ip}\n`);
//     logToFile(`User-Agent: ${userAgent}\n`);
//     // logToFile(`Request Body: ${requestBody}\n`);
//     logToFile(`Wallet ID: ${walletID}\n`);

//     // Add the machine info to the logs
//     const machineInfo = `Machine Info: ${os.type()} ${os.release()} (${os.arch()})\n`;
//     console.warn(machineInfo);
//     logToFile(machineInfo);

//     res.status(429).json({ message });
//   },
// });


// // Middleware for logging and blocking attackers
// const blockedIPs = new Set();
// const MAX_FAILED_REQUESTS = 3;
// const WINDOW_SIZE = 60 * 1000; // 1 minute

// const shouldBlock = (ip) => {
//   if (blockedIPs.has(ip)) {
//     return true;
//   }

//   const now = Date.now();
//   const recentFailedRequests = failedRequests.filter((req) => req.ip === ip && now - req.timestamp < WINDOW_SIZE);

//   if (recentFailedRequests.length >= MAX_FAILED_REQUESTS) {
//     blockedIPs.add(ip);
//     console.warn(`Blocked IP address: ${ip}`);
//     logToFile(`Blocked IP address: ${ip}\n`, 'blocked_ips.log');
//     return true;
//   }

//   return false;
// };

// const failedRequests = [];

// const logToFile = (message) => {
//   const filePath = path.join(logFolderPath, 'server_errors.log');
//   fs.appendFile(filePath, message, (err) => {
//     if (err) {
//       console.error('Failed to write error to file:', err);
//     }
//   });
// };

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   logToFile(`${err.stack}\n`, 'server_errors.log');

//   const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   const userAgent = req.headers['user-agent'];
//   const requestBody = JSON.stringify(req.body);
//   const message = 'Internal Server Error. Your request has been logged and will be investigated.';

//   console.error(`IP Address: ${ip}`);
//   console.error(`User-Agent: ${userAgent}`);
//   console.error(`Request Body: ${requestBody}`);

//   logToFile(`IP Address: ${ip}\n`, 'server_errors.log');
//   logToFile(`User-Agent: ${userAgent}\n`, 'server_errors.log');
//   logToFile(`Request Body: ${requestBody}\n`, 'server_errors.log');

//     // Add the machine info to the logs
//     const machineInfo = `Machine Info: ${os.type()} ${os.release()} (${os.arch()})\n`;
//     console.error(machineInfo);
//     logToFile(machineInfo, 'server_errors.log');
  
//     if (shouldBlock(ip)) {
//       console.error(`Blocking IP Address: ${ip}`);
//       logToFile(`Blocking IP Address: ${ip}\n`, 'blocked_ips.log');
//       return res.status(403).json({ message: 'Forbidden' });
//     }
//     next();
  
//     return res.status(500).json({ message });
  
//   });
  
//   const allowedOrigins = ['https://wiki.ninj.ai', 'http://localhost:5000'];
  
//   app.use(cors({ origin: allowedOrigins }));

//   app.post(
//     '/api/purchaseTokens',
//     body('connectedAccountAddress').isString().withMessage('connectedAccountAddress must be a string'),
//     body('token').isString().withMessage('token must be a string'),
//     body('amount').isNumeric().withMessage('amount must be a number'),
//     async (req, res) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
  
//       const { connectedAccountAddress, token, amount } = req.body;
//       creditUserTokens(connectedAccountAddress, token, amount);
//       res.status(200).send({ message: `Credited ${amount} ${token} to ${connectedAccountAddress}` });
//     }
//   );



// app.post('/api/payment', async (req, res) => {
//   try {
//     const { price_amount, price_currency, pay_currency, payment_id, check_status } = req.body;

//     if (check_status && payment_id) {
//       const response = await apiClient.get(`/payment/${payment_id}`);
//       res.json(response.data);
//     } else {
//       console.log('Received parameters:', { price_amount, price_currency, pay_currency });
//       const response = await apiClient.post('/payment', {
//         price_amount,
//         price_currency,
//         pay_currency,
//       });
//       res.json(response.data);
//     }
//   } catch (error) {
//     console.error('Error processing payment:', error);
//     res.status(500).json({ message: 'Error processing payment' });
//   }
// });


// // backend payments API

// app.post('/credit-tokens', async (req, res) => {
//   const { walletAddress, tokensToCredit } = req.body;

//   const { data: user_tokens, error } = await supabase
//     .from('user_tokens')
//     .select('*')
//     .eq('wallet_address', walletAddress);

//   if (error) {
//     console.error('Error fetching user tokens:', error);
//     res.status(500).send('Error fetching user tokens');
//     return;
//   }

//   if (!user_tokens || user_tokens.length === 0) {
//     console.error('No user token entry found for the connected wallet address');
//     res.status(400).send('No user token entry found for the connected wallet address');
//     return;
//   }

//   const userToken = user_tokens[0];

//   const updatedTokensOwned = (userToken.tokens_owned || 0) + tokensToCredit;
//   const updatedTokensPurchased = (userToken.tokens_purchased || 0) + tokensToCredit;

//   const { error: updateError } = await supabase
//     .from('user_tokens')
//     .update({ tokens_owned: updatedTokensOwned, tokens_purchased: updatedTokensPurchased })
//     .eq('wallet_address', walletAddress);

//   if (updateError) {
//     console.error('Error updating user tokens:', updateError);
//     res.status(500).send('Error updating user tokens');
//     return;
//   }

//   res.send(`Credited ${tokensToCredit} tokens to wallet address ${walletAddress}`);
// });

// app.listen(port, () => {
// console.log(`Server running on port ${port}`);
// });