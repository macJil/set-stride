import React from 'react';
import { Clock, CheckCircle, Circle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WorkoutCardProps {
  workout: {
    id: number;
    name: string;
    exercises: string[];
    duration: string;
    status: 'scheduled' | 'in-progress' | 'completed';
    muscleGroup: string;
  };
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const getMuscleGroupClass = (muscleGroup: string) => {
    const classes = {
      chest: 'muscle-chest',
      back: 'muscle-back',
      legs: 'muscle-legs',
      arms: 'muscle-arms',
      cardio: 'muscle-back'
    };
    return classes[muscleGroup as keyof typeof classes] || 'muscle-arms';
  };

  const getStatusIcon = () => {
    switch (workout.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in-progress':
        return <Play className="h-5 w-5 text-primary animate-pulse" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (workout.status) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={cn(
      "p-4 border border-border rounded-lg transition-all duration-300 hover-lift",
      "bg-gradient-secondary backdrop-blur-sm",
      workout.status === 'completed' && 'border-success/30 bg-success/5',
      workout.status === 'in-progress' && 'border-primary/30 bg-primary/5 glow-primary'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon()}
            <h3 className="font-semibold text-lg">{workout.name}</h3>
            <Badge className={cn('text-xs px-2 py-1', getMuscleGroupClass(workout.muscleGroup))}>
              {workout.muscleGroup.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {workout.duration}
            </div>
            <span>•</span>
            <span>{workout.exercises.length} exercises</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {workout.exercises.map((exercise, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-muted hover:bg-muted/80 transition-colors"
              >
                {exercise}
              </Badge>
            ))}
          </div>
        </div>

        <div className="ml-4 flex flex-col gap-2">
          {workout.status === 'scheduled' && (
            <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          )}
          
          {workout.status === 'in-progress' && (
            <Button size="sm" variant="outline" className="hover-lift">
              Continue
            </Button>
          )}
          
          {workout.status === 'completed' && (
            <Button size="sm" variant="outline" className="hover-lift">
              View Log
            </Button>
          )}
        </div>
      </div>

      <div className={cn("text-sm capitalize", getStatusColor())}>
        Status: {workout.status.replace('-', ' ')}
      </div>
    </div>
  );
};