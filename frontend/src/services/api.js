const API_BASE_URL = "http://127.0.0.1:8000";


// ============================================
// GET ALL MEETINGS
// ============================================

export async function getMeetings() {
  const response = await fetch(
    `${API_BASE_URL}/api/meetings/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch meetings");
  }

  return response.json();
}


// ============================================
// GET SINGLE MEETING
// ============================================

export async function getMeeting(meetingId) {
  const response = await fetch(
    `${API_BASE_URL}/api/meetings/${meetingId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch meeting");
  }

  return response.json();
}


// ============================================
// ANALYZE MEETING
// ============================================

export async function analyzeMeeting(file) {

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/meetings/analyze`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {

    let message = "Failed to analyze meeting";

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        message = errorData.detail;
      }

    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.json();
}


// ============================================
// DELETE MEETING
// ============================================

export async function deleteMeeting(meetingId) {

  const response = await fetch(
    `${API_BASE_URL}/api/meetings/${meetingId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete meeting");
  }

  return response.json();
}