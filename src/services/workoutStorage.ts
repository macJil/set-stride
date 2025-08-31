import { WorkoutHistory, WorkoutSession } from '@/types/workout';

class WorkoutStorageService {
  private readonly STORAGE_KEY = 'fitTracker_workoutHistory';
  private readonly BACKUP_KEY = 'fitTracker_backup';
  private readonly VERSION_KEY = 'fitTracker_version';
  private readonly CURRENT_VERSION = '1.0.0';

  constructor() {
    // Defer initialization to avoid constructor errors
    setTimeout(() => {
      try {
        this.initializeStorage();
      } catch (error) {
        console.error('Failed to initialize workout storage:', error);
      }
    }, 0);
  }

  private initializeStorage() {
    try {
      // Check if we need to migrate from old storage
      const oldStorage = localStorage.getItem('workoutHistory');
      if (oldStorage && !localStorage.getItem(this.STORAGE_KEY)) {
        this.migrateOldData(oldStorage);
      }

      // Set current version
      localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
    } catch (error) {
      console.error('Storage initialization failed:', error);
    }
  }

  private migrateOldData(oldData: string) {
    try {
      const parsed = JSON.parse(oldData);
      this.saveWorkoutHistory(parsed);
      // Remove old data
      localStorage.removeItem('workoutHistory');
    } catch (error) {
      console.error('Failed to migrate old workout data:', error);
    }
  }

  // Save workout history with backup
  saveWorkoutHistory(history: WorkoutHistory): void {
    try {
      // Create backup before saving
      this.createBackup();
      
      // Save current data
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      
      // Update last save timestamp
      localStorage.setItem('fitTracker_lastSave', new Date().toISOString());
    } catch (error) {
      console.error('Failed to save workout history:', error);
      // Try to restore from backup
      this.restoreFromBackup();
    }
  }

  // Load workout history
  loadWorkoutHistory(): WorkoutHistory {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return {};
      }

      const parsed = JSON.parse(data);
      
      // Convert date strings back to Date objects
      const converted: WorkoutHistory = {};
      Object.keys(parsed).forEach(date => {
        converted[date] = parsed[date].map((workout: any) => ({
          ...workout,
          startTime: new Date(workout.startTime),
          endTime: workout.endTime ? new Date(workout.endTime) : undefined
        }));
      });

