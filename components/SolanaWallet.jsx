import { useState, useEffect } from "react";
import axios from "axios";

function SolanaWallet({ Keys, deleteKey,addSolWallet }) {
  const [visible, setVisible] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState([]);
  const [balanceKeys, setBalanceKeys] = useState([]);
  const [addWallet, setAddWallet] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [btmBalance, setBtmBalance] = useState('');

  const handleToggle = (index) => {
    if (visibleKeys.includes(index)) {
      setVisibleKeys(visibleKeys.filter((i) => i !== index));
    } else {
      setVisibleKeys([...visibleKeys, index]);
    }
  };

  const handleAdd = () => {
    setAddWallet(!addWallet);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtmBalance("");
    if (inputValue.trim()) {
      try {
        const res = await axios.post("https://explorer-api.devnet.solana.com", {
          "jsonrpc": "2.0",
          "id": 1,
          "method": "getBalance",
          "params": [
            inputValue,
            { "encoding": "jsonParsed" }
          ]
        });

        const balance = res.data.result.value;
        setBtmBalance(balance);
      } catch (error) {
        setBtmBalance("Invalid key");
      }
    }
  };

  const checkBalance = async (pubKey, index) => {
    try {
      const res = await axios.post("https://explorer-api.devnet.solana.com", {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [
          pubKey,
          { "encoding": "jsonParsed" }
        ]
      });

      const balance = res.data.result.value;

      setBalanceKeys((prevBalanceKeys) => {
        const existingIndex = prevBalanceKeys.findIndex((obj) => obj.index === index);

        if (existingIndex !== -1) {
          const updatedBalanceKeys = prevBalanceKeys.map((obj, i) =>
            i === existingIndex ? { ...obj, balance } : obj
          );
          return updatedBalanceKeys;
        } else {
          return [...prevBalanceKeys, { index, pubKey, balance }];
        }
      });

    } catch (error) {
      console.error("Error checking balance:", error);
    }
  };

  return (
    <div style={{ backgroundColor: 'lightgray', padding: '20px',paddingTop:'10px', height: "fit-content",borderRadius:"5px",margin:"10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between",cursor:"pointer" }}>
        <h3>Solana Wallets</h3>
        <div style={{marginTop:"15px",cursor:"pointer"}}>
        <button onClick={()=>{addSolWallet();setVisible(true)}} style={{ border: "0px", borderRadius: "5px", padding: "5px",cursor:"pointer" }} >Add Wallets</button>
        <button onClick={() => {
          setVisible(!visible);
        }} style={{ marginLeft: "10px",border: "0px", borderRadius: "5px", padding: "5px",cursor:"pointer" }}  >
          {visible ? "Close" : "Open"}
        </button>
     </div> </div>
      {Keys && Keys.length > 0 ? (
        <div>
        <ul style={{ display: !visible ? 'none' : 'block' }}>
          {Keys.map((key, index) => (
            <li key={index}>
              <div style={{ padding: "10px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ marginBottom: "10px", display: "inline", paddingRight: "5px" }}>{key.publicKey}</div>
                  <button style={{ border: "1px solid gray", borderRadius: "5px", padding: "5px", marginRight: "5px",cursor:"pointer" }} onClick={() => deleteKey(key.index)}>Delete</button>
                  <button style={{ border: "1px solid gray", borderRadius: "5px", padding: "5px",cursor:"pointer" }} onClick={() => checkBalance(key.publicKey, index)}>Check Balance</button>
                </div>
                <div style={{ width: "fit-content", height: "fit-content", padding: "5px", backgroundColor: "black", borderRadius: "5px", color: "white" }}>
                  {balanceKeys
                    .filter((obj) => obj.index === index)
                    .map((obj) => (
                      <div key={obj.index}>
                    Devnet  Balance: {obj.balance} Lamports
                      </div>
                    ))
                  }
                </div>
                {visibleKeys.includes(index) ? (
                  <div>
                    <div style={{ display: "inline" }}> {key.privateKey} </div>
                    <button style={{ border: "1px solid gray", borderRadius: "5px", padding: "5px",cursor:"pointer" }} onClick={() => handleToggle(index)}>Hide</button>
                  </div>
                ) : (
                  <div>
                    ................................................................................................................
                    <button style={{ border: "1px solid gray", borderRadius: "5px", padding: "5px",cursor:"pointer" }} onClick={() => handleToggle(index)}>Show private key</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
           <div style={{ padding: "10px", backgroundColor: "gray", borderRadius: "5px", height: "fit-content" }}>
           {!addWallet && <button style={{ paddingRight: "10px", borderRadius: "5px", border: "0px",cursor:"pointer" }} onClick={handleAdd}>Check Balance of Imported Wallet </button>}
           {addWallet && (
             <form onSubmit={handleSubmit}>
               <input type="text" style={{ borderRadius: "5px", width: "500px", border: "0px" }} onChange={(e) => setInputValue(e.target.value)} value={inputValue}/>
               <button type="submit" style={{ marginLeft: "5px",cursor:"pointer" }}>Submit</button>
               <button onClick={()=>{setInputValue("");
                setBtmBalance("");
               }} style={{ marginLeft: "5px",cursor:"pointer" }}>Clear</button>
               <div>{"Devnet Balance is :"+btmBalance}</div>
             </form>
           )}
         </div>
         </div>

      ) : (
        <p>No wallets available.</p>
      )}
   
    </div>
  );
}

export default SolanaWallet;
