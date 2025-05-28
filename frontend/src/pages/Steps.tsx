import { ArrowLeft, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CircularProgress from '../components/CircularProgress';
import BottomNavigation from '../components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { stepsApi } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Steps = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  // Mock data
  const [stepsData, setStepsData] = useState({
    today: 7234,
    goal: 10000,
    weekly: [8234, 9156, 7890, 10234, 6789, 8956, 7234],
    weeklyLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  });

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(stepsData.goal.toString());

  const progress = (stepsData.today / stepsData.goal) * 100;
  const dailyQuote = "Every step counts towards your goal!";
  const maxWeeklySteps = Math.max(...stepsData.weekly);

  const handleUpdateGoal = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to update your steps goal');
      navigate('/login');
      return;
    }

    const goalNumber = parseInt(newGoal);
    if (isNaN(goalNumber) || goalNumber < 1000) {
      toast.error('Please enter a valid goal (minimum 1000 steps)');
      return;
    }

    try {
      const response = await stepsApi.updateStepsGoal(goalNumber);
      setStepsData(prev => ({ ...prev, goal: goalNumber }));
      toast.success(response.message || 'Steps goal updated successfully!');
      setIsEditingGoal(false);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to update steps goal');
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="flex items-center p-6 pb-4">
        <Link to="/" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Steps Challenge</h1>
      </div>

      {/* Today's Progress */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6 text-center">
          <div className="flex flex-col items-center">
            <CircularProgress progress={progress} size={150} />
            <div className="mt-4 text-center">
              <div className="text-lg font-semibold text-blue-400 mb-1">
                {Math.round(progress)}% Complete
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {stepsData.today.toLocaleString()}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <p className="text-gray-400">
                  of {stepsData.goal.toLocaleString()} steps goal
                </p>
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-blue-400 mt-2">
                {(stepsData.goal - stepsData.today).toLocaleString()} steps to go!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditingGoal} onOpenChange={setIsEditingGoal}>
        <DialogContent className="bg-gray-900 text-white border-gray-800" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Update Daily Steps Goal</DialogTitle>
            <p id="dialog-description" className="text-sm text-gray-400">
              Set your daily steps target to track your fitness progress
            </p>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              min="1000"
              step="1000"
              aria-describedby="steps-goal-description"
            />
            <p id="steps-goal-description" className="text-gray-400 text-sm mt-2">Minimum goal: 1,000 steps</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditingGoal(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateGoal}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Motivation - Moved to top */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30">
          <div className="flex items-center mb-3">
            <div className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full mr-3 font-semibold">
              🧠 AI MOTIVATION
            </div>
          </div>
          <p className="text-white text-lg font-medium leading-relaxed">"{dailyQuote}"</p>
          <p className="text-indigo-300 text-sm mt-2">Personalized based on your progress</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">This Week</h3>
          <div className="flex items-end justify-between space-x-2 h-40">
            {stepsData.weekly.map((steps, index) => {
              const heightPercentage = (steps / maxWeeklySteps) * 100;
              const isToday = index === stepsData.weekly.length - 1;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end h-32 mb-2">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday 
                          ? 'bg-gradient-to-t from-blue-500 to-purple-500' 
                          : 'bg-gradient-to-t from-gray-600 to-gray-500'
                      }`}
                      style={{ height: `${heightPercentage}%` }}
                    />
                  </div>
                  <span className={`text-xs ${isToday ? 'text-blue-400' : 'text-gray-400'}`}>
                    {stepsData.weeklyLabels[index]}
                  </span>
                  <span className={`text-xs mt-1 ${isToday ? 'text-white' : 'text-gray-500'}`}>
                    {(steps / 1000).toFixed(1)}k
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-xl">
              <div>
                <p className="text-white font-medium">7-Day Streak</p>
                <p className="text-gray-400 text-sm">Keep up the momentum!</p>
              </div>
              <div className="text-yellow-400 text-xl">🔥</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl">
              <div>
                <p className="text-white font-medium">Goal Crusher</p>
                <p className="text-gray-400 text-sm">Hit your goal 5 times this month</p>
              </div>
              <div className="text-blue-400 text-xl">🎯</div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Steps;
