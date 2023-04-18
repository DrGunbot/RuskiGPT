// api/addWallet.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_API;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function addWallet(req, res) {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is missing' });
  }

  try {
    const { error } = await supabase
      .from('user_tokens')
      .insert([{ wallet_address: walletAddress }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Wallet address added successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
