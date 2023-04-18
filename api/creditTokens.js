const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API
);

module.exports = async (req, res) => {
  const {
    walletAddress,
    payment_id,
    purchase_id,
    txid,
  } = req.body;

  // Check if wallet address exists in the database
  const { data: user_tokens, error } = await supabase
    .from('user_tokens')
    .select('*')
    .eq('wallet_address', walletAddress);

  if (error) {
    console.error('Error fetching user tokens:', error);
    res.status(500).send('Error fetching user tokens');
    return;
  }

  // If wallet address doesn't exist, create a new row
  if (!user_tokens || user_tokens.length === 0) {
    const { data, error } = await supabase
      .from('user_tokens')
      .insert([{ wallet_address: walletAddress }]);

    if (error) {
      console.error('Error inserting wallet address:', error);
      res.status(500).send('Error inserting wallet address');
      return;
    }
  }

  // Create a new transaction in the transaction_logs table
  const { data: newTransaction, error: insertError } = await supabase
    .from('transaction_logs')
    .insert([
      {
        wallet_address: walletAddress,
        payment_id: payment_id,
        purchase_id: purchase_id,
        txid: txid,
      },
    ]);

  if (insertError) {
    console.error('Error inserting transaction:', insertError);
    res.status(500).send('Error inserting transaction');
    return;
  }

  res.send(`Transaction added for wallet address ${walletAddress}.`);
};
