import React, { useState } from 'react';
import { Calendar, Dumbbell, TrendingUp, Settings, Timer, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkoutCard } from '@/components/WorkoutCard';
import { RestTimer } from '@/components/RestTimer';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { ProgressTracker } from '@/components/ProgressTracker';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  const todaysWorkouts = [
    {
      id: 1,
      name: 'Chest & Triceps',
      exercises: ['Bench Press', 'Incline Dumbbell Press', 'Chest Flyes', 'Tricep Dips'],
      duration: '45-60 min',
      status: 'scheduled' as const,
      muscleGroup: 'chest'
    },
    {
      id: 2,
      name: 'Cardio Session',
      exercises: ['Treadmill', 'Rowing Machine', 'Jump Rope'],
      duration: '30 min',
      status: 'completed' as const,
      muscleGroup: 'cardio'
    }
  ];

  const weeklyProgress = {
    workoutsCompleted: 4,
    workoutsPlanned: 5,
    totalVolume: 12450,
    avgDuration: 52
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            FitTracker Pro
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your strength. Build your legacy.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="workout-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Dumbbell className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {weeklyProgress.workoutsCompleted}/{weeklyProgress.workoutsPlanned}
              </div>
              <p className="text-xs text-muted-foreground">Workouts Completed</p>
            </CardContent>
          </Card>

          <Card className="workout-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {weeklyProgress.totalVolume.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">lbs lifted this week</p>
            </CardContent>
          </Card>

          <Card className="workout-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                <Timer className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {weeklyProgress.avgDuration}m
              </div>
              <p className="text-xs text-muted-foreground">per workout</p>
            </CardContent>
          </Card>

          <Card className="workout-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">7</div>
              <p className="text-xs text-muted-foreground">days active</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-4 bg-card border-border">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="workout" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Dumbbell className="h-4 w-4 mr-2" />
              Workout
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="workout-card">
                  <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>Monday, December 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {todaysWorkouts.map((workout) => (
                      <WorkoutCard key={workout.id} workout={workout} />
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <RestTimer />
                
                <Card className="workout-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Start</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                      <Play className="h-4 w-4 mr-2" />
                      Start Chest Workout
                    </Button>
                    <Button variant="outline" className="w-full hover-lift">
                      View Exercise Library
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workout" className="mt-6">
            <WorkoutLogger />
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <ProgressTracker />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="workout-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Workout Preferences</CardTitle>
                <CardDescription>
                  Configure your workout split and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Workout Split</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['3x per week', '4x per week', '5x per week'].map((split) => (
                      <Button key={split} variant="outline" className="hover-lift">
                        {split}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Equipment Access</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['Full Gym', 'Home', 'Dumbbells Only'].map((equipment) => (
                      <Button key={equipment} variant="outline" className="hover-lift">
                        {equipment}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;