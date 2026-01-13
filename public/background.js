importScripts('gardenLogic.js');

chrome.runtime.onInstalled.addListener(() => {
  checkDailyReset();
  setupDailyAlarm();
});

chrome.runtime.onStartup.addListener(() => {
  checkDailyReset();
  setupDailyAlarm();
});

async function playNotificationSound() {
  try {
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT']
    });

    if (existingContexts.length === 0) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Play notification sound'
      });
    }

    chrome.runtime.sendMessage({
      type: 'PLAY_SOUND',
      soundUrl: 'assets/bloomodoro-notification.mp3'
    });
  } catch (error) {
    console.log('Error playing sound:', error);
  }
}

function getTodayDateString() {
  return new Date().toLocaleDateString('en-CA');
}

function checkDailyReset() {
  chrome.storage.local.get(["lastSessionDate", "todaySessions"], (result) => {
    const today = getTodayDateString();
    if (result.lastSessionDate !== today) {
      chrome.storage.local.set({
        todaySessions: 0,
        lastSessionDate: today
      }, () => {
        console.log("Daily reset: todaySessions reset to 0 for date", today);
      });
    }
  });
}

function setupDailyAlarm() {
  chrome.alarms.get("dailyReset", (alarm) => {
    if (!alarm) {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
      chrome.alarms.create("dailyReset", {
        when: nextMidnight.getTime(),
        periodInMinutes: 24 * 60
      });
    }
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyReset") {
    checkDailyReset();
  } else if (alarm.name === "focusTimer") {

    chrome.storage.local.get(["todaySessions", "totalFocusTime", "plantCount", "gardenPlants", "sessionDuration", "notificationsEnabled"], (result) => {
      const newSessions = (result.todaySessions || 0) + 1;
      const sessionDurationMinutes = (result.sessionDuration || 0) / 60;
      const newFocusTime = (result.totalFocusTime || 0) + sessionDurationMinutes;
      const notificationsEnabled = result.notificationsEnabled !== false;

      const STAGE_THRESHOLDS = {
        1: 0,
        2: 25,
        3: 75,
        4: 150
      };

      const currentGarden = result.gardenPlants || [];
      let plantsGrew = 0;
      let newStageReached = false;

      currentGarden.forEach(plant => {
        if (plant.stage < 4) {
          if (typeof plant.totalMinutes !== 'number') {
            plant.totalMinutes = STAGE_THRESHOLDS[plant.stage] || 0;
          }

          plant.totalMinutes += sessionDurationMinutes;
          plantsGrew++;

          const nextStage = plant.stage + 1;
          if (STAGE_THRESHOLDS[nextStage] && plant.totalMinutes >= STAGE_THRESHOLDS[nextStage]) {
            plant.stage = nextStage;
            newStageReached = true;
          }
        }
      });

      const MAX_PLANTS = 25;
      const MIN_SESSION_MINUTES = 10;

      let newPlantAdded = false;

      if (currentGarden.length < MAX_PLANTS && sessionDurationMinutes >= MIN_SESSION_MINUTES) {
        const newPlant = {
          id: Date.now(),
          stage: 1,
          date: new Date().toISOString(),
          totalMinutes: sessionDurationMinutes
        };
        if (newPlant.totalMinutes >= STAGE_THRESHOLDS[2]) {
          newPlant.stage = 2;
        }
        currentGarden.push(newPlant);
        newPlantAdded = true;
      }

      let msg;
      if (newPlantAdded && newStageReached) {
        msg = `You planted a new seed and your plants grew! 🌱🌿`;
      } else if (newPlantAdded) {
        msg = `You planted a new seed! 🌱`;
      } else if (newStageReached) {
        msg = `Your plants grew! 🌿`;
      } else {
        msg = `Focus session complete! Keep up the good work. 💪`;
      }

      let bonusXP = result.bonusXP || 0;
      let newGarden = [...currentGarden];

      if (checkGardenCompletion(currentGarden)) {
        bonusXP += GARDEN_RESET_BONUS;

        newGarden = [];

        msg = `Garden Harvested! +${GARDEN_RESET_BONUS} XP awarded! Starting a new garden. 🌱`;
        newStageReached = true;

        if (notificationsEnabled) {
          chrome.notifications.create("garden-reset", {
            type: "basic",
            iconUrl: "assets/icons/icon128.png",
            title: "Garden Harvested! 🌻",
            message: msg,
            priority: 2,
            silent: false
          });
        }
      }

      if (notificationsEnabled && msg !== `Garden Harvested! +${GARDEN_RESET_BONUS} XP awarded! Starting a new garden. 🌱`) {
        playNotificationSound();

        chrome.notifications.create("focus-complete", {
          type: "basic",
          iconUrl: "assets/icons/icon128.png",
          title: "Focus Session Complete!",
          message: msg,
          priority: 2,
          silent: true,
          requireInteraction: true
        });
      }

      chrome.storage.local.set({
        isRunning: false,
        targetTime: null,
        remainingTime: null,
        sessionDuration: null,
        todaySessions: newSessions,
        totalFocusTime: newFocusTime,
        plantCount: newGarden.length,
        gardenPlants: newGarden,
        bonusXP: bonusXP,
        sessionJustFinished: true
      });
    });
  }
});

chrome.notifications.onClicked.addListener(async (notificationId) => {
  chrome.notifications.clear(notificationId);

  try {
    const window = await chrome.windows.getLastFocused();
    if (window) {
      if (!window.focused) {
        await chrome.windows.update(window.id, { focused: true });
      }
      setTimeout(() => {
        if (chrome.action && chrome.action.openPopup) {
          chrome.action.openPopup();
        }
      }, 100);
    }
  } catch (error) {
    chrome.tabs.create({ url: "about:blank" });
  }
});