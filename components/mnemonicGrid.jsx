
import '../src/App.css';
import { useState } from 'react';

function mnemonicGrid({mnemonic,setMnemonic,setKeys}){

    const [mne,setMne]=useState("");

   return <>
   <div style={{height:"fit-content",marginLeft:"10px",marginRight:"10px",display:"flex"}}>
   <div style={{width:"80%",display:"inline"}}> <input type="text" value={mne} onChange={(e)=>{setMne(e.target.value)}} placeholder="xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx" style={{height:"35px",width:"100%"}}></input></div>
   <button style={{width:"20%",padding:"3px",marginLeft:"10px",height:"41px"}} onClick={()=>{setMnemonic(mne.split(' '));
    setMne("");
    setKeys([]);
   }}>Import Mnemonic</button>
     </div>
       <div className="grid-container" style={{padding:"10px"}}>
      
  <div className="grid-item">{mnemonic[0]}</div>
  <div className="grid-item">{mnemonic[1]}</div>
  <div className="grid-item">{mnemonic[2]}</div>
  <div className="grid-item">{mnemonic[3]}</div>
  <div className="grid-item">{mnemonic[4]}</div>
  <div className="grid-item">{mnemonic[5]}</div>
  <div className="grid-item">{mnemonic[6]}</div>
  <div className="grid-item">{mnemonic[7]}</div>
  <div className="grid-item">{mnemonic[8]}</div>
  <div className="grid-item">{mnemonic[9]}</div>
  <div className="grid-item">{mnemonic[10]}</div>
  <div className="grid-item">{mnemonic[11]}</div>
</div> 

      </>
}

export default mnemonicGrid;