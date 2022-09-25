import logo from './logo.svg';
import './App.css';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';

const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'

function App() {
  const generateKeypair = () => {
    const kp = new Keypair();
    console.log(kp.secretKey.toString())
  }
  
  const initializekeypair = () => {
    const secretkey = JSON.parse(process.env.REACT_APP_SECRET_KEY);
    const secretUint8 = Uint8Array.from(secretkey);
    const keypair = Keypair.fromSecretKey(secretUint8);
    return keypair;
  }

  const pingProgram = async (connection, payer) => {
    const transaction = new Transaction();
    const programId = new PublicKey(PROGRAM_ADDRESS);
    const programDataAddress = new PublicKey(PROGRAM_DATA_ADDRESS);

    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: programDataAddress,
          isWritable: true,
          isSigner: false,
        }
      ],
      programId: programId
    })
    transaction.add(instruction);

    const sig = await sendAndConfirmTransaction(
      connection,
      transaction, 
      [payer]
    )
    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`)

  }


  const pingCounterProgram = async () => {
    const pair = initializekeypair();
    const connection = new Connection(clusterApiUrl('devnet'));
    await connection.requestAirdrop(pair.publicKey, LAMPORTS_PER_SOL);
    pingProgram(connection, pair);

  }

  const sendSOLSimple = async () => {
    const connection = new Connection(clusterApiUrl('devnet'));
    const myKeyPair = initializekeypair();
    await connection.requestAirdrop(myKeyPair.publicKey, LAMPORTS_PER_SOL*5);
    const randomKeypair = Keypair.generate();
    const transaction = new Transaction();

    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: myKeyPair.publicKey,
      lamports: LAMPORTS_PER_SOL*2,
      toPubkey: randomKeypair.publicKey
    })

    transaction.add(sendSolInstruction);
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [myKeyPair]
    )
    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)
    //facing Buffer not defined error 
    //Link
    ///https://viglucci.io/how-to-polyfill-buffer-with-webpack-5
  }
  return (
    <div className="App">
     <button onClick={generateKeypair}>  Generate Keypair </button>
     <button onClick={initializekeypair}>  Initialize Keypair from secret  </button>
     <button onClick={pingCounterProgram}>  Ping the counter program  </button>
     <button onClick={sendSOLSimple}>  Send SOL to another account  </button>

    </div>
  );
}

export default App;
