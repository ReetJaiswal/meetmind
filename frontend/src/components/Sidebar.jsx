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

  return (
    <aside className="sidebar">
      
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Brain size={22} />
        </div>

        <div>
          <h2>MeetMind</h2>
          <span>Meeting Intelligence</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="nav-title">
          WORKSPACE
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.page}
              className={`nav-item ${
                currentPage === item.page
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage(item.page)
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}

      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <p>AI-powered meeting analysis</p>
        <span>MeetMind v1.0</span>
      </div>

    </aside>
  );
}

export default Sidebar;