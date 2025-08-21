import { useQuery } from "@tanstack/react-query";
import { Alert } from "@shared/schema";

interface MapContainerProps {
  onToggleSidebar: () => void;
  activeFilter: string;
}

export default function MapContainer({ onToggleSidebar, activeFilter }: MapContainerProps) {
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const filteredAlerts = alerts.filter(alert => 
    activeFilter === "all" || alert.type === activeFilter
  );

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "accident": return "bg-accident";
      case "traffic": return "bg-traffic";
      case "hazard": return "bg-hazard";
      default: return "bg-gray-400";
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "accident": return "fas fa-car-crash";
      case "traffic": return "fas fa-traffic-light";
      case "hazard": return "fas fa-exclamation-triangle";
      default: return "fas fa-circle";
    }
  };

  const getMarkerTextColor = (type: string) => {
    return type === "traffic" ? "text-gray-800" : "text-white";
  };

  // Mock marker positions based on alert data
  const getMarkerPosition = (alert: Alert, index: number) => {
    const positions = [
      { top: "20%", left: "30%" },
      { top: "40%", left: "45%" },
      { bottom: "30%", right: "30%" },
      { top: "60%", left: "25%" },
    ];
    return positions[index % positions.length];
  };

  return (
    <main className="flex-1 relative">
      {/* Map placeholder with mock visualization */}
      <div className="w-full h-full bg-gray-200 relative overflow-hidden">
        {/* Street grid background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Mock street names */}
        <div className="absolute top-20 left-32 text-gray-600 text-sm font-medium transform -rotate-12">Main Street</div>
        <div className="absolute top-40 left-20 text-gray-600 text-sm font-medium">Highway 101</div>
        <div className="absolute bottom-40 right-32 text-gray-600 text-sm font-medium transform rotate-45">Oak Street</div>
        
        {/* Alert markers on map */}
        {filteredAlerts.map((alert, index) => (
          <div
            key={alert.id}
            data-testid={`map-marker-${alert.id}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={getMarkerPosition(alert, index)}
          >
            <div className={`w-8 h-8 ${getMarkerColor(alert.type)} rounded-full flex items-center justify-center ${getMarkerTextColor(alert.type)} shadow-lg hover:scale-110 transition-transform`}>
              <i className={`${getMarkerIcon(alert.type)} text-xs`}></i>
            </div>
            <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 ${getMarkerColor(alert.type)} ${getMarkerTextColor(alert.type)} text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
              {alert.location}
            </div>
          </div>
        ))}
        
        {/* User location marker */}
        <div 
          data-testid="user-location-marker"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          <div className="absolute -inset-2 border-2 border-primary rounded-full opacity-30 animate-ping"></div>
        </div>
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button
            data-testid="button-zoom-in"
            className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-plus text-gray-600"></i>
          </button>
          <button
            data-testid="button-zoom-out"
            className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-minus text-gray-600"></i>
          </button>
          <button
            data-testid="button-center-user"
            className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-crosshairs text-gray-600"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile sidebar toggle */}
      <button
        data-testid="button-toggle-sidebar"
        className="lg:hidden absolute top-4 left-4 z-50 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center"
        onClick={onToggleSidebar}
      >
        <i className="fas fa-bars text-gray-600"></i>
      </button>
    </main>
  );
}
