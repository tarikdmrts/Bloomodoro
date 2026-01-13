import "./Details.css";

export function Details({ todaySessions, plantCount, totalFocusTime }) {
  function formatTime(minutes) {
    const integerMinutes = Math.floor(minutes);
    const hrs = Math.floor(integerMinutes / 60);
    const mins = integerMinutes % 60;
    return `${hrs > 0 ? hrs + "h " : ""}${mins}m`;
  }

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Today's Session</span>
        <span className="stat-value">{todaySessions}</span>
      </div>

      <div className="stat-divider"></div>

      <div className="stat-item">
        <span className="stat-label">Total Plants</span>
        <div className="stat-with-icon">
          <span className="stat-icon">🌱</span>
          <span className="stat-value">{plantCount}</span>
        </div>
      </div>

      <div className="stat-divider"></div>

      <div className="stat-item">
        <span className="stat-label">Total Focus Time</span>
        <div className="stat-with-icon">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{formatTime(totalFocusTime)}</span>
        </div>
      </div>
    </div>
  );
}
