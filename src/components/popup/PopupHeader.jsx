import React from 'react';

export const PopupHeader = ({ isNightMode, toggleNightMode }) => {
    return (
        <div className="popup-header">
            <h2>Bloomodoro</h2>
            <h3>Cultivate your focus, grow your garden.</h3>
            <button
                className="theme-toggle-btn header-btn"
                onClick={toggleNightMode}
                title={isNightMode ? "Switch to Day Mode" : "Switch to Night Mode"}
            >
                {isNightMode ? '☀️' : '🌙'}
            </button>
        </div>
    );
};
