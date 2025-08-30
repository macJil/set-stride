import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const RestTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(90); // Default 90 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(90);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Could play notification sound here
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const adjustTime = (adjustment: number) => {
    if (!isRunning) {
      const newTime = Math.max(0, timeLeft + adjustment);
      setTimeLeft(newTime);
      setInitialTime(newTime);
    }
  };

  const getTimerClass = () => {
    if (timeLeft === 0) return 'timer-complete';
    if (isRunning) return 'timer-active';
    return '';
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <Card className="workout-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Rest Timer
          <div className="text-sm text-muted-foreground font-normal">
            {timeLeft === 0 ? 'Complete!' : isRunning ? 'Running' : 'Ready'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className={cn(
          "text-center p-6 rounded-xl border-2 transition-all duration-300",
          "bg-gradient-secondary",
          getTimerClass()
        )}>
          <div className="text-4xl font-bold mb-2">
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {initialTime > 0 ? `${Math.round(progress)}% complete` : 'Set your rest time'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => adjustTime(-15)}
            disabled={isRunning}
            className="hover-lift"
          >
            <Minus className="h-4 w-4" />
            15s
          </Button>

          <Button
            size="sm"
            onClick={handlePlayPause}
            className={cn(
              "px-6 transition-all duration-300",
              isRunning 
                ? "bg-warning hover:bg-warning/80" 
                : "bg-gradient-primary hover:opacity-90"
            )}
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => adjustTime(15)}
            disabled={isRunning}
            className="hover-lift"
          >
            <Plus className="h-4 w-4" />
            15s
          </Button>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground hover-lift"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Quick Set Times */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border">
          {[60, 90, 120, 180].map((seconds) => (
            <Button
              key={seconds}
              size="sm"
              variant="ghost"
              onClick={() => {
                if (!isRunning) {
                  setTimeLeft(seconds);
                  setInitialTime(seconds);
                }
              }}
              disabled={isRunning}
              className="text-xs hover-lift"
            >
              {formatTime(seconds)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};