import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Upload,
  ArrowRight,
  Clock3,
  FileAudio,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { getMeetings } from "../services/api";

function Dashboard({ setCurrentPage }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMeetings();
      setMeetings(data.meetings || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load meeting data.");
    } finally {
      setLoading(false);
    }
  };

  const totalMeetings = meetings.length;

  const totalActionItems = meetings.reduce(
    (total, meeting) =>
      total + (meeting.action_items?.length || 0),
    0
  );

  const totalDecisions = meetings.reduce(
    (total, meeting) =>
      total + (meeting.key_decisions?.length || 0),
    0
  );

  const recentMeetings = meetings.slice(0, 5);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard">

      {/* HERO */}

      <section className="dashboard-hero">

        <div className="dashboard-hero-content">

          <div className="dashboard-eyebrow">
            <Sparkles size={14} />
            AI MEETING INTELLIGENCE
          </div>

          <h1>
            Welcome back to
            <span> MeetMind</span>
          </h1>

          <p>
            Turn your meeting recordings into clear transcripts,
            summaries, decisions and actionable next steps.
          </p>

          <button
            className="hero-upload-button"
            onClick={() => setCurrentPage("upload")}
          >
            <Upload size={17} />
            Analyze New Meeting
            <ArrowRight size={16} />
          </button>

        </div>

        <div className="dashboard-hero-visual">
          <div className="hero-glow"></div>

          <div className="hero-floating-card hero-card-one">
            <FileAudio size={18} />
            <div>
              <strong>Audio</strong>
              <span>Processed</span>
            </div>
          </div>

          <div className="hero-floating-card hero-card-two">
            <CheckCircle2 size={18} />
            <div>
              <strong>Insights</strong>
              <span>Generated</span>
            </div>
          </div>

          <div className="hero-brain">
            <Sparkles size={38} />
          </div>
        </div>

      </section>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* STATS */}

      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="stat-top">
            <div className="stat-icon purple">
              <CalendarDays size={20} />
            </div>

            <span className="stat-trend">
              <TrendingUp size={13} />
              Activity
            </span>
          </div>

          <span className="stat-label">
            Total Meetings
          </span>

          <strong className="stat-value">
            {loading ? "—" : totalMeetings}
          </strong>

          <span className="stat-description">
            Meetings analyzed with MeetMind
          </span>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-top">
            <div className="stat-icon green">
              <CheckCircle2 size={20} />
            </div>

            <span className="stat-trend">
              AI Extracted
            </span>
          </div>

          <span className="stat-label">
            Key Decisions
          </span>

          <strong className="stat-value">
            {loading ? "—" : totalDecisions}
          </strong>

          <span className="stat-description">
            Important decisions identified
          </span>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-top">
            <div className="stat-icon orange">
              <Clock3 size={20} />
            </div>

            <span className="stat-trend">
              To Do
            </span>
          </div>

          <span className="stat-label">
            Action Items
          </span>

          <strong className="stat-value">
            {loading ? "—" : totalActionItems}
          </strong>

          <span className="stat-description">
            Tasks extracted from meetings
          </span>
        </div>

      </section>

      {/* QUICK ACTION */}

      <section className="dashboard-section-header">
        <div>
          <h2>Workspace</h2>
          <p>
            Manage your meeting intelligence from one place.
          </p>
        </div>
      </section>

      <section className="dashboard-action-card">

        <div className="dashboard-action-icon">
          <Upload size={25} />
        </div>

        <div className="dashboard-action-content">
          <span className="action-kicker">
            QUICK ACTION
          </span>

          <h3>
            Analyze a new meeting
          </h3>

          <p>
            Upload an audio recording and let MeetMind
            automatically transcribe and extract insights.
          </p>
        </div>

        <button
          className="dashboard-action-button"
          onClick={() => setCurrentPage("upload")}
        >
          Upload Meeting
          <ArrowRight size={16} />
        </button>

      </section>

      {/* RECENT MEETINGS */}

      <section className="recent-meetings-section">

        <div className="recent-header">

          <div>
            <h2>Recent Meetings</h2>
            <p>
              Your latest analyzed conversations
            </p>
          </div>

          <button
            className="view-all-button"
            onClick={() => setCurrentPage("meetings")}
          >
            View All
            <ArrowRight size={16} />
          </button>

        </div>

        <div className="recent-meetings-card">

          {loading ? (

            <div className="loading">
              Loading meetings...
            </div>

          ) : recentMeetings.length === 0 ? (

            <div className="dashboard-empty">

              <div className="dashboard-empty-icon">
                <CalendarDays size={26} />
              </div>

              <h3>No meetings yet</h3>

              <p>
                Upload your first meeting recording
                to start generating insights.
              </p>

              <button
                className="primary-button"
                onClick={() => setCurrentPage("upload")}
              >
                <Upload size={15} />
                Upload Meeting
              </button>

            </div>

          ) : (

            <div className="recent-meeting-list">

              {recentMeetings.map((meeting, index) => (

                <div
                  className="recent-meeting-row"
                  key={meeting.id}
                >

                  <div className="recent-meeting-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="recent-meeting-icon">
                    <FileAudio size={19} />
                  </div>

                  <div className="recent-meeting-info">

                    <h3>
                      {meeting.title || meeting.filename}
                    </h3>

                    <div className="recent-meeting-meta">
                      <span>
                        {formatDate(meeting.created_at)}
                      </span>

                      <span>•</span>

                      <span>
                        {meeting.language
                          ? meeting.language.toUpperCase()
                          : "UNKNOWN"}
                      </span>
                    </div>

                  </div>

                  <button
                    className="recent-view-button"
                    onClick={() =>
                      setCurrentPage(
                        `meeting-${meeting.id}`
                      )
                    }
                  >
                    View Details
                    <ArrowRight size={15} />
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;