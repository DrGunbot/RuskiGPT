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

  let userToken;
  if (!user_tokens || user_tokens.length === 0) {
    console.log('No user token entry found for the connected wallet address. Creating new entry...');
    const { data, error } = await supabase
      .from('user_tokens')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching max ID:', error);
      res.status(500).send('Error fetching max ID');
      return;
    }

    const maxId = data && data.length > 0 ? data[0].id : 0;
    userToken = { id: maxId + 1, wallet_address: walletAddress, tokens_owned: tokensToCredit };
    
    const { error: insertError } = await supabase
      .from('user_tokens')
      .insert(userToken);

    if (insertError) {
      console.error('Error inserting new user token:', insertError);
      res.status(500).send('Error inserting new user token');
      return;
    }
  } else {
    userToken = user_tokens[0];

    const updatedTokensOwned = (userToken.tokens_owned || 0) + tokensToCredit;

    const { error: updateError } = await supabase
      .from('user_tokens')
      .update({ tokens_owned: updatedTokensOwned })
      .eq('id', userToken.id);

    if (updateError) {
      console.error('Error updating user tokens:', updateError);
      res.status(500).send('Error updating user tokens');
      return;
    }
  }

  res.send(`Зачислено ${tokensToCredit} токенов на кошелек с адресом ${walletAddress}.`);
};