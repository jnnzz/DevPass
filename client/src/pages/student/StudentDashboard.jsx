import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Moon, 
  Sun,
  Shield,
  Loader2
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/');
        return;
      }

      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to load profile:', error);
        if (error.response?.status === 401) {
          await authService.logout();
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const bgClass = darkMode 
    ? 'bg-black text-white' 
    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900';

  const cardBg = darkMode
    ? 'bg-white/5 border border-white/10 backdrop-blur-xl'
    : 'bg-white/80 border border-white/60 backdrop-blur-xl';

  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  if (loading) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500`}>
      {/* Top Navigation */}
      <nav className={`sticky top-0 z-40 ${cardBg} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">
                DevPass
              </h1>
                <p className={`text-xs ${textSecondary}`}>Student Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3">
              <button className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <Bell className={`w-4 h-4 sm:w-5 sm:h-5 ${textSecondary}`} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                )}
              </button>
              <button className={`hidden sm:block p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <Settings className={`w-5 h-5 ${textSecondary}`} />
              </button>
              <button 
                onClick={handleLogout}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${darkMode ? 'hover:bg-white/10 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className={`${cardBg} rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <User className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>
                Welcome back, {user?.name || 'Student'}!
          </h2>
          <p className={`text-sm sm:text-base ${textSecondary}`}>
                Student ID: {user?.id || 'N/A'}
          </p>
        </div>
          </div>

          {/* Student Info */}
          {user && (
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs ${textSecondary} mb-1`}>Email</p>
                  <p className={`font-semibold ${textPrimary}`}>{user.email || 'N/A'}</p>
              </div>
                {user.phone && (
                  <div>
                    <p className={`text-xs ${textSecondary} mb-1`}>Phone</p>
                    <p className={`font-semibold ${textPrimary}`}>{user.phone}</p>
          </div>
        )}
                {user.department && (
          <div>
                    <p className={`text-xs ${textSecondary} mb-1`}>Department</p>
                    <p className={`font-semibold ${textPrimary}`}>{user.department}</p>
                            </div>
                          )}
                {user.course && (
                  <div>
                    <p className={`text-xs ${textSecondary} mb-1`}>Course</p>
                    <p className={`font-semibold ${textPrimary}`}>{user.course}</p>
                      </div>
                )}
                {user.year_of_study && (
                  <div>
                    <p className={`text-xs ${textSecondary} mb-1`}>Year of Study</p>
                    <p className={`font-semibold ${textPrimary}`}>{user.year_of_study}</p>
                    </div>
                  )}
            </div>
          </div>
        )}
      </div>

        {/* Placeholder for future features */}
        <div className={`${cardBg} rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center`}>
          <p className={`text-base sm:text-lg ${textSecondary}`}>
            Dashboard features coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
