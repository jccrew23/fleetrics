import React from 'react';
import { useEffect, useState } from "react";
import api from '../api';

function Calendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/api/calendar/events', { withCredentials: true });
                setEvents(response.data.events || []);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to fetch events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <div>Loading events...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }

    return ( 
    <div>
      <h2>Your Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              {event.summary} — {event.start?.dateTime || event.start?.date}
            </li>
          ))}
        </ul>
      )}
    </div>
    );
}

export default Calendar;
