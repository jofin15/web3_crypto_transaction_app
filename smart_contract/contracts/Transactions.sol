// SPDX-License-Identifier: SEE LICENSE IN LICENSE

//version number of solidity
pragma solidity ^0.8.0;

//smart contract
contract Transactions{
   //unsigned integer variable of length 256 
    uint256 transactionCount;

    //function
    //note:- address is a data type
    event Transfer(address from,address reciever,uint amount, string message, uint256 timestamp, string keyword );

    //structure
    struct TransferStruct {
        address sender;
        address reciever;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;

    }

    //dynamic array
    //note:- TranserStruct is a data type ; (array of objects)
    TransferStruct[] transactions;
     

    function addToBlockchain(address payable reciever, uint amount, string memory message, string memory keyword) public {
        transactionCount+=1;
        transactions.push(TransferStruct(msg.sender,reciever,amount,message,block.timestamp,keyword));
        emit Transfer(msg.sender,reciever,amount,message,block.timestamp,keyword);
    }

    //this function is going to return all the transaction in the form of transferStruct array
    function getAllTransactions() view public returns (TransferStruct[] memory){
        return transactions;

    }

    //this function is going to return the transaction Count which is in the form of unsigned integer
    function getTransactionCount() view public returns (uint256) {
        return transactionCount;
    }
}