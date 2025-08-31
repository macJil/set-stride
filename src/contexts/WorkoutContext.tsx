import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { WorkoutSession, WorkoutHistory, WorkoutStats } from '@/types/workout';
import { workoutStorage } from '@/services/workoutStorage';

interface WorkoutState {
  workoutHistory: WorkoutHistory;
  currentWorkout: WorkoutSession | null;
  stats: WorkoutStats;
}

type WorkoutAction =
  | { type: 'START_WORKOUT'; payload: WorkoutSession }
  | { type: 'UPDATE_WORKOUT'; payload: Partial<WorkoutSession> }
  | { type: 'FINISH_WORKOUT'; payload: WorkoutSession }
  | { type: 'DELETE_WORKOUT'; payload: { date: string; workoutId: string } }
  | { type: 'EDIT_WORKOUT_TIME'; payload: { workoutId: string; startTime: Date; endTime?: Date } }
  | { type: 'LOAD_HISTORY'; payload: WorkoutHistory };

const initialState: WorkoutState = {
  workoutHistory: {},
  currentWorkout: null,
  stats: {
    totalWorkouts: 0,
    totalVolume: 0,
    averageDuration: 0,
    favoriteExercises: [],
    muscleGroupFocus: {},
    weeklyProgress: {}
  }
};

function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'START_WORKOUT':
      return {
        ...state,
        currentWorkout: action.payload
      };

    case 'UPDATE_WORKOUT':
      if (!state.currentWorkout) return state;
      return {
        ...state,
        currentWorkout: { ...state.currentWorkout, ...action.payload }
      };

    case 'FINISH_WORKOUT': {
      const finishedWorkout = action.payload;
      const dateKey = finishedWorkout.startTime.toISOString().split('T')[0];
      
      const updatedHistory = {
        ...state.workoutHistory,
        [dateKey]: [
          ...(state.workoutHistory[dateKey] || []),
          finishedWorkout
        ]
      };

      // Update stats
      const allWorkouts = Object.values(updatedHistory).flat();
      const stats = calculateStats(allWorkouts);

      return {
        ...state,
        workoutHistory: updatedHistory,
        currentWorkout: null,
        stats
      };
    }

    case 'DELETE_WORKOUT': {
      const { date, workoutId } = action.payload;
      const updatedHistory = {
        ...state.workoutHistory,
        [date]: state.workoutHistory[date]?.filter(w => w.id !== workoutId) || []
      };

      // Remove empty dates
      if (updatedHistory[date].length === 0) {
        delete updatedHistory[date];
      }

      const allWorkouts = Object.values(updatedHistory).flat();
      const stats = calculateStats(allWorkouts);

      return {
        ...state,
        workoutHistory: updatedHistory,
        stats
      };
    }

    case 'EDIT_WORKOUT_TIME': {
      const { workoutId, startTime, endTime } = action.payload;
      const updatedHistory = { ...state.workoutHistory };
      
      // Find and update the workout
      Object.keys(updatedHistory).forEach(date => {
        updatedHistory[date] = updatedHistory[date].map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              startTime,
              endTime,
              duration: endTime ? Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) : undefined
            };
          }
          return workout;
        });
      });

      const allWorkouts = Object.values(updatedHistory).flat();
      const stats = calculateStats(allWorkouts);

      return {
        ...state,
        workoutHistory: updatedHistory,
        stats
      };
    }

    case 'LOAD_HISTORY':
      const allWorkouts = Object.values(action.payload).flat();
      const stats = calculateStats(allWorkouts);
      return {
        ...state,
        workoutHistory: action.payload,
        stats
      };

    default:
      return state;
  }
}

