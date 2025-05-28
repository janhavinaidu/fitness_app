import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, LogOut, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/lib/api';
import { toast } from 'sonner';
import BottomNavigation from '../components/BottomNavigation';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, initializeAuth } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: ''
  });

  // Initialize auth state
  useEffect(() => {
    const init = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, [initializeAuth]);

  // Update form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || ''
      });
    }
  }, [user]);

  // Handle authentication check
  useEffect(() => {
    if (!isInitializing && !user) {
      navigate('/login');
    }
  }, [user, navigate, isInitializing]);

  // Mock stats and achievements for now
  const stats = {
    totalSteps: 245670,
    totalWorkouts: 156,
    journalEntries: 89,
    currentStreak: 12
  };

  const achievements = [
    { title: 'Step Master', description: '100,000 steps milestone', emoji: '🚶‍♂️' },
    { title: 'Workout Warrior', description: '100 workouts completed', emoji: '💪' },
    { title: 'Mindful Writer', description: '50 journal entries', emoji: '📖' },
    { title: 'Hydration Hero', description: 'Weekly water goals met', emoji: '💧' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await userApi.updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditDialogOpen(false);
      // Refresh the page to get updated user data
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await userApi.deleteAccount();
        toast.success('Account deleted successfully');
        logout();
        navigate('/login');
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Failed to delete account');
      }
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="flex items-center p-6 pb-4">
        <Link to="/" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>

      {/* Profile Info */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : user.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{user.full_name || user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-500 text-sm">Member since {formatDate(user.created_at)}</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800/50"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Your Progress</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-xl">
              <div className="text-2xl font-bold text-white">{stats.totalSteps.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Total Steps</div>
            </div>
            <div className="text-center p-4 bg-orange-500/10 rounded-xl">
              <div className="text-2xl font-bold text-white">{stats.totalWorkouts}</div>
              <div className="text-gray-400 text-sm">Workouts</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-xl">
              <div className="text-2xl font-bold text-white">{stats.journalEntries}</div>
              <div className="text-gray-400 text-sm">Journal Entries</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-xl">
              <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-gray-400 text-sm">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center p-4 bg-yellow-500/10 rounded-xl">
                <div className="text-2xl mr-4">{achievement.emoji}</div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{achievement.title}</h4>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 space-y-3">
        <Button 
          variant="outline" 
          className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
          onClick={handleDeleteAccount}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-white">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
