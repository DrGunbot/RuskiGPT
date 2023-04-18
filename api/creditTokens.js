const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API
);

module.exports = async (req, res) => {
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
};
