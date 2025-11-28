import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, User, Zap, Shield, Rocket, Moon, Sun, Mail, GraduationCap, Calendar, X } from 'lucide-react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState('email'); // 'email' or 'reset'
  const [rememberMe, setRememberMe] = useState(false);
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

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    code: '',
    password: '',
    password_confirmation: '',
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Helper function to determine user role and redirect path
  const getRedirectPath = (user) => {
    if (!user) return '/student/dashboard';
    
    const course = user.course?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    
    // Check if admin (by course or email)
    if (course === 'admin' || email.includes('admin@devpass')) {
      return '/admin/dashboard';
    }
    
    // Check if security/personnel (by course or email)
    if (course === 'security' || course === 'personnel' || email.includes('security@devpass')) {
      return '/personnel/dashboard';
    }
    
    // Default to student dashboard
    return '/student/dashboard';
  };

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const student = authService.getCurrentStudent();
        if (student) {
          const redirectPath = getRedirectPath(student);
          navigate(redirectPath);
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const result = await authService.login({
          id: formData.id,
          password: formData.password,
        }, rememberMe);
        setMessage('✅ Login successful!');
        console.log('Logged in user:', result);
        
        // Redirect based on user role
        const redirectPath = getRedirectPath(result.student);
        setTimeout(() => {
          navigate(redirectPath);
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
        }, 1500);
      }
    } catch (err) {
      console.error('Login/Register error:', err);
      let errorMessage = 'Operation failed';
      
      if (err.response?.data) {
        // Check for validation errors
        if (err.response.data.errors) {
          // Get first error from any field
          const errorFields = Object.keys(err.response.data.errors);
          if (errorFields.length > 0) {
            errorMessage = err.response.data.errors[errorFields[0]][0];
          }
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const bgClass = darkMode 
    ? 'bg-black text-white' 
    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900';
  
  const orbClass = darkMode
    ? 'bg-blue-600/20'
    : 'bg-blue-200/30';

  const featureCardBg = darkMode
    ? 'p-3 bg-blue-500/20 rounded-xl border border-blue-500/30'
    : 'p-3 bg-blue-100 rounded-xl border border-blue-300/60';

  const featureCardText = darkMode ? 'text-blue-400' : 'text-blue-600';
  const featureTitleText = darkMode ? 'text-white' : 'text-gray-900';
  const featureDescText = darkMode ? 'text-gray-400' : 'text-gray-600';

  const formBg = darkMode
    ? 'backdrop-blur-2xl bg-white/5 border border-white/10'
    : 'backdrop-blur-xl bg-white/80 border border-white/60';
  
  const formText = darkMode ? 'text-gray-300' : 'text-gray-800';
  const formDescText = darkMode ? 'text-gray-400' : 'text-gray-600';
  
  const inputBg = darkMode
    ? 'bg-gray-900/50 border border-gray-800 text-white placeholder-gray-600'
    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500';

  const toggleBg = darkMode
    ? 'bg-gray-900/50 border border-gray-800'
    : 'bg-gray-100 border border-gray-300';

  const checkboxColor = darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-300';

  return (
    <div className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500`}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-xl transition-all duration-300 ${
          darkMode
            ? 'bg-white/10 border border-white/20 hover:bg-white/20'
            : 'bg-gray-900/10 border border-gray-900/20 hover:bg-gray-900/20'
        }`}
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-indigo-600" />
        )}
      </button>

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-80 h-80 ${orbClass} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-40 right-20 w-96 h-96 ${darkMode ? 'bg-indigo-600/20' : 'bg-indigo-200/20'} rounded-full blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
        <div className={`absolute top-1/2 left-1/3 w-72 h-72 ${darkMode ? 'bg-cyan-600/10' : 'bg-cyan-200/20'} rounded-full blur-3xl animate-pulse`} style={{animationDelay: '4s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 lg:gap-0 items-center">
          {/* Left Side - Information */}
          <div className="lg:pr-12">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">
                  DevPass
                </h1>
              </div>
              <p className={`text-xl lg:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-light leading-relaxed`}>
                Next-gen QR-based device registration platform for seamless campus entry
              </p>
            </div>

            <div className="space-y-5 mb-12">
              <div className="flex items-start gap-4 group">
                <div className={`${darkMode ? 'bg-cyan-500/20 border border-cyan-500/30 group-hover:bg-cyan-500/30' : 'bg-cyan-100 border border-cyan-300/60 group-hover:bg-cyan-200'} rounded-xl p-3 transition-all duration-300`}>
                  <Zap className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${featureTitleText} mb-1`}>Digital Gate Pass</h3>
                  <p className={featureDescText}>Automated QR verification replaces manual processes instantly</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className={`${darkMode ? 'bg-cyan-500/20 border border-cyan-500/30 group-hover:bg-cyan-500/30' : 'bg-cyan-100 border border-cyan-300/60 group-hover:bg-cyan-200'} rounded-xl p-3 transition-all duration-300`}>
                  <Shield className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${featureTitleText} mb-1`}>Enhanced Security</h3>
                  <p className={featureDescText}>Real-time validation powered by centralized database</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className={`${darkMode ? 'bg-cyan-500/20 border border-cyan-500/30 group-hover:bg-cyan-500/30' : 'bg-cyan-100 border border-cyan-300/60 group-hover:bg-cyan-200'} rounded-xl p-3 transition-all duration-300`}>
                  <Rocket className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${featureTitleText} mb-1`}>Quick & Efficient</h3>
                  <p className={featureDescText}>Streamline operations and eliminate entry bottlenecks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:pl-12">
            <div className={`${formBg} rounded-3xl p-8 lg:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500`}>
              <div className="text-center mb-8">
                <h2 className={`text-3xl lg:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {isLogin ? 'Welcome Back' : 'Join DevPass'}
                </h2>
                <p className={formDescText}>
                  {isLogin ? 'Sign in to access your digital pass' : 'Create your account in seconds'}
                </p>
              </div>

              {/* Toggle Buttons */}
              <div className={`flex gap-2 ${toggleBg} rounded-xl p-1 mb-8`}>
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                    isLogin 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {!isLogin && (
                    <>
                      <div>
                        <label className={`block text-sm font-semibold ${formText} mb-3`}>
                          Full Name
                        </label>
                        <div className="relative">
                          <User className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                          <input
                            name="name"
                            type="text"
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold ${formText} mb-3`}>
                          Course
                        </label>
                        <div className="relative">
                          <GraduationCap className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                          <input
                            name="course"
                            type="text"
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="Computer Science"
                            value={formData.course}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className={`block text-sm font-semibold ${formText} mb-3`}>Phone</label>
                        <div className="relative">
                          <User className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                          <input
                            name="phone"
                            type="text"
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="09123456789"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Department */}
                      <div>
                        <label className={`block text-sm font-semibold ${formText} mb-3`}>Department</label>
                        <div className="relative">
                          <GraduationCap className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                          <input
                            name="department"
                            type="text"
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="Engineering"
                            value={formData.department}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Year of Study */}
                      <div>
                        <label className={`block text-sm font-semibold ${formText} mb-3`}>Year of Study</label>
                        <div className="relative">
                          <Calendar className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                          <input
                            name="year_of_study"
                            type="number"
                            min="1"
                            max="10"
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="3"
                            value={formData.year_of_study}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold ${formText} mb-3`}>
                          {isLogin ? 'Email' : 'Email Address'}
                        </label>
                        <div className="relative">
                          <Mail className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                          <input
                            name="email"
                            type="email"
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="student@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </>                 
                  )}

                  <div>
                    <label className={`block text-sm font-semibold ${formText} mb-3`}>
                      Student ID
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                      <input
                        name="id"
                        type="text"
                        className={`w-full pl-12 pr-4 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="e.g., 23664035"
                        value={formData.id}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${formText} mb-3`}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full pl-4 pr-12 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-3.5 transition-colors ${darkMode ? 'text-gray-600 hover:text-gray-400' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label className={`block text-sm font-semibold ${formText} mb-3`}>
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          name="password_confirmation"
                          type={showPassword ? 'text' : 'password'}
                          className={`w-full pl-4 pr-12 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="••••••••"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-4 top-3.5 transition-colors ${darkMode ? 'text-gray-600 hover:text-gray-400' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center cursor-pointer gap-2">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className={`w-4 h-4 rounded ${checkboxColor} accent-blue-600`} 
                        />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className={`text-sm font-medium transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Create Account')}
                  </button>
                </div>
              </form>

              {/* Success/Error Messages */}
              {message && (
                <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                  {message}
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="mt-8 text-center">
                <p className={formDescText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className={`font-semibold cursor-pointer transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-black border-white/10' : 'bg-white border-gray-200'} border rounded-2xl w-full max-w-md shadow-2xl`}>
            <div className="flex items-center justify-between p-6 border-b" style={{borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {forgotPasswordStep === 'email' ? 'Reset Password' : 'Enter Reset Code'}
              </h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordStep('email');
                  setForgotPasswordData({ email: '', code: '', password: '', password_confirmation: '' });
                  setForgotPasswordMessage('');
                  setForgotPasswordError('');
                }}
                className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="p-6">
              {forgotPasswordStep === 'email' ? (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setForgotPasswordMessage('');
                  setForgotPasswordError('');
                  setForgotPasswordLoading(true);

                  try {
                    await authService.forgotPassword(forgotPasswordData.email);
                    setForgotPasswordMessage('Password reset code sent to your email!');
                    setTimeout(() => {
                      setForgotPasswordStep('reset');
                    }, 1500);
                  } catch (err) {
                    const errorMessage = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Failed to send reset code';
                    setForgotPasswordError(`❌ ${errorMessage}`);
                  } finally {
                    setForgotPasswordLoading(false);
                  }
                }}>
                  <div className="mb-4">
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                      <input
                        type="email"
                        value={forgotPasswordData.email}
                        onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 ${darkMode ? 'bg-gray-900/50 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="student@example.com"
                        required
                      />
                    </div>
                  </div>

                  {forgotPasswordMessage && (
                    <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                      {forgotPasswordMessage}
                    </div>
                  )}

                  {forgotPasswordError && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                      {forgotPasswordError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordData({ email: '', code: '', password: '', password_confirmation: '' });
                        setForgotPasswordMessage('');
                        setForgotPasswordError('');
                      }}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotPasswordLoading}
                      className="flex-1 px-4 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotPasswordLoading ? 'Sending...' : 'Send Code'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setForgotPasswordMessage('');
                  setForgotPasswordError('');

                  if (forgotPasswordData.password !== forgotPasswordData.password_confirmation) {
                    setForgotPasswordError('❌ Passwords do not match!');
                    return;
                  }

                  setForgotPasswordLoading(true);

                  try {
                    await authService.resetPassword(
                      forgotPasswordData.email,
                      forgotPasswordData.code,
                      forgotPasswordData.password,
                      forgotPasswordData.password_confirmation
                    );
                    setForgotPasswordMessage('✅ Password reset successful! You can now login.');
                    setTimeout(() => {
                      setShowForgotPassword(false);
                      setForgotPasswordStep('email');
                      setForgotPasswordData({ email: '', code: '', password: '', password_confirmation: '' });
                      setForgotPasswordMessage('');
                      setForgotPasswordError('');
                    }, 2000);
                  } catch (err) {
                    const errorMessage = err.response?.data?.message || err.response?.data?.errors?.code?.[0] || 'Failed to reset password';
                    setForgotPasswordError(`❌ ${errorMessage}`);
                  } finally {
                    setForgotPasswordLoading(false);
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Reset Code
                      </label>
                      <input
                        type="text"
                        value={forgotPasswordData.code}
                        onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, code: e.target.value })}
                        className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-900/50 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="Enter 6-digit code"
                        maxLength="6"
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={forgotPasswordData.password}
                          onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, password: e.target.value })}
                          className={`w-full pl-4 pr-12 py-3 ${darkMode ? 'bg-gray-900/50 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-4 top-3.5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={forgotPasswordData.password_confirmation}
                          onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, password_confirmation: e.target.value })}
                          className={`w-full pl-4 pr-12 py-3 ${darkMode ? 'bg-gray-900/50 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-4 top-3.5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {forgotPasswordMessage && (
                      <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                        {forgotPasswordMessage}
                      </div>
                    )}

                    {forgotPasswordError && (
                      <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        {forgotPasswordError}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordStep('email');
                          setForgotPasswordData({ ...forgotPasswordData, code: '', password: '', password_confirmation: '' });
                          setForgotPasswordMessage('');
                          setForgotPasswordError('');
                        }}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={forgotPasswordLoading}
                        className="flex-1 px-4 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}