import React from 'react';

const GoogleSheetButton = () => {
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1nd1pwG8VtR0FBIRQjzqUVNEqZ3bz-82JHUHD3sCH6zU/edit";

  return (
    <a
      href={sheetUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <button
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 16px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        📊 View Webhook Sheet
      </button>
    </a>
  );
};

export default GoogleSheetButton;
