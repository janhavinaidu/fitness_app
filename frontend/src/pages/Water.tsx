
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const Water = () => {
  const [currentIntake, setCurrentIntake] = useState(1500); // in ml
  const goal = 2000; // in ml
  
  // Mock weekly data (in ml)
  const weeklyData = [1750, 2000, 1500, 2000, 1250, 1750, 1500];
  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const progress = (currentIntake / goal) * 100;
  const remainingIntake = Math.max(0, goal - currentIntake);

  const addWater = (amount: number) => {
    setCurrentIntake(prev => prev + amount);
  };

  const removeWater = (amount: number) => {
    setCurrentIntake(prev => Math.max(0, prev - amount));
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="flex items-center p-6 pb-4">
        <Link to="/" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Water Intake</h1>
      </div>

      {/* AI Recommendation - Moved to top */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30">
          <div className="flex items-center mb-3">
            <div className="bg-cyan-600 text-white text-xs px-3 py-1 rounded-full mr-3 font-semibold">
              🧠 AI RECOMMENDATION
            </div>
          </div>
          <p className="text-white text-lg font-medium mb-2">
            Drink <span className="text-cyan-400 font-bold">2.2L</span> today
          </p>
          <p className="text-cyan-300 text-sm mb-3">
            Based on your activity level and today's weather
          </p>
          <div className="flex items-center text-sm">
            <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full mr-2">
              High Activity
            </span>
            <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
              Warm Weather
            </span>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-white mb-1">{currentIntake}ml</div>
            <p className="text-gray-400 text-lg">of {goal}ml goal</p>
            
            {/* Horizontal Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-4 mt-4 overflow-hidden">
              <div 
                className="h-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>0ml</span>
              <span className="text-cyan-400 font-medium">{Math.round(progress)}%</span>
              <span>{goal}ml</span>
            </div>
            
            {remainingIntake > 0 && (
              <p className="text-cyan-400 mt-3 font-medium">
                💧 {remainingIntake}ml to go!
              </p>
            )}
          </div>

          {/* Quick Add Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => removeWater(250)}
              className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => addWater(250)}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors font-medium"
              >
                +250ml
              </button>
              <button
                onClick={() => addWater(500)}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors font-medium"
              >
                +500ml
              </button>
            </div>
            
            <button
              onClick={() => addWater(250)}
              className="p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Water Drops Visualization */}
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: 8 }, (_, i) => {
              const dropValue = (goal / 8) * (i + 1);
              const isFilled = currentIntake >= dropValue;
              
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                    isFilled
                      ? 'bg-gradient-to-b from-blue-400 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  💧
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="px-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">This Week</h3>
          <div className="flex items-end justify-between space-x-2 h-32">
            {weeklyData.map((intake, index) => {
              const heightPercentage = (intake / goal) * 100;
              const isToday = index === weeklyData.length - 1;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end h-24 mb-2">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday 
                          ? 'bg-gradient-to-t from-blue-400 to-cyan-400' 
                          : 'bg-gradient-to-t from-gray-600 to-gray-500'
                      }`}
                      style={{ height: `${Math.min(heightPercentage, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs ${isToday ? 'text-blue-400' : 'text-gray-400'}`}>
                    {weeklyLabels[index]}
                  </span>
                  <span className={`text-xs mt-1 ${isToday ? 'text-white' : 'text-gray-500'}`}>
                    {(intake / 1000).toFixed(1)}L
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Water;
