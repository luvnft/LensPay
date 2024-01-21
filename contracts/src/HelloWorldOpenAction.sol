// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {HubRestricted} from "lens/HubRestricted.sol";
import {Types} from "lens/Types.sol";
import {IPublicationActionModule} from "lens/IPublicationActionModule.sol";
import {LensModuleMetadata} from "lens/LensModuleMetadata.sol";
import {IHelloWorld} from "./IHelloWorld.sol";

enum PayFeesIn {
  Native,
  LINK
}

interface CCIP {
  function setWinner(
    uint64 destinationChainSelector,
    address receiver,
    PayFeesIn payFeesIn,
    address winner
  ) external;
}

interface IERC721 {
  function balanceOf(address owner) external view returns (uint256 balance);
}

contract HelloWorldOpenAction is HubRestricted, IPublicationActionModule, LensModuleMetadata {
  struct Comment {
    uint256 pubId;
    uint256 commentId;
    address author;
    string content;
    uint256 votes;
  }

    /**
     * User gets the NFT when they have deposited GHO tokens into the vault.
     * Vault is a contract that holds the GHO tokens on Ethereum.
     */
    modifier hasGatedNFT() {
        address nftAddress = 0x96C8B8DB5561ef0Ab3a1f375aAA6dc6062A935C0;
        IERC721 nft = IERC721(nftAddress);
        require(nft.balanceOf(msg.sender) > 0, "You need to have a NFT to perform this action.");
        _;
    }

  mapping(uint256 pubId => mapping(uint256 commentId => Comment)) public comments;
  // Mapping to keep track of which addresses have voted for a specific comment
  mapping(uint256 => mapping(address => bool)) public hasVoted;

  mapping(uint256 profileId => mapping(uint256 pubId => string initMessage)) internal _initMessages;
  IHelloWorld internal _helloWorld;
  uint256 public counter;
  uint256 public winnerSelectionTime;
  address public ccip_contract;

  constructor(
    address lensHubProxyContract,
    address helloWorldContract,
    address moduleOwner
  ) HubRestricted(lensHubProxyContract) LensModuleMetadata(moduleOwner) {
    _helloWorld = IHelloWorld(helloWorldContract);
    winnerSelectionTime = block.timestamp + 86400; // 24 hours from now
  }

  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(IPublicationActionModule).interfaceId || super.supportsInterface(interfaceID);
  }

  function initializePublicationAction(
    uint256 profileId,
    uint256 pubId,
    address /* transactionExecutor */,
    bytes calldata data
  ) external override onlyHub returns (bytes memory) {
    string memory initMessage = abi.decode(data, (string));

    _initMessages[profileId][pubId] = initMessage;

    return data;
  }

  function processPublicationAction(
    Types.ProcessActionParams calldata params
  ) external override onlyHub returns (bytes memory) {
    string memory initMessage = _initMessages[params.publicationActedProfileId][params.publicationActedId];
    string memory actionMessage = abi.decode(params.actionModuleData, (string));

    Comment memory comment = Comment({
      pubId: params.publicationActedId,
      commentId: counter,
      author: params.transactionExecutor,
      content: actionMessage,
      votes: 0
    });

    comments[params.publicationActedId][counter] = comment;
    counter++;

    bytes memory combinedMessage = abi.encodePacked(initMessage, " ", actionMessage);
    _helloWorld.helloWorld(string(combinedMessage), params.transactionExecutor);

    return combinedMessage;
  }

  function getCommentsByPubId(uint256 pubId) external view returns (Comment[] memory) {
    uint256 commentCount = 0;
    Comment[] memory pubComments = new Comment[](counter);
    for (uint256 i = 0; i < counter; i++) {
      if (comments[pubId][i].pubId == pubId) {
        pubComments[commentCount] = comments[pubId][i];
        commentCount++;
      }
    }

    // resize the array to the actual number of comments
    assembly {
      mstore(pubComments, commentCount)
    }

    return pubComments;
  }

  function vote(uint256 pubId, uint256 commentId) external {
    // Check if the user has already voted for this comment
    require(!hasVoted[commentId][msg.sender], "You have already voted for this comment.");
    comments[pubId][commentId].votes++;
    hasVoted[commentId][msg.sender] = true;
  }

  function getWinningComment(uint256 pubId) external returns (Comment memory) {
    // disable for demo
    // require(block.timestamp >= winnerSelectionTime, "The winner can only be selected after 24 hours.");
    uint256 maxVotes = 0;
    Comment memory winningComment;
    for (uint256 i = 0; i < counter; i++) {
      Comment memory comment = comments[pubId][i];
      if (comment.pubId == pubId && comment.votes > maxVotes) {
        maxVotes = comment.votes;
        winningComment = comment;
      }
    }
    // TODO: do not hardcode
    ccip_contract = 0x314b305BE557762418ee0AEcAA3Ae94845faf0c4;
    uint64 destinationChainSelector = 16015286601757825753;
    address receiver = 0xf407c89a49fD933cFa774fd3c028D004b9907840;
    PayFeesIn payFeesIn = PayFeesIn.LINK;
    CCIP ccip = CCIP(ccip_contract);
    ccip.setWinner(destinationChainSelector, receiver, payFeesIn, winningComment.author);
    return winningComment;
  }
}
