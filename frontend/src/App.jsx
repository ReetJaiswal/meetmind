import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import MeetingDetails from "./pages/MeetingDetails";
import UploadMeeting from "./pages/UploadMeeting";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  // -----------------------------------------
  // Render current page
  // -----------------------------------------

  const renderPage = () => {
    // Meeting details
    if (currentPage.startsWith("meeting-")) {
      const meetingId = currentPage.replace("meeting-", "");

      return (
        <MeetingDetails
          meetingId={meetingId}
          setCurrentPage={setCurrentPage}
        />
      );
    }

    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            setCurrentPage={setCurrentPage}
          />
        );

      case "meetings":
        return (
          <Meetings
            setCurrentPage={setCurrentPage}
          />
        );

      case "upload":
        return (
          <UploadMeeting
            setCurrentPage={setCurrentPage}
          />
        );

      default:
        return (
          <Dashboard
            setCurrentPage={setCurrentPage}
          />
        );
    }
  };

  // -----------------------------------------
  // Page title
  // -----------------------------------------

  const getPageTitle = () => {
    switch (true) {
      case currentPage === "dashboard":
        return "Dashboard";

      case currentPage === "meetings":
        return "Meetings";

      case currentPage === "upload":
        return "Upload Meeting";

      case currentPage.startsWith("meeting-"):
        return "Meeting Details";

      default:
        return "MeetMind";
    }
  };

  // -----------------------------------------
  // Page description
  // -----------------------------------------

  const getPageDescription = () => {
    switch (true) {
      case currentPage === "dashboard":
        return "Your meeting intelligence overview";

      case currentPage === "meetings":
        return "Browse and manage your analyzed meetings";

      case currentPage === "upload":
        return "Upload an audio recording for AI-powered analysis";

      case currentPage.startsWith("meeting-"):
        return "View meeting insights and action items";

      default:
        return "";
    }
  };

  return (
    <div className="app">

      {/* ================================
          SIDEBAR
      ================================= */}

      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* ================================
          MAIN APPLICATION
      ================================= */}

      <main className="main-content">

        {/* Top header */}
        <Header
          title={getPageTitle()}
          description={getPageDescription()}
        />

        {/* Page content */}
        <section className="page-content">

          <div
            key={currentPage}
            className="page-transition"
          >
            {renderPage()}
          </div>

        </section>

      </main>

    </div>
  );
}

export default App;