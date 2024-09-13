import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
function Tokens(){

    const [TokensList,setTokensList]=useState([]);
    const [inputValue,setInputValue]=useState("");
   //tokenName, tokenAmount, mint address,token symbol, token logo
    const findOldTokens=async (pubKey)=>{
        const res=await axios.post("https://explorer-api.devnet.solana.com",
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getTokenAccountsByOwner",
                "params": [
                     `${pubKey}`,
                    {
                        "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                    },
                    {
                        "encoding": "jsonParsed"
                    }
                ]
            })
            console.log("Tokens are "+TokensList);
            console.log(res);
        // const accounts=res.data.result.value.length;
    
        res.data.result.value.forEach(item => {
            const balance=item.account.data.parsed.info.tokenAmount.amount;
            const mint =item.account.data.parsed.info.mint;
            const name="Unknown";
            const symbol=null;
            const logo=null;
           
            setTokensList((prevTokensList) => [
                ...prevTokensList,
                { name, logo, balance, symbol, mint },
            ]);
        });
    }


    const findNewTokens=async (pubKey)=>{
        const res=await axios.post("https://explorer-api.devnet.solana.com",
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getTokenAccountsByOwner",
                "params": [
                     `${pubKey}`,
                    {
                        "programId": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
                    },
                    {
                        "encoding": "jsonParsed"
                    }
                ]
            })
            console.log("Tokens are "+TokensList);
            console.log(res);
        // const accounts=res.data.result.value.length;
        let balance="";
        let mint="";
        res.data.result.value.forEach(item => {
            balance=item.account.data.parsed.info.tokenAmount.amount;
            mint =item.account.data.parsed.info.mint;
           
        });
        const result= await getTokenMetadata(mint);
         const name=result.name;
            const symbol=result.symbol;
            const logo=result.logo;
        console.log(result);

        setTokensList((prevTokensList) => [
            ...prevTokensList,
            { balance, mint,name,symbol,logo },
        ])

    }


    const tokenListURL = "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json";

const getTokenMetadata = async (mintAddress) => {
       const response=await axios.post("https://explorer-api.devnet.solana.com",{
        "id": 1,
        "jsonrpc": "2.0",
        "method": "getMultipleAccounts",
        "params": [
            [
                `${mintAddress}`
            ],
            {
                "encoding": "jsonParsed",
                "commitment": "confirmed"
            }
        ]
    })
    
    const name=response.data.result.value[0].data.parsed.info.extensions[1].state.name;
    const symbol=response.data.result.value[0].data.parsed.info.extensions[1].state.symbol;

    const logoURL=response.data.result.value[0].data.parsed.info.extensions[1].state.uri;
    const img=await fetchImageFromJSON(logoURL);
    return {name,symbol,logoURL,img};
};

const fetchImageFromJSON = async (jsonURL) => {
    try {
        const response = await axios.get(jsonURL);
        return response.data.image; // Adjust based on the actual JSON structure
    } catch (error) {
        console.error("Error fetching image from JSON:", error);
        return '';
    }
};


// res.data.result.value.forEach(item => {
//     const balance=item.account.data.parsed.info.tokenAmount.amount;


    function handleSubmit(e) {
        e.preventDefault();
        const pubKey = inputValue.trim();
        if (pubKey) {
            setTokensList([]); // Clear previous results before fetching new ones
            findOldTokens(pubKey);
            findNewTokens(pubKey);
        }
    }
    useEffect(()=>{
        console.log("new TokenList "+TokensList);},
        [TokensList]
    )

    return<>
        <form onSubmit={handleSubmit}>
               <input type="text" style={{ borderRadius: "5px", width: "80%", border: "0px" ,margin:"5px",height:"20px"}} onChange={(e) => setInputValue(e.target.value)} value={inputValue} placeholder="  Enter public key"/>
               <button type="submit" style={{ marginLeft: "5px",borderRadius:"5px",border:"0px",height:"20px" }}>Submit</button>
               <button onClick={()=>{setInputValue("");
               }} style={{ marginLeft: "5px",borderRadius:"5px",border:"0px",height:"20px" }}>Clear</button>
             </form>
        <div style={{}}>
                {TokensList.map((item, index) => (
                    <div key={index} style={{ padding: "10px", border: "1px solid #000", margin: "5px",backgroundColor:"white",borderRadius:"5px",fontSize:"medium" }}>
                        <div>Name: {item.name}</div>
                       {item.img && <div>LogoURL: {item.img}</div> }
                        <div>Mint: {item.mint}</div>
                        <div>Balance: {item.balance} Lamports</div>
                        <div>Symbol: {item.symbol}</div>
                        {item.logo && <img src={item.img} alt={`${item.name} logo`} />}
                    </div>
                ))}
            </div>
            
        
               
        
        </>
}

export default Tokens;