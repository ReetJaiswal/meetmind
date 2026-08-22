import { useEffect, useState } from "react";

import { getMeetings } from "../services/api";


function Dashboard() {

  const [meetings, setMeetings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    async function loadMeetings() {

      try {

        const data = await getMeetings();

        setMeetings(data.meetings || []);

      } catch (error) {

        console.error(error);

        setError(error.message);

      } finally {

        setLoading(false);

      }

    }

    loadMeetings();

  }, []);


  if (loading) {

    return (
      <div className="loading-state">
        Loading meetings...
      </div>
    );

  }


  if (error) {

    return (
      <div className="error-state">
        <h3>Unable to load meetings</h3>
        <p>{error}</p>
      </div>
    );

  }


  return (

    <div>

      <h2>
        Backend connection successful
      </h2>

      <p>
        Meetings found: {meetings.length}
      </p>


      {meetings.map((meeting) => (

        <div
          key={meeting.id}
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "10px"
          }}
        >

          <h3>
            {meeting.title}
          </h3>

          <p>
            {meeting.summary}
          </p>

        </div>

      ))}

    </div>

  );
}


export default Dashboard;