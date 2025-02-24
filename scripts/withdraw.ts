import { compile, NetworkProvider } from "@ton-community/blueprint";
import { MainContract } from "../wrappers/MainContract";
import { address, toNano } from "ton-core";

export async function run(provider: NetworkProvider) {
    const codeCell = await compile("MainContract");

    const myContract = MainContract.createFromConfig(
        {
            number: 0,
            address: address("kQDVzGqve9HiJKmf1cDxnmBi5mRSbOdgPMo3WYdZvIHFKLeU"),
            owner_address: address("kQBMYGpCJCN7c9Yr8zRTpA6LO0YZn8F7ywbJLscjmgP5-qxJ"),
        },
        codeCell
    );

    const openContract = provider.open(myContract);

    await openContract.sendWithdrawalRequest(provider.sender(), toNano("0.1"), toNano("0.03"));
}