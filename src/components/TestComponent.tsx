import React from 'react';

export const TestComponent: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">
        🏋️ FitTracker Pro
      </h1>
      <p className="text-xl text-muted-foreground mb-6">
        Your comprehensive workout tracking solution
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">📅 Calendar View</h3>
          <p className="text-muted-foreground">
            Plan and track your workouts with our enhanced calendar
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">💪 Workout Logger</h3>
          <p className="text-muted-foreground">
            Log your exercises, sets, and track your progress
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">📊 Progress Tracking</h3>
          <p className="text-muted-foreground">
            Monitor your fitness journey with detailed analytics
          </p>
        </div>
      </div>
    </div>
  );
};
