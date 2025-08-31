import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SimpleDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          🏋️ FitTracker Pro
        </h1>
        <p className="text-xl text-muted-foreground">
          Your comprehensive workout tracking solution
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📅 Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Enhanced calendar with workout planning and tracking will be displayed here.
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">Calendar component is working!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workout" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>💪 Workout Logger</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Enhanced workout logging with predefined routines will be displayed here.
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">Workout Logger component is working!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Progress analytics and statistics will be displayed here.
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">Progress Tracker component is working!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Data management and application settings will be displayed here.
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">Settings functionality is working!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimpleDashboard;
