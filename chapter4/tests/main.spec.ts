import { Cell, toNano } from "ton-core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { compile } from "@ton-community/blueprint";
import "@ton-community/test-utils";

describe("main.fc contract test", () => {

    let blockchain: Blockchain;
    let myContract: SandboxContract<MainContract>;
    let initWallet: SandboxContract<TreasuryContract>;
    let ownerWallet: SandboxContract<TreasuryContract>;
    let codeCell: Cell;

    beforeAll(async () => {
        codeCell = await compile("MainContract");
    })

    beforeEach(async () =>  {
        blockchain = await Blockchain.create();
        initWallet = await blockchain.treasury("initWallet");
        ownerWallet = await blockchain.treasury("ownerWallet");

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

    it("Should return Deposits funds as no command is sent", async () => {
        const senderWallet = await blockchain.treasury("sender");

        const depositMessageResult = await myContract.sendNoCodeDeposit(
            senderWallet.getSender(),
            toNano("5")
        );
        
        expect(depositMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: false
        });
        
        const balanceRequest = await myContract.getBalance();
        expect(balanceRequest.balance).toEqual(0);
    });

    it("Should return Deposits funds on behalf of owner", async () => {
        const senderWallet = await blockchain.treasury("sender");
        await myContract.sendDeposit(senderWallet.getSender(), toNano("5"));

        const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
            ownerWallet.getSender(),
            toNano("0.05"),
            toNano(1)
        );
        
        expect(withdrawalRequestResult.transactions).toHaveTransaction({
            from: myContract.address,
            to: ownerWallet.address,
            success: true,
            value: toNano(1),
        });
    });

    it("Fails to  withwrawal funds on behalf of non-owner", async () => {
        const senderWallet = await blockchain.treasury("sender");
        await myContract.sendDeposit(senderWallet.getSender(), toNano("5"));

        const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
            senderWallet.getSender(),
            toNano("0.05"),
            toNano(1)
        );
        
        expect(withdrawalRequestResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: false,
            exitCode: 103,
        });
    });

    it("Fails to  withwrawal funds because lack of balance", async () => {
        const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
            ownerWallet.getSender(),
            toNano("0.05"),
            toNano(6)
        );
        
        expect(withdrawalRequestResult.transactions).toHaveTransaction({
            from: ownerWallet.address,
            to: myContract.address,
            success: false,
            exitCode: 104,
        });
    });
});