import React from 'react';
import './DurationButtons.css';

export function DurationButtons({ onSelect, selectedDuration }) {
    const durations = [25, 45, 60];

    return (
        <div className="duration-buttons-container">
            <p className="duration-label">Select Focus Duration:</p>
            <div className="duration-buttons">
                {durations.map((min) => (
                    <button
                        key={min}
                        className={`duration-btn ${selectedDuration === min ? 'active' : ''}`}
                        onClick={() => onSelect(min)}
                    >
                        {min}m
                    </button>
                ))}
            </div>
        </div>
    );
}
