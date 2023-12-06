import React,{useEffect,useState} from "react";
import {ethers } from "ethers";

// for accessing blockchain

import {contractABI,contractAddress} from "../utils/constants"
export const TransactionContext=React.createContext();

//ethereum objects come from the metamask
const {ethereum} =window;

//spectial function thats going to fetch our ethereum contract
const getEthereumContract =()=>{
  const provider=new ethers.providers.Web3Provider(ethereum);
  const signer =provider.getSigner();
  const transactionContract=new ethers.Contract(contractAddress,contractABI,signer);
  
  //signer, contractAddress and contractABI are the three incrediants that we need to fetch our contract
  console.log({
    provider,
    signer,
    transactionContract
  });
  alert("we got contract")
  
  return transactionContract;
}

export const TransactionProvider =({children})=>{

  const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange=(e,name)=>{
    setFormData((prevState)=>({...prevState,[name]:e.target.value}));
  }

  const getAllTransactions=async()=>{
    try {
      if (!ethereum) return alert("please install metamask");
      const transactionContract= getEthereumContract();
       const availableTransactions=await transactionContract.getAllTransactions();
       console.log(availableTransactions);


    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");  
    }

  }
  //a function to check our wallet is connected or not from the start
    const checkIfWalletIsConnect = async ()=>{ 
      try {
        //checks whether is a metamask account is there or not
          if (!ethereum) return alert("please install metamask");
          
          //if connected it request metamask account
          const account=await ethereum.request({method:"eth_accounts"});
          
          //at the start of the every render we are going to have access to our account
          if (account.length){
            setCurrentAccount(account[0]);
  
            getAllTransactions();
          }
          else{
            console.log("No account Found from check");
          }
      } catch (error) {
        console.log(error);
        throw new Error("No ethereum object"); 
      }
    };

    
    //function for connecting the account 
    const connectWallet= async()=>{
      try {
        //checks whether is a metamask account is there or not
        if (!ethereum) return alert("please install metamask");

        //if metamask is installed then choosing one (first account) from multiple account
        const account=await ethereum.request({method:"eth_requestAccounts"});
        
        //connect that first account
        setCurrentAccount(account[0]); 
      } catch (error) {
        console.log(error);
        throw new Error("No ethereum object"); 
        
      }
    }

    const checkIfTransactionExist= async()=>{
      try {
        const transactionContract= getEthereumContract();
        const transactionCount=await transactionContract.getTransactionCount();
        window.localStorage.setItem("transactionCount",transactionCount);

      } catch (error) {
        console.log(error);
        throw new Error("No ethereum object"); 
      }
    }

    //function that have the entire logic for sending and storing transactions
    const sendTransaction = async()=>{
      try {
        //checks whether is a metamask account is there or not
        if (!ethereum) return alert("please install metamask");
        const {addressTo,amount,keyword,message} = formData;

        //now we can  use this below "transactionContract" variable to call all of our contract related functions 
       const transactionContract= getEthereumContract();

       //this ether package help us to converst the amount into gwei hexadecimal amount
       const parsedAmount=ethers.utils.parseEther(amount);

       //sending ethereum from one address to another
       await ethereum.request({
        method:"eth_sendTransaction",
        params:[{
          from:currentAccount,
          to:addressTo,
          gas:"0x5208", //21000 GWEI => 0.000021 ETHER
          value:parsedAmount._hex // 0.0001 ether
        }]
       });

       //to store our transaction
       const transactionHash= await transactionContract.addToBlockchain( addressTo,parsedAmount,message,keyword);
      //variable tractionHash store the data in unique transactionID

       //every transaction will take little time 
       setIsLoading(true);
       console.log(`Loading - ${transactionHash.hash}`);
       //this is going to wait for the transaction to be finished
       await transactionHash.wait();

       setIsLoading(false);
       console.log(`Success - ${transactionHash.hash}`);

       //once we get the transaction count we can store that in our state
       const transactionCount=await transactionContract.getTransactionCount();

       setTransactionCount(transactionCount.toNumber());

      } catch (error) {
        console.log(error);
        throw new Error("No ethereum object"); 
      }
      alert("sending transaction")
    }


    useEffect(()=>{
        checkIfWalletIsConnect();
        checkIfTransactionExist();
    },[])

  return <TransactionContext.Provider value={{connectWallet , currentAccount,formData,setFormData,handleChange,sendTransaction }}>
    {children}
  </TransactionContext.Provider>
}





// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";

// // // for accessing blockchain
// import { contractABI, contractAddress } from "../utils/constants";
// export const TransactionContext = React.createContext();

// // //ethereum objects come from the metamask
// const { ethereum } = window;

// // //spectial function thats going to fetch our ethereum contract
// const createEthereumContract = () => {
//   const provider = new ethers.providers.Web3Provider(ethereum);
//   const signer = provider.getSigner();
//   const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

// //   //signer, contractAddress and contractABI are the three incrediants that we need to fetch our contract
// //   console.log({
// //     provider,
// //     signer,
// //     transactionContract
// //   });
// //   alert("we got contract")

//   return transactionsContract;
// };

// export const TransactionProvider = ({ children }) => {

//   const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
//   const [currentAccount, setCurrentAccount] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
//   const [transactions, setTransactions] = useState([]);

//   const handleChange = (e, name) => {
//     setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
//   };

//   const getAllTransactions = async () => {
//     try {
//       if (ethereum) {
//         const transactionsContract = createEthereumContract(); //*

//         const availableTransactions = await transactionsContract.getAllTransactions();

//         const structuredTransactions = availableTransactions.map((transaction) => ({
//           addressTo: transaction.receiver,
//           addressFrom: transaction.sender,
//           timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
//           message: transaction.message,
//           keyword: transaction.keyword,
//           amount: parseInt(transaction.amount._hex) / (10 ** 18)
//         }));

//         console.log(structuredTransactions);

//         setTransactions(structuredTransactions);
//       } else {
//         console.log("Ethereum is not present");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   //   //a function to check our wallet is connected or not from the start
//   const checkIfWalletIsConnect = async () => {
//     try {
//       //checks whether is a metamask account is there or not
//       if (!ethereum) return alert("Please install MetaMask.");
      
//       //if connected it request metamask account
//       const accounts = await ethereum.request({ method: "eth_accounts" });

//       if (accounts.length) {
//         setCurrentAccount(accounts[0]);

//         getAllTransactions();
//       } else {
//         console.log("No accounts found");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const checkIfTransactionsExists = async () => {
//     try {
//       if (ethereum) {
//         const transactionsContract = createEthereumContract();
//         const currentTransactionCount = await transactionsContract.getTransactionCount();

//         window.localStorage.setItem("transactionCount", currentTransactionCount);
//       }
//     } catch (error) {
//       console.log(error);

//       throw new Error("No ethereum object");
//     }
//   };

//   const connectWallet = async () => {
//     try {
//       if (!ethereum) return alert("Please install MetaMask.");

//       const accounts = await ethereum.request({ method: "eth_requestAccounts", });

//       setCurrentAccount(accounts[0]);
//       window.location.reload();
//     } catch (error) {
//       console.log(error);

//       throw new Error("No ethereum object");
//     }
//   };

//   const sendTransaction = async () => {
//     try {
//       if (ethereum) {
//         const { addressTo, amount, keyword, message } = formData;
//         const transactionsContract = createEthereumContract();
//         const parsedAmount = ethers.utils.parseEther(amount);

//         await ethereum.request({
//           method: "eth_sendTransaction",
//           params: [{
//             from: currentAccount,
//             to: addressTo,
//             gas: "0x5208",
//             value: parsedAmount._hex,
//           }],
//         });

//         const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

//         setIsLoading(true);
//         console.log(`Loading - ${transactionHash.hash}`);
//         await transactionHash.wait();
//         console.log(`Success - ${transactionHash.hash}`);
//         setIsLoading(false);

//         const transactionsCount = await transactionsContract.getTransactionCount();

//         setTransactionCount(transactionsCount.toNumber());
//         window.location.reload();
//       } else {
//         console.log("No ethereum object");
//       }
//     } catch (error) {
//       console.log(error);

//       throw new Error("No ethereum object");
//     }
//   };

//   useEffect(() => {
//     checkIfWalletIsConnect();
//     checkIfTransactionsExists();
//   }, [transactionCount]);

//   return (
//     <TransactionContext.Provider
//       value={{
//         transactionCount,
//         connectWallet,
//         transactions,
//         currentAccount,
//         isLoading,
//         sendTransaction,
//         handleChange,
//         formData,
//       }}
//     >
//       {children}
//     </TransactionContext.Provider>
//   );
// };