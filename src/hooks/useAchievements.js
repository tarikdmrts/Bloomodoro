import { useState, useEffect } from 'react';
import { fetchStorage, storageListener, updateStorage } from '../utils/storage';
import { ACHIEVEMENTS_DATA } from '../utils/achievementData';

export function useAchievements(stats) {
    const [unlockedAchievements, setUnlockedAchievements] = useState([]);
    const [lastSeenAchievements, setLastSeenAchievements] = useState(0);

    useEffect(() => {
        fetchStorage(["unlockedAchievements", "lastSeenAchievements"])
            .then((result) => {
                setUnlockedAchievements(result.unlockedAchievements || []);
                setLastSeenAchievements(result.lastSeenAchievements || 0);
            });

        const removeListener = storageListener((changes) => {
            if (changes.unlockedAchievements) setUnlockedAchievements(changes.unlockedAchievements.newValue);

            if (changes.lastSeenAchievements) setLastSeenAchievements(changes.lastSeenAchievements.newValue);
        });

        return () => removeListener();
    }, []);

    useEffect(() => {
        if (!stats) return;

        const newUnlocked = [...unlockedAchievements];
        let changed = false;

        ACHIEVEMENTS_DATA.forEach(achievement => {
            if (!newUnlocked.includes(achievement.id) && achievement.condition(stats)) {
                newUnlocked.push(achievement.id);
                changed = true;
            }
        });

        if (changed) {
            setUnlockedAchievements(newUnlocked);
            updateStorage({ unlockedAchievements: newUnlocked });
        }
    }, [stats.plantCount, stats.totalFocusTime, unlockedAchievements]);

    const markAsSeen = () => {
        const count = unlockedAchievements.length;
        setLastSeenAchievements(count);
        updateStorage({ lastSeenAchievements: count });
    };

    const badgeCount = unlockedAchievements.length - lastSeenAchievements;

    return {
        unlockedAchievements,
        lastSeenAchievements,
        markAsSeen,
        badgeCount,
        ACHIEVEMENTS_DATA
    };
}
