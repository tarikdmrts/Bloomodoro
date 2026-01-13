import Timer from "./Timer";
import "./CircleTimer.css";

export default function CircleTimer({ seconds, size = 250, isRunning, totalTime = 25 * 60 }) {
  const timeLeft = seconds;

  let progress = 0;
  if (totalTime > 0) {
    const elapsed = totalTime - timeLeft;
    progress = Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
  }

  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const ratio = totalTime > 0 ? timeLeft / totalTime : 0;
  const color = ratio < 0.1 ? "#ef4444" : ratio < 0.5 ? "#f59e0b" : "#22c55e";

  return (
    <div className="circle-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="circle-svg">
        <circle
          stroke="#e8decf"
          fill="transparent"
          strokeWidth="10"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="progress-circle"
        />
      </svg>

      <div className="timer-center">
        <Timer seconds={timeLeft} />
        {!isRunning ? (
          <div className="timer-subtext">Ready to Focus?</div>
        ) : (
          <div className="timer-subtext">Stay Focused...</div>
        )}
      </div>
    </div>
  );
}
