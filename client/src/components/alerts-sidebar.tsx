import { useQuery } from "@tanstack/react-query";
import { Alert } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface AlertsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function AlertsSidebar({ isOpen, onClose, activeFilter, onFilterChange }: AlertsSidebarProps) {
  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const filteredAlerts = alerts.filter(alert => 
    activeFilter === "all" || alert.type === activeFilter
  );

  const getAlertColor = (type: string) => {
    switch (type) {
      case "accident": return "bg-accident";
      case "traffic": return "bg-traffic";
      case "hazard": return "bg-hazard";
      default: return "bg-gray-400";
    }
  };

  const getAlertTextColor = (type: string) => {
    switch (type) {
      case "accident": return "text-accident";
      case "traffic": return "text-yellow-700";
      case "hazard": return "text-orange-700";
      default: return "text-gray-700";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "accident": return "fas fa-car-crash";
      case "traffic": return "fas fa-traffic-light";
      case "hazard": return "fas fa-exclamation-triangle";
      default: return "fas fa-circle";
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "accident": return "Accident";
      case "traffic": return "Heavy Traffic";
      case "hazard": return "Road Hazard";
      default: return type;
    }
  };

  const calculateDistance = (lat: number, lng: number) => {
    // Mock distance calculation - in real app would use geolocation
    return (Math.random() * 3).toFixed(1);
  };

  return (
    <aside
      className={`w-80 bg-surface shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-in-out absolute lg:relative z-40 h-full`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Live Alerts</h2>
          <button
            data-testid="button-close-sidebar"
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Alert filters */}
        <div className="flex space-x-2 overflow-x-auto">
          <button
            data-testid="filter-all"
            onClick={() => onFilterChange("all")}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              activeFilter === "all"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            data-testid="filter-accident"
            onClick={() => onFilterChange("accident")}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeFilter === "accident"
                ? "bg-accident text-white"
                : "bg-gray-200 text-gray-700 hover:bg-accident hover:text-white"
            }`}
          >
            <i className="fas fa-car-crash mr-1"></i>Accidents
          </button>
          <button
            data-testid="filter-traffic"
            onClick={() => onFilterChange("traffic")}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeFilter === "traffic"
                ? "bg-traffic text-gray-800"
                : "bg-gray-200 text-gray-700 hover:bg-traffic hover:text-gray-800"
            }`}
          >
            <i className="fas fa-traffic-light mr-1"></i>Traffic
          </button>
          <button
            data-testid="filter-hazard"
            onClick={() => onFilterChange("hazard")}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeFilter === "hazard"
                ? "bg-hazard text-white"
                : "bg-gray-200 text-gray-700 hover:bg-hazard hover:text-white"
            }`}
          >
            <i className="fas fa-exclamation-triangle mr-1"></i>Hazards
          </button>
        </div>
      </div>
      
      {/* Alerts list */}
      <div className="overflow-y-auto h-full pb-20">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading alerts...</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {activeFilter === "all" ? "No alerts available" : `No ${activeFilter} alerts`}
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              data-testid={`alert-item-${alert.id}`}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 ${getAlertColor(alert.type)} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${getAlertTextColor(alert.type)}`}>
                      {getAlertTypeLabel(alert.type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    <span>{alert.location}</span>
                    <span className="mx-2">•</span>
                    <span>{calculateDistance(alert.latitude, alert.longitude)} mi away</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
