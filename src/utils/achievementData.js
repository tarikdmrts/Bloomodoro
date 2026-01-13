import { calculateLevel } from './levelUtils';

export const ACHIEVEMENTS_DATA = [
    { id: 'first_seed', title: 'First Seed', description: 'Plant your first seed.', condition: (stats) => stats.plantCount >= 1 },
    { id: 'novice_gardener', title: 'Novice Gardener', description: 'Grow 5 plants.', condition: (stats) => stats.plantCount >= 5 },
    { id: 'master_gardener', title: 'Master Gardener', description: 'Grow 25 plants.', condition: (stats) => stats.plantCount >= 25 },
    { id: 'focus_initiate', title: 'Focused Mind', description: 'Complete 1 hour of focus.', condition: (stats) => stats.totalFocusTime >= 60 },
    { id: 'deep_worker', title: 'Deep Worker', description: 'Complete 10 hours of focus.', condition: (stats) => stats.totalFocusTime >= 600 },
    { id: 'time_lord', title: 'Time Lord', description: 'Complete 100 hours of focus.', condition: (stats) => stats.totalFocusTime >= 6000 },
    { id: 'level_5', title: 'Apprentice', description: 'Reach Level 5.', condition: (stats) => calculateLevel(stats.totalFocusTime) >= 5 },
    { id: 'level_10', title: 'Journeyman', description: 'Reach Level 10.', condition: (stats) => calculateLevel(stats.totalFocusTime) >= 10 },
    { id: 'level_25', title: 'Master', description: 'Reach Level 25.', condition: (stats) => calculateLevel(stats.totalFocusTime) >= 25 },
];
