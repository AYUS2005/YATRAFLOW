import { useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import { AccidentZone } from '@/types';

export const useAccidentZones = () => {
  const setAccidentZones = useStore((state) => state.setAccidentZones);

  useEffect(() => {
    const q = query(
      collection(db, 'accident_zones'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const zones: AccidentZone[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          zones.push({
            id: doc.id,
            name: data.name,
            lat: data.lat,
            lng: data.lng,
            severity: data.severity,
            radius: data.radius || 500,
            description: data.description,
            timestamp: data.timestamp?.toDate() || new Date(),
            createdBy: data.createdBy,
          });
        });
        setAccidentZones(zones);
      },
      (error) => {
        console.error('Error fetching accident zones:', error);
      }
    );

    return () => unsubscribe();
  }, [setAccidentZones]);
};
