/* eslint-disable camelcase */
import fs from "fs";
import { ethers, network } from "hardhat";
import path from "path";

import { callRpc } from "../lib/utils";
import networkJsonFile from "../network.json";
import {
  CustomMarketAPI__factory,
  CustomMinerAPI__factory,
  ProofOfDataPreservation__factory,
} from "../typechain-types";
import { isChainId } from "../types/ChainId";

async function main() {
  const chainId = String(network.config.chainId);
  if (!isChainId(chainId)) {
    throw new Error("chainId invalid");
  }

  const [signer, owner] = await ethers.getSigners();
  const fileCoinRPC = networkJsonFile["31415"].rpc;
  const customMinerAPI = await new CustomMinerAPI__factory(signer).deploy(owner.address, {
    maxPriorityFeePerGas: await callRpc(fileCoinRPC, "eth_maxPriorityFeePerGas"),
  });
  await customMinerAPI.deployed();
  console.log("customMinerAPI", customMinerAPI.address);

  networkJsonFile[chainId].deployments.customMinerAPI = customMinerAPI.address;
  fs.writeFileSync(path.join(__dirname, `../network.json`), JSON.stringify(networkJsonFile));

  const customMarketAPI = await new CustomMarketAPI__factory(signer).deploy(
    CUSTOME_DEAL_ID,
    networkJsonFile[chainId].deployments.customMinerAPI,
    CUSTOME_PAYLOAD_CID,
    {
      maxPriorityFeePerGas: await callRpc(fileCoinRPC, "eth_maxPriorityFeePerGas"),
    }
  );
  await customMarketAPI.deployed();
  console.log("customMarketAPI", customMarketAPI.address);

  networkJsonFile[chainId].deployments.customMarketAPI = customMarketAPI.address;
  fs.writeFileSync(path.join(__dirname, `../network.json`), JSON.stringify(networkJsonFile));

  const proofOfDataPreservation = await new ProofOfDataPreservation__factory(signer).deploy(
    networkJsonFile[chainId].deployments.customMarketAPI,
    BASE_TOKEN_URI,
    false,
    "0",
    {
      maxPriorityFeePerGas: await callRpc(fileCoinRPC, "eth_maxPriorityFeePerGas"),
    }
  );
  await proofOfDataPreservation.deployed();
  console.log("proofOfDataPreservation", proofOfDataPreservation.address);

  networkJsonFile[chainId].deployments.proofOfDataPreservation = proofOfDataPreservation.address;
  fs.writeFileSync(path.join(__dirname, `../network.json`), JSON.stringify(networkJsonFile));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
