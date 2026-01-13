import React from "react";
import "./Buttons.css";
export function Buttons({
  handleStartPause,
  handleEndSession,
  isRunning,
  onAchievementsClick,
  badgeCount,
  notificationsEnabled,
  toggleNotifications
}) {
  return <div className="button-wrapper">
    <button className="control-btn notification-toggle-btn" onClick={toggleNotifications} title={notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}>
      {notificationsEnabled ? (
        <svg className="control-btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ) : (
        <svg className="control-btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          <path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path>
          <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path>
          <path d="M18 8a6 6 0 0 0-9.33-5"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      )}
    </button>

    <button className="control-btn main-btn" onClick={handleStartPause} title={isRunning ? "Pause" : "Start"}>
      {isRunning ? <svg className="main-btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
        <rect x="5" y="4" width="4" height="16" rx="1" />
        <rect x="15" y="4" width="4" height="16" rx="1" />
      </svg> : <svg className="main-btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
        <polygon points="5,3 19,12 5,21" />
      </svg>}
    </button>

    {isRunning && (
      <button className="control-btn" onClick={handleEndSession} title="End Session & Save">
        <svg className="control-btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        </svg>
      </button>
    )}

    <button className="control-btn award-btn" tabIndex="0" onClick={onAchievementsClick} title="Achievements">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="award-icon control-btn-icon" aria-hidden="true">
        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
        <circle cx="12" cy="8" r="6"></circle>
      </svg>

      {badgeCount > 0 && <div className="award-badge">{badgeCount}</div>}
    </button>
  </div>;
}
