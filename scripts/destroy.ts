import { Address, address, toNano } from "ton-core";
import { MainContract } from "../wrappers/MainContract";
import { compile, NetworkProvider } from "@ton-community/blueprint";

export async function run(provider: NetworkProvider) {
    const myContract = provider.open(new MainContract(Address.parse(""))); // <== adress of our contract
    await myContract.sendDestroy(provider.sender(), toNano("0.05"));
}
