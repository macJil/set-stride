import React, { useState } from 'react';
import { Calendar, Clock, Edit, Trash2, Plus, Dumbbell, TrendingUp, Target, CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkout } from '@/contexts/WorkoutContext';
import { WorkoutSession } from '@/types/workout';
import { workoutRoutines } from '@/data/workoutRoutines';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, addDays, isToday, isFuture, isPast } from 'date-fns';

interface PlannedWorkout {
  id: string;
  date: string;
  name: string;
  routineId?: string;
  notes?: string;
  status: 'planned' | 'completed' | 'skipped';
  targetDuration?: number;
  targetVolume?: number;
}

interface EnhancedWorkoutCalendarProps {
  onStartWorkout: () => void;
}

export const EnhancedWorkoutCalendar: React.FC<EnhancedWorkoutCalendarProps> = ({ onStartWorkout }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutSession | null>(null);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [showPlanWorkoutDialog, setShowPlanWorkoutDialog] = useState(false);
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([]);
  const [activeTab, setActiveTab] = useState('calendar');
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
            <CardTitle className="text-destructive">Calendar Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Failed to load workout calendar. Please refresh the page.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { state, deleteWorkout, editWorkoutTime } = workoutContext;

  // Load planned workouts from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('fitTracker_plannedWorkouts');
    if (saved) {
      try {
        setPlannedWorkouts(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load planned workouts:', error);
      }
    }
  }, []);

  // Save planned workouts to localStorage
  React.useEffect(() => {
    localStorage.setItem('fitTracker_plannedWorkouts', JSON.stringify(plannedWorkouts));
  }, [plannedWorkouts]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getWorkoutsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return state.workoutHistory[dateKey] || [];
  };

  const getPlannedWorkoutsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return plannedWorkouts.filter(workout => workout.date === dateKey);
  };

  const getTotalVolumeForDate = (date: Date) => {
    const workouts = getWorkoutsForDate(date);
    return workouts.reduce((total, workout) => total + workout.totalVolume, 0);
  };

  const handleEditWorkout = (workout: WorkoutSession) => {
    setEditingWorkout(workout);
    setEditStartTime(format(workout.startTime, 'HH:mm'));
    setEditEndTime(workout.endTime ? format(workout.endTime, 'HH:mm') : '');
  };

  const saveWorkoutTime = () => {
    if (!editingWorkout) return;

    const [startHour, startMinute] = editStartTime.split(':').map(Number);
    const newStartTime = new Date(editingWorkout.startTime);
    newStartTime.setHours(startHour, startMinute, 0, 0);

    let newEndTime: Date | undefined;
    if (editEndTime) {
      const [endHour, endMinute] = editEndTime.split(':').map(Number);
      newEndTime = new Date(editingWorkout.startTime);
      newEndTime.setHours(endHour, endMinute, 0, 0);
    }

    editWorkoutTime(editingWorkout.id, newStartTime, newEndTime);
    setEditingWorkout(null);
  };

  const handleDeleteWorkout = (workout: WorkoutSession) => {
    const dateKey = format(workout.startTime, 'yyyy-MM-dd');
    if (confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(dateKey, workout.id);
    }
  };

  const addPlannedWorkout = (date: Date, workoutData: Omit<PlannedWorkout, 'id' | 'date'>) => {
    const newPlannedWorkout: PlannedWorkout = {
      id: Date.now().toString(),
      date: format(date, 'yyyy-MM-dd'),
      ...workoutData
    };

    setPlannedWorkouts([...plannedWorkouts, newPlannedWorkout]);
    setShowPlanWorkoutDialog(false);
  };

  const updatePlannedWorkoutStatus = (workoutId: string, status: PlannedWorkout['status']) => {
    setPlannedWorkouts(plannedWorkouts.map(workout => 
      workout.id === workoutId ? { ...workout, status } : workout
    ));
  };

  const deletePlannedWorkout = (workoutId: string) => {
    setPlannedWorkouts(plannedWorkouts.filter(workout => workout.id !== workoutId));
  };

  const renderCalendarDay = (day: Date) => {
    const workouts = getWorkoutsForDate(day);
    const plannedWorkouts = getPlannedWorkoutsForDate(day);
    const totalVolume = getTotalVolumeForDate(day);
    const isTodayDate = isToday(day);
    const isCurrentMonth = isSameMonth(day, currentMonth);

    return (
      <div
        key={day.toISOString()}
        className={`
          min-h-[140px] p-2 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors
          ${isTodayDate ? 'bg-primary/10 border-primary' : ''}
          ${!isCurrentMonth ? 'opacity-50' : ''}
        `}
        onClick={() => setSelectedDate(day)}
      >
        <div className="text-sm font-medium mb-2">
          {format(day, 'd')}
        </div>
        
        {/* Planned Workouts */}
        {plannedWorkouts.map((planned) => (
          <div key={planned.id} className="mb-1">
            <div className={`
              text-xs px-1 py-0.5 rounded truncate
              ${planned.status === 'completed' ? 'bg-green-100 text-green-800' : 
                planned.status === 'skipped' ? 'bg-red-100 text-red-800' : 
                'bg-blue-100 text-blue-800'}
            `}>
              📋 {planned.name}
            </div>
          </div>
        ))}
        
        {/* Completed Workouts */}
        {workouts.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              ✅ {workouts.length} completed
            </div>
            {totalVolume > 0 && (
              <div className="text-xs font-medium text-primary">
                {totalVolume.toLocaleString()} lbs
              </div>
            )}
            {workouts.map((workout, index) => (
              <div key={workout.id} className="text-xs bg-primary/10 rounded px-1 py-0.5 truncate">
                {workout.name}
              </div>
            ))}
          </div>
        )}

        {/* Quick Add Button for Future Dates */}
        {isFuture(day) && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full mt-1 h-6 text-xs opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDate(day);
              setShowPlanWorkoutDialog(true);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  const renderWorkoutDetails = (workout: WorkoutSession) => (
    <Card key={workout.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{workout.name}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(workout.startTime, 'HH:mm')}
                {workout.endTime && ` - ${format(workout.endTime, 'HH:mm')}`}
              </span>
              {workout.duration && (
                <span>Duration: {workout.duration} min</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditWorkout(workout)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Time
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeleteWorkout(workout)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{workout.totalVolume.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Volume (lbs)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{workout.completedSets}</div>
            <div className="text-sm text-muted-foreground">Completed Sets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{workout.exercises.length}</div>
            <div className="text-sm text-muted-foreground">Exercises</div>
          </div>
        </div>
        
        <div className="space-y-3">
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">{exercise.exercise.name}</div>
                <div className="text-sm text-muted-foreground">
                  {exercise.exercise.muscleGroup} • {exercise.exercise.equipment}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {exercise.sets.length} sets × {exercise.sets[0]?.reps || '0'} reps
                </div>
                <div className="text-sm text-muted-foreground">
                  {exercise.restTime}s rest
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderPlannedWorkoutDetails = (date: Date) => {
    const plannedWorkouts = getPlannedWorkoutsForDate(date);
    const completedWorkouts = getWorkoutsForDate(date);

    return (
      <div className="space-y-4">
        {/* Planned Workouts Section */}
        {plannedWorkouts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Planned Workouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {plannedWorkouts.map((planned) => (
                <div key={planned.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{planned.name}</div>
                    {planned.notes && (
                      <div className="text-sm text-muted-foreground">{planned.notes}</div>
                    )}
                    {planned.routineId && (
                      <div className="text-xs text-primary">
                        Based on: {workoutRoutines.find(r => r.id === planned.routineId)?.name}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={planned.status}
                      onValueChange={(value: PlannedWorkout['status']) => 
                        updatePlannedWorkoutStatus(planned.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="skipped">Skipped</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePlannedWorkout(planned.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Workouts Section */}
        {completedWorkouts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Completed Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedWorkouts.map(renderWorkoutDetails)}
            </CardContent>
          </Card>
        )}

        {/* No Workouts Message */}
        {plannedWorkouts.length === 0 && completedWorkouts.length === 0 && (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No workouts planned or completed on this date</p>
              <Button 
                onClick={() => setShowPlanWorkoutDialog(true)} 
                variant="outline" 
                className="mt-4"
              >
                Plan a Workout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            ←
          </Button>
          <h2 className="text-2xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button
            variant="outline"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            →
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onStartWorkout} className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Start Workout
          </Button>
          <Button 
            onClick={() => setShowPlanWorkoutDialog(true)} 
            variant="outline"
          >
            <Target className="h-4 w-4 mr-2" />
            Plan Workout
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="planning">Workout Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {daysInMonth.map(renderCalendarDay)}
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderPlannedWorkoutDetails(selectedDate)}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plannedWorkouts.map((planned) => (
                  <Card key={planned.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{planned.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(planned.date).toLocaleDateString()}
                        </div>
                        {planned.notes && (
                          <div className="text-sm text-muted-foreground mt-1">{planned.notes}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={planned.status === 'completed' ? 'default' : 
                            planned.status === 'skipped' ? 'destructive' : 'secondary'}
                        >
                          {planned.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deletePlannedWorkout(planned.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {plannedWorkouts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No workouts planned yet</p>
                  <Button 
                    onClick={() => setShowPlanWorkoutDialog(true)} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Plan Your First Workout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Workout Time Dialog */}
      <Dialog open={!!editingWorkout} onOpenChange={() => setEditingWorkout(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workout Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={editStartTime}
                onChange={(e) => setEditStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time (Optional)</Label>
              <Input
                id="endTime"
                type="time"
                value={editEndTime}
                onChange={(e) => setEditEndTime(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingWorkout(null)}>
                Cancel
              </Button>
              <Button onClick={saveWorkoutTime}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plan Workout Dialog */}
      <Dialog open={showPlanWorkoutDialog} onOpenChange={setShowPlanWorkoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plan a Workout</DialogTitle>
          </DialogHeader>
          <PlanWorkoutForm 
            selectedDate={selectedDate || new Date()}
            onPlanWorkout={addPlannedWorkout}
            onCancel={() => setShowPlanWorkoutDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface PlanWorkoutFormProps {
  selectedDate: Date;
  onPlanWorkout: (date: Date, data: Omit<PlannedWorkout, 'id' | 'date'>) => void;
  onCancel: () => void;
}

const PlanWorkoutForm: React.FC<PlanWorkoutFormProps> = ({ selectedDate, onPlanWorkout, onCancel }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState('');
  const [notes, setNotes] = useState('');
  const [targetDuration, setTargetDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutName.trim()) return;

    onPlanWorkout(selectedDate, {
      name: workoutName,
      routineId: selectedRoutine || undefined,
      notes: notes.trim() || undefined,
      status: 'planned',
      targetDuration: targetDuration ? parseInt(targetDuration) : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="workoutName">Workout Name</Label>
        <Input
          id="workoutName"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="e.g., Chest & Triceps"
          required
        />
      </div>

      <div>
        <Label htmlFor="routine">Based on Routine (Optional)</Label>
        <Select value={selectedRoutine} onValueChange={setSelectedRoutine}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a routine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No routine</SelectItem>
            {workoutRoutines.map((routine) => (
              <SelectItem key={routine.id} value={routine.id}>
                {routine.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="targetDuration">Target Duration (minutes, optional)</Label>
        <Input
          id="targetDuration"
          type="number"
          value={targetDuration}
          onChange={(e) => setTargetDuration(e.target.value)}
          placeholder="60"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific notes or goals for this workout..."
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!workoutName.trim()}>
          Plan Workout
        </Button>
      </div>
    </form>
  );
};
