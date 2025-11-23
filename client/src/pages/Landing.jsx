import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Zap, Shield, Rocket, Moon, Sun, Mail, GraduationCap, Calendar } from 'lucide-react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    course: '',
    phone: '',
    department: '',
    year_of_study: '',
    password: '',
    password_confirmation: '',
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN - Support both email (admin/security) and id (students)
        const credentials = {
          password: formData.password,
        };
        
        // Check if input looks like an email (contains @)
        const isEmailFormat = formData.email && formData.email.includes('@');
        
        if (isEmailFormat) {
          credentials.email = formData.email;
        } else {
          // Use email field value as ID (students can login with ID via email field)
          credentials.id = formData.email || formData.id;
        }
        
        const result = await authService.login(credentials);
        setMessage('✅ Login successful!');
        console.log('Logged in user:', result);
        
        // Redirect based on user role
        const role = result.role || authService.getRole();
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'security') {
            navigate('/personnel/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        }, 1000);
        
      } else {
        // REGISTER
        if (formData.password !== formData.password_confirmation) {
          setError('❌ Passwords do not match!');
          setLoading(false);
          return;
        }

        const result = await authService.register({
          id: formData.id,
          name: formData.name,
          email: formData.email,
          course: formData.course,
          phone: formData.phone,
          department: formData.department,
          year_of_study: formData.year_of_study ? parseInt(formData.year_of_study) : null,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        });
        setMessage('✅ Registered successfully!');
        console.log('Registered user:', result);
        
        // Switch to login after successful registration
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            id: '',
            name: '',
            email: '',
            course: '',
            phone: '',
            department: '',
            year_of_study: '',
            password: '',
            password_confirmation: '',
          });
          setMessage('');
        }, 2000);
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred. Please try again.';
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const bgClass = darkMode 
    ? 'bg-black text-white' 
    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900';

  const cardBg = darkMode
    ? 'bg-white/5 border border-white/10 backdrop-blur-xl'
    : 'bg-white/80 border border-white/60 backdrop-blur-xl';

  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500 flex items-center justify-center p-4`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-10 w-80 h-80 ${darkMode ? 'bg-blue-600/20' : 'bg-blue-200/30'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-40 left-20 w-96 h-96 ${darkMode ? 'bg-indigo-600/20' : 'bg-indigo-200/20'} rounded-full blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">
              DevPass
            </h1>
          </div>
          <p className={`text-sm ${textSecondary}`}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className={`${cardBg} rounded-2xl p-8 shadow-2xl`}>
          {/* Toggle Login/Register */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setMessage('');
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : `${textSecondary} hover:${textPrimary}`
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setMessage('');
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : `${textSecondary} hover:${textPrimary}`
              }`}
            >
              Register
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/40 ${textPrimary} text-sm`}>
              {message}
            </div>
          )}
          {error && (
            <div className={`mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 ${textPrimary} text-sm`}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin ? (
              <>
                {/* Login Form */}
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Email or Student ID
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter email or student ID"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-12 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondary} hover:${textPrimary}`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Register Form */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      Student ID *
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                      <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="ID"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Name"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Phone"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      Year of Study
                    </label>
                    <input
                      type="number"
                      name="year_of_study"
                      value={formData.year_of_study}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Year"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Department"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      Course
                    </label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Course"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className={`w-full pl-10 pr-12 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Password (min 6 chars)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondary} hover:${textPrimary}`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-lg ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-all shadow-lg ${
                loading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
              }`}
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
