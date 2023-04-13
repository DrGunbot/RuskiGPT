import React, { useState, useEffect } from 'react';
import { getAccount } from '@wagmi/core';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxyktcgpiwlirnfixrrd.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_API;
const supabase = createClient(supabaseUrl, supabaseKey);

const BobbyDazzler = ({ ethereumClient, tokensToCredit = 100 }) => { 
  const [walletAddress, setWalletAddress] = useState(null);
  const wagmiClient = ethereumClient.wagmiClient;

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const connectedAccount = await getAccount(wagmiClient);
        setWalletAddress(connectedAccount.address);
      } catch (error) {
        console.error('Error getting connected account:', error);
      }
    };

    fetchWalletAddress();
  }, [wagmiClient]);

  const creditTokens = async () => {
    if (!walletAddress) {
      console.error('No wallet address found');
      return;
    }

    const { data: user_tokens, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('wallet_address', walletAddress);

    if (error) {
      console.error('Error fetching user tokens:', error);
      return;
    }

    if (!user_tokens || user_tokens.length === 0) {
      console.error('No user token entry found for the connected wallet address');
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
      return;
    }

    console.log(`Credited ${tokensToCredit} tokens to wallet address ${walletAddress}`);
  };

  return (
    <div>
      {walletAddress ? (
        <p>Connected wallet address: {walletAddress}</p>
      ) : (
        <p>No wallet address found</p>
      )}
      <button onClick={creditTokens}>Credit Tokens</button>
    </div>
  );
};

export default BobbyDazzler; 