      return converted;
    } catch (error) {
      console.error('Failed to load workout history:', error);
      // Try to restore from backup
      return this.restoreFromBackup();
    }
  }

  // Create backup of current data
  private createBackup(): void {
    try {
      const currentData = localStorage.getItem(this.STORAGE_KEY);
      if (currentData) {
        localStorage.setItem(this.BACKUP_KEY, currentData);
        localStorage.setItem('fitTracker_backupTime', new Date().toISOString());
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }

  // Restore from backup
  private restoreFromBackup(): WorkoutHistory {
    try {
      const backupData = localStorage.getItem(this.BACKUP_KEY);
      if (backupData) {
        console.log('Restoring workout data from backup');
        const parsed = JSON.parse(backupData);
        
        // Convert date strings back to Date objects
        const converted: WorkoutHistory = {};
        Object.keys(parsed).forEach(date => {
          converted[date] = parsed[date].map((workout: any) => ({
            ...workout,
            startTime: new Date(workout.startTime),
            endTime: workout.endTime ? new Date(workout.endTime) : undefined
          }));
        });

        return converted;
      }
    } catch (error) {
      console.error('Failed to restore from backup:', error);
    }
    
    return {};
  }

  // Export workout data
  exportWorkoutData(): string {
    try {
      const data = this.loadWorkoutHistory();
      const exportData = {
        version: this.CURRENT_VERSION,
        exportDate: new Date().toISOString(),
        workoutHistory: data
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export workout data:', error);
      return '';
    }
  }

  // Import workout data
  importWorkoutData(importData: string): boolean {
    try {
      const parsed = JSON.parse(importData);
      
      // Validate import data
      if (!parsed.workoutHistory || typeof parsed.workoutHistory !== 'object') {
        throw new Error('Invalid import data format');
      }

      // Create backup before import
      this.createBackup();

      // Import the data
      this.saveWorkoutHistory(parsed.workoutHistory);
      
      return true;
    } catch (error) {
      console.error('Failed to import workout data:', error);
      return false;
    }
  }

  // Clear all workout data
  clearAllData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
      localStorage.removeItem(this.VERSION_KEY);
      localStorage.removeItem('fitTracker_lastSave');
      localStorage.removeItem('fitTracker_backupTime');
    } catch (error) {
      console.error('Failed to clear workout data:', error);
    }
  }

  // Get storage statistics
  getStorageStats(): {
    totalWorkouts: number;
    totalDates: number;
    lastSave: string | null;
    backupTime: string | null;
    storageSize: number;
  } {
    try {
      const history = this.loadWorkoutHistory();
      const totalWorkouts = Object.values(history).reduce((sum, workouts) => sum + workouts.length, 0);
      const totalDates = Object.keys(history).length;
      const lastSave = localStorage.getItem('fitTracker_lastSave');
      const backupTime = localStorage.getItem('fitTracker_backupTime');
      
      // Calculate approximate storage size
      const dataString = JSON.stringify(history);
      const storageSize = new Blob([dataString]).size;

      return {
        totalWorkouts,
        totalDates,
        lastSave,
        backupTime,
        storageSize
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        totalWorkouts: 0,
        totalDates: 0,
        lastSave: null,
        backupTime: null,
        storageSize: 0
      };
    }
  }

  // Check if storage is healthy
  isStorageHealthy(): boolean {
    try {
      const stats = this.getStorageStats();
      const data = localStorage.getItem(this.STORAGE_KEY);
      
      // Check if we can read/write data
      if (!data) return true; // Empty storage is healthy
      
      // Test parsing
      JSON.parse(data);
      
      return true;
    } catch (error) {
      console.error('Storage health check failed:', error);
      return false;
    }
  }

  // Perform storage maintenance
  performMaintenance(): void {
    try {
      // Create fresh backup
      this.createBackup();
      
      // Check storage health
      if (!this.isStorageHealthy()) {
        console.log('Storage unhealthy, attempting repair...');
        this.restoreFromBackup();
      }
      
      // Clean up old backup if it's too old (older than 7 days)
      const backupTime = localStorage.getItem('fitTracker_backupTime');
      if (backupTime) {
        const backupDate = new Date(backupTime);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        if (backupDate < sevenDaysAgo) {
          localStorage.removeItem(this.BACKUP_KEY);
          localStorage.removeItem('fitTracker_backupTime');
          console.log('Cleaned up old backup');
        }
      }
    } catch (error) {
      console.error('Storage maintenance failed:', error);
    }
  }
}

// Create singleton instance with error handling
let workoutStorage: WorkoutStorageService;
try {
  workoutStorage = new WorkoutStorageService();
} catch (error) {
  console.error('Failed to create workout storage service:', error);
  // Create a fallback service
  workoutStorage = {
    saveWorkoutHistory: () => {},
    loadWorkoutHistory: () => ({}),
    createBackup: () => {},
    restoreFromBackup: () => ({}),
    exportWorkoutData: () => '{}',
    importWorkoutData: () => false,
    clearAllData: () => {},
    getStorageStats: () => ({
      totalWorkouts: 0,
      totalDates: 0,
      lastSave: null,
      backupTime: null,
      storageSize: 0
    }),
    isStorageHealthy: () => false,
    performMaintenance: () => {}
  } as any;
}

// Auto-maintenance every hour (only if service is healthy)
try {
  setInterval(() => {
    if (workoutStorage.isStorageHealthy && workoutStorage.isStorageHealthy()) {
      workoutStorage.performMaintenance();
    }
  }, 60 * 60 * 1000);
} catch (error) {
  console.error('Failed to set up storage maintenance:', error);
}

export { workoutStorage };
export default workoutStorage;
