import { Details } from "./../details/Details";
import { Buttons } from "./../Buttons";
import { DurationButtons } from "../DurationButtons";
import { useState, useEffect } from "react";
import CircleTimer from "../CircleTimer/CircleTimer";
import { ViewGardenButton } from "../ViewGardenButton";
import Garden from "../Garden/Garden";
import "./Popup.css";
import { useTimer } from "../../hooks/useTimer";
import { useAchievements } from "../../hooks/useAchievements";
import { useUserStats } from "../../hooks/useUserStats";
import { Achievements } from "../Achievements/Achievements";

import { fetchStorage, updateStorage } from "../../utils/storage";

import { PopupHeader } from "./PopupHeader";

export default function Popup() {
  const {
    seconds,
    totalDuration,
    isRunning,
    handleStartPause,
    handleDurationSelect,
    handleEndSession
  } = useTimer();

  const [currentView, setCurrentView] = useState("timer");
  const [isNightMode, setIsNightMode] = useState(false);

  useEffect(() => {
    fetchStorage(["isNightMode"]).then((result) => {
      setIsNightMode(result.isNightMode || false);
    });
  }, []);

  const toggleNightMode = () => {
    const newMode = !isNightMode;
    setIsNightMode(newMode);
    updateStorage({ isNightMode: newMode });
  };

  const {
    todaySessions,
    totalFocusTime,
    plantCount,
    gardenPlants,
    notificationsEnabled,
    bonusXP,
    toggleNotifications
  } = useUserStats();

  const {
    unlockedAchievements,
    badgeCount,
    markAsSeen,
    ACHIEVEMENTS_DATA
  } = useAchievements({ plantCount, totalFocusTime });



  const toggleView = () => {
    if (currentView === "achievements") {
      markAsSeen();
    }
    setCurrentView(currentView === "timer" ? "garden" : "timer");
  };

  const openAchievements = () => {
    markAsSeen();
    setCurrentView("achievements");
  };

  const backToTimer = () => {
    setCurrentView("timer");
  };

  if (currentView === "garden") {
    const calculatedTotalXP = totalFocusTime + bonusXP;

    return (
      <div className="popup garden-view">
        <Garden
          plants={gardenPlants}
          isRunning={isRunning}
          seconds={seconds}
          totalDuration={totalDuration}
          totalFocusTime={calculatedTotalXP}
          isNightMode={isNightMode}
        />
        <ViewGardenButton onClick={toggleView} buttonTxt="Back to Focus" className="view-garden-absolute" />
      </div>
    );
  }

  if (currentView === "achievements") {
    const achievementsList = ACHIEVEMENTS_DATA.map(a => ({
      ...a,
      unlocked: unlockedAchievements.includes(a.id)
    }));

    return (
      <div className="popup achievements-view" style={{ backgroundColor: '#1a4e3a' }}>
        <Achievements achievements={achievementsList} />
        <ViewGardenButton onClick={backToTimer} buttonTxt="Back to Focus" className="view-garden-absolute" />
      </div>
    );
  }

  return (
    <div className="popup">
      <PopupHeader isNightMode={isNightMode} toggleNightMode={toggleNightMode} />

      <CircleTimer seconds={seconds} totalTime={totalDuration} size={220} isRunning={isRunning} />

      {!isRunning && (
        <DurationButtons onSelect={handleDurationSelect} selectedDuration={Math.floor(totalDuration / 60)} />
      )}

      <Buttons
        handleStartPause={handleStartPause}
        handleEndSession={handleEndSession}
        isRunning={isRunning}
        onAchievementsClick={openAchievements}
        badgeCount={badgeCount > 0 ? badgeCount : 0}
        notificationsEnabled={notificationsEnabled}
        toggleNotifications={toggleNotifications}
      />

      <Details
        todaySessions={todaySessions}
        totalFocusTime={totalFocusTime}
        plantCount={plantCount}
      />

      <ViewGardenButton onClick={toggleView} buttonTxt="View My Garden" />
    </div>
  );
}
