import { useRef, useState } from "react";
import {
  UploadCloud,
  FileAudio,
  X,
  Sparkles,
  Mic2,
  FileText,
  Brain,
  Lightbulb,
  Database,
  CheckCircle2,
} from "lucide-react";

import { analyzeMeeting } from "../services/api";

function UploadMeeting({ setCurrentPage }) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const allowedExtensions = [
    ".mp3",
    ".wav",
    ".m4a",
    ".mp4",
    ".webm",
  ];

  // -----------------------------------------
  // Validate file
  // -----------------------------------------

  const validateFile = (file) => {
    if (!file) return false;

    const extension =
      "." + file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError(
        "Unsupported file format. Please upload MP3, WAV, M4A, MP4 or WEBM."
      );
      return false;
    }

    setError("");
    return true;
  };

  // -----------------------------------------
  // Select file
  // -----------------------------------------

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setError("");
      setStatus("");
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  // -----------------------------------------
  // Drag & Drop
  // -----------------------------------------

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  // -----------------------------------------
  // Analyze
  // -----------------------------------------

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a meeting recording first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      setStatus("Uploading meeting...");

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setStatus("Transcribing audio...");

      const result = await analyzeMeeting(selectedFile);

      setStatus("Generating meeting intelligence...");

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setStatus("Meeting analyzed successfully.");

      setTimeout(() => {
        setCurrentPage(
          `meeting-${result.meeting_id}`
        );
      }, 700);

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to analyze meeting."
      );

      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Remove file
  // -----------------------------------------

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError("");
    setStatus("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="upload-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="upload-page-header">

        <div>
          <div className="upload-eyebrow">
            <Sparkles size={13} />
            AI MEETING ANALYSIS
          </div>

          <h1>Analyze a meeting</h1>

          <p>
            Upload a meeting recording and let MeetMind
            transform it into a clear transcript,
            summary, decisions and action items.
          </p>
        </div>

      </div>


      {/* =====================================
          MAIN UPLOAD AREA
      ====================================== */}

      <div className="upload-main-card">

        {!selectedFile ? (

          <div
            className={`upload-dropzone ${
              dragging ? "dragging" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              fileInputRef.current?.click()
            }
          >

            <div className="upload-main-icon">
              <UploadCloud
                size={34}
                strokeWidth={1.8}
              />
            </div>

            <h2>
              Drop your meeting recording here
            </h2>

            <p>
              Drag and drop your file here, or{" "}
              <span>browse from your computer</span>
            </p>

            <div className="upload-supported">

              <span>MP3</span>
              <span>WAV</span>
              <span>M4A</span>
              <span>MP4</span>
              <span>WEBM</span>

            </div>

            <small>
              Audio and video meeting recordings supported
            </small>

            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.mp4,.webm"
              onChange={handleInputChange}
              hidden
            />

          </div>

        ) : (

          /* =================================
             SELECTED FILE
          ================================= */

          <div className="selected-file-section">

            <div className="selected-file-card">

              <div className="selected-file-left">

                <div className="selected-file-icon">
                  <FileAudio size={25} />
                </div>

                <div className="file-info">

                  <span className="file-label">
                    SELECTED RECORDING
                  </span>

                  <h3>
                    {selectedFile.name}
                  </h3>

                  <p>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)}
                    {" MB"}
                  </p>

                </div>

              </div>

              {!loading && (
                <button
                  type="button"
                  className="remove-file"
                  onClick={handleRemoveFile}
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              )}

            </div>

            <div className="ready-message">

              <CheckCircle2 size={18} />

              <div>
                <strong>
                  Your recording is ready
                </strong>

                <span>
                  Click "Analyze Meeting" to start processing.
                </span>
              </div>

            </div>

          </div>

        )}

        {/* =================================
            ERROR
        ================================= */}

        {error && (
          <div className="upload-error">
            <X size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* =================================
            STATUS
        ================================= */}

        {status && (
          <div className="upload-status">

            {loading && (
              <div className="status-spinner">
                <Sparkles size={16} />
              </div>
            )}

            <span>{status}</span>

          </div>
        )}

        {/* =================================
            ACTIONS
        ================================= */}

        <div className="upload-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setCurrentPage("dashboard")
            }
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="primary-button analyze-button"
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <>
                <span className="button-spinner" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyze Meeting
              </>
            )}
          </button>

        </div>

      </div>


      {/* =====================================
          HOW IT WORKS
      ====================================== */}

      <div className="upload-process">

        <div className="upload-process-header">

          <div>
            <span>HOW IT WORKS</span>

            <h2>
              From recording to intelligence
            </h2>

            <p>
              MeetMind automatically processes your
              meeting through each stage.
            </p>
          </div>

        </div>

        <div className="pipeline-steps">

          <div className="pipeline-step">

            <div className="pipeline-icon">
              <Mic2 size={19} />
            </div>

            <div>
              <strong>Recording</strong>
              <span>Your meeting audio</span>
            </div>

          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">

            <div className="pipeline-icon">
              <FileText size={19} />
            </div>

            <div>
              <strong>Transcription</strong>
              <span>Whisper converts speech</span>
            </div>

          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">

            <div className="pipeline-icon">
              <Brain size={19} />
            </div>

            <div>
              <strong>AI Analysis</strong>
              <span>Qwen3 understands context</span>
            </div>

          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">

            <div className="pipeline-icon">
              <Lightbulb size={19} />
            </div>

            <div>
              <strong>Insights</strong>
              <span>Decisions & actions</span>
            </div>

          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step">

            <div className="pipeline-icon">
              <Database size={19} />
            </div>

            <div>
              <strong>Saved</strong>
              <span>Meeting history</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UploadMeeting;