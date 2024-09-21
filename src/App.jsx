import { useState } from 'react'
import { Buffer } from 'buffer';
import { mnemonicToSeedSync,generateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import SolanaWallet from '../components/SolanaWallet';
import MnemonicGrid from '../components/mnemonicGrid';
import './App.css'
import Tokens from '../components/Tokens';


function App() {
  window.Buffer = Buffer;
  const [currentIndex,setCurrentIndex]=useState(0);
  const [Keys,setKeys]=useState([]);
  const [mnemonic,setMnemonic]= useState([]);
  const [solanaWallet,setSolanaWallet]=useState(true);
  const [showTokens,setShowTokens]=useState(false);

  function deleteKey(index){
    setKeys(Keys.filter((key) => key.index!=index));
  } 

function changeKeys(e){
  setKeys(e);
}

function addSolWallet(){
  if(mnemonic.length==0){
    console.log("Mnemonic is empty");
    return;
  }
  const seed=mnemonicToSeedSync(mnemonic.join(" "));
  const path=`m/44'/501'/${currentIndex}'/0'`;
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  const keypair = Keypair.fromSecretKey(secret);
  const secretKeyHex = Buffer.from(keypair.secretKey).toString('hex');
  const pubKey=keypair.publicKey.toBase58();
  setKeys((prevKeys) => [...(prevKeys), {"index":currentIndex,"publicKey":pubKey,"privateKey":secretKeyHex}]);
  setCurrentIndex((prevIndex) => prevIndex + 1);

  
}

  const handleGenerateMnemonic=async () => {
    const mne = await generateMnemonic();
    const mneArray = mne.split(' ');
    setMnemonic(mneArray);
    setCurrentIndex(0);
    setKeys([]); 
    setShowTokens(false);
  };

  return (
    <>
    <div className='header' style={{ width:"98vw",fontWeight:"bold",display:"flex",flexDirection:"row",justifyContent:"space-between",height:"40px"
    }}> <div style={{color:"white",paddingTop:"5px",fontSize:"x-large",paddingLeft:"5px"}}>Wallet</div> 

    <div style={{paddingRight:"10px",paddingTop:"5px"}}>
    <button onClick={()=>{setShowTokens(true)}}style={{height:"30px",marginRight:"10px",backgroundColor:"white",border:"0px",borderRadius:"5px",color:"black",cursor:"pointer"}}>Tokens</button>

     <button onClick={handleGenerateMnemonic} style={{height:"30px",paddingRight:"10px",backgroundColor:"white",border:"0px",borderRadius:"5px",color:"black",cursor:"pointer"}}>Create mnemonic</button>
     </div>
    </div>


     <hr></hr>
  {showTokens ? <Tokens></Tokens> :
      <div style={{display:"flex",flexDirection:"column",justifyContent:"center",paddingTop:"30px",height:"fit-content",alignItems:"stretch",gap:"20px"}}>
      
      {mnemonic.length > 0 && (
          <MnemonicGrid mnemonic={mnemonic} setMnemonic={setMnemonic} setKeys={changeKeys}></MnemonicGrid>
        )}
        {solanaWallet &&mnemonic.length>0 ?
         (
          <SolanaWallet Keys={Keys} deleteKey={deleteKey} addSolWallet={addSolWallet} ></SolanaWallet>
        ): <div style={{textAlign:"center",color:"white"}}>Create Mnemonic first to add wallets</div>
            }
       </div>
}
   </>
  )
}

export default App
