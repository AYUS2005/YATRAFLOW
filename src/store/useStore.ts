import { create } from 'zustand';
import { User, AccidentZone, Hazard, Alert, UserLocation } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Location
  userLocation: UserLocation | null;
  setUserLocation: (location: UserLocation | null) => void;
  
  // Zones & Hazards
  accidentZones: AccidentZone[];
  setAccidentZones: (zones: AccidentZone[]) => void;
  hazards: Hazard[];
  setHazards: (hazards: Hazard[]) => void;
  
  // Alerts
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  dismissAlert: (alertId: string) => void;
  clearAlerts: () => void;
  
  // UI State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isReportFormOpen: boolean;
  setReportFormOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),
  
  // Location
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
  
  // Zones & Hazards
  accidentZones: [],
  setAccidentZones: (zones) => set({ accidentZones: zones }),
  hazards: [],
  setHazards: (hazards) => set({ hazards }),
  
  // Alerts
  alerts: [],
  addAlert: (alert) => set((state) => ({ 
    alerts: [...state.alerts, alert] 
  })),
  dismissAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map(a => 
      a.id === alertId ? { ...a, dismissed: true } : a
    )
  })),
  clearAlerts: () => set({ alerts: [] }),
  
  // UI State
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isReportFormOpen: false,
  setReportFormOpen: (open) => set({ isReportFormOpen: open }),
}));
