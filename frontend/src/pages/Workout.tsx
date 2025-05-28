
import { ArrowLeft, Clock, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomNavigation from '../components/BottomNavigation';

const Workout = () => {
  // Mock data
  const todayWorkout = {
    type: "HIIT Cardio",
    duration: 30,
    calories: 250,
    exercises: [
      "Jumping Jacks - 45s",
      "Mountain Climbers - 45s",
      "Burpees - 30s",
      "High Knees - 45s",
      "Rest - 30s"
    ]
  };

  const weeklyWorkouts = [
    { day: 'Mon', type: 'Strength', completed: true },
    { day: 'Tue', type: 'Cardio', completed: true },
    { day: 'Wed', type: 'Rest', completed: true },
    { day: 'Thu', type: 'Yoga', completed: true },
    { day: 'Fri', type: 'HIIT', completed: false },
    { day: 'Sat', type: 'Strength', completed: false },
    { day: 'Sun', type: 'Rest', completed: false }
  ];

  const stats = {
    thisWeek: 4,
    totalCalories: 890,
    avgDuration: 35
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="flex items-center p-6 pb-4">
        <Link to="/" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Workouts</h1>
      </div>

      {/* AI Workout Recommendation - Moved to top */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6 bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
          <div className="flex items-center mb-3">
            <div className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full mr-3 font-semibold">
              🧠 AI WORKOUT
            </div>
            <div className="text-orange-400 text-xl">🔥</div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Today's Recommended Workout</h3>
          <p className="text-orange-400 font-medium text-lg mb-1">{todayWorkout.type}</p>
          <div className="flex items-center space-x-4 text-gray-300 mb-3">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{todayWorkout.duration} min</span>
            </div>
            <div className="flex items-center">
              <Flame className="w-4 h-4 mr-1" />
              <span>{todayWorkout.calories} cal</span>
            </div>
          </div>
          <p className="text-orange-300 text-sm">Personalized based on your fitness level and goals</p>
        </div>
      </div>

      {/* Today's Workout Details */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Workout Details</h3>
          
          <div className="space-y-2 mb-6">
            {todayWorkout.exercises.map((exercise, index) => (
              <div key={index} className="bg-black/20 p-3 rounded-lg">
                <span className="text-white">{exercise}</span>
              </div>
            ))}
          </div>

          <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl">
            Start Workout
          </Button>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">This Week</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.thisWeek}</div>
              <div className="text-gray-400 text-sm">Workouts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalCalories}</div>
              <div className="text-gray-400 text-sm">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.avgDuration}</div>
              <div className="text-gray-400 text-sm">Avg Min</div>
            </div>
          </div>

          <div className="space-y-2">
            {weeklyWorkouts.map((workout, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  workout.completed 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-gray-700/50'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-white font-medium w-12">{workout.day}</span>
                  <span className={workout.completed ? 'text-green-400' : 'text-gray-400'}>
                    {workout.type}
                  </span>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  workout.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-600'
                }`}>
                  {workout.completed && '✓'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alternative AI Workout Generator */}
      <div className="px-6">
        <div className="glass-card p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <h3 className="text-lg font-semibold text-white mb-3">Need Something Different?</h3>
          <p className="text-gray-300 mb-4">
            Get a personalized workout based on your available time and equipment.
          </p>
          <Button 
            variant="outline" 
            className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
          >
            🧠 Generate Alternative Workout
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Workout;
