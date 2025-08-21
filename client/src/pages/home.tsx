import { useState } from "react";
import Header from "@/components/header";
import AlertsSidebar from "@/components/alerts-sidebar";
import MapContainer from "@/components/map-container";
import ReportAlertModal from "@/components/report-alert-modal";
import MobileNavigation from "@/components/mobile-navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const isMobile = useIsMobile();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  return (
    <div className="min-h-screen bg-background text-gray-800 font-inter">
      <Header />
      
      <div className="flex h-screen pt-16 relative">
        <AlertsSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        <MapContainer 
          onToggleSidebar={toggleSidebar}
          activeFilter={activeFilter}
        />
        
        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            data-testid="button-report-alert"
            onClick={openReportModal}
            className="w-14 h-14 bg-primary hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <i className="fas fa-plus text-xl"></i>
          </button>
        </div>
      </div>

      <ReportAlertModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
      />

      {isMobile && (
        <MobileNavigation
          onOpenReport={openReportModal}
        />
      )}
    </div>
  );
}
