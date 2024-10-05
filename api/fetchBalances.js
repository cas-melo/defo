import { PulsarSDK, ChainKeys } from 'pulsar_sdk_js';

export default async function handler(req, res) {
  const API_KEY = process.env.PULSAR_API_KEY;
  const sdk = new PulsarSDK(API_KEY);
  const wallet_addr = '0x1bdb97985913d699b0fbd1aacf96d1f855d9e1d0';

  try {
    const balances = sdk.balances.getWalletBalances(wallet_addr, ChainKeys.ETHEREUM);
    const responses = [];
    for await (const balance of balances) {
      responses.push(balance);
    }
    res.status(200).json(responses);
  } catch (error) {
    console.error('Error fetching balances:', error); // Log the full error
    res.status(500).json({ error: error.message });
  }
}
