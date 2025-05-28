
import { Home, User, Droplet, Dumbbell, Book } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: User, label: 'Steps', path: '/steps' },
    { icon: Droplet, label: 'Water', path: '/water' },
    { icon: Dumbbell, label: 'Workout', path: '/workout' },
    { icon: Book, label: 'Journal', path: '/journal' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-card m-4 p-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
