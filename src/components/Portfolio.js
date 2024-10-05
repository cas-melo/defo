import React, { useEffect, useState } from 'react';

function Portfolio() {
  const [tokenDetails, setTokenDetails] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        console.log('Fetching balances from serverless function...');
        const response = await fetch('/api/fetchBalances'); // Call the Vercel serverless function
        const data = await response.json();
        console.log('Received data:', data); // Log the received data

        if (response.ok) {
          setTokenDetails(data);
          const total = data.reduce((sum, token) => sum + parseFloat(token.usd_value || 0), 0);
          setTotalValue(total);
        } else {
          throw new Error(data.error || 'Failed to fetch data');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching balances:', error);
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
