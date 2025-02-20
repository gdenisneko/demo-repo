import { Cell, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";

import "@ton-community/test-utils";

describe("main.fc contract test", () => {

    let blockchain: Blockchain;
    let myContract: SandboxContract<MainContract>;
    let initWallet: SandboxContract<TreasuryContract>;
    let ownerWallet: SandboxContract<TreasuryContract>;

    beforeEach(async () =>  {
        blockchain = await Blockchain.create();
        initWallet = await blockchain.treasury("initWallet");
        ownerWallet = await blockchain.treasury("ownerWallet");

        const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];

        myContract = blockchain.openContract(
            await MainContract.createFromConfig(
                {
                    number: 0,
                    address: initWallet.address,
                    owner_address: ownerWallet.address,
                },
                codeCell
            )
        );
    })

    it("Should successfully increase counter in contract and get the proper most recent sender address", async () => {

        const sentMessageResult = await myContract.sendIncrement(
            initWallet.getSender(),
            toNano("0.05"),
            Number(5),
        );
        
        expect(sentMessageResult.transactions).toHaveTransaction({
            from: initWallet.address,
            to: myContract.address,
            success: true,
        });

        const data = await myContract.getData();

        expect(data.recent_sender.toString()).toBe(initWallet.address.toString());
        expect(data.number).toEqual(5);
    });

    it("Successfully Deposits funds", async () => {
        const senderWallet = await blockchain.treasury("sender");

        const depositMessageResult = await myContract.sendDeposit(
            senderWallet.getSender(),
            toNano("5")
        );

        expect(depositMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true
        });

        const balanceRequest = await myContract.getBalance();
        expect(balanceRequest.balance).toBeGreaterThan(toNano("4.99"));
    });

    it("Should return Deposits funds as no command is sent", () => {
        //tesst logic
    });

    it("Should return Deposits funds on behalf of owner", () => {
        //tesst logic
    });

    it("Fails to  withwrawal funds on behalf of non-owner", () => {
        //tesst logic
    });

    it("Fails to  withwrawal funds because lack of balance", () => {
        //tesst logic
    });
});