import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Background from './Background';
import './CoinFlip.css'
import GIF from '../assets/1.b89d740d.gif'

const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "won",
				"type": "bool"
			}
		],
		"name": "CoinFlipped",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "flipCoin",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fundContract",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const contractAddress = '0x5Eb041F247b6B7eD3aA89f870Be95ab12149ac62';

const CoinFlip = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => setAccount(accounts[0]));

      const coinFlipContract = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(coinFlipContract);

      updateBalance(coinFlipContract);
    } else {
      setMessage('Please install MetaMask to use this app.');
    }
  }, []);

  const updateBalance = (contract) => {
    contract.methods.getContractBalance().call()
      .then(result => {
        setBalance(web3.utils.fromWei(result, 'ether'));
      });
  };

  const handleFlipCoin = async () => {
    if (!betAmount) {
      setMessage('Please enter a bet amount.');
      return;
    }

    try {
      const weiValue = web3.utils.toWei(betAmount, 'ether');
      await contract.methods.flipCoin().send({ from: account, value: weiValue });
      setMessage('Coin flipped successfully!');
      updateBalance(contract);
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while flipping the coin.');
    }
  };

  return (
    <>
		<div className='coin-flip-container'>
			<h1>Flipper</h1>
			<p>Contract Balance: <span>{balance} ETH</span></p>
			<p>Your Account: <b>{account}</b></p>
			
			<div className='input-button'>
				<img src={GIF} />
				<input 
					type="number"
					className='no-spinner' 
					placeholder="Enter bet amount in ETH" 
					value={betAmount} 
					onChange={(e) => setBetAmount(e.target.value)} 
				/>
				<button onClick={handleFlipCoin}>FLIP COIN</button>
			</div>

			{message && <p className='message'>{message}</p>}
		</div>
		<Background />
	</>
  );
};

export default CoinFlip;
