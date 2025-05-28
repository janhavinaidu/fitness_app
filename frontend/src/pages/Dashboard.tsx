
import { User, Droplet, Dumbbell, Book } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import CircularProgress from '../components/CircularProgress';
import BottomNavigation from '../components/BottomNavigation';

const Dashboard = () => {
  // Mock data - will be replaced with real data later
  const userStats = {
    steps: { current: 7234, goal: 10000 },
    water: { current: 6, goal: 8 },
    workoutsThisWeek: 4,
    journalStreak: 12
  };

  const stepsProgress = (userStats.steps.current / userStats.steps.goal) * 100;
  const waterProgress = (userStats.water.current / userStats.water.goal) * 100;

  const dailyQuote = "The only bad workout is the one that didn't happen.";
  const todayWorkout = "30-min HIIT Cardio";

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="pt-12 px-6 mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Good Morning!</h1>
        <p className="text-gray-400">Ready to crush your goals today?</p>
      </div>

      {/* Main Stats Cards */}
      <div className="px-6 space-y-6 mb-8">
        {/* Steps Challenge */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Steps Challenge</h3>
              <p className="text-gray-400 mb-4">
                {userStats.steps.current.toLocaleString()} / {userStats.steps.goal.toLocaleString()} steps
              </p>
              <div className="text-sm text-blue-400">
                {(userStats.steps.goal - userStats.steps.current).toLocaleString()} steps to go!
              </div>
            </div>
            <CircularProgress progress={stepsProgress} size={100} />
          </div>
        </div>

        {/* Daily Quote */}
        <div className="glass-card p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <h3 className="text-lg font-semibold text-white mb-3">Daily Inspiration</h3>
          <p className="text-gray-300 italic text-lg leading-relaxed">"{dailyQuote}"</p>
        </div>

        {/* Today's Workout */}
        <div className="glass-card p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Today's Workout</h3>
              <p className="text-orange-400 font-medium text-xl">{todayWorkout}</p>
              <p className="text-gray-400 mt-1">AI-generated for you</p>
            </div>
            <Dumbbell className="w-12 h-12 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="px-6 grid grid-cols-2 gap-4">
        <FeatureCard
          icon={Droplet}
          title="Water Intake"
          description={`${userStats.water.current}/${userStats.water.goal} glasses`}
          value={`${userStats.water.current}L`}
          progress={waterProgress}
          link="/water"
          gradient="from-blue-400 to-cyan-400"
        />
        
        <FeatureCard
          icon={Dumbbell}
          title="Workouts"
          description={`${userStats.workoutsThisWeek} this week`}
          value={userStats.workoutsThisWeek}
          link="/workout"
          gradient="from-orange-400 to-red-400"
        />
        
        <FeatureCard
          icon={Book}
          title="Journal"
          description={`${userStats.journalStreak} day streak`}
          value={userStats.journalStreak}
          link="/journal"
          gradient="from-green-400 to-emerald-400"
        />
        
        <FeatureCard
          icon={User}
          title="Profile"
          description="View your progress"
          link="/profile"
          gradient="from-purple-400 to-pink-400"
        />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
