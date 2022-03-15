## Configuring a secret
In the root folder create *sercret.json* file and fill it the following properties:<br/>
```
{
    "INFURA_API_KEY": [INFURA API KEY]
    "PRIVATE_KEY": [YOUR ACCOUNT's PRIVATE KEY]
}
```

## How to deploy the contract
1. From the root folder run ``` npx hardhat run --network rinkeby scripts/deploy.js ```
2. Save the contract address for future interactions

## How to run a task
From the root folder run<br/>``` npx hardhat [task name] --network rinkeby --contract-address [contract address] --argument [argument value] ```<br/>Example:<br/>``` npx hardhat transfer --network rinkeby --contract-address 0xdFFD4DEA4e382A7eA6a728b188DDDbF78DB76677 --to 0x12d8f31923aa0acc543b96733bc0ed348ef44970 --tokens 0 ```

## The list of available tasks
| Task name    | Description                                                                                           | Options                                                                                                                                                                            |
|--------------|-------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| approve      | Allows `spender` to withdraw from caller's account multiple times, up to the `tokens` amount.         | --spender => Address which should receive an approval to spend caller's tokens <br/> --tokens => Amount of tokens to transfer <br/> --contract-address => An address of a contract |
| transfer     | Transfers `tokens` amount of tokens to address `to` and fires the Transfer event.                     | --contract-address => An address of a contract <br/> --to => Destination address <br/> --tokens => Amount of tokens to transfer                                                    |
| transferFrom | Transfers `tokens` amount of tokens from address `from` to address `to` and fires the Transfer event. | --contract-address => An address of a contract <br/> --to => Destination address <br/> --tokens => Amount of tokens to transfer <br/> --from => Source address                     |

## How to run tests and evaluate the coverage
From the root folder run ``` npx hardhat coverage ```
## Current test and coverage results for *i7-8550U 1.80GHz/16Gb RAM/WIN10 x64*
```
MySimpleToken
√ Should not allow a non-minter to mint tokens (71ms)
√ Should allow the owner to mint tokens (64ms)
√ Should allow to burn owned tokens (44ms)
√ Should allow to transfer approved tokens (94ms)
√ Should allow to transfer owned tokens (66ms)
√ Should not allow to transfer insufficient amount of tokens
√ Should not allow to transferFrom insufficient amount of tokens
√ Should not allow to mint tokens on zero address
√ Should not allow to overflow total supply
√ Should not allow to burn more tokens than a caller posesses
√ Should not allow to transferFrom if the source address does not hold sufficient amount of tokens
√ Should not allow to transferFrom if the source address does not hold sufficient amount of tokens
√ Should allow to transfer 0 tokens
√ Should allow to transferFrom 0 tokens
√ Should not allow to transfer to the zero address
√ Should not allow to transferFrom to the zero address
```
| File                 | % Stmts    | % Branch   | % Funcs    | % Lines    | Uncovered Lines  |
|----------------------|------------|------------|------------|------------|------------------|
| contracts\           | 89.47      | 100        | 71.43      | 89.74      |                  |
| MySimpleToken.sol    | 89.47      | 100        | 71.43      | 89.74      | 168,180,184,188  |
| -------------------- | ---------- | ---------- | ---------- | ---------- | ---------------- |
| All files            | 89.47      | 100        | 71.43      | 89.74      |                  |

## Project dependencies
* @nomiclabs/ethereumjs-vm#4.2.2,
* @nomiclabs/hardhat-ethers#2.0.5,
* @nomiclabs/hardhat-waffle#2.0.3,
* @nomiclabs/hardhat-web3#2.0.0,
* @nomiclabs/hardhat-etherscan#3.0.3,
* chai#4.3.6,
* ethereum-waffle#4.0.0-alpha.0,
* ethers#5.6.0,
* hardhat#2.9.1,
* solidity-coverage#0.7.20