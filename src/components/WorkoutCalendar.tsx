import React, { useState } from 'react';
import { Calendar, Clock, Edit, Trash2, Plus, Dumbbell, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWorkout } from '@/contexts/WorkoutContext';
import { WorkoutSession } from '@/types/workout';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';

interface WorkoutCalendarProps {
  onStartWorkout: () => void;
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ onStartWorkout }) => {
  const { state, deleteWorkout, editWorkoutTime } = useWorkout();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutSession | null>(null);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getWorkoutsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return state.workoutHistory[dateKey] || [];
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

  const renderCalendarDay = (day: Date) => {
    const workouts = getWorkoutsForDate(day);
    const totalVolume = getTotalVolumeForDate(day);
    const isToday = isSameDay(day, new Date());
    const isCurrentMonth = isSameMonth(day, currentMonth);

    return (
      <div
        key={day.toISOString()}
        className={`
          min-h-[120px] p-2 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors
          ${isToday ? 'bg-primary/10 border-primary' : ''}
          ${!isCurrentMonth ? 'opacity-50' : ''}
        `}
        onClick={() => setSelectedDate(day)}
      >
        <div className="text-sm font-medium mb-2">
          {format(day, 'd')}
        </div>
        
        {workouts.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              {workouts.length} workout{workouts.length > 1 ? 's' : ''}
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
        
        <Button onClick={onStartWorkout} className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Start Workout
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
        {daysInMonth.map(renderCalendarDay)}
      </div>

      {/* Selected Date Workouts */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Workouts for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getWorkoutsForDate(selectedDate).length > 0 ? (
              getWorkoutsForDate(selectedDate).map(renderWorkoutDetails)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No workouts on this date</p>
                <Button 
                  onClick={onStartWorkout} 
                  variant="outline" 
                  className="mt-4"
                >
                  Start a workout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
    </div>
  );
};
