import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Ssgoi,SsgoiTransition } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";

import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./components/MainPage";
import { Guide, Account, Database, Deployment, Encryption, Logging, Monitoring, Network, Storage } from "./components/Guide";
import { AdminPage } from "./components/Admin";

import Checklist from "./components/Checklist";
import Prowler from "./components/Prowler";
// import Prowler from "./components/Prowler";

const config = {
  defaultTransition: fade()
};

function AppContent() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <div className={isMainPage ? "" : "min-h-screen flex flex-col pt-16"}>
      {!isMainPage && <Header />}
      <Ssgoi config={config}>
        <main className={isMainPage ? "" : "flex-1 p-6"} style={isMainPage ? {} : { position: "relative" }}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/guide" element={<Guide />}>
              <Route path="account" element={<Account />} />
              <Route path="compute" element={<Database/>} />
              <Route path="storage" element={<Storage />} />
              <Route path="network" element={<Network />} />
              <Route path="logging" element={<Logging />} />
              <Route path="monitoring" element={<Monitoring />} />
              <Route path="deployment" element={<Deployment />} />
              <Route path="encryption" element={<Encryption />} />
            </Route>  
            <Route path="/prowler" element={<Prowler />} />
            <Route path="/checklist" element={
              <SsgoiTransition id="checklist">
                <Checklist />
              </SsgoiTransition>
              }/>
            <Route path="/admin/*" element={<AdminPage />} />
            </Routes>
        </main>
      </Ssgoi>
      {!isMainPage && <Footer onDemoClick={() => setShowDemoModal(true)} />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;