import React from 'react';

function GoogleCalEmbed() {
  const calendarUrl = "https://calendar.google.com/calendar/u/0/r";

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title mb-3">Work Order Calendar</h5>
          <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&src=MzJkZjE1N2M4Y2MxOTgzOWMyMmI1YTE0ZWZjM2E1MDkzZmQ1MDE4ZThmNGVhM2ExZmQ3ZWY1YzZhMmU1ODJlOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23a79b8e&color=%230b8043"
            style={{ border: 0 }}
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="Google Calendar"
          ></iframe>
          <div className="text-end mt-3">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-link text-primary p-0"
            >
              Open full Google Calendar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleCalEmbed;
