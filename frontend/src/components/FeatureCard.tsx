
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value?: string | number;
  progress?: number;
  link: string;
  gradient?: string;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  value, 
  progress, 
  link, 
  gradient = "from-blue-500 to-purple-500" 
}: FeatureCardProps) => {
  return (
    <Link to={link} className="block">
      <div className="feature-card group">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {value && (
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        
        {progress !== undefined && (
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default FeatureCard;
