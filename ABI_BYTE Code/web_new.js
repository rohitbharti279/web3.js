solc = require("solc");

// file system - read and write files to your computer
fs = require("fs");

// web3 interface
// Web3 = require("web3");
const {Web3} = require('web3')

// setup a http provider
let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

// reading the file contents of the smart  contract

let fileContent = fs.readFileSync("demo.sol").toString();
console.log(fileContent);

// create an input structure for my solidity compiler
let input = {
  language: "Solidity",
  sources: {
    "demo.sol": {
      content: fileContent,
    },
  },

  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

let output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("Output: ", output);

ABI = output.contracts["demo.sol"]["demo"].abi;
bytecode = output.contracts["demo.sol"]["demo"].evm.bytecode.object;
console.log("Bytecode: ", bytecode);
console.log("ABI: ", ABI);


let contract = new web3.eth.Contract(ABI);
let defaultAccount;
web3.eth.getAccounts().then((accounts) => {
  console.log("Accounts:", accounts); //it will show all the ganache accounts

  defaultAccount = accounts[0];
  console.log("Default Account:", defaultAccount);  //to deploy the contract from default Account
  contract
    .deploy({ data: bytecode })
    .send({ from: defaultAccount, gas: 500000 })
    .on("receipt", (receipt) => { //event,transactions,contractAddress will be returned by blockchain
      console.log("Contract Address:", receipt.contractAddress);
    })
    .then((demoContract) => {
      demoContract.methods.x().call((err, data) => {
        console.log("Initial Value:", data);
      });
    });
  
});

