import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Timer, Dumbbell, Play, Check, X, Edit, Copy, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useWorkout } from '@/contexts/WorkoutContext';
import { WorkoutSession, WorkoutExercise, WorkoutSet } from '@/types/workout';
import { exerciseLibrary, workoutRoutines, muscleGroups, equipmentTypes, workoutCategories } from '@/data/workoutRoutines';

interface CustomExercise {
  name: string;
  muscleGroup: string;
  equipment: string;
  description?: string;
}

export const EnhancedWorkoutLogger: React.FC = () => {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<string>('');
  const [customExercise, setCustomExercise] = useState<CustomExercise>({
    name: '',
    muscleGroup: '',
    equipment: ''
  });
  const [showCustomExerciseDialog, setShowCustomExerciseDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('routines');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Safely get workout context with error handling
  let workoutContext;
  try {
    workoutContext = useWorkout();
  } catch (err) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Workout Context Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Failed to load workout context. Please refresh the page.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { startWorkout, updateWorkout, finishWorkout, state } = workoutContext;
  
  let toast;
  try {
    toast = useToast();
  } catch (err) {
    // Fallback toast function if useToast fails
    toast = {
      toast: (props: any) => console.log('Toast:', props),
      dismiss: () => {},
      toasts: []
    };
  }

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

  const addCustomExercise = () => {
    if (!customExercise.name || !customExercise.muscleGroup || !customExercise.equipment) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newExercise = {
      id: `custom-${Date.now()}`,
      ...customExercise
    };

    const newWorkoutExercise: WorkoutExercise = {
      exercise: newExercise,
      sets: [{ id: Date.now().toString(), weight: 0, reps: 0, completed: false }],
      restTime: 90
    };

    setWorkoutExercises([...workoutExercises, newWorkoutExercise]);
    setCustomExercise({ name: '', muscleGroup: '', equipment: '' });
    setShowCustomExerciseDialog(false);
    
    toast({
      title: "Custom exercise added!",
      description: `${customExercise.name} has been added to your workout`,
    });
  };

  const loadRoutine = (routineId: string) => {
    try {
      const routine = workoutRoutines.find(r => r.id === routineId);
      if (!routine) {
        toast({
          title: "Routine not found",
          description: "The selected routine could not be found.",
          variant: "destructive"
        });
        return;
      }

      // Validate that all exercises exist
      const validExercises = routine.exercises.filter(routineEx => routineEx.exercise);
      if (validExercises.length !== routine.exercises.length) {
        toast({
          title: "Warning",
          description: "Some exercises in this routine could not be loaded.",
          variant: "destructive"
        });
      }

      setWorkoutName(routine.name);
      const exercises: WorkoutExercise[] = validExercises.map(routineEx => ({
        exercise: routineEx.exercise,
        sets: Array.from({ length: routineEx.sets }, (_, i) => ({
          id: `${Date.now()}-${i}`,
          weight: 0,
          reps: 0,
          completed: false
        })),
        restTime: routineEx.restTime,
        targetReps: routineEx.reps,
        targetSets: routineEx.sets
      }));

      setWorkoutExercises(exercises);
      setSelectedRoutine(routineId);
      
      toast({
        title: "Routine loaded!",
        description: `${routine.name} has been loaded with ${exercises.length} exercises`,
      });
    } catch (error) {
      console.error('Error loading routine:', error);
      toast({
        title: "Error loading routine",
        description: "There was an error loading the routine. Please try again.",
        variant: "destructive"
      });
    }
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

  const handleStartWorkout = () => {
    if (!workoutName.trim()) {
      toast({
        title: "Workout name required",
        description: "Please enter a name for your workout",
        variant: "destructive"
      });
      return;
    }
    
    if (workoutExercises.length === 0) {
      toast({
        title: "No exercises added",
        description: "Please add at least one exercise before starting",
        variant: "destructive"
      });
      return;
    }
    
    const workout: WorkoutSession = {
      id: Date.now().toString(),
      name: workoutName,
      startTime: new Date(),
      exercises: workoutExercises,
      totalVolume: 0,
      completedSets: 0,
      totalSets: workoutExercises.reduce((total, ex) => total + ex.sets.length, 0),
      routineId: selectedRoutine || undefined
    };

    setWorkoutStarted(true);
    setStartTime(new Date());
    startWorkout(workout);
    
    toast({
      title: "Workout started!",
      description: `"${workoutName}" is now in progress`,
    });
  };

  const handleFinishWorkout = () => {
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

    const totalVolume = workoutExercises.reduce((total, ex) => 
      total + ex.sets.reduce((setTotal, set) => 
        setTotal + (set.weight * set.reps), 0
      ), 0
    );

    const finishedWorkout: WorkoutSession = {
      id: state.currentWorkout?.id || Date.now().toString(),
      name: workoutName,
      startTime: startTime || new Date(),
      endTime: new Date(),
      exercises: workoutExercises,
      totalVolume,
      completedSets,
      totalSets: workoutExercises.reduce((total, ex) => total + ex.sets.length, 0),
      routineId: selectedRoutine || undefined
    };

    finishWorkout(finishedWorkout);

    // Reset form
    setWorkoutExercises([]);
    setWorkoutStarted(false);
    setWorkoutName('');
    setStartTime(null);
    setSelectedRoutine('');
  };

  const getMuscleGroupClass = (muscleGroup: string) => {
    const classes = {
      'Chest': 'muscle-chest',
      'Back': 'muscle-back', 
      'Legs': 'muscle-legs',
      'Arms': 'muscle-arms',
      'Shoulders': 'muscle-arms',
      'Core': 'muscle-core',
      'Cardio': 'muscle-cardio'
    };
    return classes[muscleGroup as keyof typeof classes] || 'muscle-arms';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Beginner': 'bg-green-500',
      'Intermediate': 'bg-yellow-500',
      'Advanced': 'bg-red-500'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Strength': 'bg-blue-500',
      'Hypertrophy': 'bg-purple-500',
      'Endurance': 'bg-green-500',
      'Home': 'bg-orange-500',
      'Gym': 'bg-indigo-500',
      'Mixed': 'bg-pink-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredRoutines = workoutRoutines.filter(routine => {
    const matchesCategory = !selectedCategory || routine.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Error boundary
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Workout Logger</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => setError(null)} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!workoutStarted) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
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
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="routines">Predefined Routines</TabsTrigger>
                <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
                <TabsTrigger value="custom">Custom Exercise</TabsTrigger>
              </TabsList>

              <TabsContent value="routines" className="space-y-4">
                {/* Filters */}
                <div className="flex gap-3 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search routines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {workoutCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRoutines.map((routine) => (
                    <Card key={routine.id} className="hover-lift cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{routine.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{routine.description}</p>
                          </div>
                          <div className="flex flex-col gap-2 ml-3">
                            <Badge className={`${getDifficultyColor(routine.difficulty)} text-white`}>
                              {routine.difficulty}
                            </Badge>
                            <Badge className={`${getCategoryColor(routine.category)} text-white`}>
                              {routine.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>⏱️ {routine.estimatedDuration}</span>
                          <span>💪 {routine.exercises.length} exercises</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={() => loadRoutine(routine.id)}
                          className="w-full"
                          variant="outline"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Load Routine
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredRoutines.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No routines match your current filters</p>
                    <Button 
                      onClick={() => {
                        setSelectedCategory('');
                        setSearchTerm('');
                      }}
                      variant="outline" 
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="exercises" className="space-y-4">
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
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <Button 
                  onClick={() => setShowCustomExerciseDialog(true)}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Exercise
                </Button>
              </TabsContent>
            </Tabs>

            {workoutExercises.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Selected Exercises ({workoutExercises.length})</h3>
                {workoutExercises.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{exercise.exercise.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.exercise.muscleGroup} • {exercise.exercise.equipment}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeExercise(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={handleStartWorkout}
              disabled={!workoutName.trim() || workoutExercises.length === 0}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Workout
            </Button>
          </CardContent>
        </Card>

        {/* Custom Exercise Dialog */}
        <Dialog open={showCustomExerciseDialog} onOpenChange={setShowCustomExerciseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Exercise</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Exercise Name</label>
                <Input
                  value={customExercise.name}
                  onChange={(e) => setCustomExercise({ ...customExercise, name: e.target.value })}
                  placeholder="e.g., Custom Push-up Variation"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Muscle Group</label>
                <Select value={customExercise.muscleGroup} onValueChange={(value) => setCustomExercise({ ...customExercise, muscleGroup: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map((group) => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Equipment</label>
                <Select value={customExercise.equipment} onValueChange={(value) => setCustomExercise({ ...customExercise, equipment: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  value={customExercise.description || ''}
                  onChange={(e) => setCustomExercise({ ...customExercise, description: e.target.value })}
                  placeholder="Describe the exercise..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCustomExerciseDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addCustomExercise}>
                  Add Exercise
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
              {selectedRoutine && (
                <p className="text-sm text-primary">
                  Based on: {workoutRoutines.find(r => r.id === selectedRoutine)?.name}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleFinishWorkout}
                className="bg-success hover:bg-success/80 text-success-foreground"
              >
                <Check className="h-4 w-4 mr-2" />
                Finish Workout
              </Button>
            </div>
          </div>
        </CardHeader>
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
                  {workoutEx.targetReps && (
                    <Badge variant="secondary">
                      Target: {workoutEx.targetReps}
                    </Badge>
                  )}
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
    </div>
  );
};
