import React, { useState } from 'react';
import './Plant.css';
import PlantModal from './PlantModal';

const Plant = ({ plant, isGrowing, isRunning, seconds, totalDuration }) => {
  const [hoveredPlant, setHoveredPlant] = useState(null);

  return (
    <div
      className={`plant stage-${plant.stage}`}
      onMouseEnter={() => setHoveredPlant(plant.id)}
      onMouseLeave={() => setHoveredPlant(null)}
      style={{
        left: `${plant.x}%`,
        top: `${plant.y}%`,
        animationDelay: `${plant.animationDelay}, ${plant.animationDelay}, ${plant.animationDelay}`
      }}>
      {hoveredPlant === plant.id && (
        <PlantModal
          plant={plant}
          isGrowing={isGrowing}
          isRunning={isRunning}
          seconds={seconds}
          totalDuration={totalDuration}
        />
      )}
    </div>
  );
};

export default Plant;
