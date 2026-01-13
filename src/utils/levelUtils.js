export const getLevelData = (totalMinutes) => {
    if (!totalMinutes || totalMinutes < 0) totalMinutes = 0;

    let level = 1;
    let minutesRequired = 60;
    let remainingMinutes = totalMinutes;

    while (remainingMinutes >= minutesRequired) {
        remainingMinutes -= minutesRequired;
        level++;
        minutesRequired += 30;
    }

    const progress = (remainingMinutes / minutesRequired) * 100;

    return {
        level,
        progress,
        minutesInCurrentLevel: Math.floor(remainingMinutes),
        minutesRequiredForNextLevel: minutesRequired
    };
};

export const calculateLevel = (totalMinutes) => getLevelData(totalMinutes).level;
export const calculateProgress = (totalMinutes) => getLevelData(totalMinutes).progress;
