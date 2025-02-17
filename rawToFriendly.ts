import { Address } from "ton-core";

const rawAddr = "a3935861f79daf59a13d6d182e1640210c02f98e3df18fda74b8f5ab141abf18";

const basechainAddress = Address.parse(`0:${rawAddr}`);
console.log("Basechain Address:", basechainAddress.toString());

const masterchainAddress = Address.parse(`-1:${rawAddr}`);
console.log("Masterchain Address:", masterchainAddress.toString());