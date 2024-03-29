import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Navbar from "./components/Navbar/Navbar";
import Loader from "./components/Loader/Loader";
import SkillTree from "./contracts/SkillTree.json";
import { MetamaskContextType } from "./types/metamask";
import SkillTreeContract from "./types/contract";

export const MetamaskContext = createContext<MetamaskContextType | null>(null);

function App(): JSX.Element {
  const [context, setContext] = useState<MetamaskContextType | null>(null);

  const initWeb3 = async (): Promise<void> => {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });

    const contractAddress = "0xD6A860D036284D917bB852bdDd48f296C6BDa6D2";
    const contractABI = SkillTree.abi;

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = (await new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )) as SkillTreeContract;

      console.log({ accounts });

      setContext({
        account: accounts[0],
        contract,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!context) {
      initWeb3().then(() => {
        console.log("Web3 initialized!");
      });
    }
  }, [context]);

  if (!context) {
    return <Loader />;
  }

  type Params = {
    address: string;
  };

  return (
    <MetamaskContext.Provider value={context}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/profile/:address"
            element={<ProfilePage isOwnProfile={false} />}
          />
        </Routes>
      </Router>
    </MetamaskContext.Provider>
  );
}

export default App;
