import { compile, NetworkProvider } from "@ton-community/blueprint";
import { MainContract } from "../wrappers/MainContract";
import { address, toNano } from "ton-core";

export async function run(provider: NetworkProvider) {
    
    // Old smart-contract (wihtout op == 4) - kQDVzGqve9HiJKmf1cDxnmBi5mRSbOdgPMo3WYdZvIHFKLeU  kQCuUvg78pocsbOKPPaMPxtaTvH3zH6fXlpxcQa75B09Ekn3
    const myContract = provider.open(new MainContract(address(""))); // <== adress of our contract
    await myContract.sendWithdrawalRequest(provider.sender(), toNano(0.1), toNano("0.09"));

}