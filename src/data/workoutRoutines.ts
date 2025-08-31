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
  category: 'Strength' | 'Hypertrophy' | 'Endurance' | 'Home' | 'Gym' | 'Mixed';
  exercises: {
    exercise: Exercise;
    sets: number;
    reps: string;
    restTime: number;
    notes?: string;
  }[];
}

export const exerciseLibrary: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'Chest', equipment: 'Barbell', description: 'Compound chest exercise targeting pectoralis major' },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbells', description: 'Upper chest focus with dumbbells' },
  { id: 'decline-bench-press', name: 'Decline Bench Press', muscleGroup: 'Chest', equipment: 'Barbell', description: 'Lower chest emphasis' },
  { id: 'chest-flyes', name: 'Chest Flyes', muscleGroup: 'Chest', equipment: 'Dumbbells', description: 'Isolation exercise for chest' },
  { id: 'push-ups', name: 'Push-ups', muscleGroup: 'Chest', equipment: 'Bodyweight', description: 'Bodyweight chest exercise' },
  { id: 'diamond-push-ups', name: 'Diamond Push-ups', muscleGroup: 'Chest', equipment: 'Bodyweight', description: 'Tricep-focused push-up variation' },
  { id: 'wide-push-ups', name: 'Wide Push-ups', muscleGroup: 'Chest', equipment: 'Bodyweight', description: 'Wide grip for chest focus' },
  { id: 'dumbbell-press', name: 'Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbells', description: 'Flat bench dumbbell press' },
  
  // Back
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell', description: 'Compound back exercise' },
  { id: 'pull-ups', name: 'Pull-ups', muscleGroup: 'Back', equipment: 'Bodyweight', description: 'Upper body pulling exercise' },
  { id: 'barbell-rows', name: 'Barbell Rows', muscleGroup: 'Back', equipment: 'Barbell', description: 'Mid-back thickness builder' },
  { id: 'lat-pulldowns', name: 'Lat Pulldowns', muscleGroup: 'Back', equipment: 'Machine', description: 'Latissimus dorsi focus' },
  { id: 'face-pulls', name: 'Face Pulls', muscleGroup: 'Back', equipment: 'Cable', description: 'Rear deltoid and upper back' },
  { id: 'dumbbell-rows', name: 'Dumbbell Rows', muscleGroup: 'Back', equipment: 'Dumbbells', description: 'Single-arm dumbbell rows' },
  { id: 't-bar-rows', name: 'T-Bar Rows', muscleGroup: 'Back', equipment: 'Machine', description: 'T-bar row machine exercise' },
  { id: 'assisted-pull-ups', name: 'Assisted Pull-ups', muscleGroup: 'Back', equipment: 'Machine', description: 'Pull-ups with assistance' },
  
  // Legs
  { id: 'squats', name: 'Squats', muscleGroup: 'Legs', equipment: 'Barbell', description: 'King of leg exercises' },
  { id: 'lunges', name: 'Lunges', muscleGroup: 'Legs', equipment: 'Dumbbells', description: 'Unilateral leg exercise' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine', description: 'Machine-based leg exercise' },
  { id: 'leg-curls', name: 'Leg Curls', muscleGroup: 'Legs', equipment: 'Machine', description: 'Hamstring isolation' },
  { id: 'leg-extensions', name: 'Leg Extensions', muscleGroup: 'Legs', equipment: 'Machine', description: 'Quadriceps isolation' },
  { id: 'calf-raises', name: 'Calf Raises', muscleGroup: 'Legs', equipment: 'Machine', description: 'Calf development' },
  { id: 'goblet-squats', name: 'Goblet Squats', muscleGroup: 'Legs', equipment: 'Dumbbells', description: 'Dumbbell front squat variation' },
  { id: 'bulgarian-split-squats', name: 'Bulgarian Split Squats', muscleGroup: 'Legs', equipment: 'Dumbbells', description: 'Single-leg squat variation' },
  { id: 'step-ups', name: 'Step-ups', muscleGroup: 'Legs', equipment: 'Dumbbells', description: 'Step-up with dumbbells' },
  { id: 'wall-sits', name: 'Wall Sits', muscleGroup: 'Legs', equipment: 'Bodyweight', description: 'Isometric leg exercise' },
  { id: 'jump-squats', name: 'Jump Squats', muscleGroup: 'Legs', equipment: 'Bodyweight', description: 'Explosive squat variation' },
  { id: 'glute-bridges', name: 'Glute Bridges', muscleGroup: 'Legs', equipment: 'Bodyweight', description: 'Glute activation exercise' },
  
  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell', description: 'Compound shoulder press' },
  { id: 'lateral-raises', name: 'Lateral Raises', muscleGroup: 'Shoulders', equipment: 'Dumbbells', description: 'Lateral deltoid focus' },
  { id: 'rear-delt-flyes', name: 'Rear Delt Flyes', muscleGroup: 'Shoulders', equipment: 'Dumbbells', description: 'Rear deltoid development' },
  { id: 'arnold-press', name: 'Arnold Press', muscleGroup: 'Shoulders', equipment: 'Dumbbells', description: 'Rotating shoulder press' },
  { id: 'front-raises', name: 'Front Raises', muscleGroup: 'Shoulders', equipment: 'Dumbbells', description: 'Anterior deltoid focus' },
  { id: 'pike-push-ups', name: 'Pike Push-ups', muscleGroup: 'Shoulders', equipment: 'Bodyweight', description: 'Bodyweight shoulder press' },
  { id: 'handstand-holds', name: 'Handstand Holds', muscleGroup: 'Shoulders', equipment: 'Bodyweight', description: 'Advanced shoulder stability' },
  
  // Arms
  { id: 'bicep-curls', name: 'Bicep Curls', muscleGroup: 'Arms', equipment: 'Dumbbells', description: 'Bicep isolation' },
  { id: 'tricep-dips', name: 'Tricep Dips', muscleGroup: 'Arms', equipment: 'Bodyweight', description: 'Tricep compound exercise' },
  { id: 'hammer-curls', name: 'Hammer Curls', muscleGroup: 'Arms', equipment: 'Dumbbells', description: 'Bicep and forearm focus' },
  { id: 'skull-crushers', name: 'Skull Crushers', muscleGroup: 'Arms', equipment: 'Barbell', description: 'Lying tricep extension' },
  { id: 'concentration-curls', name: 'Concentration Curls', muscleGroup: 'Arms', equipment: 'Dumbbells', description: 'Isolated bicep curl' },
  { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', muscleGroup: 'Arms', equipment: 'Dumbbells', description: 'Overhead tricep stretch' },
  { id: 'preacher-curls', name: 'Preacher Curls', muscleGroup: 'Arms', equipment: 'Barbell', description: 'Preacher bench bicep curls' },
  { id: 'close-grip-bench', name: 'Close Grip Bench Press', muscleGroup: 'Arms', equipment: 'Barbell', description: 'Tricep-focused bench press' },
  
  // Core
  { id: 'planks', name: 'Planks', muscleGroup: 'Core', equipment: 'Bodyweight', description: 'Core stability exercise' },
  { id: 'crunches', name: 'Crunches', muscleGroup: 'Core', equipment: 'Bodyweight', description: 'Abdominal exercise' },
  { id: 'russian-twists', name: 'Russian Twists', muscleGroup: 'Core', equipment: 'Bodyweight', description: 'Rotational core exercise' },
  { id: 'leg-raises', name: 'Leg Raises', muscleGroup: 'Core', equipment: 'Bodyweight', description: 'Lower abdominal focus' },
  { id: 'mountain-climbers', name: 'Mountain Climbers', muscleGroup: 'Core', equipment: 'Bodyweight', description: 'Dynamic core exercise' },
  { id: 'bicycle-crunches', name: 'Bicycle Crunches', muscleGroup: 'Core', equipment: 'Bodyweight', description: 'Advanced crunch variation' },
  { id: 'dead-bugs', name: 'Dead Bugs', muscleGroup: 'Core', equipment: 'Bodyweight', description: 'Core stability and coordination' },
  { id: 'side-planks', name: 'Side Planks', muscleGroup: 'Core', equipment: 'Bodyweight', description: 'Lateral core stability' },
  
  // Cardio/Functional
  { id: 'burpees', name: 'Burpees', muscleGroup: 'Cardio', equipment: 'Bodyweight', description: 'Full body cardio exercise' },
  { id: 'jumping-jacks', name: 'Jumping Jacks', muscleGroup: 'Cardio', equipment: 'Bodyweight', description: 'Classic cardio exercise' },
  { id: 'high-knees', name: 'High Knees', muscleGroup: 'Cardio', equipment: 'Bodyweight', description: 'Running in place variation' },
  { id: 'mountain-climbers-cardio', name: 'Mountain Climbers (Cardio)', muscleGroup: 'Cardio', equipment: 'Bodyweight', description: 'Fast-paced mountain climbers' },
  { id: 'jump-rope', name: 'Jump Rope', muscleGroup: 'Cardio', equipment: 'Bodyweight', description: 'Cardio and coordination' },
  { id: 'box-jumps', name: 'Box Jumps', muscleGroup: 'Cardio', equipment: 'Bodyweight', description: 'Explosive jumping exercise' },
];

export const workoutRoutines: WorkoutRoutine[] = [
  // Toji Fushiguro Routines
  {
    id: 'toji-fushiguro-strength',
    name: 'Toji Fushiguro Strength Routine',
    description: 'A comprehensive strength training program inspired by the legendary Toji Fushiguro, focusing on building raw power and functional strength.',
    difficulty: 'Advanced',
    estimatedDuration: '90-120 minutes',
    category: 'Strength',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'deadlift')!,
        sets: 5,
        reps: '3-5',
        restTime: 180,
        notes: 'Focus on form and explosive power'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'bench-press')!,
        sets: 5,
        reps: '5',
        restTime: 180,
        notes: 'Control the descent, explode up'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'squats')!,
        sets: 5,
        reps: '5',
        restTime: 180,
        notes: 'Go deep, maintain upright torso'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'overhead-press')!,
        sets: 3,
        reps: '5',
        restTime: 120,
        notes: 'Full range of motion'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'pull-ups')!,
        sets: 3,
        reps: '5-8',
        restTime: 120,
        notes: 'Dead hang to chin over bar'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'barbell-rows')!,
        sets: 3,
        reps: '8-10',
        restTime: 120,
        notes: 'Squeeze shoulder blades together'
      }
    ]
  },
  {
    id: 'toji-fushiguro-hypertrophy',
    name: 'Toji Fushiguro Hypertrophy',
    description: 'Muscle building focused routine with higher volume and moderate weights for maximum muscle growth.',
    difficulty: 'Intermediate',
    estimatedDuration: '75-90 minutes',
    category: 'Hypertrophy',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'bench-press')!,
        sets: 4,
        reps: '8-12',
        restTime: 90,
        notes: 'Moderate weight, focus on mind-muscle connection'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'incline-dumbbell-press')!,
        sets: 3,
        reps: '10-12',
        restTime: 90,
        notes: 'Feel the upper chest working'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'chest-flyes')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Light weight, full stretch'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'barbell-rows')!,
        sets: 4,
        reps: '10-12',
        restTime: 90,
        notes: 'Control the movement'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'lat-pulldowns')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Wide grip for lats'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'squats')!,
        sets: 4,
        reps: '10-12',
        restTime: 120,
        notes: 'Moderate depth, controlled movement'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'lunges')!,
        sets: 3,
        reps: '12 each leg',
        restTime: 90,
        notes: 'Alternating legs'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'bicep-curls')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Strict form, no swinging'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'tricep-dips')!,
        sets: 3,
        reps: '10-12',
        restTime: 60,
        notes: 'Body weight or assisted'
      }
    ]
  },
  {
    id: 'toji-fushiguro-endurance',
    name: 'Toji Fushiguro Endurance',
    description: 'High-rep, lower-weight routine focusing on muscular endurance and cardiovascular fitness.',
    difficulty: 'Beginner',
    estimatedDuration: '60-75 minutes',
    category: 'Endurance',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'push-ups')!,
        sets: 4,
        reps: '15-20',
        restTime: 45,
        notes: 'Full range of motion'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'squats')!,
        sets: 4,
        reps: '20-25',
        restTime: 60,
        notes: 'Body weight or light weight'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'lunges')!,
        sets: 3,
        reps: '15 each leg',
        restTime: 45,
        notes: 'Walking lunges'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'planks')!,
        sets: 3,
        reps: '45-60 seconds',
        restTime: 30,
        notes: 'Hold position'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'crunches')!,
        sets: 3,
        reps: '20-25',
        restTime: 30,
        notes: 'Slow and controlled'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'calf-raises')!,
        sets: 4,
        reps: '25-30',
        restTime: 30,
        notes: 'Full range of motion'
      }
    ]
  },

  // Push Pull Legs Split
  {
    id: 'push-day',
    name: 'Push Day (Chest, Shoulders, Triceps)',
    description: 'Classic push day focusing on chest, shoulders, and triceps with compound and isolation movements.',
    difficulty: 'Intermediate',
    estimatedDuration: '60-75 minutes',
    category: 'Gym',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'bench-press')!,
        sets: 4,
        reps: '6-8',
        restTime: 120,
        notes: 'Heavy compound movement'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'incline-dumbbell-press')!,
        sets: 3,
        reps: '8-10',
        restTime: 90,
        notes: 'Upper chest focus'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'overhead-press')!,
        sets: 3,
        reps: '6-8',
        restTime: 90,
        notes: 'Shoulder strength'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'lateral-raises')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Lateral deltoid development'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'chest-flyes')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Chest isolation'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'tricep-dips')!,
        sets: 3,
        reps: '10-12',
        restTime: 60,
        notes: 'Tricep focus'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'skull-crushers')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Tricep isolation'
      }
    ]
  },
  {
    id: 'pull-day',
    name: 'Pull Day (Back, Biceps)',
    description: 'Comprehensive pull day targeting all back muscles and biceps with various pulling movements.',
    difficulty: 'Intermediate',
    estimatedDuration: '60-75 minutes',
    category: 'Gym',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'deadlift')!,
        sets: 4,
        reps: '5-6',
        restTime: 150,
        notes: 'Heavy compound movement'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'pull-ups')!,
        sets: 4,
        reps: '6-10',
        restTime: 90,
        notes: 'Bodyweight back exercise'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'barbell-rows')!,
        sets: 3,
        reps: '8-10',
        restTime: 90,
        notes: 'Mid-back thickness'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'lat-pulldowns')!,
        sets: 3,
        reps: '10-12',
        restTime: 60,
        notes: 'Lat development'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'face-pulls')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Rear deltoid focus'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'bicep-curls')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Bicep isolation'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'hammer-curls')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Forearm and bicep focus'
      }
    ]
  },
  {
    id: 'leg-day',
    name: 'Leg Day (Quads, Hamstrings, Glutes)',
    description: 'Intensive leg day targeting all major leg muscle groups with compound and isolation movements.',
    difficulty: 'Intermediate',
    estimatedDuration: '75-90 minutes',
    category: 'Gym',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'squats')!,
        sets: 4,
        reps: '6-8',
        restTime: 150,
        notes: 'Heavy compound movement'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'leg-press')!,
        sets: 3,
        reps: '8-10',
        restTime: 90,
        notes: 'Machine-based leg exercise'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'lunges')!,
        sets: 3,
        reps: '10 each leg',
        restTime: 90,
        notes: 'Unilateral movement'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'leg-extensions')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Quadriceps isolation'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'leg-curls')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Hamstring isolation'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'calf-raises')!,
        sets: 4,
        reps: '15-20',
        restTime: 45,
        notes: 'Calf development'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'glute-bridges')!,
        sets: 3,
        reps: '15-20',
        restTime: 60,
        notes: 'Glute activation'
      }
    ]
  },

  // Home Workouts
  {
    id: 'home-full-body',
    name: 'Home Full Body Workout',
    description: 'Complete full body workout using only bodyweight exercises, perfect for home training.',
    difficulty: 'Beginner',
    estimatedDuration: '45-60 minutes',
    category: 'Home',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'push-ups')!,
        sets: 3,
        reps: '10-15',
        restTime: 60,
        notes: 'Modify on knees if needed'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'squats')!,
        sets: 3,
        reps: '15-20',
        restTime: 60,
        notes: 'Body weight squats'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'lunges')!,
        sets: 3,
        reps: '10 each leg',
        restTime: 60,
        notes: 'Walking lunges'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'planks')!,
        sets: 3,
        reps: '30-45 seconds',
        restTime: 45,
        notes: 'Hold position'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'crunches')!,
        sets: 3,
        reps: '15-20',
        restTime: 45,
        notes: 'Abdominal focus'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'mountain-climbers')!,
        sets: 3,
        reps: '20-30',
        restTime: 45,
        notes: 'Dynamic core exercise'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'jumping-jacks')!,
        sets: 3,
        reps: '30-45',
        restTime: 45,
        notes: 'Cardio element'
      }
    ]
  },
  {
    id: 'home-upper-body',
    name: 'Home Upper Body Focus',
    description: 'Upper body focused home workout targeting chest, back, shoulders, and arms.',
    difficulty: 'Beginner',
    estimatedDuration: '40-50 minutes',
    category: 'Home',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'push-ups')!,
        sets: 4,
        reps: '8-12',
        restTime: 60,
        notes: 'Multiple variations'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'diamond-push-ups')!,
        sets: 3,
        reps: '6-10',
        restTime: 60,
        notes: 'Tricep focus'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'wide-push-ups')!,
        sets: 3,
        reps: '8-12',
        restTime: 60,
        notes: 'Chest focus'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'pike-push-ups')!,
        sets: 3,
        reps: '6-10',
        restTime: 60,
        notes: 'Shoulder focus'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'planks')!,
        sets: 3,
        reps: '45-60 seconds',
        restTime: 45,
        notes: 'Core stability'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'side-planks')!,
        sets: 3,
        reps: '30 seconds each side',
        restTime: 45,
        notes: 'Lateral core'
      }
    ]
  },
  {
    id: 'home-cardio',
    name: 'Home Cardio Blast',
    description: 'High-intensity cardio workout using bodyweight exercises for maximum calorie burn.',
    difficulty: 'Intermediate',
    estimatedDuration: '30-40 minutes',
    category: 'Home',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'burpees')!,
        sets: 4,
        reps: '10-15',
        restTime: 45,
        notes: 'Full body cardio'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'jumping-jacks')!,
        sets: 3,
        reps: '40-50',
        restTime: 30,
        notes: 'Cardio warm-up'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'high-knees')!,
        sets: 3,
        reps: '30-45 seconds',
        restTime: 30,
        notes: 'Running in place'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'mountain-climbers-cardio')!,
        sets: 3,
        reps: '30-45 seconds',
        restTime: 30,
        notes: 'Fast-paced'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'jump-squats')!,
        sets: 3,
        reps: '15-20',
        restTime: 45,
        notes: 'Explosive movement'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'box-jumps')!,
        sets: 3,
        reps: '10-15',
        restTime: 45,
        notes: 'Use stable surface'
      }
    ]
  },

  // Dumbbell Workouts
  {
    id: 'dumbbell-full-body',
    name: 'Dumbbell Full Body',
    description: 'Complete full body workout using only dumbbells, perfect for home or limited equipment.',
    difficulty: 'Intermediate',
    estimatedDuration: '60-75 minutes',
    category: 'Home',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'dumbbell-press')!,
        sets: 4,
        reps: '8-12',
        restTime: 90,
        notes: 'Flat bench or floor'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'dumbbell-rows')!,
        sets: 3,
        reps: '10-12 each arm',
        restTime: 90,
        notes: 'Single-arm rows'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'goblet-squats')!,
        sets: 3,
        reps: '12-15',
        restTime: 90,
        notes: 'Hold dumbbell at chest'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'bulgarian-split-squats')!,
        sets: 3,
        reps: '10-12 each leg',
        restTime: 90,
        notes: 'Rear foot elevated'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'overhead-press')!,
        sets: 3,
        reps: '8-10',
        restTime: 90,
        notes: 'Standing or seated'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'lateral-raises')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Light weight, controlled'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'bicep-curls')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Alternating arms'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'overhead-tricep-extension')!,
        sets: 3,
        reps: '12-15',
        restTime: 60,
        notes: 'Single dumbbell'
      }
    ]
  },
  {
    id: 'dumbbell-strength',
    name: 'Dumbbell Strength Builder',
    description: 'Strength-focused dumbbell workout emphasizing progressive overload and compound movements.',
    difficulty: 'Advanced',
    estimatedDuration: '75-90 minutes',
    category: 'Home',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'dumbbell-press')!,
        sets: 5,
        reps: '5-6',
        restTime: 120,
        notes: 'Heavy weight, low reps'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'dumbbell-rows')!,
        sets: 4,
        reps: '6-8 each arm',
        restTime: 120,
        notes: 'Heavy single-arm rows'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'goblet-squats')!,
        sets: 4,
        reps: '6-8',
        restTime: 120,
        notes: 'Heavy goblet squats'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'step-ups')!,
        sets: 3,
        reps: '8-10 each leg',
        restTime: 90,
        notes: 'Use stable platform'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'arnold-press')!,
        sets: 3,
        reps: '6-8',
        restTime: 90,
        notes: 'Rotating press'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'hammer-curls')!,
        sets: 3,
        reps: '8-10',
        restTime: 90,
        notes: 'Heavy weight'
      }
    ]
  },

  // Specialized Routines
  {
    id: 'core-focus',
    name: 'Core Focus Workout',
    description: 'Intensive core workout targeting all abdominal muscles and core stability.',
    difficulty: 'Intermediate',
    estimatedDuration: '45-60 minutes',
    category: 'Mixed',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'planks')!,
        sets: 4,
        reps: '60 seconds',
        restTime: 45,
        notes: 'Hold position'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'side-planks')!,
        sets: 3,
        reps: '45 seconds each side',
        restTime: 45,
        notes: 'Lateral stability'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'crunches')!,
        sets: 3,
        reps: '20-25',
        restTime: 30,
        notes: 'Upper abs'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'leg-raises')!,
        sets: 3,
        reps: '15-20',
        restTime: 30,
        notes: 'Lower abs'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'russian-twists')!,
        sets: 3,
        reps: '20 each side',
        restTime: 30,
        notes: 'Rotational core'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'bicycle-crunches')!,
        sets: 3,
        reps: '20-25',
        restTime: 30,
        notes: 'Advanced crunch'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'dead-bugs')!,
        sets: 3,
        reps: '30 seconds',
        restTime: 30,
        notes: 'Core coordination'
      }
    ]
  },
  {
    id: 'cardio-conditioning',
    name: 'Cardio Conditioning',
    description: 'High-intensity interval training for cardiovascular fitness and endurance.',
    difficulty: 'Advanced',
    estimatedDuration: '40-50 minutes',
    category: 'Mixed',
    exercises: [
      {
        exercise: exerciseLibrary.find(e => e.id === 'burpees')!,
        sets: 5,
        reps: '15-20',
        restTime: 60,
        notes: 'Full body cardio'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'jump-squats')!,
        sets: 4,
        reps: '20-25',
        restTime: 45,
        notes: 'Explosive movement'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'mountain-climbers-cardio')!,
        sets: 4,
        reps: '45-60 seconds',
        restTime: 45,
        notes: 'Fast-paced'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'high-knees')!,
        sets: 4,
        reps: '45-60 seconds',
        restTime: 45,
        notes: 'Running in place'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'box-jumps')!,
        sets: 3,
        reps: '15-20',
        restTime: 60,
        notes: 'Use stable surface'
      },
      {
        exercise: exerciseLibrary.find(e => e.id === 'jumping-jacks')!,
        sets: 3,
        reps: '50-60',
        restTime: 30,
        notes: 'Cardio finisher'
      }
    ]
  }
];

export const muscleGroups = [
  'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'
];

export const equipmentTypes = [
  'Barbell', 'Dumbbells', 'Machine', 'Cable', 'Bodyweight'
];

export const workoutCategories = [
  'Strength', 'Hypertrophy', 'Endurance', 'Home', 'Gym', 'Mixed'
];
