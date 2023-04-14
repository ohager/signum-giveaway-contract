
# signum-giveaway-contract

A simple smart contract to provide giveaways, e.g. for events like live streams

The contract can be configured to Give Away a fixed amount of SIGNA per claiming account, e.g. 250 SIGNA.
Users can claim the amount by just sending the minimum fee of 0.25 SIGNA and will get the configured amount.
Accounts can only claim once. The contract runs until no funds are available anymore. 
If the creator of the contract wants to stop the Give Away he can request a refund of the resting balance.

This repo gives you the necessary tools to create, charge and refund a Give Away contract

## Usage

> Prerequisites:  Having [NodeJS 16+ installed](https://nodejs.org/en/download) on your system

### Installation

Clone this repository: `git clone https://github.com/ohager/signum-giveaway-contract.git`

Just run `npm i`, or `yarn` to install all dependencies

### Run Tools

You will be guided what you have to do once you type `npm start` or `yarn start`. 

The flow is

1. Create Contract
2. Charge Contract with Give Away amount
3. Eventually Stop Give Away by Refunding

```
? What do you want to do? (Use arrow keys)
❯ Create 
  Charge 
  Refund 
```

#### Create Contract

When selected "Create" you can deploy a new contract. A small dialog will ask you for some input parameters:

- Network: Obvious the network selection (Mainnet: europe.signum.network, Testnet: europe3.testnet.signum.network)
> You can change the node in `./src/cli/helper/constants.mjs`

- Amount: Defines the amount that shall be sent per claim. This cannot be changed afterwards!
- Name: Give it a name according to your event
- Alias: You can reference an alias. Using an alias may allow you to provide additional meta information people can follow, like a home page, more detailed description etc.
> The Alias should be follow the [SRC44](https://github.com/signum-network/SIPs/blob/master/SIP/sip-44.md) spec - you can generate it using Phoenix Wallet (Alias Section)


#### Charge Contract

Just send some money to the contract. Can be done with any wallet also. 
> Actually, everybody can charge the contract. Others than the creator would get back a claim (if not claimed already)> 

Parameters:
- Network: Obvious the network selection
- Contract Id: The id of the contract


#### Refund Contract

This stops the Give Away session, as the contracts balance will be send to the creator. This command can only be executed by the creator.

Parameters:
- Network: Obvious the network selection
- Contract Id: The id of the contract


## Contract 

[Source code](https://github.com/ohager/signum-giveaway-contract/blob/main/contract/claimContract.smart.c) 

```
Activation Costs: 0.25 SIGNA
Machine Code Hash: 14708020252986460043
Full Hash Reference MainNet: 
Full Hash Reference TestNet: 920BF14AB0AD3A462FF50341E7EBCF09933EBD16D4718F42651063C6EC406F06 
```
