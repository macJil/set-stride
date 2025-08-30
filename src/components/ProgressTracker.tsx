import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Calendar, Dumbbell, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WorkoutData {
  name: string;
  startTime: string;
  endTime: string;
  exercises: any[];
  completedSets: number;
}

interface ProgressStats {
  totalWorkouts: number;
  totalSets: number;
  totalVolume: number;
  avgDuration: number;
  streak: number;
  personalRecords: { exercise: string; weight: number; reps: number }[];
}

export const ProgressTracker: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalWorkouts: 0,
    totalSets: 0,
    totalVolume: 0,
    avgDuration: 0,
    streak: 0,
    personalRecords: []
  });

  useEffect(() => {
    // Load workouts from localStorage
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    setWorkouts(savedWorkouts);

    // Calculate statistics
    if (savedWorkouts.length > 0) {
      calculateStats(savedWorkouts);
    }
  }, []);

  const calculateStats = (workoutData: WorkoutData[]) => {
    const totalWorkouts = workoutData.length;
    const totalSets = workoutData.reduce((sum, w) => sum + w.completedSets, 0);
    
    // Calculate total volume (sets × reps × weight)
    let totalVolume = 0;
    let totalDuration = 0;
    const prs: { [key: string]: { weight: number; reps: number } } = {};

    workoutData.forEach(workout => {
      // Duration calculation
      const start = new Date(workout.startTime);
      const end = new Date(workout.endTime);
      totalDuration += (end.getTime() - start.getTime()) / (1000 * 60); // minutes

      // Volume and PRs calculation
      workout.exercises?.forEach(exercise => {
        exercise.sets?.forEach((set: any) => {
          if (set.completed) {
            const volume = set.weight * set.reps;
            totalVolume += volume;

            // Track personal records
            const exerciseName = exercise.exercise.name;
            if (!prs[exerciseName] || set.weight > prs[exerciseName].weight) {
              prs[exerciseName] = { weight: set.weight, reps: set.reps };
            }
          }
        });
      });
    });

    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
    
    // Convert PRs to array
    const personalRecords = Object.entries(prs).map(([exercise, data]) => ({
      exercise,
      weight: data.weight,
      reps: data.reps
    }));

    // Calculate streak (simplified - consecutive days with workouts)
    const streak = calculateStreak(workoutData);

    setStats({
      totalWorkouts,
      totalSets,
      totalVolume: Math.round(totalVolume),
      avgDuration,
      streak,
      personalRecords
    });
  };

  const calculateStreak = (workoutData: WorkoutData[]): number => {
    if (workoutData.length === 0) return 0;
    
    // Sort workouts by date
    const sortedWorkouts = workoutData
      .map(w => new Date(w.startTime).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Remove duplicates (multiple workouts same day)
    const uniqueDays = [...new Set(sortedWorkouts)];
    
    let streak = 0;
    const today = new Date().toDateString();
    
    for (let i = 0; i < uniqueDays.length; i++) {
      const daysDiff = Math.floor(
        (new Date(today).getTime() - new Date(uniqueDays[i]).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getThisWeekWorkouts = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return workouts.filter(workout => 
      new Date(workout.startTime) > oneWeekAgo
    );
  };

  const getMuscleGroupVolume = () => {
    const muscleGroups: { [key: string]: number } = {};
    
    workouts.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        const muscleGroup = exercise.exercise.muscleGroup;
        let volume = 0;
        
        exercise.sets?.forEach((set: any) => {
          if (set.completed) {
            volume += set.weight * set.reps;
          }
        });
        
        muscleGroups[muscleGroup] = (muscleGroups[muscleGroup] || 0) + volume;
      });
    });
    
    return Object.entries(muscleGroups)
      .map(([muscle, volume]) => ({ muscle, volume }))
      .sort((a, b) => b.volume - a.volume);
  };

  const thisWeekWorkouts = getThisWeekWorkouts();
  const muscleGroupVolume = getMuscleGroupVolume();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
        <Card className="workout-card hover-lift">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="workout-card hover-lift">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <Dumbbell className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {stats.totalVolume.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">lbs lifted</p>
          </CardContent>
        </Card>

        <Card className="workout-card hover-lift">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Target className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{stats.avgDuration}m</div>
            <p className="text-xs text-muted-foreground">per workout</p>
          </CardContent>
        </Card>

        <Card className="workout-card hover-lift">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.streak}</div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <Tabs defaultValue="weekly" className="animate-scale-in">
        <TabsList className="grid w-full grid-cols-3 bg-card border-border">
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="volume">Muscle Groups</TabsTrigger>
          <TabsTrigger value="records">Personal Records</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-6">
          <Card className="workout-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                This Week's Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {thisWeekWorkouts.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-secondary rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {thisWeekWorkouts.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Workouts</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-secondary rounded-lg">
                      <div className="text-2xl font-bold text-success mb-1">
                        {thisWeekWorkouts.reduce((sum, w) => sum + w.completedSets, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Sets Completed</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-secondary rounded-lg">
                      <div className="text-2xl font-bold text-warning mb-1">
                        {Math.round(
                          thisWeekWorkouts.reduce((sum, w) => {
                            const duration = (new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / (1000 * 60);
                            return sum + duration;
                          }, 0)
                        )}m
                      </div>
                      <div className="text-sm text-muted-foreground">Total Time</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {thisWeekWorkouts.map((workout, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg bg-gradient-secondary">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{workout.name}</h4>
                          <Badge variant="outline">{workout.completedSets} sets</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(workout.startTime).toLocaleDateString()} • 
                          {Math.round((new Date(workout.endTime).getTime() - new Date(workout.startTime).getTime()) / (1000 * 60))} minutes
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No workouts this week</h3>
                  <p className="text-muted-foreground">
                    Start logging workouts to see your weekly progress
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="mt-6">
          <Card className="workout-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-success" />
                Volume by Muscle Group
              </CardTitle>
            </CardHeader>
            <CardContent>
              {muscleGroupVolume.length > 0 ? (
                <div className="space-y-4">
                  {muscleGroupVolume.map(({ muscle, volume }) => (
                    <div key={muscle} className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-secondary">
                      <div className="flex items-center gap-3">
                        <Badge className={`muscle-${muscle.toLowerCase()}`}>
                          {muscle}
                        </Badge>
                        <span className="font-medium">{muscle}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-success">
                          {volume.toLocaleString()} lbs
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total volume
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No volume data</h3>
                  <p className="text-muted-foreground">
                    Complete some workouts to see muscle group breakdown
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="mt-6">
          <Card className="workout-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Personal Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.personalRecords.length > 0 ? (
                <div className="space-y-4">
                  {stats.personalRecords.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-secondary hover-lift">
                      <div>
                        <h4 className="font-semibold">{record.exercise}</h4>
                        <p className="text-sm text-muted-foreground">Personal best</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {record.weight} lbs
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {record.reps} reps
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No personal records yet</h3>
                  <p className="text-muted-foreground">
                    Start logging workouts to track your strongest lifts
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};