import React, { useState } from 'react';
import { Plus, Trash2, Save, Timer, Dumbbell, Play, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
}

interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

interface WorkoutExercise {
  exercise: Exercise;
  sets: WorkoutSet[];
  restTime: number;
}

const exerciseLibrary: Exercise[] = [
  { id: '1', name: 'Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { id: '2', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbells' },
  { id: '3', name: 'Push-ups', muscleGroup: 'Chest', equipment: 'Bodyweight' },
  { id: '4', name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell' },
  { id: '5', name: 'Pull-ups', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { id: '6', name: 'Barbell Rows', muscleGroup: 'Back', equipment: 'Barbell' },
  { id: '7', name: 'Squats', muscleGroup: 'Legs', equipment: 'Barbell' },
  { id: '8', name: 'Lunges', muscleGroup: 'Legs', equipment: 'Dumbbells' },
  { id: '9', name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine' },
  { id: '10', name: 'Bicep Curls', muscleGroup: 'Arms', equipment: 'Dumbbells' },
  { id: '11', name: 'Tricep Dips', muscleGroup: 'Arms', equipment: 'Bodyweight' },
  { id: '12', name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell' },
];

export const WorkoutLogger: React.FC = () => {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const addExercise = () => {
    if (!selectedExercise) return;
    
    const exercise = exerciseLibrary.find(ex => ex.id === selectedExercise);
    if (!exercise) return;

    const newWorkoutExercise: WorkoutExercise = {
      exercise,
      sets: [{ id: Date.now().toString(), weight: 0, reps: 0, completed: false }],
      restTime: 90
    };

    setWorkoutExercises([...workoutExercises, newWorkoutExercise]);
    setSelectedExercise('');
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...workoutExercises];
    const lastSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1];
    
    updated[exerciseIndex].sets.push({
      id: Date.now().toString(),
      weight: lastSet ? lastSet.weight : 0,
      reps: lastSet ? lastSet.reps : 0,
      completed: false
    });
    
    setWorkoutExercises(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: number) => {
    const updated = [...workoutExercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setWorkoutExercises(updated);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const updated = [...workoutExercises];
    updated[exerciseIndex].sets[setIndex].completed = !updated[exerciseIndex].sets[setIndex].completed;
    setWorkoutExercises(updated);
    
    if (updated[exerciseIndex].sets[setIndex].completed) {
      toast({
        title: "Set completed!",
        description: `${updated[exerciseIndex].exercise.name} - Set ${setIndex + 1}`,
      });
    }
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...workoutExercises];
    if (updated[exerciseIndex].sets.length > 1) {
      updated[exerciseIndex].sets.splice(setIndex, 1);
      setWorkoutExercises(updated);
    }
  };

  const removeExercise = (exerciseIndex: number) => {
    const updated = [...workoutExercises];
    updated.splice(exerciseIndex, 1);
    setWorkoutExercises(updated);
  };

  const startWorkout = () => {
    if (!workoutName.trim()) {
      toast({
        title: "Workout name required",
        description: "Please enter a name for your workout",
        variant: "destructive"
      });
      return;
    }
    
    setWorkoutStarted(true);
    setStartTime(new Date());
    toast({
      title: "Workout started!",
      description: `"${workoutName}" is now in progress`,
    });
  };

  const finishWorkout = () => {
    const completedSets = workoutExercises.reduce((total, ex) => 
      total + ex.sets.filter(set => set.completed).length, 0
    );
    
    if (completedSets === 0) {
      toast({
        title: "No completed sets",
        description: "Complete at least one set before finishing",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage (can be replaced with actual database later)
    const workoutData = {
      name: workoutName,
      startTime,
      endTime: new Date(),
      exercises: workoutExercises,
      completedSets
    };
    
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    savedWorkouts.push(workoutData);
    localStorage.setItem('workouts', JSON.stringify(savedWorkouts));

    toast({
      title: "Workout completed!",
      description: `"${workoutName}" saved with ${completedSets} completed sets`,
    });

    // Reset form
    setWorkoutExercises([]);
    setWorkoutStarted(false);
    setWorkoutName('');
    setStartTime(null);
  };

  const getMuscleGroupClass = (muscleGroup: string) => {
    const classes = {
      'Chest': 'muscle-chest',
      'Back': 'muscle-back', 
      'Legs': 'muscle-legs',
      'Arms': 'muscle-arms',
      'Shoulders': 'muscle-arms'
    };
    return classes[muscleGroup as keyof typeof classes] || 'muscle-arms';
  };

  if (!workoutStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="workout-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Start New Workout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter workout name (e.g., 'Chest & Triceps')"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="text-lg"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Push (Chest, Shoulders, Triceps)', 'Pull (Back, Biceps)', 'Legs (Quads, Glutes, Hamstrings)'].map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  onClick={() => setWorkoutName(template)}
                  className="hover-lift text-left h-auto p-4"
                >
                  {template}
                </Button>
              ))}
            </div>

            <Button 
              onClick={startWorkout}
              disabled={!workoutName.trim()}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Workout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Workout Header */}
      <Card className="workout-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{workoutName}</CardTitle>
              <p className="text-muted-foreground">
                Started at {startTime?.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={finishWorkout}
                className="bg-success hover:bg-success/80 text-success-foreground"
              >
                <Check className="h-4 w-4 mr-2" />
                Finish Workout
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Add Exercise */}
      <Card className="workout-card">
        <CardHeader>
          <CardTitle className="text-lg">Add Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose an exercise" />
              </SelectTrigger>
              <SelectContent>
                {exerciseLibrary.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    <div className="flex items-center gap-2">
                      {exercise.name}
                      <Badge className={getMuscleGroupClass(exercise.muscleGroup)}>
                        {exercise.muscleGroup}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addExercise} disabled={!selectedExercise}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <div className="space-y-4">
        {workoutExercises.map((workoutEx, exerciseIndex) => (
          <Card key={exerciseIndex} className="workout-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{workoutEx.exercise.name}</CardTitle>
                  <Badge className={getMuscleGroupClass(workoutEx.exercise.muscleGroup)}>
                    {workoutEx.exercise.muscleGroup}
                  </Badge>
                  <Badge variant="outline">
                    {workoutEx.exercise.equipment}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeExercise(exerciseIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Sets Header */}
              <div className="grid grid-cols-5 gap-3 text-sm text-muted-foreground font-medium">
                <div>Set</div>
                <div>Weight (lbs)</div>
                <div>Reps</div>
                <div>Rest ({workoutEx.restTime}s)</div>
                <div>Action</div>
              </div>

              {/* Sets */}
              {workoutEx.sets.map((set, setIndex) => (
                <div key={set.id} className="grid grid-cols-5 gap-3 items-center">
                  <div className="text-sm font-medium">#{setIndex + 1}</div>
                  
                  <Input
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', Number(e.target.value))}
                    placeholder="0"
                    className="text-center"
                  />
                  
                  <Input
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', Number(e.target.value))}
                    placeholder="0"
                    className="text-center"
                  />

                  <div className="flex items-center justify-center">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={set.completed ? "default" : "outline"}
                      onClick={() => toggleSetComplete(exerciseIndex, setIndex)}
                      className={set.completed ? "bg-success hover:bg-success/80 text-success-foreground" : ""}
                    >
                      {set.completed ? <Check className="h-4 w-4" /> : <Timer className="h-4 w-4" />}
                    </Button>
                    
                    {workoutEx.sets.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button
                size="sm"
                variant="outline"
                onClick={() => addSet(exerciseIndex)}
                className="w-full hover-lift"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Set
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {workoutExercises.length === 0 && (
        <Card className="workout-card">
          <CardContent className="text-center py-12">
            <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No exercises added yet</h3>
            <p className="text-muted-foreground">
              Add your first exercise to start logging sets and reps
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};