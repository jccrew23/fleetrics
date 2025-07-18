import React from 'react';

function Header({ user, onLogout, onLogin }) {
  return (
    <header className="bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
      <h1 className="h5 m-0">Fleetrics</h1>

      {user ? (
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Welcome, {user.displayName}!</h5>
          <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
            Log Out
          </button>
        </div>
      ) : (
        <button className="btn btn-primary btn-sm" onClick={onLogin}>
          Log In with Google
        </button>
      )}
    </header>
  );
}

export default Header;
