import {
  LayoutDashboard,
  CalendarDays,
  Upload,
  Brain,
} from "lucide-react";

function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      page: "dashboard",
    },
    {
      name: "Meetings",
      icon: CalendarDays,
      page: "meetings",
    },
    {
      name: "Upload Meeting",
      icon: Upload,
      page: "upload",
    },
  ];

  const isActive = (page) => {
    if (page === "meetings") {
      return (
        currentPage === "meetings" ||
        currentPage.startsWith("meeting-")
      );
    }

    return currentPage === page;
  };

  return (
    <aside className="sidebar">

      {/* =====================================
          BRAND
      ====================================== */}

      <div className="sidebar-logo">

        <div className="logo-icon">
          <Brain size={21} strokeWidth={2.3} />
        </div>

        <div className="brand-text">
          <h2>MeetMind</h2>
          <span>Meeting Intelligence</span>
        </div>

      </div>


      {/* =====================================
          NAVIGATION
      ====================================== */}

      <nav className="sidebar-nav">

        <p className="nav-title">
          WORKSPACE
        </p>

        <div className="nav-items">

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.page);

            return (
              <button
                key={item.page}
                type="button"
                className={`nav-item ${
                  active ? "active" : ""
                }`}
                onClick={() =>
                  setCurrentPage(item.page)
                }
              >

                <span className="nav-icon">
                  <Icon
                    size={18}
                    strokeWidth={active ? 2.2 : 2}
                  />
                </span>

                <span className="nav-label">
                  {item.name}
                </span>

                {active && (
                  <span className="nav-active-indicator" />
                )}

              </button>
            );
          })}

        </div>

      </nav>


      {/* =====================================
          BOTTOM INFO
      ====================================== */}

      <div className="sidebar-bottom">

        <div className="sidebar-status">

          <span className="status-dot" />

          <span>AI Engine Ready</span>

        </div>

        <p>
          AI-powered meeting analysis
        </p>

        <span className="version">
          MeetMind · v1.0
        </span>

      </div>

    </aside>
  );
}

export default Sidebar;