import "./PlantModal.css";

export default function PlantModal({ plant, isGrowing, isRunning, seconds, totalDuration }) {
    const STAGE_THRESHOLDS = {
        1: 0,
        2: 25,
        3: 75,
        4: 150
    };

    const getPlantName = (stage) => {
        const names = {
            1: "Seedling",
            2: "Sprout",
            3: "Bud",
            4: "Bloom"
        };
        return names[stage] || "Plant";
    };

    const nextStage = plant.stage + 1;
    const threshold = STAGE_THRESHOLDS[nextStage];
    const prevThreshold = STAGE_THRESHOLDS[plant.stage];
    const currentTotal = plant.totalMinutes || 0;

    let displayTotal = currentTotal;
    let minutesRemaining = 0;

    if (isGrowing && threshold) {
        if (isRunning) {
            const sessionProgress = (totalDuration - seconds) / 60;
            displayTotal += sessionProgress;
        }

        minutesRemaining = Math.max(0, Math.ceil(threshold - displayTotal));
    }
    let progressPercent = 100;
    if (plant.stage < 4) {
        const stageDuration = threshold - prevThreshold;
        const progressInStage = displayTotal - prevThreshold;
        progressPercent = Math.min(100, Math.max(0, (progressInStage / stageDuration) * 100));
    }

    return (
        <div className="plant-modal">
            <div className="modal-header">
                <h3>{getPlantName(plant.stage)}</h3>
                <span className="stage-badge">Stage {plant.stage}</span>
            </div>

            <div className="modal-content">
                {plant.stage < 4 ? (
                    <>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                        </div>

                        <div className="growth-info">
                            <p className="next-stage-label">Next Stage in:</p>
                            <p className="time-remaining">
                                {minutesRemaining > 0
                                    ? <>{minutesRemaining} <span>mins</span></>
                                    : "Ready!"}
                            </p>
                        </div>

                        {isGrowing ? (
                            isRunning ? (
                                <p className="growing-status">Photosynthesizing... ☀️</p>
                            ) : (
                                <p className="growing-status paused">Waiting for focus...</p>
                            )
                        ) : (
                            <p className="growing-status dormant">Previous Plant</p>
                        )}
                    </>
                ) : (
                    <p className="fully-grown">Fully Grown! 🌸</p>
                )}
            </div>
        </div>
    );
}