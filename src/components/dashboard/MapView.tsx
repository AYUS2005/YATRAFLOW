import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '@/store/useStore';
import { SeverityLevel } from '@/types';

const MAPTILER_API_KEY = 'YOUR_MAPTILER_API_KEY'; // Replace with your MapTiler API key

const getSeverityColor = (severity: SeverityLevel): string => {
  const colors = {
    low: '#22c55e',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
  };
  return colors[severity];
};

export const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const userMarker = useRef<maplibregl.Marker | null>(null);
  const zoneMarkers = useRef<maplibregl.Marker[]>([]);
  const hazardMarkers = useRef<maplibregl.Marker[]>([]);

  const userLocation = useStore((state) => state.userLocation);
  const accidentZones = useStore((state) => state.accidentZones);
  const hazards = useStore((state) => state.hazards);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
      center: [77.5946, 12.9716], // Default: Bangalore
      zoom: 12,
      pitch: 45,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!map.current || !userLocation) return;

    if (!userMarker.current) {
      // Create user marker
      const el = document.createElement('div');
      el.className = 'w-6 h-6 bg-primary rounded-full border-4 border-primary-foreground shadow-lg pulse-glow';
      
      userMarker.current = new maplibregl.Marker({ element: el })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);

      // Center map on user location
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 14,
        duration: 2000,
      });
    } else {
      // Update existing marker
      userMarker.current.setLngLat([userLocation.lng, userLocation.lat]);
    }
  }, [userLocation]);

  // Update accident zone markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing zone markers
    zoneMarkers.current.forEach((marker) => marker.remove());
    zoneMarkers.current = [];

    // Add new zone markers
    accidentZones.forEach((zone) => {
      const el = document.createElement('div');
      el.className = 'relative';
      
      // Outer circle (radius indicator)
      const radiusCircle = document.createElement('div');
      radiusCircle.style.cssText = `
        width: 60px;
        height: 60px;
        background: ${getSeverityColor(zone.severity)}20;
        border: 2px solid ${getSeverityColor(zone.severity)};
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: pulse 2s ease-in-out infinite;
      `;
      el.appendChild(radiusCircle);

      // Inner marker
      const marker = document.createElement('div');
      marker.style.cssText = `
        width: 20px;
        height: 20px;
        background: ${getSeverityColor(zone.severity)};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
        z-index: 10;
      `;
      el.appendChild(marker);

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm mb-1">${zone.name}</h3>
          <p class="text-xs text-muted-foreground mb-1">Severity: <span class="font-semibold capitalize">${zone.severity}</span></p>
          ${zone.description ? `<p class="text-xs">${zone.description}</p>` : ''}
          <p class="text-xs text-muted-foreground mt-1">Radius: ${zone.radius}m</p>
        </div>
      `);

      const mapMarker = new maplibregl.Marker({ element: el })
        .setLngLat([zone.lng, zone.lat])
        .setPopup(popup)
        .addTo(map.current!);

      zoneMarkers.current.push(mapMarker);
    });
  }, [accidentZones]);

  // Update hazard markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing hazard markers
    hazardMarkers.current.forEach((marker) => marker.remove());
    hazardMarkers.current = [];

    // Add new hazard markers
    hazards.forEach((hazard) => {
      const el = document.createElement('div');
      el.className = 'text-2xl';
      el.innerHTML = getHazardIcon(hazard.type);

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm mb-1 capitalize">${hazard.type}</h3>
          <p class="text-xs mb-1">${hazard.description}</p>
          <p class="text-xs text-muted-foreground">Reported by: ${hazard.reportedByName || 'Anonymous'}</p>
        </div>
      `);

      const mapMarker = new maplibregl.Marker({ element: el })
        .setLngLat([hazard.lng, hazard.lat])
        .setPopup(popup)
        .addTo(map.current!);

      hazardMarkers.current.push(mapMarker);
    });
  }, [hazards]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden shadow-lg" />
  );
};

const getHazardIcon = (type: string): string => {
  const icons: Record<string, string> = {
    pothole: '🕳️',
    debris: '🚧',
    construction: '🏗️',
    accident: '🚨',
    other: '⚠️',
  };
  return icons[type] || '⚠️';
};
