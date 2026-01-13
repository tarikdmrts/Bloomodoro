import { useState, useEffect } from 'react';
import { fetchStorage, storageListener, updateStorage } from '../utils/storage';

export function useUserStats() {
    const [todaySessions, setTodaySessions] = useState(0);
    const [totalFocusTime, setTotalFocusTime] = useState(0);
    const [plantCount, setPlantCount] = useState(0);
    const [gardenPlants, setGardenPlants] = useState([]);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [bonusXP, setBonusXP] = useState(0);

    useEffect(() => {
        fetchStorage(["todaySessions", "totalFocusTime", "plantCount", "gardenPlants", "notificationsEnabled", "bonusXP"])
            .then((result) => {
                setTodaySessions(result.todaySessions || 0);
                setTotalFocusTime(result.totalFocusTime || 0);
                setPlantCount(result.plantCount || 0);
                setGardenPlants(result.gardenPlants || []);
                setNotificationsEnabled(result.notificationsEnabled !== false);
                setBonusXP(result.bonusXP || 0);
            });

        const removeListener = storageListener((changes) => {
            if (changes.plantCount) setPlantCount(changes.plantCount.newValue);
            if (changes.gardenPlants) setGardenPlants(changes.gardenPlants.newValue);
            if (changes.todaySessions) setTodaySessions(changes.todaySessions.newValue);
            if (changes.totalFocusTime) setTotalFocusTime(changes.totalFocusTime.newValue);
            if (changes.notificationsEnabled) setNotificationsEnabled(changes.notificationsEnabled.newValue);
            if (changes.bonusXP) setBonusXP(changes.bonusXP.newValue);
        });

        return () => removeListener();
    }, []);

    const toggleNotifications = () => {
        const newState = !notificationsEnabled;
        setNotificationsEnabled(newState);
        updateStorage({ notificationsEnabled: newState });
    };

    return {
        todaySessions,
        totalFocusTime,
        plantCount,
        gardenPlants,
        notificationsEnabled,
        bonusXP,
        toggleNotifications
    };
}
