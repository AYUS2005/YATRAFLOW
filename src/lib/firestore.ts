import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { AccidentZone, Hazard } from '@/types';

// Accident Zones
export const addAccidentZone = async (zone: Omit<AccidentZone, 'id' | 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'accident_zones'), {
      ...zone,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding accident zone:', error);
    return { success: false, error };
  }
};

export const updateAccidentZone = async (zoneId: string, data: Partial<AccidentZone>) => {
  try {
    await updateDoc(doc(db, 'accident_zones', zoneId), data);
    return { success: true };
  } catch (error) {
    console.error('Error updating accident zone:', error);
    return { success: false, error };
  }
};

export const deleteAccidentZone = async (zoneId: string) => {
  try {
    await deleteDoc(doc(db, 'accident_zones', zoneId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting accident zone:', error);
    return { success: false, error };
  }
};

// Hazards
export const addHazard = async (hazard: Omit<Hazard, 'id' | 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'hazards'), {
      ...hazard,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding hazard:', error);
    return { success: false, error };
  }
};

export const updateHazardStatus = async (
  hazardId: string,
  status: 'approved' | 'rejected',
  adminUid: string
) => {
  try {
    const updateData: any = {
      status,
      [`${status}By`]: adminUid,
      [`${status}At`]: serverTimestamp(),
    };
    await updateDoc(doc(db, 'hazards', hazardId), updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating hazard status:', error);
    return { success: false, error };
  }
};

export const deleteHazard = async (hazardId: string) => {
  try {
    await deleteDoc(doc(db, 'hazards', hazardId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting hazard:', error);
    return { success: false, error };
  }
};
