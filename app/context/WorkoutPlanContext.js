import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { AuthContext } from './AuthContext';
import { getWorkoutExerciseIdentity } from '../data/exerciseVariations';
import { 
  fetchWorkoutPlan, 
  addExerciseToDay, 
  removeExerciseFromDay, 
  updateDayExercises, 
  clearDay as apiClearDay 
} from '../utils/workoutPlanApi';

const WorkoutPlanContext = createContext();

const emptyPlan = {
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
};

export const WorkoutPlanProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [plan, setPlan] = useState(emptyPlan);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // One-time migration from AsyncStorage to MongoDB
  const migrateFromAsyncStorage = async () => {
    try {
      const migrationFlag = await AsyncStorage.getItem('@migration_complete');
      if (migrationFlag === 'true') return;

      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      let migrationOccurred = false;

      for (const day of days) {
        const key = `@workout_plan_${day.toLowerCase()}`;
        const stored = await AsyncStorage.getItem(key);
        
        if (stored) {
          const exercises = JSON.parse(stored);
          if (exercises.length > 0) {
            await updateDayExercises(day, exercises);
            migrationOccurred = true;
          }
          await AsyncStorage.removeItem(key); // Always clean up old keys
        }
      }

      await AsyncStorage.setItem('@migration_complete', 'true');
      if (migrationOccurred) {
        console.log('✅ Migration from AsyncStorage to MongoDB complete.');
      }
    } catch (err) {
      console.error('Migration failed:', err);
    }
  };

  const loadPlan = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      await migrateFromAsyncStorage(); // Run migration check first
      const data = await fetchWorkoutPlan();
      setPlan(data || emptyPlan);
    } catch (err) {
      setError(err.message);
      Toast.show({ type: 'error', text1: 'Sync Error', text2: err.message });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load plan automatically on mount if authenticated
  useEffect(() => {
    if (user) {
      loadPlan();
    }
  }, [user, loadPlan]);

  const addExercise = async (day, exercise) => {
    // Check local duplicate first
    const exerciseIdentity = getWorkoutExerciseIdentity(exercise);
    const exists = plan[day]?.some(
      (existingExercise) => getWorkoutExerciseIdentity(existingExercise) === exerciseIdentity
    );
    if (exists) {
      throw new Error('Exercise already in plan for this day');
    }

    // Optimistic Update
    const previousPlan = { ...plan };
    setPlan(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), exercise]
    }));

    try {
      const updatedDay = await addExerciseToDay(day, exercise);
      // Ensure state is perfectly synced with server response (IDs, timestamps)
      setPlan(prev => ({ ...prev, [day]: updatedDay }));
    } catch (err) {
      // Revert on failure
      setPlan(previousPlan);
      throw err;
    }
  };

  const removeExercise = async (day, exerciseId) => {
    // Optimistic Update
    const previousPlan = { ...plan };
    setPlan(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(ex => ex.id !== exerciseId)
    }));

    try {
      await removeExerciseFromDay(day, exerciseId);
    } catch (err) {
      // Revert on failure
      setPlan(previousPlan);
      Toast.show({ type: 'error', text1: 'Failed to remove', text2: err.message });
      throw err;
    }
  };

  const clearDay = async (day) => {
    // Optimistic Update
    const previousPlan = { ...plan };
    setPlan(prev => ({ ...prev, [day]: [] }));

    try {
      await apiClearDay(day);
    } catch (err) {
      // Revert on failure
      setPlan(previousPlan);
      Toast.show({ type: 'error', text1: 'Failed to clear', text2: err.message });
      throw err;
    }
  };

  return (
    <WorkoutPlanContext.Provider value={{
      plan,
      loading,
      error,
      loadPlan,
      addExercise,
      removeExercise,
      clearDay
    }}>
      {children}
    </WorkoutPlanContext.Provider>
  );
};

export const useWorkoutPlan = () => useContext(WorkoutPlanContext);
