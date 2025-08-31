export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  notes?: string;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: WorkoutSet[];
  restTime: number;
  targetReps?: string;
  targetSets?: number;
}

export interface WorkoutSession {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  exercises: WorkoutExercise[];
  notes?: string;
  routineId?: string;
  totalVolume: number;
  completedSets: number;
  totalSets: number;
  duration?: number; // in minutes
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  description?: string;
  instructions?: string[];
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  exercises: {
    exercise: Exercise;
    sets: number;
    reps: string;
    restTime: number;
    notes?: string;
  }[];
}

export interface WorkoutHistory {
  [date: string]: WorkoutSession[];
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  favoriteExercises: string[];
  muscleGroupFocus: { [key: string]: number };
  weeklyProgress: { [week: string]: number };
}
