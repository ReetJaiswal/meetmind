const API_BASE_URL = "http://127.0.0.1:8000";

export async function getMeetings() {
  const response = await fetch(
    `${API_BASE_URL}/api/meetings/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch meetings");
  }

  return response.json();
}

export async function getMeeting(meetingId) {
  const response = await fetch(
    `${API_BASE_URL}/api/meetings/${meetingId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch meeting");
  }

  return response.json();
}

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
    const error = await response.text();
    throw new Error(error || "Failed to analyze meeting");
  }

  return response.json();
}