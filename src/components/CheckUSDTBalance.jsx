import React from 'react';
import { useBalance } from 'wagmi';

const USDT_TOKEN_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // Replace with the correct USDT token address

function CheckUSDTBalance({ connectedAddress }) {
  const { data, isError, isLoading } = useBalance({
    address: connectedAddress,
    token: USDT_TOKEN_ADDRESS,
  });

  if (isLoading) return <div>Fetching USDT balance...</div>;
  if (isError) return <div>Error fetching USDT balance</div>;

  const usdtBalance = data?.formatted;
  const hasUSDT = parseFloat(usdtBalance) > 0;

  return (
    <div>
      {hasUSDT
        ? `Wallet has USDT balance: ${usdtBalance} USDT`
        : 'Wallet does not have USDT balance'}
    </div>
  );
}

export default CheckUSDTBalance;
