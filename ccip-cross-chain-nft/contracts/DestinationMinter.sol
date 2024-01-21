// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {Withdraw} from "./utils/Withdraw.sol";
import {MyNFT} from "./MyNFT.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract DestinationMinter is Withdraw, CCIPReceiver {
  enum PayFeesIn {
    Native,
    LINK
  }

  MyNFT nft;

  address public _router;
  address immutable i_link;

  event MintCallSuccessfull();
  // Event emitted when a message is sent to another chain.
  event MessageSent(
    bytes32 indexed messageId,
    uint64 indexed destinationChainSelector,
    address receiver,
    string message,
    uint256 fees
  );

  constructor(address router, address link, address nftAddress) CCIPReceiver(router) {
    _router = router;
    i_link = link;
    nft = MyNFT(nftAddress);
    LinkTokenInterface(i_link).approve(_router, type(uint256).max);
  }

  receive() external payable {}

  function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
    (bool success, ) = address(nft).call(message.data);
    require(success);
    emit MintCallSuccessfull();
  }

  // TODO: remove this function
  function updateRouter(address routerAddr) external {
    _router = routerAddr;
  }

  /// @notice Sends data to receiver on the destination chain.
  /// @dev Assumes your contract has sufficient native asset (e.g, ETH on Ethereum, MATIC on Polygon...).
  /// @param destinationChainSelector The identifier (aka selector) for the destination blockchain.
  /// @param receiver The address of the recipient on the destination blockchain.
  /// @param message The string message to be sent.
  /// @return messageId The ID of the message that was sent.
  function sendMessage(
    uint64 destinationChainSelector,
    address receiver,
    string memory message,
    PayFeesIn payFeesIn
  ) public returns (bytes32 messageId) {
    // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
    Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
      receiver: abi.encode(receiver), // ABI-encoded receiver address
      data: abi.encode(message), // ABI-encoded string message
      tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array indicating no tokens are being sent
      extraArgs: "",
      // extraArgs: Client._argsToBytes(
      //   Client.EVMExtraArgsV1({gasLimit: 400_000, strict: false}) // Additional arguments, setting gas limit and non-strict sequency mode
      // ),
      feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0) // Setting feeToken to zero address, indicating native asset will be used for fees
    });

    // Initialize a router client instance to interact with cross-chain router
    IRouterClient router = IRouterClient(_router);

    // Get the fee required to send the message
    uint256 fee = router.getFee(destinationChainSelector, evm2AnyMessage);

    // Send the message through the router and store the returned message ID
    if (payFeesIn == PayFeesIn.LINK) {
      LinkTokenInterface(i_link).approve(_router, fee);
      messageId = router.ccipSend(destinationChainSelector, evm2AnyMessage);
    } else {
      messageId = router.ccipSend{value: fee}(destinationChainSelector, evm2AnyMessage);
    }

    // Emit an event with message details
    emit MessageSent(messageId, destinationChainSelector, receiver, message, fee);

    // Return the message ID
    return messageId;
  }

  // TODO: must be called by smart post
  function setWinner(
    uint64 destinationChainSelector,
    address receiver,
    PayFeesIn payFeesIn,
    address winner
  ) public {
    string memory message = string(abi.encodeWithSignature("setWinner(address)", winner));
    sendMessage(destinationChainSelector, receiver, message, payFeesIn);
  }
}
