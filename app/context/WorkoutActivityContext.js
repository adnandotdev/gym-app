import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

const WorkoutActivityContext = createContext(null);
const HISTORY_LIMIT = 50;

const getStorageKey = (user) => `@workout_activity_${user?._id || user?.id || 'local'}`;

const normalizeRecord = (record) => ({
  id: record.id,
  day: record.day,
  startedAt: record.startedAt,
  completedAt: record.completedAt || Date.now(),
  totalElapsedSeconds: record.totalElapsedSeconds || 0,
  completedCount: record.completedCount || 0,
  skippedCount: record.skippedCount || 0,
  totalCount: record.totalCount || 0,
  items: (record.items || []).map((item) => ({ ...item })),
});

export function WorkoutActivityProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const historyRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const storageKey = useMemo(() => getStorageKey(user), [user]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    historyRef.current = [];
    setHistory([]);
    try {
      const stored = await AsyncStorage.getItem(storageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      const normalizedHistory = Array.isArray(parsed)
        ? parsed.slice(0, HISTORY_LIMIT).map(normalizeRecord)
        : [];
      historyRef.current = normalizedHistory;
      setHistory(normalizedHistory);
    } catch (error) {
      console.warn('Workout history could not be loaded.', error);
      historyRef.current = [];
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const recordWorkout = useCallback(async (record) => {
    const normalized = normalizeRecord(record);
    const nextHistory = [
      normalized,
      ...historyRef.current.filter((item) => item.id !== normalized.id),
    ].slice(0, HISTORY_LIMIT);
    historyRef.current = nextHistory;
    setHistory(nextHistory);
    await AsyncStorage.setItem(storageKey, JSON.stringify(nextHistory));
    return normalized;
  }, [storageKey]);

  return (
    <WorkoutActivityContext.Provider value={{ history, loading, loadHistory, recordWorkout }}>
      {children}
    </WorkoutActivityContext.Provider>
  );
}

export const useWorkoutActivity = () => {
  const context = useContext(WorkoutActivityContext);
  if (!context) throw new Error('useWorkoutActivity must be used within WorkoutActivityProvider');
  return context;
};
