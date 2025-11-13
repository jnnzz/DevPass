import React, { useState, useEffect } from 'react';
import { studentInfo, devices, recentActivity } from '../../data/mockData';
import { useQRCode } from '../../hooks/useQRCode';
import { 
  QrCode, 
  Laptop, 
  Plus, 
  Download, 
  Settings, 
  LogOut, 
  Bell, 
  Moon, 
  Sun,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  RefreshCw,
  X,
  Upload
} from 'lucide-react';

function Register({ darkMode, onClose }) {
  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    serialNumber: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Device registered:', formData);
    onClose();
  };

  const inputBg = darkMode ? 'bg-black border-gray/20' : 'bg-white/60 border-gray/40';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-black' : 'bg-white'} rounded-2xl w-full max-w-md shadow-2xl border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}>
          <h2 className={`text-2xl font-bold ${textPrimary}`}>Register Device</h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X className={`w-5 h-5 ${textSecondary}`} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Device Type
            </label>
            <select
              name="deviceType"
              value={formData.deviceType}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${textPrimary} font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select device type</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Tablet">Tablet</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., Dell, Apple, HP"
              required
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${textPrimary} placeholder-gray-500 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., XPS 15, MacBook Pro M2"
              required
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${textPrimary} placeholder-gray-500 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Serial Number
            </label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Device serial number"
              className={`w-full px-4 py-2.5 rounded-lg border  border-gray-500 ${inputBg} ${textPrimary} placeholder-gray-500 font-medium transition-all focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
              rows="3"
              className={`w-full px-4 py-2.5 rounded-lg border border-gray-500 ${inputBg} ${textPrimary} placeholder-gray-500 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            />
          </div>

          {/* Upload Document */}
          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Proof of Ownership (Optional)
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${darkMode ? 'border-white/20 hover:border-blue-500/40' : 'border-gray-300 hover:border-blue-500'}`}>
              <Upload className={`w-6 h-6 mx-auto mb-2 ${textSecondary}`} />
              <p className={`text-sm font-medium ${textPrimary}`}>Click to upload</p>
              <p className={`text-xs ${textSecondary}`}>PNG, JPG, PDF up to 5MB</p>
              <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Register Device
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('devices');
  const [showRegister, setShowRegister] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState('all'); // 'all', 'active', 'pending'  
  const qrCodes = useQRCode(devices, studentInfo);

  const bgClass = darkMode 
    ? 'bg-black text-white' 
    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900';

  const cardBg = darkMode
    ? 'bg-white/5 border border-white/10 backdrop-blur-xl'
    : 'bg-white/80 border border-white/60 backdrop-blur-xl';

  const hoverCardBg = darkMode
    ? 'hover:bg-white/10'
    : 'hover:bg-white/90';

  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-500' : 'text-gray-500';

  const getStatusColor = (status) => {
    if (status === 'active') return darkMode ? 'text-emerald-400 bg-emerald-500/20' : 'text-emerald-700 bg-emerald-100';
    if (status === 'pending') return darkMode ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-700 bg-yellow-100';
    if (status === 'expired') return darkMode ? 'text-red-400 bg-red-500/20' : 'text-red-700 bg-red-100';
    return darkMode ? 'text-gray-400 bg-gray-500/20' : 'text-gray-700 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    if (status === 'active') return <CheckCircle className="w-4 h-4" />;
    if (status === 'pending') return <Clock className="w-4 h-4" />;
    if (status === 'expired') return <XCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  // Simple QR code generator function
  // const generateQRCodeSVG = (data, size = 200) => {
  //   // Using a data URL approach with qrcode.react concept
  //   const qrData = encodeURIComponent(data);
  //   return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrData}`;
  // };

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-10 w-80 h-80 ${darkMode ? 'bg-blue-600/20' : 'bg-blue-200/30'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-40 left-20 w-96 h-96 ${darkMode ? 'bg-indigo-600/20' : 'bg-indigo-200/20'} rounded-full blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
      </div>

      {/* Top Navigation */}
      <nav className={`sticky top-0 z-40 ${cardBg} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">
                DevPass
              </h1>
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
              <button className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${darkMode ? 'hover:bg-white/10 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}>
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-2`}>
            Welcome back, {studentInfo.name.split(' ')[0]}! 
          </h2>
          <p className={`text-sm sm:text-base ${textSecondary}`}>
            Manage your registered devices and track your campus entries
          </p>
        </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Laptop className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>2</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Total Devices</p>
          </div>

          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <CheckCircle className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>1</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Active Devices</p>
          </div>

          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'}`}>
                <Clock className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>1</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Pending</p>
          </div>

          {/* <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-500" />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>24</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Days Left</p>
          </div> */}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'devices'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
            }`}
          >
            My Devices
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
            }`}
          >
            Recent Activity
          </button>
          {/* Add Device Button */}
          <div className="ml-auto">
            <button
              onClick={() => setShowRegister(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2.5 cursor-pointer sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Register New Device
            </button>
          </div>   
        </div>

        {/* Device Filter - only show in devices tab */}
        {activeTab === 'devices' && (
          <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto">
            <button
              onClick={() => setDeviceFilter('all')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap border ${darkMode ? 'border-gray-800' : 'border-gray-300'}  cursor-pointer ${
                deviceFilter === 'all'
                  ? darkMode
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-white text-gray-900 border border-gray-300 shadow-sm'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/40'
              }`}
            >
              All Devices
            </button>
            <button
              onClick={() => setDeviceFilter('active')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap border ${darkMode ? 'border-gray-800' : 'border-gray-300'}  border-gray-300  cursor-pointer ${
                deviceFilter === 'active'
                  ? darkMode
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/40'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setDeviceFilter('pending')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap border ${darkMode ? 'border-gray-800' : 'border-gray-300'}  border-gray-300 cursor-pointer ${
                deviceFilter === 'pending'
                  ? darkMode
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/40'
              }`}
            >
              Pending
            </button>
          </div>
        )}

        {/* Content */}
        {activeTab === 'devices' ? (
          <div>
            {/* Devices List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {devices.filter(device => deviceFilter === 'all' || device.status === deviceFilter).map((device) => (
                <div key={device.id} className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'} flex-shrink-0`}>
                        <Laptop className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-base sm:text-lg font-bold ${textPrimary} truncate`}>
                          {device.brand} {device.model}
                        </h3>
                        <p className={`text-xs sm:text-sm ${textSecondary}`}>{device.type}</p>
                      </div>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 flex-shrink-0 ${getStatusColor(device.status)}`}>
                      {getStatusIcon(device.status)}
                      <span className="hidden sm:inline">{device.status.charAt(0).toUpperCase() + device.status.slice(1)}</span>
                    </span>
                  </div>

                 {device.status === 'active' && (
                    <>
                      <div className="mb-4 p-3 sm:p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg sm:rounded-xl border border-blue-500/20">
                        <div className="flex items-center justify-center mb-2 sm:mb-3">
                          {qrCodes[device.id] ? (
                            <img 
                              src={qrCodes[device.id]} 
                              alt={`QR Code for ${device.brand} ${device.model}`}
                              className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-lg sm:rounded-xl p-2"
                            />
                          ) : (
                            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-lg sm:rounded-xl p-2 flex items-center justify-center">
                              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                            </div>
                          )}
                        </div>
                        <p className={`text-xs text-center ${textMuted}`}>
                          Scan this QR code at campus gates
                        </p>
                      </div>

                      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs sm:text-sm ${textSecondary}`}>QR Expires:</span>
                          <span className={`text-xs sm:text-sm font-semibold ${textPrimary}`}>{device.qrExpiry}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs sm:text-sm ${textSecondary}`}>Last Scanned:</span>
                          <span className={`text-xs sm:text-sm font-semibold ${textPrimary}`}>{device.lastScanned}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.download = `${device.brand}-${device.model}-QR.png`;
                            link.href = qrCodes[device.id];
                            link.click();
                          }}
                          className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} flex items-center justify-center gap-2`}
                        >
                          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Download QR</span>
                          <span className="sm:hidden">Download</span>
                        </button>
                        <button className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm transition-all ${darkMode ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'} flex items-center justify-center gap-2`}>
                          <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Renew
                        </button>
                      </div>
                    </>
                  )}

                  {device.status === 'pending' && (
                    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'}`}>
                      <p className={`text-xs sm:text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'} flex items-center gap-2`}>
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        Waiting for admin approval
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6`}>
            <h3 className={`text-lg sm:text-xl font-bold ${textPrimary} mb-4 sm:mb-6`}>Entry History</h3>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-white/60'}`}>
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'} flex-shrink-0`}>
                      <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-semibold text-sm sm:text-base ${textPrimary} truncate`}>{activity.gate}</h4>
                      <p className={`text-xs sm:text-sm ${textSecondary}`}>{activity.time}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${textMuted} flex-shrink-0`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Register Modal */}
      {showRegister && <Register darkMode={darkMode} onClose={() => setShowRegister(false)} />}
    </div>
  );
}