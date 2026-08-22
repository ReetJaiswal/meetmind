import { Bell } from "lucide-react";

function Header({ title, description }) {
  return (
    <header className="header">

      <div>
        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>

      <button className="notification-button">
        <Bell size={20} />
      </button>

    </header>
  );
}

export default Header;