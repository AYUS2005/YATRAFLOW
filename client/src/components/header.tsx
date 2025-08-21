import { useState, useEffect } from "react";

export default function Header() {
  const [connectionStatus, setConnectionStatus] = useState("Live");
  const [unreadCount] = useState(3);

  useEffect(() => {
    // Mock real-time status updates
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? "Live" : "Reconnecting...");
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-primary text-white shadow-lg relative z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <i className="fas fa-route text-2xl"></i>
            <h1 className="text-xl font-semibold">Yatraflow</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Real-time status indicator */}
            <div className="flex items-center space-x-2 bg-green-500 px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span data-testid="text-connection-status">{connectionStatus}</span>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button
                data-testid="button-notifications"
                className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <i className="fas fa-bell text-lg"></i>
                <span
                  data-testid="text-unread-count"
                  className="absolute -top-1 -right-1 bg-accident text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {unreadCount}
                </span>
              </button>
            </div>
            
            {/* User menu */}
            <div className="flex items-center space-x-2">
              <span className="hidden md:block">John Doe</span>
              <button
                data-testid="button-user-menu"
                className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center"
              >
                <i className="fas fa-user text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