function calculateStats(workouts: WorkoutSession[]): WorkoutStats {
  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalVolume: 0,
      averageDuration: 0,
      favoriteExercises: [],
      muscleGroupFocus: {},
      weeklyProgress: {}
    };
  }

  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, w) => sum + w.totalVolume, 0);
  const completedWorkouts = workouts.filter(w => w.duration);
  const averageDuration = completedWorkouts.length > 0 
    ? Math.round(completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / completedWorkouts.length)
    : 0;

  // Calculate favorite exercises
  const exerciseCount: { [key: string]: number } = {};
  workouts.forEach(workout => {
    workout.exercises.forEach(ex => {
      exerciseCount[ex.exercise.name] = (exerciseCount[ex.exercise.name] || 0) + 1;
    });
  });
  const favoriteExercises = Object.entries(exerciseCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name]) => name);

  // Calculate muscle group focus
  const muscleGroupCount: { [key: string]: number } = {};
  workouts.forEach(workout => {
    workout.exercises.forEach(ex => {
      muscleGroupCount[ex.exercise.muscleGroup] = (muscleGroupCount[ex.exercise.muscleGroup] || 0) + 1;
    });
  });

  // Calculate weekly progress
  const weeklyProgress: { [key: string]: number } = {};
  workouts.forEach(workout => {
    const weekStart = new Date(workout.startTime);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    weeklyProgress[weekKey] = (weeklyProgress[weekKey] || 0) + 1;
  });

  return {
    totalWorkouts,
    totalVolume,
    averageDuration,
    favoriteExercises,
    muscleGroupFocus: muscleGroupCount,
    weeklyProgress
  };
}

interface WorkoutContextType {
  state: WorkoutState;
  startWorkout: (workout: WorkoutSession) => void;
  updateWorkout: (updates: Partial<WorkoutSession>) => void;
  finishWorkout: (workout: WorkoutSession) => void;
  deleteWorkout: (date: string, workoutId: string) => void;
  editWorkoutTime: (workoutId: string, startTime: Date, endTime?: Date) => void;
  getWorkoutsByDate: (date: string) => WorkoutSession[];
  getWorkoutById: (workoutId: string) => WorkoutSession | null;
  exportData: () => string;
  importData: (data: string) => boolean;
  getStorageStats: () => ReturnType<typeof workoutStorage.getStorageStats>;
  clearAllData: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  useEffect(() => {
    // Load workout history from storage service on mount
    try {
      const savedHistory = workoutStorage.loadWorkoutHistory();
      dispatch({ type: 'LOAD_HISTORY', payload: savedHistory });
    } catch (error) {
      console.error('Failed to load workout history:', error);
    }
  }, []);

  useEffect(() => {
    // Save workout history to storage service whenever it changes
    if (Object.keys(state.workoutHistory).length > 0) {
      try {
        workoutStorage.saveWorkoutHistory(state.workoutHistory);
      } catch (error) {
        console.error('Failed to save workout history:', error);
      }
    }
  }, [state.workoutHistory]);

  const startWorkout = (workout: WorkoutSession) => {
    dispatch({ type: 'START_WORKOUT', payload: workout });
  };

  const updateWorkout = (updates: Partial<WorkoutSession>) => {
    dispatch({ type: 'UPDATE_WORKOUT', payload: updates });
  };

  const finishWorkout = (workout: WorkoutSession) => {
    dispatch({ type: 'FINISH_WORKOUT', payload: workout });
  };

  const deleteWorkout = (date: string, workoutId: string) => {
    dispatch({ type: 'DELETE_WORKOUT', payload: { date, workoutId } });
  };

  const editWorkoutTime = (workoutId: string, startTime: Date, endTime?: Date) => {
    dispatch({ type: 'EDIT_WORKOUT_TIME', payload: { workoutId, startTime, endTime } });
  };

  const getWorkoutsByDate = (date: string): WorkoutSession[] => {
    return state.workoutHistory[date] || [];
  };

  const getWorkoutById = (workoutId: string): WorkoutSession | null => {
    for (const date in state.workoutHistory) {
      const workout = state.workoutHistory[date].find(w => w.id === workoutId);
      if (workout) return workout;
    }
    return null;
  };

  const exportData = (): string => {
    return workoutStorage.exportWorkoutData();
  };

  const importData = (data: string): boolean => {
    const success = workoutStorage.importWorkoutData(data);
    if (success) {
      const importedHistory = workoutStorage.loadWorkoutHistory();
      dispatch({ type: 'LOAD_HISTORY', payload: importedHistory });
    }
    return success;
  };

  const getStorageStats = () => {
    return workoutStorage.getStorageStats();
  };

  const clearAllData = () => {
    workoutStorage.clearAllData();
    dispatch({ type: 'LOAD_HISTORY', payload: {} });
  };

  const value: WorkoutContextType = {
    state,
    startWorkout,
    updateWorkout,
    finishWorkout,
    deleteWorkout,
    editWorkoutTime,
    getWorkoutsByDate,
    getWorkoutById,
    exportData,
    importData,
    getStorageStats,
    clearAllData
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
