import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Zap, Shield, Rocket, Moon, Sun } from 'lucide-react';

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

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
                <div className={`${darkMode ? 'bg-blue-500/20 border border-blue-500/30 group-hover:bg-blue-500/30' : 'bg-blue-100 border border-blue-300/60 group-hover:bg-blue-200'} rounded-xl p-3 transition-all duration-300`}>
                  <Zap className={`w-5 h-5 ${featureCardText}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${featureTitleText} mb-1`}>Digital Gate Pass</h3>
                  <p className={featureDescText}>Automated QR verification replaces manual processes instantly</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className={`${darkMode ? 'bg-indigo-500/20 border border-indigo-500/30 group-hover:bg-indigo-500/30' : 'bg-indigo-100 border border-indigo-300/60 group-hover:bg-indigo-200'} rounded-xl p-3 transition-all duration-300`}>
                  <Shield className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
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

            <div className={`pt-8 ${darkMode ? 'border-gray-700/50' : 'border-gray-300/50'} border-t`}>
              {/* <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Built by Group 3 • Laroco, Abais, Postreros, Service
              </p> */}
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
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {setIsLogin(false)
                    // Navigate('/register');
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

              <div className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className={`block text-sm font-semibold ${formText} mb-3`}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                      <input
                        type="text"
                        className={`w-full pl-12 pr-4 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-semibold ${formText} mb-3`}>
                    Student ID
                  </label>
                  <div className="relative">
                    <User className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                    <input
                      type="text"
                      className={`w-full pl-12 pr-4 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="STU123456"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${formText} mb-3`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full pl-12 pr-12 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="••••••••"
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
                      <Lock className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full pl-12 pr-12 py-3 ${inputBg} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer gap-2">
                      <input type="checkbox" className={`w-4 h-4 rounded ${checkboxColor} accent-blue-600`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remember me</span>
                    </label>
                    <a href="#" className={`text-sm font-medium transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      Forgot password?
                    </a>
                  </div>
                )}

                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/50"
                  style={{focusRingOffset: darkMode ? undefined : 'rgb(255, 255, 255, 0.8)'}}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className={formDescText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className={`font-semibold transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
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