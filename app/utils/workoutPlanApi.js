import api from './api';

const handleApiError = (error, defaultMessage) => {
  const message = error.response?.data?.message || error.message || defaultMessage;
  throw new Error(message);
};

export const fetchWorkoutPlan = async () => {
  try {
    const response = await api.get('/workout-plan');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to parse plan response');
  } catch (error) {
    handleApiError(error, 'Failed to fetch workout plan');
  }
};

export const updateDayExercises = async (day, exercises) => {
  try {
    const response = await api.put('/workout-plan/day', { day, exercises });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update day response');
  } catch (error) {
    handleApiError(error, 'Failed to update day exercises');
  }
};

export const addExerciseToDay = async (day, exercise) => {
  try {
    const response = await api.post('/workout-plan/add-exercise', { day, exercise });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to add exercise response');
  } catch (error) {
    handleApiError(error, 'Failed to add exercise to plan');
  }
};

export const removeExerciseFromDay = async (day, exerciseId) => {
  try {
    const response = await api.delete('/workout-plan/remove-exercise', {
      body: { day, exerciseId },
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to remove exercise response');
  } catch (error) {
    handleApiError(error, 'Failed to remove exercise from plan');
  }
};

export const clearDay = async (day) => {
  try {
    const response = await api.delete('/workout-plan/clear-day', {
      body: { day },
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to clear day response');
  } catch (error) {
    handleApiError(error, 'Failed to clear day');
  }
};
