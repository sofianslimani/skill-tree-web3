import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Loader from "./components/Loader/Loader";
import SkillTree from "./contracts/SkillTree.json";

export interface MetamaskContextType {
  account: string | null;
  contract: ethers.Contract;
}

export const MetamaskContext = createContext<MetamaskContextType | null>(null);

function App(): JSX.Element {
  const [context, setContext] = useState<MetamaskContextType | null>(null);

  const initWeb3 = async (): Promise<void> => {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractABI = SkillTree.abi;

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = await new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const test = await contract.getUserSkills;
      console.log(test);

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

  return (
    <MetamaskContext.Provider value={context}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </MetamaskContext.Provider>
  );
}

export default App;
