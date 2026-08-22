import {
  CalendarDays,
  Clock,
  FileAudio,
  ArrowRight,
  Trash2,
  Search,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getMeetings,
  deleteMeeting,
} from "../services/api";

function Meetings({ setCurrentPage }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);

      const data = await getMeetings();

      setMeetings(data.meetings || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (meetingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmed) return;

    try {
      await deleteMeeting(meetingId);

      setMeetings((current) =>
        current.filter(
          (meeting) => meeting.id !== meetingId
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete meeting.");
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const query = search.toLowerCase();

    return (
      meeting.title?.toLowerCase().includes(query) ||
      meeting.filename?.toLowerCase().includes(query) ||
      meeting.summary?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="meetings-loading">
        <div className="loading-spinner"></div>
        <p>Loading meetings...</p>
      </div>
    );
  }

  return (
    <div className="meetings-page">

      {/* HEADER */}

      <div className="meetings-page-header">

        <div>

          <div className="meetings-eyebrow">
            <Sparkles size={13} />
            MEETING LIBRARY
          </div>

          <h1>Your Meetings</h1>

          <p>
            Review, analyze and manage all your
            AI-processed meetings.
          </p>

        </div>

        <button
          className="meetings-upload-button"
          onClick={() => setCurrentPage("upload")}
        >
          <FileAudio size={17} />
          Upload Meeting
          <ArrowRight size={15} />
        </button>

      </div>

      {/* TOOLBAR */}

      {meetings.length > 0 && (

        <div className="meetings-toolbar-new">

          <div className="meeting-library-count">
            <strong>{meetings.length}</strong>

            <span>
              {meetings.length === 1
                ? "meeting"
                : "meetings"}
            </span>
          </div>

          <div className="meeting-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </div>

      )}

      {/* EMPTY */}

      {meetings.length === 0 ? (

        <div className="meetings-empty-new">

          <div className="meetings-empty-icon">
            <FileAudio size={30} />
          </div>

          <span className="empty-kicker">
            YOUR LIBRARY IS EMPTY
          </span>

          <h2>
            No meetings yet
          </h2>

          <p>
            Upload your first meeting recording and
            MeetMind will turn it into useful,
            searchable intelligence.
          </p>

          <button
            className="primary-meeting-button"
            onClick={() =>
              setCurrentPage("upload")
            }
          >
            Upload Your First Meeting
            <ArrowRight size={17} />
          </button>

        </div>

      ) : filteredMeetings.length === 0 ? (

        <div className="meetings-empty-new compact">

          <Search size={28} />

          <h2>No meetings found</h2>

          <p>
            Try searching with a different keyword.
          </p>

        </div>

      ) : (

        <div className="meetings-list-new">

          {filteredMeetings.map((meeting, index) => (

            <div
              className="meeting-card-new"
              key={meeting.id}
            >

              {/* NUMBER */}

              <div className="meeting-index">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* ICON */}

              <div className="meeting-card-icon-new">
                <FileAudio size={22} />
              </div>

              {/* CONTENT */}

              <div className="meeting-card-content">

                <div className="meeting-card-heading">

                  <h3>
                    {meeting.title ||
                      "Untitled Meeting"}
                  </h3>

                  {meeting.language && (
                    <span className="meeting-language">
                      {meeting.language.toUpperCase()}
                    </span>
                  )}

                </div>

                <p className="meeting-filename-new">
                  {meeting.filename}
                </p>

                <div className="meeting-card-meta-new">

                  <span>
                    <CalendarDays size={14} />
                    {meeting.created_at
                      ? new Date(
                          meeting.created_at
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Unknown date"}
                  </span>

                  <span>
                    <Clock size={14} />
                    {meeting.created_at
                      ? new Date(
                          meeting.created_at
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>

                </div>

              </div>

              {/* SUMMARY */}

              <div className="meeting-summary-new">

                <span>AI SUMMARY</span>

                <p>
                  {meeting.summary ||
                    "No summary available for this meeting."}
                </p>

              </div>

              {/* ACTIONS */}

              <div className="meeting-actions-new">

                <button
                  className="view-meeting-button-new"
                  onClick={() =>
                    setCurrentPage(
                      `meeting-${meeting.id}`
                    )
                  }
                >
                  View Meeting
                  <ArrowRight size={16} />
                </button>

                <button
                  className="delete-meeting-icon-button"
                  title="Delete meeting"
                  onClick={() =>
                    handleDelete(meeting.id)
                  }
                >
                  <Trash2 size={17} />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Meetings;