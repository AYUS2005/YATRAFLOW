import { useState } from "react";

interface MobileNavigationProps {
  onOpenReport: () => void;
}

export default function MobileNavigation({ onOpenReport }: MobileNavigationProps) {
  const [activeTab, setActiveTab] = useState("map");

  const navItems = [
    { id: "map", label: "Map", icon: "fas fa-map" },
    { id: "alerts", label: "Alerts", icon: "fas fa-list" },
    { id: "report", label: "Report", icon: "fas fa-plus" },
    { id: "profile", label: "Profile", icon: "fas fa-user" },
  ];

  const handleNavClick = (itemId: string) => {
    if (itemId === "report") {
      onOpenReport();
    } else {
      setActiveTab(itemId);
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex">
        {navItems.map((item) => (
          <button
            key={item.id}
            data-testid={`nav-${item.id}`}
            onClick={() => handleNavClick(item.id)}
            className={`flex-1 py-3 flex flex-col items-center justify-center transition-colors ${
              activeTab === item.id ? "text-primary" : "text-gray-400"
            }`}
          >
            <i className={`${item.icon} text-lg mb-1`}></i>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
