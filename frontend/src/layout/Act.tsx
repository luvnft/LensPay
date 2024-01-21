/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublications } from "@lens-protocol/react-web";
import { useEffect, useState } from "react";
import { encodeAbiParameters, encodeFunctionData, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";
import { useLensHelloWorld } from "../context/LensHelloWorldContext";
import { publicClient } from "../main";
import { mode, uiConfig } from "../utils/constants";
import { fetchInitMessage } from "../utils/fetchInitMessage";
import { lensHubAbi } from "../utils/lensHubAbi";
import { serializeLink } from "../utils/serializeLink";
import { PostCreatedEventFormatted } from "../utils/types";
//import { ProfileId } from "@lens-protocol/metadata";
import { useContractRead } from 'wagmi'
import { writeContract } from "wagmi/actions";


const ActionBox = ({
  post,
  address,
  profileId,
  refresh,
}: {
  post: PostCreatedEventFormatted;
  address?: `0x${string}`;
  profileId?: number;
  refresh: () => void;
}) => {
  const [actionText, setActionText] = useState<string>("");
  const [createState, setCreateState] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const { data: walletClient } = useWalletClient();

  const [comments, setComments] = useState<any>([])

  useEffect(() => { 
    publicClient({
      chainId: 80001,
    }).readContract({
      abi: [{ "inputs": [{ "internalType": "address", "name": "lensHubProxyContract", "type": "address" }, { "internalType": "address", "name": "helloWorldContract", "type": "address" }, { "internalType": "address", "name": "moduleOwner", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "NotHub", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "HUB", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ccip_contract", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "uint256", "name": "commentId", "type": "uint256" }], "name": "comments", "outputs": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "uint256", "name": "commentId", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "counter", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }], "name": "getCommentsByPubId", "outputs": [{ "components": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "uint256", "name": "commentId", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }], "internalType": "struct HelloWorldOpenAction.Comment[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getModuleMetadataURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }], "name": "getWinningComment", "outputs": [{ "components": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "uint256", "name": "commentId", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }], "internalType": "struct HelloWorldOpenAction.Comment", "name": "", "type": "tuple" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }], "name": "hasVoted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "profileId", "type": "uint256" }, { "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "initializePublicationAction", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "metadataURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "uint256", "name": "publicationActedProfileId", "type": "uint256" }, { "internalType": "uint256", "name": "publicationActedId", "type": "uint256" }, { "internalType": "uint256", "name": "actorProfileId", "type": "uint256" }, { "internalType": "address", "name": "actorProfileOwner", "type": "address" }, { "internalType": "address", "name": "transactionExecutor", "type": "address" }, { "internalType": "uint256[]", "name": "referrerProfileIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "referrerPubIds", "type": "uint256[]" }, { "internalType": "enum Types.PublicationType[]", "name": "referrerPubTypes", "type": "uint8[]" }, { "internalType": "bytes", "name": "actionModuleData", "type": "bytes" }], "internalType": "struct Types.ProcessActionParams", "name": "params", "type": "tuple" }], "name": "processPublicationAction", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_metadataURI", "type": "string" }], "name": "setModuleMetadataURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceID", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "uint256", "name": "commentId", "type": "uint256" }], "name": "vote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "winnerSelectionTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }],
      address: '0xeE54f5bA1505839F139E29deaD51F7983D70bD87',
      functionName: 'getCommentsByPubId' as never,
      args: [Number(post.args.pubId)],
    }).then((result) => {
      console.log({ result })
      setComments(result)
    }).catch((error) => {
      console.log({ error })
    })
  }, [])

  const voteForComment = async (comment: any) => {
    writeContract({
      abi: [{ "inputs": [{ "internalType": "address", "name": "lensHubProxyContract", "type": "address" }, { "internalType": "address", "name": "helloWorldContract", "type": "address" }, { "internalType": "address", "name": "moduleOwner", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "NotHub", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "HUB", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ccip_contract", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "uint256", "name": "commentId", "type": "uint256" }], "name": "comments", "outputs": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "uint256", "name": "commentId", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "counter", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }], "name": "getCommentsByPubId", "outputs": [{ "components": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "uint256", "name": "commentId", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }], "internalType": "struct HelloWorldOpenAction.Comment[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getModuleMetadataURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }], "name": "getWinningComment", "outputs": [{ "components": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "uint256", "name": "commentId", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }], "internalType": "struct HelloWorldOpenAction.Comment", "name": "", "type": "tuple" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }], "name": "hasVoted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "profileId", "type": "uint256" }, { "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "initializePublicationAction", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "metadataURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "uint256", "name": "publicationActedProfileId", "type": "uint256" }, { "internalType": "uint256", "name": "publicationActedId", "type": "uint256" }, { "internalType": "uint256", "name": "actorProfileId", "type": "uint256" }, { "internalType": "address", "name": "actorProfileOwner", "type": "address" }, { "internalType": "address", "name": "transactionExecutor", "type": "address" }, { "internalType": "uint256[]", "name": "referrerProfileIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "referrerPubIds", "type": "uint256[]" }, { "internalType": "enum Types.PublicationType[]", "name": "referrerPubTypes", "type": "uint8[]" }, { "internalType": "bytes", "name": "actionModuleData", "type": "bytes" }], "internalType": "struct Types.ProcessActionParams", "name": "params", "type": "tuple" }], "name": "processPublicationAction", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_metadataURI", "type": "string" }], "name": "setModuleMetadataURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceID", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "pubId", "type": "uint256" }, { "internalType": "uint256", "name": "commentId", "type": "uint256" }], "name": "vote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "winnerSelectionTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }],
      functionName: 'vote' as never,
      address: '0xeE54f5bA1505839F139E29deaD51F7983D70bD87',
      args: [Number(post.args.pubId), Number(comment.commentId)],
    }).then((result) => {
      console.log({ result })
    }).catch((error) => {
      console.log({ error })
    }) 
  }

  const executeHelloWorld = async (
    post: PostCreatedEventFormatted,
    actionText: string
  ) => {
    const encodedActionData = encodeAbiParameters(
      [{ type: "string" }],
      [actionText]
    );

    const args = {
      publicationActedProfileId: BigInt(post.args.postParams.profileId || 0),
      publicationActedId: BigInt(post.args.pubId),
      actorProfileId: BigInt(profileId || 0),
      referrerProfileIds: [],
      referrerPubIds: [],
      actionModuleAddress: uiConfig.openActionContractAddress,
      actionModuleData: encodedActionData as `0x${string}`,
    };

    const calldata = encodeFunctionData({
      abi: lensHubAbi,
      functionName: "act",
      args: [args],
    });

    console.log({ actionText, post, encodedActionData, args, calldata });

    setCreateState("PENDING IN WALLET");
    try {
      const hash = await walletClient!.sendTransaction({
        to: uiConfig.lensHubProxyAddress,
        account: address,
        data: calldata as `0x${string}`,
      });
      setCreateState("PENDING IN MEMPOOL");
      setTxHash(hash);
      const result = await publicClient({
        chainId: 80001,
      }).waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        setCreateState("SUCCESS");
        refresh();
      } else {
        setCreateState("CREATE TXN REVERTED");
      }
    } catch (e) {
      setCreateState(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const executeCollect = async (post: PostCreatedEventFormatted) => {
    const baseFeeCollectModuleTypes = [
      { type: "address" },
      { type: "uint256" },
    ];

    const encodedBaseFeeCollectModuleInitData = encodeAbiParameters(
      baseFeeCollectModuleTypes,
      [zeroAddress, 0]
    );

    const encodedCollectActionData = encodeAbiParameters(
      [{ type: "address" }, { type: "bytes" }],
      [address!, encodedBaseFeeCollectModuleInitData]
    );

    const args = {
      publicationActedProfileId: BigInt(post.args.postParams.profileId || 0),
      publicationActedId: BigInt(post.args.pubId),
      actorProfileId: BigInt(profileId || 0),
      referrerProfileIds: [],
      referrerPubIds: [],
      actionModuleAddress: uiConfig.collectActionContractAddress,
      actionModuleData: encodedCollectActionData as `0x${string}`,
    };

    const calldata = encodeFunctionData({
      abi: lensHubAbi,
      functionName: "act",
      args: [args],
    });

    setCreateState("PENDING IN WALLET");
    try {
      const hash = await walletClient!.sendTransaction({
        to: uiConfig.lensHubProxyAddress,
        account: address,
        data: calldata as `0x${string}`,
      });
      setCreateState("PENDING IN MEMPOOL");
      setTxHash(hash);
      const result = await publicClient({
        chainId: 80001,
      }).waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        setCreateState("SUCCESS");
        refresh();
      } else {
        setCreateState("CREATE TXN REVERTED");
      }
    } catch (e) {
      setCreateState(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="flex flex-col border rounded-xl px-5 py-3 mb-3 justify-center">
      <div className="flex flex-col justify-center items-center">
        <p>ProfileID: {post.args.postParams.profileId}</p>
        <p>PublicationID: {post.args.pubId}</p>
        <p>Initialize Message: {fetchInitMessage(post)}</p>
        <img
          className="my-3 rounded-2xl"
          style={{ maxWidth: 430 }}
          src={serializeLink(post.args.postParams.contentURI)}
          alt="Post"
        />
        <Button asChild variant="link">
          <a
            href={`${uiConfig.blockExplorerLink}${post.transactionHash}`}
            target="_blank">
            Txn Link
          </a>
        </Button>
      </div>
      <div>
        <p className="mb-3">
          Post a Comment to this Post
        </p>
        <Input
          id={`initializeTextId-${post.args.pubId}`}
          type="text"
          value={actionText}
          onChange={(e) => setActionText(e.target.value)}
          disabled={!profileId}
        />
      </div>
      {profileId && (
        <Button
          className="mt-3"
          onClick={() => executeHelloWorld(post, actionText)}>
          Post Comment
        </Button>
      )}
      {profileId &&
        post.args.postParams.actionModules.includes(
          uiConfig.collectActionContractAddress
        ) && (
          <Button className="mt-3" onClick={() => executeCollect(post)}>
            Collect Post
          </Button>
        )}
      {createState && (
        <p className="mt-2 text-primary create-state-text">{createState}</p>
      )}
      {txHash && (
        <a
          href={`${uiConfig.blockExplorerLink}${txHash}`}
          target="_blank"
          className="block-explorer-link">
          Block Explorer Link
        </a>
      )}

      {comments.map((comment: any, index: number) => (
        <div key={index} className="flex flex-col border rounded-xl p-5 m-5 justify-center">
          <p>Author: {comment.author}</p>
          <p>Content: {comment.content}</p>
          <p>Votes: {parseInt(comment.votes, 10)}</p>
          <Button className="mt-3" onClick={() => voteForComment(comment)}>
            Vote
          </Button>
        </div>
      ))}
    </div>
  );
};

export const Actions = () => {
  const [filterOwnPosts, setFilterOwnPosts] = useState(false);
  const { address, profileId, posts, refresh, loading } = useLensHelloWorld();
  //const profileIdString = profileId ? "0x" + profileId.toString(16) : "0x0";
  const { data } = usePublications({
    where: {
      //from: [profileIdString as ProfileId],
      withOpenActions: [{ address: uiConfig.helloWorldContractAddress }],
    },
  });
  console.log(data);
  const activePosts = mode === "api" ? [] : posts;

  let filteredPosts = filterOwnPosts
    ? activePosts.filter(
      (post) => post.args.postParams.profileId === profileId?.toString()
    )
    : activePosts;

  filteredPosts = filteredPosts.sort((a, b) => {
    const blockNumberA = parseInt(a.blockNumber, 10);
    const blockNumberB = parseInt(b.blockNumber, 10);
    return blockNumberB - blockNumberA;
  });

  return (
    <>
      {address && profileId && (
        <div className="my-3">
          <input
            type="checkbox"
            id="filterCheckbox"
            className="mr-3"
            checked={filterOwnPosts}
            onChange={(e) => setFilterOwnPosts(e.target.checked)}
          />
          <label htmlFor="filterCheckbox">
            Filter only posts from my profile
          </label>
        </div>
      )}
      {loading && (
        <span className="flex items-center gap-x-2">
          Retrieving Posts... <div className="spinner" />
        </span>
      )}
      {!loading && filteredPosts.length === 0 ? (
        <p>No Posts found</p>
      ) : (
        filteredPosts.map((post, index) => (
          <ActionBox
            key={index}
            post={post}
            address={address}
            profileId={profileId}
            refresh={refresh}
          />
        ))
      )}
    </>
  );
};
