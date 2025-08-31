import React, { useState } from 'react';
import { Calendar, Dumbbell, TrendingUp, Settings, Timer, Play, Pause, Download, Upload, Database, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

import { RestTimer } from '@/components/RestTimer';
import { EnhancedWorkoutLogger } from '@/components/EnhancedWorkoutLogger';
import { EnhancedWorkoutCalendar } from '@/components/EnhancedWorkoutCalendar';
import { ProgressTracker } from '@/components/ProgressTracker';
import { useWorkout } from '@/contexts/WorkoutContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [importDataText, setImportDataText] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
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
            <CardTitle className="text-destructive">Dashboard Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Failed to load dashboard. Please refresh the page.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { state, exportData, importData, getStorageStats, clearAllData } = workoutContext;
  
  let toastHook;
  try {
    toastHook = useToast();
  } catch (err) {
    // Fallback toast function if useToast fails
    toastHook = {
      toast: (props: any) => console.log('Toast:', props),
      dismiss: () => {},
      toasts: []
    };
  }

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

  const handleStartWorkout = () => {
    setActiveTab('workout');
  };

  const handleExportData = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitTracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toastHook.toast({
        title: "Data exported successfully!",
        description: "Your workout data has been downloaded as a backup file.",
      });
    } catch (error) {
      toastHook.toast({
        title: "Export failed",
        description: "Failed to export workout data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImportData = () => {
    if (!importDataText.trim()) {
      toastHook.toast({
        title: "No data provided",
        description: "Please paste your workout data to import.",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = importData(importDataText);
      if (success) {
        setImportDataText('');
        setShowImportDialog(false);
        toastHook.toast({
          title: "Data imported successfully!",
          description: "Your workout data has been restored.",
        });
      } else {
        toastHook.toast({
          title: "Import failed",
          description: "Invalid data format. Please check your backup file.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toastHook.toast({
        title: "Import failed",
        description: "Failed to import workout data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear ALL workout data? This action cannot be undone!')) {
      clearAllData();
      toastHook.toast({
        title: "Data cleared",
        description: "All workout data has been removed.",
      });
    }
  };

  const storageStats = getStorageStats();

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
                <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
                <Dumbbell className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {state.stats.totalWorkouts}
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
                {state.stats.totalVolume.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">lbs lifted total</p>
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
                {state.stats.averageDuration}m
              </div>
              <p className="text-xs text-muted-foreground">per workout</p>
            </CardContent>
          </Card>

          <Card className="workout-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {Object.keys(state.stats.weeklyProgress).length > 0 
                  ? (Object.values(state.stats.weeklyProgress) as number[]).reduce((a: number, b: number) => a + b, 0)
                  : 0
                }
              </div>
              <p className="text-xs text-muted-foreground">workouts this week</p>
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
            <EnhancedWorkoutCalendar onStartWorkout={handleStartWorkout} />
          </TabsContent>

          <TabsContent value="workout" className="mt-6">
            <EnhancedWorkoutLogger />
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <ProgressTracker />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workout Preferences */}
              <Card className="workout-card">
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

              {/* Data Management */}
              <Card className="workout-card">
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Backup, restore, and manage your workout data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Storage Stats */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Storage Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Total Workouts: <span className="font-medium">{storageStats.totalWorkouts}</span></div>
                      <div>Total Dates: <span className="font-medium">{storageStats.totalDates}</span></div>
                      <div>Storage Size: <span className="font-medium">{(storageStats.storageSize / 1024).toFixed(1)} KB</span></div>
                      <div>Last Save: <span className="font-medium">{storageStats.lastSave ? new Date(storageStats.lastSave).toLocaleDateString() : 'Never'}</span></div>
                    </div>
                  </div>

                  {/* Export/Import */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Backup & Restore</h4>
                    <div className="flex gap-2">
                      <Button onClick={handleExportData} variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button onClick={() => setShowImportDialog(true)} variant="outline" className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </div>

                  {/* Clear Data */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Danger Zone</h4>
                    <Button 
                      onClick={handleClearAllData} 
                      variant="destructive" 
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Data
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      This will permanently delete all your workout history. Make sure you have a backup first.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Import Dialog */}
            {showImportDialog && (
              <Card className="workout-card mt-6">
                <CardHeader>
                  <CardTitle>Import Workout Data</CardTitle>
                  <CardDescription>
                    Paste your exported workout data to restore your workout history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="importData">Workout Data (JSON)</Label>
                    <Textarea
                      id="importData"
                      value={importDataText}
                      onChange={(e) => setImportDataText(e.target.value)}
                      placeholder="Paste your exported workout data here..."
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleImportData}>
                      Import Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;