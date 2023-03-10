# NFT Storage Bounty

![top](./docs/top.png)

## Description

NFT Storage Bounty is a bounty creation app for NFT content. Users can input the NFT info, then the system automatically converts IPFS data into Filecoin format, which enables users to create Filecoin deal bounty on NFT content directly.

### Benefit

We can decentralize the NFT collection's storage with incentives.

## Submission

### Video

https://youtu.be/0H_PgMAm93I

### App

#### Next

https://nft-storage-bounty.vercel.app/

#### Spheron

https://filecoin-hackathon-2f5534.spheron.app/

## How It Works

![how-it-works](./docs/how-it-works.png)

- User inputs NFT data
- The system gets IPFS data from the token URI
- The system gets piece id from IPFS data by lotus
- Users can create bounty using the calculated piece id
- FEVM Smart contract enables the deal creator to claim the fund (not implemented yet)

### Technical Detail

We have Nextjs frontend, and the frontend is connected to the Filecoin testnet.

We are running lotus and IPFS in the backend.

And deal bounty smart contract is on the FEVM.

#### Filecoin 🛸 FVM Spaceships -

We build the storage Data DAO service for NFT content, which can be integrated into any chain. I used the example contract, but I provided a perfect use case for the contract.

#### Filecoin ⚓️ Docking Modules

I integrated the NFT storage incentive layer using Filecoin. And this could be a good docking module for every chain NFT and it incentivizes users to use IPFS and Filecoin.

#### Filecoin 🔥 FVM Jetpacks

We built smart contracts and interact with frontend and backend.

This is a simple dApp but it is strongly powered by Filcoin.

#### Sample Image

https://bafybeiblm23hq22c3k6fqlvvpbiototds4kblkf5yas5iti6e2igtnbdva.ipfs.nftstorage.link/

#### Calculated Piece ID

CID: baga6ea4seaqcxsr53negpkklyb4p6pojm2726yrr34lszn5j7qiacc7htv7vueq
Piece size: 15.88 MiB
Piece size in bytes: 16646144

#### Deployed Contracts on Hyperspace

DealRewarder: 0xec8845201c40Ec2C258b96CAD110aD01566247F6

#### Tested deal

bafyreig5obeibqjphohqyaa3t5blgclvsathhdmny7iot6mksigxsuzyam

#### Add fund

https://hyperspace.filfox.info/en/tx/0xd6b0cb8263c0f22dd814c4dbb21d0d10bfd1e5b7567b1a3e1ee7eadc5bd0dfc2

## Reference

### Main Guide

We are using the following document as the main reference.

https://medium.com/@rvk_rishikesh/build-your-first-datadao-on-fvm-6ed38b940103

And we forked the following contract as quick start

https://github.com/filecoin-project/fevm-hardhat-kit/tree/main

### Previous Project

Community Storage is extended from NFT Storage Bounty, which is my winning project in Hack FEVM.
It re-uses the frontend component, but smart contracts and business logic are newly implemented.

## Disclaimer

### Integrating with Lotus

This service requires running IPFS and Lotus, and it was hard to deploy, so only the front end is deployed.

To make the demo possible, I hard-coded the piece id and size calculation process.

### Creating deal

```
  Message: error validating deal published: decoding deal publish return: unsupported network version 19
...gxsuzyam  0       f01129    StorageDealError  N          N         ...mtrqnshi  15.88 MiB  0 FIL  521136    false
```

I was not able to create deal on Hyperspace properly, so the getting claim function is not integrated.
