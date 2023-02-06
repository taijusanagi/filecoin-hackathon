/* eslint-disable camelcase */
import fs from "fs";
import { ethers, network } from "hardhat";
import path from "path";

import { callRpc } from "../lib/utils";
import networkJsonFile from "../network.json";
import {
  DataDAO__factory
} from "../typechain-types";
import { isChainId } from "../types/ChainId";

async function main() {
  const chainId = String(network.config.chainId);
  if (!isChainId(chainId)) {
    throw new Error("chainId invalid");
  }

  const [signer] = await ethers.getSigners();
  const fileCoinRPC = networkJsonFile["31415"].rpc;
  const dataDAO = await new DataDAO__factory(signer).deploy({
    maxPriorityFeePerGas: await callRpc(fileCoinRPC, "eth_maxPriorityFeePerGas"),
  });
  await dataDAO.deployed();
  console.log("customMinerAPI", dataDAO.address);

  networkJsonFile[chainId].deployments.dataDAO = dataDAO.address;
  fs.writeFileSync(path.join(__dirname, `../network.json`), JSON.stringify(networkJsonFile));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
