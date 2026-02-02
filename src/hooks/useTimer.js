import { useState, useEffect } from 'react';
import { updateStorage, fetchStorage } from '../utils/storage';

export const useTimer = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [totalDuration, setTotalDuration] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetchStorage(["targetTime", "isRunning", "remainingTime", "sessionDuration"])
      .then((result) => {
        if (result.sessionDuration) {
          setTotalDuration(result.sessionDuration);
        }

        if (result.isRunning && result.targetTime) {
          setIsRunning(true);
          const remaining = Math.ceil((result.targetTime - Date.now()) / 1000);
          setSeconds(remaining > 0 ? remaining : 0);
        } else if (result.remainingTime) {
          setSeconds(result.remainingTime);
        }
      });

    const listener = (changes) => {
      if (changes.isRunning) {
        setIsRunning(changes.isRunning.newValue);
        if (changes.isRunning.newValue === false) {
          fetchStorage(["remainingTime", "sessionDuration"]).then(result => {
            if (!result.remainingTime || result.remainingTime <= 0) {
              setSeconds(result.sessionDuration || totalDuration);
            }
          });
        }
      }
      if (changes.sessionDuration) setTotalDuration(changes.sessionDuration.newValue);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        fetchStorage(["targetTime"]).then((result) => {
          if (result.targetTime) {
            const remaining = Math.ceil((result.targetTime - Date.now()) / 1000);
            if (remaining <= 0) {
              setSeconds(0);
              setIsRunning(false);
            } else {
              setSeconds(remaining);
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = (durationSeconds, totalDurationOverride = null) => {
    if (durationSeconds <= 0) return;
    const targetTime = Date.now() + durationSeconds * 1000;

    const newTotalDuration = totalDurationOverride || durationSeconds;

    updateStorage({
      isRunning: true,
      targetTime: targetTime,
      remainingTime: null,
      sessionDuration: newTotalDuration
    });

    chrome.alarms.create("focusTimer", { when: targetTime });

    setTotalDuration(newTotalDuration);
    setSeconds(durationSeconds);
    setIsRunning(true);
  };

  const handleStartPause = () => {
    if (!isRunning) {
      fetchStorage(["remainingTime", "sessionDuration"]).then((result) => {
        let durationSeconds = result.remainingTime || seconds;
        let storedTotalDuration = result.sessionDuration || totalDuration;

        if (durationSeconds <= 0) {
          durationSeconds = storedTotalDuration || 25 * 60;
        }

        const totalDurationToUse = storedTotalDuration ? Number(storedTotalDuration) : durationSeconds;

        startTimer(durationSeconds, totalDurationToUse);
      });
    } else {
      chrome.alarms.clear("focusTimer");

      fetchStorage(["targetTime"]).then((result) => {
        if (result.targetTime) {
          const remaining = Math.ceil((result.targetTime - Date.now()) / 1000);
          const safeRemaining = remaining > 0 ? remaining : 0;

          updateStorage({
            isRunning: false,
            targetTime: null,
            remainingTime: safeRemaining
          });

          setSeconds(safeRemaining);
          setIsRunning(false);
        }
      });
    }
  };

  const handleReset = () => {
    chrome.alarms.clear("focusTimer");
    updateStorage({
      isRunning: false,
      targetTime: null,
      remainingTime: null,
      sessionDuration: 25 * 60
    });
    setSeconds(25 * 60);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    chrome.alarms.clear("focusTimer");

    fetchStorage(["targetTime", "sessionDuration", "isRunning"]).then((result) => {
      if (!result.isRunning && !result.targetTime) return;

      let elapsedSeconds = 0;
      if (result.targetTime) {
        const now = Date.now();
        const totalDurationMs = (result.sessionDuration || totalDuration) * 1000;
        const startTime = result.targetTime - totalDurationMs;
        elapsedSeconds = Math.max(0, Math.floor((now - startTime) / 1000));
      } else {
        elapsedSeconds = Math.max(0, totalDuration - seconds);
      }

      updateStorage({
        isRunning: false,
        targetTime: null,
        sessionDuration: elapsedSeconds
      }).then(() => {
        chrome.alarms.create("focusTimer", { when: Date.now() });

        setTimeout(() => {
          const resetDuration = 25 * 60;
          updateStorage({
            sessionDuration: resetDuration,
            remainingTime: resetDuration,
            isRunning: false,
            targetTime: null
          });
          setSeconds(resetDuration);
          setTotalDuration(resetDuration);
          setIsRunning(false);
        }, 200);
      });
    });
  };

  const handleDurationSelect = (mins) => {
    const newDuration = mins * 60;

    fetchStorage(["remainingTime", "sessionDuration"]).then((result) => {
      const oldDuration = result.sessionDuration || totalDuration;
      const oldRemaining = result.remainingTime || seconds;
      const timeSpent = oldDuration - oldRemaining;

      const newRemaining = Math.max(0, newDuration - timeSpent);

      setTotalDuration(newDuration);
      setSeconds(newRemaining);

      updateStorage({
        sessionDuration: newDuration,
        remainingTime: newRemaining
      });
    });
  };

  return {
    seconds,
    totalDuration,
    isRunning,
    handleStartPause,
    handleReset,
    handleDurationSelect,
    handleEndSession
  };
};
