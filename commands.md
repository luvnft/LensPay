# Commands

1. `npx hardhat compile`
2. `npx hardhat deploy-destination-minter --network polygonMumbai`
   * ✅ MyNFT contract deployed at address 0x96C8B8DB5561ef0Ab3a1f375aAA6dc6062A935C0 polygonMumbai
   * ✅ DestinationMinter contract deployed at address 0x314b305BE557762418ee0AEcAA3Ae94845faf0c4 polygonMumbai
3. `npx hardhat deploy-source-minter --network ethereumSepolia`
   * ✅ SourceMinter contract deployed at address 0xf407c89a49fD933cFa774fd3c028D004b9907840 ethereumSepolia
4. `npx hardhat fill-sender --sender-address 0x314b305BE557762418ee0AEcAA3Ae94845faf0c4 --blockchain polygonMumbai --amount 5000000000000000000 --pay-fees-in LINK` send 5 LINK to DestinationMinter
5. `npx hardhat fill-sender --sender-address 0xf407c89a49fD933cFa774fd3c028D004b9907840 --blockchain ethereumSepolia --amount 5000000000000000000 --pay-fees-in LINK` send 5 LINK to SourceMinter
    * `npx hardhat fill-sender --sender-address 0x314b305BE557762418ee0AEcAA3Ae94845faf0c4 --blockchain polygonMumbai --amount 100000000000000000 --pay-fees-in Native` send 0.1 MATIC to DestinationMinter
    * `npx hardhat fill-sender --sender-address 0xf407c89a49fD933cFa774fd3c028D004b9907840 --blockchain ethereumSepolia --amount 100000000000000000 --pay-fees-in Native` send 0.1 ETH to SourceMinter
    * Call `approve` on GHO contract if permit is not implemented yet
6. `npx hardhat cross-chain-mint --source-minter 0xf407c89a49fD933cFa774fd3c028D004b9907840 --source-blockchain ethereumSepolia --destination-blockchain polygonMumbai --destination-minter 0x314b305BE557762418ee0AEcAA3Ae94845faf0c4 --pay-fees-in LINK`

* Sepolia Router address `0xd0daae2231e9cb96b94c8512223533293c3693bf`
* Mumbai Router address `0x70499c328e1e2a3c41108bd3730f6670a44595d1`
* GHO address `0xc4bF5CbDaBE595361438F8c6a187bDc330539c60`
* LINK address Sepolia `0x779877A7B0D9E8603169DdbD7836e478b4624789`
* LINK address Mumbai `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`

## Verify on EtherScan and PolygonScan

1. `npx hardhat verify 0x96C8B8DB5561ef0Ab3a1f375aAA6dc6062A935C0 --network polygonMumbai`
   * ✅ Successfully verified contract MyNFT on the block explorer.
   * <https://mumbai.polygonscan.com/address/0x96C8B8DB5561ef0Ab3a1f375aAA6dc6062A935C0#code>
2. `npx hardhat verify 0x314b305BE557762418ee0AEcAA3Ae94845faf0c4 --network polygonMumbai 0x70499c328e1e2a3c41108bd3730f6670a44595d1 0x326C977E6efc84E512bB9C30f76E30c160eD06FB 0x96C8B8DB5561ef0Ab3a1f375aAA6dc6062A935C0`
    * ✅ Successfully verified contract DestinationMinter on the block explorer.
    * <https://mumbai.polygonscan.com/address/0x314b305BE557762418ee0AEcAA3Ae94845faf0c4#code>
3. `npx hardhat verify 0xf407c89a49fD933cFa774fd3c028D004b9907840 --network ethereumSepolia 0xd0daae2231e9cb96b94c8512223533293c3693bf 0x779877A7B0D9E8603169DdbD7836e478b4624789 0xc4bF5CbDaBE595361438F8c6a187bDc330539c60`
   * ✅ Successfully verified contract SourceMinter on the block explorer.
   * <https://polygonscan.com/address/0xf407c89a49fD933cFa774fd3c028D004b9907840#code>
