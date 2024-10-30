"use client"
import { useState, useEffect } from "react";
import { Bell, Heart, Target, CheckCircle, X, RefreshCw, Smartphone, Settings, User } from "lucide-react";

interface PersuasiveSystemProps {}

type NotificationType = {
  id: number;
  message: string;
  timing: string;
  tone: string;
  impact: number;
}

type ViewMode = "design" | "experience";

const NOTIFICATION_TONES = ["encouraging", "challenging", "informative"];
const NOTIFICATION_TIMINGS = ["morning", "afternoon", "evening"];

const PersuasiveSystem: React.FC<PersuasiveSystemProps> = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("design");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [userProgress, setUserProgress] = useState<number>(0);
  const [activeNotification, setActiveNotification] = useState<NotificationType | null>(null);

  const createNotification = (tone: string, timing: string) => {
    const newNotification: NotificationType = {
      id: Date.now(),
      message: generateMessage(tone),
      timing,
      tone,
      impact: Math.floor(Math.random() * 30) + 70
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const generateMessage = (tone: string): string => {
    const messages = {
      encouraging: "Great progress! Keep moving forward! 🌟",
      challenging: "Push yourself! You can do better! 💪",
      informative: "You're 70% towards your daily goal 📊"
    };
    return messages[tone as keyof typeof messages];
  };

  const simulateExperience = () => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < notifications.length) {
        setActiveNotification(notifications[currentIndex]);
        setUserProgress(prev => Math.min(100, prev + 10));
        currentIndex++;
      } else {
        clearInterval(interval);
        setActiveNotification(null);
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (viewMode === "experience" && notifications.length > 0) {
      return simulateExperience();
    }
  }, [viewMode, notifications]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Persuasive System Designer</h1>
        <button
          onClick={() => setViewMode(prev => prev === "design" ? "experience" : "design")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {viewMode === "design" ? <Smartphone className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          {viewMode === "design" ? "Test Experience" : "Back to Design"}
        </button>
      </div>

      {viewMode === "design" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {NOTIFICATION_TONES.map(tone => (
              <div key={tone} className="space-y-2">
                {NOTIFICATION_TIMINGS.map(timing => (
                  <button
                    key={`${tone}-${timing}`}
                    onClick={() => createNotification(tone, timing)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition duration-300"
                  >
                    Create {tone} notification for {timing}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Created Notifications</h2>
            <div className="space-y-2">
              {notifications.map(notification => (
                <div key={notification.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <span>{notification.message}</span>
                  </div>
                  <span className="text-sm text-gray-500">{notification.timing}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-96 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <User className="w-6 h-6 text-gray-600" />
            <div className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${userProgress}%` }}
              />
            </div>
          </div>

          {activeNotification && (
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-blue-500 text-white rounded-lg animate-fade-in">
              <p>{activeNotification.message}</p>
              <div className="mt-2 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Impact: {activeNotification.impact}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersuasiveSystem;