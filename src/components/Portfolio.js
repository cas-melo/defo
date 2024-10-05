import React, { useEffect, useState } from "react";
import { PulsarSDK, ChainKeys } from 'pulsar_sdk_js';

function Portfolio() {
  const [tokenDetails, setTokenDetails] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_PULSAR_API_KEY;
    const sdk = new PulsarSDK(API_KEY);
    const chains = [ChainKeys.ETHEREUM, ChainKeys.ARBITRUM];
    const wallet_addr = '0x1bdb97985913d699b0fbd1aacf96d1f855d9e1d0';

    const fetchAllBalances = async () => {
      const responses_list = [];

      const getWalletBalances = async (chain) => {
        const balances = sdk.balances.getWalletBalances(wallet_addr, chain);
        for await (const balance of balances) {
          responses_list.push(balance);
        }
      };

      for (const chain of chains) {
        await getWalletBalances(chain);
      }

      const tokens_info = {};

      responses_list.forEach(response => {
        if (response.stats) {
          response.stats.forEach(token => {
            const usd_value = parseFloat(token.usd_value);
            if (usd_value > 1000) {
              const denom = token.token.denom;
              const name = token.token.name;
              const platform = token.token.chain_properties.chain;
              if (!tokens_info[denom]) {
                tokens_info[denom] = { name: name, platforms: new Set(), usd_value: 0 };
              }
              tokens_info[denom].platforms.add(platform);
              tokens_info[denom].usd_value += usd_value;
            }
          });
        }

        if (response.balances) {
          response.balances.forEach(balance => {
            const usd_value = parseFloat(balance.usd_value);
            if (usd_value > 1000) {
              const denom = balance.token.denom;
              const name = balance.token.name;
              const platform = balance.token.chain_properties.chain;
              if (!tokens_info[denom]) {
                tokens_info[denom] = { name: name, platforms: new Set(), usd_value: 0 };
              }
              tokens_info[denom].platforms.add(platform);
              tokens_info[denom].usd_value += usd_value;
            }
          });
        }
      });

      // Convert tokens_info to an array and calculate total value
      const tokensArray = Object.keys(tokens_info).map(denom => ({
        name: tokens_info[denom].name,
        ticker: denom,
        usdValue: tokens_info[denom].usd_value,
        platforms: Array.from(tokens_info[denom].platforms).join(', '),
      }));

      const totalVaultValue = tokensArray.reduce((sum, token) => sum + token.usdValue, 0);

      setTokenDetails(tokensArray);
      setTotalValue(totalVaultValue);
    };

    fetchAllBalances();
  }, []);

  return (
    <div>
      <h2 className="section-title">Portfolio</h2>
      <table className="portfolio-details">
        <thead>
          <tr>
            <th>Name</th>
            <th>Ticker</th>
            <th>USD Value</th>
            <th>Platforms</th>
          </tr>
        </thead>
        <tbody>
          {tokenDetails.map((token, index) => (
            <tr key={index}>
              <td>{token.name}</td>
              <td>{token.ticker}</td>
              <td>${token.usdValue.toFixed(2)}</td>
              <td>{token.platforms}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={{ textAlign: "right" }}>
              <strong>Total:</strong>
            </td>
            <td>${totalValue.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Portfolio;
