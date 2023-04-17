const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API
);

module.exports = async (req, res) => {
  const { walletAddress } = req.body;

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
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ wallet_address: walletAddress, tokens: 0 });

    if (error) {
      console.error('Error inserting user into the database:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.status(200).json({ message: 'Wallet connected successfully' });
};
