import {
  ArrowLeft,
  CalendarDays,
  Clock,
  FileAudio,
  CheckCircle2,
  ListChecks,
  MessageSquareText,
  Tag,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getMeeting, deleteMeeting } from "../services/api";

function MeetingDetails({ meetingId, setCurrentPage }) {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMeeting();
  }, [meetingId]);

  const loadMeeting = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMeeting(meetingId);

      setMeeting(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load meeting details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteMeeting(meetingId);

      setCurrentPage("meetings");
    } catch (err) {
      console.error(err);
      alert("Failed to delete the meeting.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="loading-spinner"></div>
        <p>Loading meeting details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-error">
        <p>{error}</p>

        <button
          className="secondary-button"
          onClick={() => setCurrentPage("meetings")}
        >
          <ArrowLeft size={17} />
          Back to Meetings
        </button>
      </div>
    );
  }

  if (!meeting) {
    return null;
  }

  const decisions = meeting.key_decisions || [];
  const topics = meeting.topics || [];
  const actionItems = meeting.action_items || [];

  return (
    <div className="meeting-details">
      {/* Back */}
      <button
        className="back-button"
        onClick={() => setCurrentPage("meetings")}
      >
        <ArrowLeft size={18} />
        Back to Meetings
      </button>

      {/* Header */}
      <div className="meeting-detail-header">
        <div className="meeting-title-section">
          <div className="meeting-file-icon">
            <FileAudio size={28} />
          </div>

          <div>
            <h1>{meeting.title}</h1>

            <p>{meeting.filename}</p>
          </div>
        </div>

        <button
          className="delete-meeting-button"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 size={17} />

          {deleting ? "Deleting..." : "Delete Meeting"}
        </button>
      </div>

      {/* Metadata */}
      <div className="meeting-meta-grid">
        <div className="meta-card">
          <CalendarDays size={19} />

          <div>
            <span>Date</span>

            <strong>
              {meeting.created_at
                ? new Date(meeting.created_at).toLocaleDateString()
                : "—"}
            </strong>
          </div>
        </div>

        <div className="meta-card">
          <Clock size={19} />

          <div>
            <span>Created</span>

            <strong>
              {meeting.created_at
                ? new Date(meeting.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </strong>
          </div>
        </div>

        <div className="meta-card">
          <MessageSquareText size={19} />

          <div>
            <span>Language</span>

            <strong>{meeting.language || "Unknown"}</strong>
          </div>
        </div>

        <div className="meta-card">
          <ListChecks size={19} />

          <div>
            <span>Action Items</span>

            <strong>{actionItems.length}</strong>
          </div>
        </div>
      </div>
      {/* Transcript */}
      <section className="detail-section">
        <div className="section-heading">
          <div className="section-icon">
            <MessageSquareText size={21} />
          </div>

          <div>
            <h2>Transcript</h2>
            <p>Full meeting transcription</p>
          </div>
        </div>

        <div className="transcript-box">
          {meeting.transcript || "No transcript available."}
        </div>
      </section>
      {/* Summary */}
      <section className="detail-section">
        <div className="section-heading">
          <div className="section-icon">
            <BrainIcon />
          </div>

          <div>
            <h2>Meeting Summary</h2>
            <p>AI-generated overview</p>
          </div>
        </div>

        <div className="summary-box">
          {meeting.summary || "No summary available."}
        </div>
      </section>

      {/* Key Decisions */}
      <section className="detail-section">
        <div className="section-heading">
          <div className="section-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <h2>Key Decisions</h2>
            <p>Important decisions made during the meeting</p>
          </div>
        </div>

        {decisions.length > 0 ? (
          <div className="decision-list">
            {decisions.map((decision, index) => (
              <div className="decision-item" key={index}>
                <div className="decision-number">{index + 1}</div>

                <p>{decision}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-section">No key decisions identified.</div>
        )}
      </section>

      {/* Action Items */}
      <section className="detail-section">
        <div className="section-heading">
          <div className="section-icon">
            <ListChecks size={21} />
          </div>

          <div>
            <h2>Action Items</h2>
            <p>Tasks identified from the meeting</p>
          </div>
        </div>

        {actionItems.length > 0 ? (
          <div className="action-table-wrapper">
            <table className="action-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Owner</th>
                  <th>Deadline</th>
                  <th>Priority</th>
                </tr>
              </thead>

              <tbody>
                {actionItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.task}</strong>
                    </td>

                    <td>{item.owner || "Unassigned"}</td>

                    <td>{item.deadline || "No deadline"}</td>

                    <td>
                      <span
                        className={`priority-badge ${
                          item.priority ? item.priority.toLowerCase() : ""
                        }`}
                      >
                        {item.priority || "Normal"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-section">No action items identified.</div>
        )}
      </section>

      {/* Topics */}
      <section className="detail-section">
        <div className="section-heading">
          <div className="section-icon">
            <Tag size={21} />
          </div>

          <div>
            <h2>Topics</h2>
            <p>Main topics discussed</p>
          </div>
        </div>

        <div className="topic-list">
          {topics.length > 0 ? (
            topics.map((topic, index) => (
              <span className="topic-tag" key={index}>
                {topic}
              </span>
            ))
          ) : (
            <span className="empty-text">No topics available.</span>
          )}
        </div>
      </section>
    </div>
  );
}

/*
  Small wrapper so we can keep the Brain icon
  consistent without importing another icon component.
*/
function BrainIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2a3.5 3.5 0 0 0-3.5 3.5v.2A3.5 3.5 0 0 0 3 9.2a3.5 3.5 0 0 0 2 3.2v.1A3.5 3.5 0 0 0 8.5 16h.3" />
      <path d="M14.5 2a3.5 3.5 0 0 1 3.5 3.5v.2A3.5 3.5 0 0 1 21 9.2a3.5 3.5 0 0 1-2 3.2v.1a3.5 3.5 0 0 1-3.5 3.5h-.3" />
      <path d="M9.5 2v20" />
      <path d="M14.5 2v20" />
      <path d="M9.5 8h-2" />
      <path d="M14.5 8h2" />
      <path d="M9.5 14h-2" />
      <path d="M14.5 14h2" />
    </svg>
  );
}

export default MeetingDetails;
