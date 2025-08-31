# FitTracker Pro - Advanced Workout Tracking App

A comprehensive workout tracking application built with React, TypeScript, and modern web technologies. Features include predefined workout routines (including the legendary Toji Fushiguro workout), custom exercise creation, detailed workout logging, comprehensive progress tracking, and advanced workout planning.

## ✨ Features

### 🏋️ **Predefined Workout Routines**
- **Toji Fushiguro Strength Routine**: Advanced strength training program
- **Toji Fushiguro Hypertrophy**: Muscle building focused routine  
- **Toji Fushiguro Endurance**: High-rep endurance training
- **Push Day (Chest, Shoulders, Triceps)**: Classic push day split
- **Pull Day (Back, Biceps)**: Comprehensive back and bicep focus
- **Leg Day (Quads, Hamstrings, Glutes)**: Intensive leg training
- **Home Full Body Workout**: Bodyweight exercises for home training
- **Home Upper Body Focus**: Upper body bodyweight routine
- **Home Cardio Blast**: High-intensity cardio workout
- **Dumbbell Full Body**: Complete dumbbell-based routine
- **Dumbbell Strength Builder**: Progressive overload focus
- **Core Focus Workout**: Intensive abdominal training
- **Cardio Conditioning**: HIIT cardiovascular training

### 🎯 **Exercise Management**
- **Exercise Library**: 50+ pre-built exercises across all muscle groups
- **Custom Exercise Creation**: Add your own exercises with custom descriptions
- **Muscle Group Categorization**: Chest, Back, Legs, Shoulders, Arms, Core, Cardio
- **Equipment Types**: Barbell, Dumbbells, Machine, Cable, Bodyweight
- **Exercise Filtering**: Search and filter by muscle group, equipment, and difficulty

### 📊 **Workout Tracking**
- **Set & Rep Logging**: Track weight, reps, and completion status
- **Rest Timer Integration**: Built-in rest time tracking
- **Volume Calculation**: Automatic total volume calculation
- **Workout History**: Complete workout session history
- **Time Tracking**: Start/end time recording with editing capabilities

### 📅 **Enhanced Calendar & Planning**
- **Interactive Calendar View**: Visual calendar with workout indicators
- **Workout Planning**: Plan future workouts with notes and routine selection
- **Status Tracking**: Mark workouts as planned, completed, or skipped
- **Date Selection**: Click any date to view detailed workout information
- **Planning Tab**: Dedicated view for managing planned workouts
- **Quick Planning**: Hover over future dates to quickly add workouts

### 🔍 **Progress Monitoring**
- **Progress Statistics**: Track total workouts, volume, and duration
- **Weekly Progress**: Monitor weekly workout frequency
- **Muscle Group Focus**: See which muscle groups you're targeting most
- **Favorite Exercises**: Track your most performed exercises
- **Volume Trends**: Monitor total weight lifted over time

