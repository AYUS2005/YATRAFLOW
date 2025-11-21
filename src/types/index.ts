export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type UserRole = 'user' | 'admin';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface AccidentZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: SeverityLevel;
  radius: number; // in meters
  description?: string;
  timestamp: Date;
  createdBy: string;
}

export interface Hazard {
  id: string;
  type: 'pothole' | 'debris' | 'construction' | 'accident' | 'other';
  lat: number;
  lng: number;
  description: string;
  reportedBy: string;
  reportedByName?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
  approvedBy?: string;
}

export interface Alert {
  id: string;
  type: 'zone' | 'hazard';
  title: string;
  message: string;
  severity: SeverityLevel;
  timestamp: Date;
  lat: number;
  lng: number;
  dismissed: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: Date;
}
