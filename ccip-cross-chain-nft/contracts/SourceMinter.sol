// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {Withdraw} from "./utils/Withdraw.sol";

interface GHOToken {
  function approve(address spender, uint256 amount) external returns (bool);

  function balanceOf(address account) external view returns (uint256);

  function allowance(address owner, address spender) external view returns (uint256);

  function transfer(address to, uint256 value) external returns (bool);

  function transferFrom(address from, address to, uint256 value) external returns (bool);

  function permit(
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external;
}

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract SourceMinter is Withdraw, CCIPReceiver {
  enum PayFeesIn {
    Native,
    LINK
  }

  address immutable i_router;
  address immutable i_link;
  address immutable i_gho_token;
  address public winner;
  uint256 public constant min_amount = 10 * 1e18; // GHO has 18 decimals
  mapping(address => uint) public deposits;
  uint public totalDeposits;
  uint public participantCount;

  event MessageSent(bytes32 messageId);
  event MessageReceived(bytes32 messageId);
  event WinnerSelected(address winner);

  constructor(address router, address link, address gho) CCIPReceiver(router) {
    i_router = router;
    i_link = link;
    i_gho_token = gho;
    LinkTokenInterface(i_link).approve(i_router, type(uint256).max);
  }

  receive() external payable {}

  function mint(uint64 destinationChainSelector, address receiver, PayFeesIn payFeesIn) external {
    require(deposits[msg.sender] == 0, "Already minted");
    GHOToken ghoToken = GHOToken(i_gho_token);
    // User must have at least 10 GHO
    require(ghoToken.balanceOf(msg.sender) >= min_amount, "Not enough GHO");
    // TODO: use permit instead of approve
    // ghoToken.permit(msg.sender, address(this), _amount, _deadline, v, r, s); // TODO: add permit
    require(ghoToken.allowance(msg.sender, address(this)) >= min_amount, "Not enough allowance");
    ghoToken.transferFrom(msg.sender, address(this), min_amount);

    deposits[msg.sender] += min_amount;
    totalDeposits += min_amount;
    participantCount++;

    Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
      receiver: abi.encode(receiver),
      data: abi.encodeWithSignature("mint(address)", msg.sender),
      tokenAmounts: new Client.EVMTokenAmount[](0),
      extraArgs: "",
      feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
    });

    uint256 fee = IRouterClient(i_router).getFee(destinationChainSelector, message);

    bytes32 messageId;

    if (payFeesIn == PayFeesIn.LINK) {
      LinkTokenInterface(i_link).approve(i_router, fee);
      messageId = IRouterClient(i_router).ccipSend(destinationChainSelector, message);
    } else {
      messageId = IRouterClient(i_router).ccipSend{value: fee}(destinationChainSelector, message);
    }

    emit MessageSent(messageId);
  }

  // TODO: only owner or router can call this
  function setWinner(address _winner) public {
    winner = _winner;
    emit WinnerSelected(winner);
  }

  function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
    (bool success, ) = address(this).call(message.data);
    require(success);
    bytes32 messageId = message.messageId; // fetch the messageId
    emit MessageReceived(messageId);
  }

  function withdraw() external {
    require(deposits[msg.sender] > 0, "no deposits"); // Ensure the participant has a deposit
    require(winner != address(0), "Winner not selected yet"); // Ensure the winner is set
    uint amount;
    if (msg.sender == winner) {
      // Winner gets 90% of their deposit + 1 GHO from each of the other participants
      amount = ((deposits[msg.sender] * 9) / 10) + (participantCount) * 1e18;
    } else {
      // Other participants get 90% of their deposit back
      amount = (deposits[msg.sender] * 9) / 10;
    }
    deposits[msg.sender] = 0; // Set deposit to 0 to prevent re-entrancy
    GHOToken ghoToken = GHOToken(i_gho_token);
    ghoToken.transfer(msg.sender, amount);
  }
}
