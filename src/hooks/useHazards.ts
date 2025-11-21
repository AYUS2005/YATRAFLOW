import { useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import { Hazard } from '@/types';

export const useHazards = () => {
  const setHazards = useStore((state) => state.setHazards);

  useEffect(() => {
    // Only fetch approved hazards for regular users
    const q = query(
      collection(db, 'hazards'),
      where('status', '==', 'approved'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const hazards: Hazard[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          hazards.push({
            id: doc.id,
            type: data.type,
            lat: data.lat,
            lng: data.lng,
            description: data.description,
            reportedBy: data.reportedBy,
            reportedByName: data.reportedByName,
            status: data.status,
            timestamp: data.timestamp?.toDate() || new Date(),
            approvedBy: data.approvedBy,
          });
        });
        setHazards(hazards);
      },
      (error) => {
        console.error('Error fetching hazards:', error);
      }
    );

    return () => unsubscribe();
  }, [setHazards]);
};
