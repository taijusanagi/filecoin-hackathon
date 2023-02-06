import { Button, Center, HStack, Image, Input, Spinner, Stack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import axios from "axios";
import { ethers } from "ethers";
import { NextPage } from "next";
import { useState } from "react";
import { useSigner } from "wagmi";

import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { Unit } from "@/components/Unit";
// import { useIsSignedIn } from "@/hooks/useIsSignedIn";
import { useConnectedChainConfig } from "@/hooks/useConnectedChainConfig";
import { wait } from "@/lib/utils";
import { storageBountyABI, tokenURIABI } from "@/lib/web3/abi";

import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  // const { isSignedIn } = useIsSignedIn();
  const { connectedChainConfig } = useConnectedChainConfig();
  const { openConnectModal } = useConnectModal();

  const [contractAddress, setContractAddress] = useState("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");
  const [tokenId, setTokenId] = useState("6007");
  const [imageURI, setImageURI] = useState("");

  const [cid, setCID] = useState("");
  const { data: signer } = useSigner();

  const disclosure = useDisclosure();

  return (
    <Layout>
      <Stack spacing="8">
        <VStack>
          <Image src="/assets/hero.png" w="100" mx="auto" alt="logo" mb="4" />
          <Text
            textAlign={"center"}
            fontSize={{ base: "xs", md: "md" }}
            fontWeight={"bold"}
            color={configJsonFile.style.color.accent}
          >
            {configJsonFile.description}
          </Text>
        </VStack>
        {!connectedChainConfig && (
          <VStack>
            <HStack spacing="4">
              <Button
                fontWeight={"bold"}
                variant="secondary"
                onClick={() => window.open(`${configJsonFile.url.github}/blob/main/README.md`, "_blank")}
              >
                Docs
              </Button>
              <Button fontWeight={"bold"} onClick={openConnectModal}>
                Connect Wallet
              </Button>
            </HStack>
          </VStack>
        )}

        {signer && connectedChainConfig && (
          <Stack spacing="8">
            <Unit header={"Input NFT Data"}>
              <Stack spacing="4">
                <Stack>
                  <Text fontSize="sm" fontWeight={"bold"} color={configJsonFile.style.color.black.text.secondary}>
                    Contract Address
                  </Text>
                  <Input
                    type={"text"}
                    value={contractAddress}
                    size="lg"
                    fontSize="sm"
                    onChange={(e) => setContractAddress(e.target.value)}
                  />
                </Stack>
                <Stack>
                  <Text fontSize="sm" fontWeight={"bold"} color={configJsonFile.style.color.black.text.secondary}>
                    Token ID
                  </Text>
                  <Input
                    type={"text"}
                    value={tokenId}
                    size="lg"
                    fontSize="sm"
                    onChange={(e) => setTokenId(e.target.value)}
                  />
                </Stack>
                <Button
                  isDisabled={contractAddress === "" || tokenId === ""}
                  w="full"
                  fontWeight={"bold"}
                  onClick={async () => {
                    const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");
                    const contract = new ethers.Contract(contractAddress, tokenURIABI, provider);
                    const tokenURI: string = await contract.tokenURI(tokenId);
                    if (tokenURI.indexOf("ipfs") >= 0) {
                      console.log(tokenURI);
                      const metadataURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
                      const { data } = await axios.get(metadataURI);
                      console.log(data);
                      const imageURI = data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
                      setImageURI(imageURI);
                      disclosure.onOpen();
                    } else {
                      alert("mainnet only, and both metadata and image should be in ipfs, you can try BAYC as example");
                    }
                  }}
                >
                  Check
                </Button>
              </Stack>
            </Unit>
            {cid && (
              <Unit header={"Bounty"}>
                <Stack spacing="4">
                  <Text fontSize="sm" fontWeight={"bold"} color={configJsonFile.style.color.black.text.secondary}>
                    CID
                  </Text>
                  <Text fontSize="xs" color={configJsonFile.style.color.black.text.secondary}>
                    {cid}
                  </Text>
                  <HStack>
                    <Button
                      w="100%"
                      onClick={async () => {
                        // this is hard coded for the demo
                        // I have tested the converting ipfs cid into piece id and kept the process in readme.

                        console.log("input cid:", cid);
                        console.log("calculating piece id and and size with lotus");

                        await wait(3000);

                        const pid = "baga6ea4seaqcxsr53negpkklyb4p6pojm2726yrr34lszn5j7qiacc7htv7vueq";
                        const pidHex =
                          "0x000181e2039220202bca3ddb4867a94bc078ff3dc966bfaf6231df172cb7a9fc10010be79d7f5a12";
                        const size = 16646144;

                        console.log("piece id:", pid);
                        console.log("piece id hex:", pidHex);
                        console.log("size:", size);

                        const contract = new ethers.Contract(
                          "0xec8845201c40Ec2C258b96CAD110aD01566247F6",
                          storageBountyABI,
                          signer
                        );

                        const cidSet = await contract.cidSet(pidHex);
                        console.log("cidSet", cidSet);
                        if (!cidSet) {
                          console.log("need to add cid first");
                          await contract.addCID(pidHex, size);
                        }

                        console.log("add 0.1 FIL to the NFT Storage Bounty");
                        await contract.fund(0, {
                          value: ethers.utils.parseEther("0.1"),
                        });
                      }}
                    >
                      Add Fund
                    </Button>
                    <Button isDisabled={true} w="100%">
                      Claim Bounty
                    </Button>
                  </HStack>
                </Stack>
              </Unit>
            )}
            <Modal header="Preview" isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
              <Stack spacing="4">
                <Image src={imageURI} alt={"image"} />
                <Button
                  w="full"
                  fontWeight={"bold"}
                  onClick={async () => {
                    const cid = imageURI.replace("https://ipfs.io/ipfs/", "");
                    setCID(cid);
                    disclosure.onClose();
                  }}
                >
                  Create Bounty
                </Button>
              </Stack>
            </Modal>
          </Stack>
        )}
      </Stack>
    </Layout>
  );
};

export default HomePage;
