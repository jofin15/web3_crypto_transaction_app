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
  
}

export const TransactionProvider =({children})=>{

  const [currentAccount, setCurrentAccount] = useState("");
  const [formData,setFormData]=useState({
    addressTo:"",
    amount:"",
    keyword:"",
    message:""
  })

  const handleChange=(e,name)=>{
    setFormData((prevState)=>({...prevState,[name]:e.target.value}));
  }

  //a function to check our wallet is connected or not from the start
    const checkIfWalletIsConnect = async ()=>{
      try {
        //checks whether is a metamask account is there or not
          if (!ethereum) return alert("please install metamask");
          
          //it request metamask account
          const account=await ethereum.request({method:"eth_accounts"});
          
          //at the start of the every render we are going to have access to our account
          if (account.length){
            setCurrentAccount(account[0]);
  
            //getAllTransactions();
          }
          else{
            console.log("No account Found");
          }
      } catch (error) {
        console.log(error);
        throw new Error("No ethereum object"); 
      }
        console.log(account);
    }

    //function for connecting the account 
    const connectWallet= async()=>{
      try {
        //checks whether is a metamask account is there or not
        if (!ethereum) return alert("please install metamask");

        //choosing from multiple account
        const accounts=await ethereum.request({method:"eth_requestAccounts"});
        
        //connect that first account
        setCurrentAccount(accounts[0]); 
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
        const {addressTo,amount,remark,message} = formData;
        getEthereumContract();
        
      } catch (error) {
        console.log(error);
        throw new Error("No ethereum object"); 
      }
    }


    useEffect(()=>{
        checkIfWalletIsConnect();
    },[])

  return <TransactionContext.Provider value={{connectWallet , currentAccount,formData,setFormData,handleChange,sendTransaction }}>
    {children}
  </TransactionContext.Provider>
}