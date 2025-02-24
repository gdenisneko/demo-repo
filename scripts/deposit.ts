import { compile, NetworkProvider } from "@ton-community/blueprint";
import { MainContract } from "../wrappers/MainContract";
import { address, toNano } from "ton-core";

export async function run(provider:NetworkProvider) {
    const myContract = provider.open(new MainContract(address("kQDVzGqve9HiJKmf1cDxnmBi5mRSbOdgPMo3WYdZvIHFKLeU"))); // <== adress of our contract
    await myContract.sendDeposit(provider.sender(), toNano("0.2"));

}