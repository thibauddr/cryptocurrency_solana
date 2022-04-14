import React, { useState } from 'react';
import { Connection,clusterApiUrl, PublicKey, LAMPORTS_PER_SOL, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const App = () => {
	const [walletConnected,setWalletConnected]=useState(false);
	const [provider, setProvider] = useState();
	const [loading, setLoading] = useState();

	const getProvider = async () => {
      if ("solana" in window) {
         const provider = window.solana;
         if (provider.isPhantom) {
            return provider;
         }
      } else {
         window.open("https://www.phantom.app/", "_blank");
      }
   };

   const walletConnectionHelper = async () => {
      if (walletConnected){
         //Disconnect Wallet
         setProvider();
         setWalletConnected(false);
      } else {
         const userWallet = await getProvider();
         if (userWallet) {
            await userWallet.connect();
            userWallet.on("connect", async () => {
               setProvider(userWallet);
               setWalletConnected(true);
            });
         }
      }
   }

   const airDropHelper = async () => {
      try {
          setLoading(true);
          const connection = new Connection(
              clusterApiUrl("devnet"),
              "confirmed"
          );
          const fromAirDropSignature = await connection.requestAirdrop(new PublicKey(provider.publicKey), LAMPORTS_PER_SOL);
          await connection.confirmTransaction(fromAirDropSignature, { commitment: "confirmed" });
         
          console.log(`1 SOL airdropped to your wallet ${provider.publicKey.toString()} successfully`);
          setLoading(false);
      } catch(err) {
          console.log(err);
          setLoading(false);
      }
   }

   const splToken = require("@solana/spl-token");
   const [isTokenCreated,setIsTokenCreated] = useState(false);
   const [createdTokenPublicKey,setCreatedTokenPublicKey] = useState(null);
   const [mintingWalletSecretKey,setMintingWalletSecretKey] = useState(null);
   
   const initialMintHelper = async () => {
      try {
         setLoading(true);
         const connection = new Connection(
             clusterApiUrl("devnet"),
             "confirmed"
         );
         
         const mintRequester = await provider.publicKey;
         const mintingFromWallet = await Keypair.generate();
         setMintingWalletSecretKey(JSON.stringify(mintingFromWallet.secretKey));
         
         const fromAirDropSignature = await connection.requestAirdrop(mintingFromWallet.publicKey, LAMPORTS_PER_SOL);
         await connection.confirmTransaction(fromAirDropSignature, { commitment: "confirmed" });
         
         const creatorToken = await splToken.Token.createMint(connection, mintingFromWallet, mintingFromWallet.publicKey, null, 6, TOKEN_PROGRAM_ID);
         const fromTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(mintingFromWallet.publicKey);
         await creatorToken.mintTo(fromTokenAccount.address, mintingFromWallet.publicKey, [], 1000000);
         
         const toTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(mintRequester);
         const transaction = new Transaction().add(
            splToken.Token.createTransferInstruction(
               TOKEN_PROGRAM_ID,
               fromTokenAccount.address,
               toTokenAccount.address,
               mintingFromWallet.publicKey,
               [],
               1000000
            )
         );
         const signature=await sendAndConfirmTransaction(connection, transaction, [mintingFromWallet], { commitment: "confirmed" });
         
         console.log("SIGNATURE:",signature);
         
         setCreatedTokenPublicKey(creatorToken.publicKey.toString());
         setIsTokenCreated(true);
         setLoading(false);
      } catch(err) {
         console.log(err)
         setLoading(false);
      }
   }

   return ( 
    	<div>
        	<h1> Create your own token using JavaScript </h1>
        	{
            walletConnected?(
            <p>
               <strong>Public Key:</strong> {provider.publicKey.toString()}
            </p>                   
            ):<p></p>
         }

         {
            walletConnected ? (
            <p>Airdrop 1 SOL into your wallet 
               <button disabled={loading} onClick={airDropHelper}>AirDrop SOL </button>
            </p>):<></>
         }

         {
            walletConnected ? (
            <p>Create your own token 
               <button disabled={loading} onClick={initialMintHelper}>Initial Mint </button>
            </p>):<></>
         }

         <button onClick={walletConnectionHelper} disabled={loading}>
            {!walletConnected?"Connect Wallet":"Disconnect Wallet"}
         </button> 
      </div>
   )
};

export default App;