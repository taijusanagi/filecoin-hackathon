import { Button, Center, HStack, Image, Input, Spinner, Stack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useState } from "react";

import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { Unit } from "@/components/Unit";
// import { useIsSignedIn } from "@/hooks/useIsSignedIn";
import { useConnectedChainConfig } from "@/hooks/useConnectedChainConfig";

import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  // const { isSignedIn } = useIsSignedIn();
  const { connectedChainConfig } = useConnectedChainConfig()
  const { openConnectModal } = useConnectModal();

  const [dealId, setDealId] = useState("");
  const disclosure = useDisclosure();

  return (
    <Layout>
      <Stack spacing="8">
        <VStack>
          <Image src="/assets/hero.png" w="100" mx="auto" alt="logo" mb="4" />
          <Text textAlign={"center"} fontSize={{ base: 'xs', md: 'md' }} fontWeight={"bold"} color={configJsonFile.style.color.accent}>
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

        {connectedChainConfig && (
          <Stack spacing="8">
            <Unit header={"Claim Proof of data preservation SBTs"}>
              <Stack spacing="2">
                <Input
                  placeholder={"input filecoin deal id which preserves the data"}
                  type={"text"}
                  value={dealId}
                  size="lg"
                  fontSize="sm"
                  onChange={(e) => setDealId(e.target.value)}
                />
                <Button w="full" fontWeight={"bold"} onClick={disclosure.onOpen}>
                  Claim SBTs
                </Button>
              </Stack>
            </Unit>
            <Modal header="Claiming SBTs..." isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
              <Text fontSize="xs">
                To be honest, there is still issue in connecting with deployed contract. Let&apos;s check in the hardhat
                test to check how contract works
              </Text>
              <Center height="400">
                <Spinner />
              </Center>
            </Modal>
            {/* <Unit header={"Minted SBTs"}>
              <Stack></Stack>
            </Unit> */}
          </Stack>
        )}
      </Stack>
    </Layout>
  );
};

export default HomePage;
