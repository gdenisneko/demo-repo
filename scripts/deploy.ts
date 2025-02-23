import { compile, NetworkProvider } from "@ton-community/blueprint";
import { MainContract } from "../wrappers/MainContract";
import { address, toNano } from "ton-core";

export async function run(provider:NetworkProvider) {
    const codeCell = await compile("MainContract");
    const myContract = MainContract.createFromConfig(
        {
        number: 0,
        address: address("kQBMYGpCJCN7c9Yr8zRTpA6LO0YZn8F7ywbJLscjmgP5-qxJ"),
        owner_address: address("kQBMYGpCJCN7c9Yr8zRTpA6LO0YZn8F7ywbJLscjmgP5-qxJ")
        },
        codeCell
    );

    const contractAddress = myContract.address.toString();
    console.log("Future contract address:", contractAddress);

    const openContract = provider.open(myContract);

    openContract.sendDeploy(provider.sender(), toNano("0.05"));

    await provider.waitForDeploy(myContract.address);
}