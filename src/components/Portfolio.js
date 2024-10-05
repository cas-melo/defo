import React, { useEffect, useState } from 'react';
import { PulsarSDK, ChainKeys } from 'pulsar_sdk_js';

function Portfolio() {
  const [tokenDetails, setTokenDetails] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_PULSAR_API_KEY; // Use environment variable
    const sdk = new PulsarSDK(API_KEY);
    const wallet_addr = '0x1bdb97985913d699b0fbd1aacf96d1f855d9e1d0';

    const fetchBalances = async () => {
      try {
        console.log('Fetching balances...'); // Log when fetching starts
        const balances = sdk.balances.getWalletBalances(wallet_addr, ChainKeys.ETHEREUM);
        const responses = [];
        for await (const balance of balances) {
          console.log('Received balance:', balance); // Log each balance
          responses.push(balance);
        }

        if (responses.length === 0) {
          console.log('No balances were returned');
        }

        // Process the data
        setTokenDetails(responses);
        const total = responses.reduce((sum, token) => sum + parseFloat(token.usd_value || 0), 0);
        setTotalValue(total);
        setIsLoading(false); // Stop loading when the fetch is done
      } catch (error) {
        console.error('Error fetching balances:', error); // Log any errors
        setError(error);
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, []);

  return (
    <div>
      <h2 className="section-title">Portfolio</h2>
      {isLoading && <p>Loading data...</p>}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && (
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
                <td>{token.token.name}</td>
                <td>{token.token.denom}</td>
                <td>${parseFloat(token.usd_value).toFixed(2)}</td>
                <td>{token.token.chain_properties.chain}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" style={{ textAlign: "right" }}>
                <strong>Total:</strong>
              </td>
              <td>${totalValue.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}

export default Portfolio;
