import './ViewGardenButton.css';

export function ViewGardenButton({ onClick, buttonTxt, className = "" }) {
  return (
    <div className={`view-garden ${className}`}>
      <button className="garden-btn" onClick={onClick}>
        {buttonTxt}
      </button>
    </div>
  );
}