### 💾 **Data Persistence & Management**
- **Local Storage**: All workout data stored locally in browser
- **Automatic Backups**: Built-in backup system with version control
- **Data Export/Import**: Backup and restore your workout data
- **Storage Health**: Monitor storage status and perform maintenance
- **Data Migration**: Automatic migration from old storage formats

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Beautiful Animations**: Smooth transitions and hover effects
- **Dark Theme**: Modern gradient-based design
- **Toast Notifications**: User feedback and confirmations
- **Category Filtering**: Filter routines by type (Strength, Home, Gym, etc.)
- **Search Functionality**: Find routines and exercises quickly

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd set-stride
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
npm run dev
```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** to connect your GitHub repository

4. **Automatic deployments** will occur on every push to main branch

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Drag and drop** the `dist` folder to Netlify

3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 3: GitHub Pages

1. **Add to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Context + useReducer
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: npm
- **Date Handling**: date-fns
- **Storage**: LocalStorage with backup system

### Project Structure
```
src/
├── components/              # React components
│   ├── ui/                # Reusable UI components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── EnhancedWorkoutCalendar.tsx # Calendar with planning
│   └── EnhancedWorkoutLogger.tsx # Workout logging
├── contexts/              # React contexts
│   └── WorkoutContext.tsx # Workout state management
├── data/                  # Static data
│   └── workoutRoutines.ts # Predefined routines
├── services/              # Services
│   └── workoutStorage.ts  # Data persistence service
├── types/                 # TypeScript type definitions
│   └── workout.ts         # Workout-related types
├── hooks/                 # Custom React hooks
└── pages/                 # Page components
```

### Key Components

- **WorkoutContext**: Central state management for all workout data
- **EnhancedWorkoutLogger**: Main workout creation and logging interface
- **EnhancedWorkoutCalendar**: Calendar view with workout planning and history
- **Dashboard**: Main application interface with statistics and settings
- **WorkoutStorage**: Data persistence service with backup and recovery

## 📱 Usage Guide

### Starting a Workout

1. **Navigate to Workout tab**
2. **Choose your approach**:
   - **Load a routine**: Select from predefined routines (Toji Fushiguro, Push/Pull/Legs, Home workouts, etc.)
   - **Add exercises**: Pick from exercise library
   - **Create custom**: Build your own exercise
3. **Customize sets and reps**
4. **Start workout and begin logging**

### Planning Workouts

1. **Go to Calendar tab**
2. **Click "Plan Workout"** or hover over a future date
3. **Fill in details**:
   - Workout name
   - Optional routine selection
   - Target duration
   - Notes and goals
4. **Set status** as planned, completed, or skipped

### Tracking Progress

1. **Calendar view**: See all workouts by date with planning
2. **Statistics**: Monitor total volume, duration, and frequency
3. **Edit workout times**: Adjust start/end times after completion
4. **Delete workouts**: Remove unwanted entries
5. **Planning tab**: Manage all planned workouts

### Data Management

1. **Settings tab**: Access data management tools
2. **Export data**: Download backup of all workout data
3. **Import data**: Restore from backup file
4. **Storage stats**: Monitor data usage and health
5. **Clear data**: Remove all workout history (with confirmation)

### Custom Exercises

1. **Go to Custom Exercise tab**
2. **Fill in details**:
   - Exercise name
   - Muscle group
   - Equipment type
   - Optional description
3. **Add to workout**

## 🔧 Customization

### Adding New Routines

Edit `src/data/workoutRoutines.ts`:

```typescript
export const workoutRoutines: WorkoutRoutine[] = [
  {
    id: 'your-routine',
    name: 'Your Routine Name',
    description: 'Description here',
    difficulty: 'Intermediate',
    estimatedDuration: '60-90 minutes',
    category: 'Gym', // Strength, Hypertrophy, Endurance, Home, Gym, Mixed
    exercises: [
      // Define exercises here
    ]
  }
];
```

### Adding New Exercises

Edit `src/data/workoutRoutines.ts`:

```typescript
export const exerciseLibrary: Exercise[] = [
  {
    id: 'your-exercise',
    name: 'Exercise Name',
    muscleGroup: 'Muscle Group',
    equipment: 'Equipment Type',
    description: 'Optional description'
  }
];
```

### Styling Customization

- **Colors**: Edit `src/App.css` for muscle group colors
- **Theme**: Modify Tailwind config in `tailwind.config.ts`
- **Animations**: Customize CSS animations in `src/App.css`

## 📊 Data Persistence

- **Local Storage**: All workout data stored locally in browser
- **Automatic Backups**: Hourly backup creation with version control
- **Data Export**: JSON export for backup and sharing
- **Data Import**: Restore from backup files
- **Storage Health**: Automatic health checks and recovery
- **Migration Support**: Automatic migration from old storage formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Toji Fushiguro**: Inspiration for the workout routines
- **shadcn/ui**: Beautiful UI components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **date-fns**: Modern date utility library

## 🆘 Support

For support, please:
1. Check the documentation above
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using modern web technologies**

## 🆕 Recent Updates

### Enhanced Calendar System
- **Workout Planning**: Plan future workouts with detailed notes
- **Status Tracking**: Mark workouts as planned, completed, or skipped
- **Visual Indicators**: See planned vs completed workouts at a glance
- **Quick Planning**: Hover over dates to quickly add workouts

### Comprehensive Workout Routines
- **Toji Fushiguro Series**: Strength, hypertrophy, and endurance routines
- **Split Training**: Push, pull, and leg day routines
- **Home Workouts**: Bodyweight and dumbbell-based routines
- **Equipment Variations**: Routines for different equipment access levels

### Data Management
- **Automatic Backups**: Built-in backup system with version control
- **Export/Import**: Backup and restore your workout data
- **Storage Health**: Monitor and maintain data integrity
- **Migration Support**: Automatic migration from old storage formats
