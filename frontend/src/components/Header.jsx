import {
  Bell,
  Sparkles,
} from "lucide-react";

function Header({ title, description }) {
  return (
    <header className="header">

      {/* =====================================
          PAGE INFORMATION
      ====================================== */}

      <div className="header-content">

        <div className="header-title-row">

          <h1>{title}</h1>

          <span className="header-badge">
            <Sparkles size={12} />
            AI Workspace
          </span>

        </div>

        {description && (
          <p>{description}</p>
        )}

      </div>


      {/* =====================================
          HEADER ACTIONS
      ====================================== */}

      <div className="header-actions">

        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="header-avatar">
          M
        </div>

      </div>

    </header>
  );
}

export default Header;