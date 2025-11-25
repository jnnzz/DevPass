import React, { useState, useEffect } from 'react';
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered credentials on component mount
  useEffect(() => {
    const rememberedId = localStorage.getItem('remembered_id');
    if (rememberedId) {
      setFormData(prev => ({ ...prev, id: rememberedId }));
      setRememberMe(true);
    }
  }, []);

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
    setFieldErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN - Support both email (admin/security) and id (students)
        const credentials = {
          password: formData.password,
        };
        
        // Check if input looks like an email (contains @)
        const isEmailFormat = formData.id && formData.id.includes('@');
        
        if (isEmailFormat) {
          credentials.email = formData.id;
        } else {
          // Use id field for student login
          credentials.id = formData.id;
        }
        
        const result = await authService.login(credentials);
        
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem('remembered_id', formData.id);
        } else {
          localStorage.removeItem('remembered_id');
        }
        
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
        }, 1500);
      }
    } catch (err) {
      // Handle validation errors with field-specific messages
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const fieldErrorMap = {};
        
        // Map Laravel validation errors to field names
        Object.keys(errors).forEach(key => {
          const fieldName = key === 'password_confirmation' ? 'password_confirmation' : key;
          fieldErrorMap[fieldName] = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
        });
        
        setFieldErrors(fieldErrorMap);
        
        // Show general error message if available
        if (err.response?.data?.message) {
          setError(`❌ ${err.response.data.message}`);
        }
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Operation failed';
        setError(`❌ ${errorMessage}`);
      }
      console.error(err);
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
                  type="button"
                  onClick={() => {
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
                    setError('');
                    setFieldErrors({});
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                    isLogin 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
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
                    setError('');
                    setFieldErrors({});
                  }}
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
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} ${fieldErrors.name ? 'border-red-500' : ''} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        {fieldErrors.name && (
                          <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>
                        )}
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
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} ${fieldErrors.course ? 'border-red-500' : ''} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="Computer Science"
                            value={formData.course}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        {fieldErrors.course && (
                          <p className="mt-1 text-sm text-red-500">{fieldErrors.course}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className={`block text-sm font-semibold ${formText} mb-3`}>Phone</label>
                        <div className="relative">
                          <User className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                          <input
                            name="phone"
                            type="text"
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} ${fieldErrors.phone ? 'border-red-500' : ''} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="09123456789"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        {fieldErrors.phone && (
                          <p className="mt-1 text-sm text-red-500">{fieldErrors.phone}</p>
                        )}
                      </div>

                      {/* Department */}
                      <div>
                        <label className={`block text-sm font-semibold ${formText} mb-3`}>Department</label>
                        <div className="relative">
                          <GraduationCap className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                          <input
                            name="department"
                            type="text"
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} ${fieldErrors.department ? 'border-red-500' : ''} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="Engineering"
                            value={formData.department}
                            onChange={handleChange}
                          />
                        </div>
                        {fieldErrors.department && (
                          <p className="mt-1 text-sm text-red-500">{fieldErrors.department}</p>
                        )}
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
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} ${fieldErrors.year_of_study ? 'border-red-500' : ''} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="3"
                            value={formData.year_of_study}
                            onChange={handleChange}
                          />
                        </div>
                        {fieldErrors.year_of_study && (
                          <p className="mt-1 text-sm text-red-500">{fieldErrors.year_of_study}</p>
                        )}
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold ${formText} mb-3`}>
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                          <input
                            name="email"
                            type="email"
                            className={`w-full pl-12 pr-4 py-3 ${inputBg} ${fieldErrors.email ? 'border-red-500' : ''} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="student@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        {fieldErrors.email && (
                          <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
                        )}
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
                        className={`w-full pl-12 pr-4 py-3 ${inputBg} ${fieldErrors.id ? 'border-red-500' : ''} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder={isLogin ? "Enter email or student ID" : "e.g., 23664035"}
                        value={formData.id}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {fieldErrors.id && (
                      <p className="mt-1 text-sm text-red-500">{fieldErrors.id}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${formText} mb-3`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full pl-12 pr-12 py-3 ${inputBg} ${fieldErrors.password ? 'border-red-500' : ''} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
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
                    {fieldErrors.password && (
                      <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
                    )}
                  </div>

                  {!isLogin && (
                    <div>
                      <label className={`block text-sm font-semibold ${formText} mb-3`}>
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                        <input
                          name="password_confirmation"
                          type={showPassword ? 'text' : 'password'}
                          className={`w-full pl-12 pr-12 py-3 ${inputBg} ${fieldErrors.password_confirmation ? 'border-red-500' : ''} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="••••••••"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {fieldErrors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-500">{fieldErrors.password_confirmation}</p>
                      )}
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center cursor-pointer gap-2">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className={`w-4 h-4 rounded ${checkboxColor} accent-blue-600 cursor-pointer`} 
                        />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remember me</span>
                      </label>
                      <a href="#" className={`text-sm font-medium transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                        Forgot password?
                      </a>
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
                <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-green-500/20 border border-green-500/40 text-green-400' : 'bg-green-50 border-l-4 border-green-500 text-green-700'}`}>
                  {message}
                </div>
              )}

              {error && (
                <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-red-500/20 border border-red-500/40 text-red-400' : 'bg-red-50 border-l-4 border-red-500 text-red-700'}`}>
                  {error}
                </div>
              )}

              <div className="mt-8 text-center">
                <p className={formDescText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
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
                      setError('');
                      setFieldErrors({});
                    }}
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
    </div>
  );
}
