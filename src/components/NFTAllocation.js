import React, { useEffect, useState } from "react";

function NFTAllocation() {
  const [nftData, setNftData] = useState({
    emerald: { starting: 0, current: 0, deflationary: 0 },
    diamond: { starting: 0, current: 0, deflationary: 0 },
    ruby: { starting: 0, current: 0, deflationary: 0 },
    sapphire: { starting: 0, current: 0, deflationary: 0 },
  });

  useEffect(() => {
    const nftConfig = {
      Emerald: { initialSupply: 36, burned: 6, shares: 27, startingFloorPrice: 585.17 },
      Diamond: { initialSupply: 55, burned: 9, shares: 9, startingFloorPrice: 195.06 },
      Ruby: { initialSupply: 109, burned: 5, shares: 3, startingFloorPrice: 65.02 },
      Sapphire: { initialSupply: 141, burned: 15, shares: 1, startingFloorPrice: 21.67 },
    };

    const vaultWorth = 100000; // You can fetch this data dynamically
    let totalInitialShares = 0;
    let totalCirculatingShares = 0;

    Object.values(nftConfig).forEach((nft) => {
      const initialShares = nft.initialSupply * nft.shares;
      const burnedShares = nft.burned * nft.shares;
      totalInitialShares += initialShares;
      totalCirculatingShares += initialShares - burnedShares;
    });

    const valuePerShareBeforeDeflation = vaultWorth / totalInitialShares;
    const valuePerShareAfterDeflation = vaultWorth / totalCirculatingShares;

    const updatedNftData = {};
    Object.entries(nftConfig).forEach(([type, nft]) => {
      const sharesPerNFT = nft.shares;
      updatedNftData[type.toLowerCase()] = {
        starting: nft.startingFloorPrice,
        current: sharesPerNFT * valuePerShareBeforeDeflation,
        deflationary: sharesPerNFT * valuePerShareAfterDeflation,
      };
    });

    setNftData(updatedNftData);
  }, []);

  return (
    <div>
      <h2 className="section-title">NFT Allocation</h2>
      <table className="nft-details">
        <thead>
          <tr>
            <th>NFT</th>
            <th>Original Floor Price</th>
            <th>Current Floor Price</th>
            <th>Deflationary Floor Price</th>
          </tr>
        </thead>
        <tbody>
          {["emerald", "diamond", "ruby", "sapphire"].map((nft) => (
            <tr key={nft}>
              <td>{nft.charAt(0).toUpperCase() + nft.slice(1)}</td>
              <td>${nftData[nft]?.starting.toFixed(2)}</td>
              <td>${nftData[nft]?.current.toFixed(2)}</td>
              <td>${nftData[nft]?.deflationary.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NFTAllocation;
