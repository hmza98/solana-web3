import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { 
  Connection, 
  PublicKey, 
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';


function App() {
  const [pubAddress, setPubAddress] = useState('');
  const [balance, setBalance] = useState({amount: 0, address:'', fetched: false})
  const [accountInfo, setAccountInfo] = useState({info: '', fetched: false})

  const findAccountInfo = (publicAddress, connection) => {
    connection.getAccountInfo(publicAddress).then(({executable}) => {
      setAccountInfo({
        info: executable,
        fetched: true,
      })
    }) 
  }
  const findBalance = (publicAddress, connection) => {
    const balance = connection.getBalance(publicAddress);
    balance.then((blnc)=>{
      setBalance({
        amount: blnc/LAMPORTS_PER_SOL,
        address: pubAddress,
        fetched: true,
      })
    });
  }
  const handleFormSubmit =(e)=> {
    e.preventDefault();
    const publicAddress = new PublicKey(pubAddress);
    const connection = new Connection(clusterApiUrl('devnet'));
    findBalance(publicAddress, connection);
    findAccountInfo(publicAddress, connection)
  }
  return (
    <div className="App">
      <h3>Start your solana Journey</h3>
      <form onSubmit={handleFormSubmit}>
        <input type="text" value={pubAddress} onChange={(e)=>setPubAddress(e.target.value)}/>
        <button type="submit">Check SOL Balance</button>
      </form>
      {!!balance.fetched && 
      <>
      <h4>Balance:{balance.amount}</h4>
      <h4>Account:{balance.address}</h4>
      </> }
      {!!accountInfo.fetched && 
      <>
      <h4>executable:{accountInfo.info ? 'Yes' : 'Nope'}</h4>
      </> }


    </div>
  );
}

export default App;
