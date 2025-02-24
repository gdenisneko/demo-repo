import { address, toNano } from "ton-core";
import { MainContract } from "../wrappers/MainContract";
import { compile, NetworkProvider } from "@ton-community/blueprint";

export async function run(provider: NetworkProvider) {
  const myContract = MainContract.createFromConfig(
    {
      number: 0,
      address: address(""),
      owner_address: address(""),
    },
    await compile("MainContract")
  );

  const openedContract = provider.open(myContract);

  openedContract.sendDeploy(provider.sender(), toNano("0.05"));

  await provider.waitForDeploy(myContract.address);
}