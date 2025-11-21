import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Alert, SeverityLevel } from '@/types';
import toast from 'react-hot-toast';

// Calculate distance between two points (Haversine formula)
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const useAlerts = () => {
  const userLocation = useStore((state) => state.userLocation);
  const accidentZones = useStore((state) => state.accidentZones);
  const hazards = useStore((state) => state.hazards);
  const addAlert = useStore((state) => state.addAlert);
  const alerts = useStore((state) => state.alerts);
  
  const notifiedZones = useRef<Set<string>>(new Set());
  const notifiedHazards = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userLocation) return;

    // Check accident zones
    accidentZones.forEach((zone) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        zone.lat,
        zone.lng
      );

      // Alert if within zone radius and not already notified
      if (distance <= zone.radius && !notifiedZones.current.has(zone.id)) {
        const alert: Alert = {
          id: `zone-${zone.id}-${Date.now()}`,
          type: 'zone',
          title: `⚠️ ${zone.name}`,
          message: `You are approaching a ${zone.severity} severity accident zone. Distance: ${Math.round(distance)}m`,
          severity: zone.severity,
          timestamp: new Date(),
          lat: zone.lat,
          lng: zone.lng,
          dismissed: false,
        };

        addAlert(alert);
        notifiedZones.current.add(zone.id);

        // Show toast notification
        const toastOptions = {
          duration: 5000,
          icon: getSeverityIcon(zone.severity),
          style: {
            background: getSeverityColor(zone.severity),
            color: '#fff',
          },
        };
        toast(alert.message, toastOptions);

        // Play alert sound
        playAlertSound(zone.severity);

        // Vibrate if supported
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      }

      // Reset notification if user moved away
      if (distance > zone.radius + 100) {
        notifiedZones.current.delete(zone.id);
      }
    });

    // Check hazards (smaller radius)
    hazards.forEach((hazard) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        hazard.lat,
        hazard.lng
      );

      const HAZARD_RADIUS = 200; // 200m radius for hazards

      if (distance <= HAZARD_RADIUS && !notifiedHazards.current.has(hazard.id)) {
        const alert: Alert = {
          id: `hazard-${hazard.id}-${Date.now()}`,
          type: 'hazard',
          title: `⚠️ Road Hazard: ${hazard.type}`,
          message: `${hazard.description}. Distance: ${Math.round(distance)}m`,
          severity: 'medium',
          timestamp: new Date(),
          lat: hazard.lat,
          lng: hazard.lng,
          dismissed: false,
        };

        addAlert(alert);
        notifiedHazards.current.add(hazard.id);

        toast(alert.message, {
          duration: 4000,
          icon: '⚠️',
        });

        playAlertSound('medium');
      }

      if (distance > HAZARD_RADIUS + 100) {
        notifiedHazards.current.delete(hazard.id);
      }
    });
  }, [userLocation, accidentZones, hazards, addAlert]);
};

const getSeverityIcon = (severity: SeverityLevel): string => {
  const icons = {
    low: '⚠️',
    medium: '⚠️',
    high: '🚨',
    critical: '🚨',
  };
  return icons[severity];
};

const getSeverityColor = (severity: SeverityLevel): string => {
  const colors = {
    low: 'hsl(142, 76%, 36%)',
    medium: 'hsl(45, 93%, 47%)',
    high: 'hsl(25, 95%, 53%)',
    critical: 'hsl(0, 84%, 60%)',
  };
  return colors[severity];
};

const playAlertSound = (severity: SeverityLevel) => {
  try {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different severities
    const frequencies = {
      low: 400,
      medium: 600,
      high: 800,
      critical: 1000,
    };

    oscillator.frequency.value = frequencies[severity];
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error('Error playing alert sound:', error);
  }
};
