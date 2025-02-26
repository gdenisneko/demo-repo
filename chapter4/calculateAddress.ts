import { compile } from "@ton-community/blueprint";
import { MainContract } from "./wrappers/MainContract";
import { address, Cell } from "ton-core";

async function calculateContractAddress() {
    const codeCell: Cell = await compile("MainContract");

    const myContract1 = MainContract.createFromConfig(
        {
            number: 0,
            address: address("kQBMYGpCJCN7c9Yr8zRTpA6LO0YZn8F7ywbJLscjmgP5-qxJ"),
            owner_address: address("kQBMYGpCJCN7c9Yr8zRTpA6LO0YZn8F7ywbJLscjmgP5-qxJ"),
        },
        codeCell
    );
    console.log("Future contract address (empty fields):", myContract1.address.toString());
}

calculateContractAddress();