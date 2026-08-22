import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";


function App() {

  const [currentPage, setCurrentPage] =
    useState("dashboard");


  const renderPage = () => {

    switch (currentPage) {

      case "dashboard":
        return <Dashboard />;

      default:
        return <Dashboard />;

    }

  };


  return (

    <div className="app">

      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />


      <main className="main-content">

        <Header
          title="Dashboard"
          description="Your meeting intelligence overview"
        />

        <div className="page-content">

          {renderPage()}

        </div>

      </main>

    </div>

  );
}

export default App;