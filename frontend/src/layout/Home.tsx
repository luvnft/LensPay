/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "../styles/Action.css";
import { useLogin, useProfiles } from "@lens-protocol/react-web";
import { Actions } from "./Act";
import { Events } from "./Events";
import { useLensHelloWorld } from "../context/LensHelloWorldContext";
import { Create } from "./Create";
import { useEffect, useState } from "react";
import { LoginData } from "../utils/types";
import { Button } from "@/components/ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PenLine, Rows, Activity, LogIn } from "lucide-react";
import { network } from "@/utils/constants";
import { ConnectKitButton } from 'connectkit'

export const Home = () => {
  const [activeSection, setActiveSection] = useState<string>("create");
  const { address, handle, connect, disconnect } = useLensHelloWorld();
  const { open } = useWeb3Modal();
  const { execute: executeLogin, data: loginData } = useLogin();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(true);
  }, []);

  useEffect(() => {
    if (loginData) {
      connect(loginData as LoginData);
    }
  }, [connect, loginData]);

  async function logIn({ address, profileId }) {
    try {
      await executeLogin({ address, profileId });
      if (!loginData) return;
      connect({ ...loginData } as LoginData);
    } catch (err) {
      console.log("err: ", err);
    }
  }

  if (!connected) return null;
  return (
    <Profiles
      address={address}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      handle={handle}
      executeLogin={logIn}
      open={open}
      disconnect={disconnect}
    />
  );
};

function Profiles({
  address,
  activeSection,
  setActiveSection,
  handle,
  executeLogin,
  // @ts-ignore
  open,
  // @ts-ignore
  disconnect,
}) {
  const { data: profiles } = useProfiles({
    where: {
      ownedBy: [address || "0x0000000000000000000000000000000000000000"],
    },
  });

  const showNoLensProfiles =
    address && !handle && profiles && profiles.length === 0;
  const showSignInWithLens =
    address && !handle && profiles && profiles.length > 0;

  return (
    <div className="flex flex-1 justify-center items-center flex-col">
      <div className="mt-20">
        <h1 className="text-5xl font-geist-black">GHO VOTE</h1>
      </div>
      <div className="mt-6 mb-6">
        <Button
          variant={activeSection === "create" ? "default" : "secondary"}
          onClick={() => setActiveSection("create")}
          className="px-10 mx-2"
        >
          <PenLine className="mr-2 h-4 w-4" />
          GHO POST
        </Button>
        <Button
          variant={activeSection === "actions" ? "default" : "secondary"}
          onClick={() => setActiveSection("actions")}
          className="px-10 mx-2"
        >
          <Rows className="mr-2 h-4 w-4" />
          VIEW POSTS
        </Button>
        <Button
          variant={activeSection === "events" ? "default" : "secondary"}
          onClick={() => setActiveSection("events")}
          className="px-10 mx-2"
        >
          <Activity className="mr-2 h-4 w-4" />
          EVENTS
        </Button>
      </div>
      <Button
        variant="outline"
        className="my-4 p-0"
        onClick={() => {
          // if (address) disconnect();
          // else open();
        }}
      >
        <ConnectKitButton />

      </Button>
      {showNoLensProfiles && <p>No Lens Profiles found for this address</p>}
      {showNoLensProfiles && network === "mumbai" && (
        <p>
          Create test profile @{" "}
          <a href="https://testnet.hey.xyz/" target="_blank">
            https://testnet.hey.xyz/
          </a>
        </p>
      )}
      {showSignInWithLens && (
        <Button
          variant="outline"
          className="my-4"
          onClick={() => executeLogin({ address, profileId: profiles[0].id })}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign in with {profiles[0].handle?.localName}.lens
        </Button>
      )}
      {activeSection === "create" && <Create />}
      {activeSection === "actions" && <Actions />}
      {activeSection === "events" && <Events />}
    </div>
  );
}
