import React, { useMemo, useState } from 'react';
import './Garden.css';
import Plant from './Plant';
import airBackgroundNight from '../../assets/bloomodoro-air-magical-night.png';
import airBackground from '../../assets/bloomodoro-air-background.png';
import magicalNightBackground from '../../assets/bloomodoro-magical-night-background.png';
import bloomodoroBackground from '../../assets/bloomodoro-background.png';
import smoke from '../../assets/bloomodoro-chimney-smoke.png';
import cloud1 from '../../assets/bloomodoro-cloud-1.png';
import cloud2 from '../../assets/bloomodoro-cloud-2.png';

import { getLevelData } from '../../utils/levelUtils';

const Garden = ({ plants = [], isRunning, seconds, totalDuration, totalFocusTime = 0, isNightMode = false }) => {
  const { level, progress, minutesInCurrentLevel, minutesRequiredForNextLevel } = useMemo(() => getLevelData(totalFocusTime), [totalFocusTime]);

  const PLANT_POSITIONS = [
    // Row 1
    { id: 0, x: 21, y: 48 }, { id: 1, x: 36, y: 48 }, { id: 2, x: 51, y: 48 }, { id: 3, x: 66, y: 48 }, { id: 4, x: 81, y: 48 },
    // Row 2
    { id: 5, x: 21, y: 57 }, { id: 6, x: 36, y: 57 }, { id: 7, x: 51, y: 57 }, { id: 8, x: 66, y: 57 }, { id: 9, x: 81, y: 57 },
    // Row 3
    { id: 10, x: 21, y: 66 }, { id: 11, x: 36, y: 66 }, { id: 12, x: 51, y: 66 }, { id: 13, x: 66, y: 66 }, { id: 14, x: 81, y: 66 },
    // Row 4
    { id: 15, x: 21, y: 75 }, { id: 16, x: 36, y: 75 }, { id: 17, x: 51, y: 75 }, { id: 18, x: 66, y: 75 }, { id: 19, x: 81, y: 75 },
    // Row 5
    { id: 20, x: 21, y: 84 }, { id: 21, x: 36, y: 84 }, { id: 22, x: 51, y: 84 }, { id: 23, x: 66, y: 84 }, { id: 24, x: 81, y: 84 },
  ];

  const visiblePlants = useMemo(() => {
    return plants.slice(0, PLANT_POSITIONS.length).map((plant, index) => ({
      ...PLANT_POSITIONS[index],
      ...plant,
      animationDelay: `${(Math.random() * -5).toFixed(2)}s`
    }));
  }, [plants]);

  const cloudDelays = useMemo(() => {
    return {
      cloud1: Math.random() * -60, // Random delay between -60s and 0s
      cloud2: Math.random() * -60,
      cloud3: Math.random() * -60,
      cloud4: Math.random() * -60,
    };
  }, []);

  return (
    <div className="garden-container">
      <div className="xp-container">
        <div className="xp-bar-bg">
          <div
            className="xp-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
          <div className="xp-text-layer">
            <span className="lvl-text">Lvl {level}</span>
            <span className="progress-text">{minutesInCurrentLevel}/{minutesRequiredForNextLevel} min</span>
          </div>
        </div>
      </div>

      {/* Background Layers */}
      <div
        className="layer-air"
        style={{ backgroundImage: `url(${isNightMode ? airBackgroundNight : airBackground})` }}
      ></div>

      {/* Cloud Layers - Only show in Day Mode */}
      {!isNightMode && (
        <>
          <div
            className="cloud-layer cloud-layer-1"
            style={{
              backgroundImage: `url(${cloud1})`,
              animationDelay: `${cloudDelays.cloud1}s`
            }}
          ></div>
          <div
            className="cloud-layer cloud-layer-2"
            style={{
              backgroundImage: `url(${cloud2})`,
              animationDelay: `${cloudDelays.cloud2}s`
            }}
          ></div>
          <div
            className="cloud-layer cloud-layer-3"
            style={{
              backgroundImage: `url(${cloud1})`,
              animationDelay: `${cloudDelays.cloud3}s`
            }}
          ></div>
          <div
            className="cloud-layer cloud-layer-4"
            style={{
              backgroundImage: `url(${cloud2})`,
              animationDelay: `${cloudDelays.cloud4}s`
            }}
          ></div>
        </>
      )}

      <div className='chimney-layer'>
        <div className='smoke s1' style={{ backgroundImage: `url(${smoke})` }}></div>
        <div className='smoke s2' style={{ backgroundImage: `url(${smoke})` }}></div>
      </div>
      <div
        className="layer-background"
        style={{ backgroundImage: `url(${isNightMode ? magicalNightBackground : bloomodoroBackground})` }}
      ></div>

      {visiblePlants.map((plant) => (
        <Plant
          key={plant.id}
          plant={plant}
          isGrowing={plant.stage < 4}
          isRunning={isRunning}
          seconds={seconds}
          totalDuration={totalDuration}
        />
      ))}
      {/* Animation Overlays */}
      <div className="scene-overlay">
      </div>
    </div>
  );
};

export default Garden;
