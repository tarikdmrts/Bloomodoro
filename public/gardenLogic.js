const GARDEN_RESET_BONUS = 300;

function checkGardenCompletion(plants) {
    if (!plants || !Array.isArray(plants)) return false;

    const MAX_PLANTS = 25;

    if (plants.length < MAX_PLANTS) return false;

    const allFullyGrown = plants.every(plant => plant.stage === 4);

    return allFullyGrown;
}


