import React from 'react';
import './Achievements.css';

export const Achievements = ({ achievements }) => {
    return (
        <div className="achievements-container">
            <div className="achievements-header">
                <h2>Achievements</h2>
            </div>

            <div className="achievements-list">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                    >
                        <div className="achievement-icon">
                            {achievement.unlocked ? '🏆' : '🔒'}
                        </div>
                        <div className="achievement-info">
                            <h3 className="achievement-title">{achievement.title}</h3>
                            <p className="achievement-desc">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && (
                            <div className="achievement-status">Unlocked</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
