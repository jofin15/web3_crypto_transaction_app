// https://eth-goerli.g.alchemy.com/v2/nmNUjAqL--tOryeebzilUoAppaRKu4C1

require('@nomiclabs/hardhat-waffle');

module.exports={
  solidity:"0.8.0",
  networks:{
    goerli:{
      url:"https://eth-goerli.g.alchemy.com/v2/nmNUjAqL--tOryeebzilUoAppaRKu4C1",
      accounts:["6f68b6974d268c2ed37a49639a00111533eeec94d856124b847e7adc0b184304"]
    }
  }
}