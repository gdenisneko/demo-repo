import { Address, address, toNano } from "ton-core";
import { MainContract } from "../wrappers/MainContract";
import { compile, NetworkProvider } from "@ton-community/blueprint";

export async function run(provider: NetworkProvider) {
    const myContract = MainContract.createFromConfig(
    {
        number: 0,
        address: Address.parse("kQBMYGpCJCN7c9Yr8zRTpA6LO0YZn8F7ywbJLscjmgP5-qxJ"),
        owner_address: Address.parse("kQBMYGpCJCN7c9Yr8zRTpA6LO0YZn8F7ywbJLscjmgP5-qxJ"),
    },
    await compile("MainContract")
    );

    const openedContract = provider.open(myContract);

    openedContract.sendDeploy(provider.sender(), toNano("0.15"));

    await provider.waitForDeploy(myContract.address);
}