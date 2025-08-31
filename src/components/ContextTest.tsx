import React from 'react';
import { useWorkout } from '@/contexts/WorkoutContext';

const ContextTest: React.FC = () => {
  try {
    const { state } = useWorkout();
    
    return (
      <div className="min-h-screen bg-white text-black p-8">
        <h1 className="text-4xl font-bold mb-4">🔧 Context Test</h1>
        <p className="text-lg mb-4">Testing workout context...</p>
        
        <div className="bg-green-100 p-4 rounded border mb-4">
          <h2 className="font-bold text-green-800">Context Status:</h2>
          <p>✅ Workout context loaded successfully</p>
          <p>Total workouts: {state.stats.totalWorkouts}</p>
          <p>Total volume: {state.stats.totalVolume}</p>
        </div>
        
        <div className="bg-blue-100 p-4 rounded border">
          <h2 className="font-bold text-blue-800">State Info:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-red-50 text-red-800 p-8">
        <h1 className="text-4xl font-bold mb-4">❌ Context Error</h1>
        <p className="text-lg mb-4">Failed to load workout context:</p>
        <div className="bg-red-100 p-4 rounded border">
          <pre className="text-sm overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
};

export default ContextTest;
