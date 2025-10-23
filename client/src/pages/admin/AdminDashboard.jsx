import React, { useState } from 'react';
import { 
  QrCode, 
  Users, 
  Laptop, 
  Shield, 
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
  Search,
  Filter,
  Eye,
  Check,
  X,
  Download,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';

function DeviceDetailsModal({ device, darkMode, onClose, onApprove, onReject }) {
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-black border-white/10' : 'bg-white border-gray-200'} border rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-inherit flex items-center justify-between p-6 border-b" style={{borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}>
          <h2 className={`text-2xl font-bold ${textPrimary}`}>Device Details</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X className={`w-5 h-5 ${textSecondary}`} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
            <h3 className={`font-bold mb-3 ${textPrimary}`}>Student Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className={`text-sm ${textSecondary}`}>Name</p>
                <p className={`font-semibold ${textPrimary}`}>{device.studentName}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary}`}>Student ID</p>
                <p className={`font-semibold ${textPrimary}`}>{device.studentId}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary}`}>Department</p>
                <p className={`font-semibold ${textPrimary}`}>{device.department}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary}`}>Course</p>
                <p className={`font-semibold ${textPrimary}`}>{device.course}</p>
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div>
            <h3 className={`font-bold mb-3 ${textPrimary}`}>Device Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Device Type</p>
                <p className={`font-semibold ${textPrimary}`}>{device.type}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Brand</p>
                <p className={`font-semibold ${textPrimary}`}>{device.brand}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Model</p>
                <p className={`font-semibold ${textPrimary}`}>{device.model}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Serial Number</p>
                <p className={`font-semibold ${textPrimary}`}>{device.serialNumber}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Registration Date</p>
                <p className={`font-semibold ${textPrimary}`}>{device.registrationDate}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  device.status === 'pending' 
                    ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                    : darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {device.status === 'pending' && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  onReject(device.id);
                  onClose();
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  darkMode 
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                }`}
              >
                <X className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => {
                  onApprove(device.id);
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Mock data
  const [devices, setDevices] = useState([
    {
      id: 1,
      studentName: "Juan Dela Cruz",
      studentId: "STU123456",
      department: "CCS",
      course: "BSIT",
      type: "Laptop",
      brand: "Dell",
      model: "XPS 15",
      serialNumber: "DL123456789",
      status: "pending",
      registrationDate: "2025-10-14"
    },
    {
      id: 2,
      studentName: "Maria Santos",
      studentId: "STU123457",
      department: "CCS",
      course: "BSCS",
      type: "Laptop",
      brand: "MacBook",
      model: "Pro M2",
      serialNumber: "MB987654321",
      status: "pending",
      registrationDate: "2025-10-14"
    },
    {
      id: 3,
      studentName: "Pedro Garcia",
      studentId: "STU123458",
      department: "Engineering",
      course: "BSCpE",
      type: "Laptop",
      brand: "HP",
      model: "Pavilion",
      serialNumber: "HP456789123",
      status: "active",
      registrationDate: "2025-10-10",
      qrExpiry: "2025-11-10"
    },
    {
      id: 4,
      studentName: "Ana Rodriguez",
      studentId: "STU123459",
      department: "CCS",
      course: "BSIT",
      type: "Laptop",
      brand: "Lenovo",
      model: "ThinkPad",
      serialNumber: "LN789123456",
      status: "active",
      registrationDate: "2025-10-09",
      qrExpiry: "2025-11-09"
    }
  ]);

  const recentScans = [
    { studentName: "Pedro Garcia", gate: "Main Gate", time: "10:30 AM", status: "success" },
    { studentName: "Ana Rodriguez", gate: "Engineering Gate", time: "09:15 AM", status: "success" },
    { studentName: "Juan Dela Cruz", gate: "Main Gate", time: "08:45 AM", status: "success" },
    { studentName: "Maria Santos", gate: "Main Gate", time: "08:30 AM", status: "success" }
  ];

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

  const inputBg = darkMode
    ? 'bg-white/10 border-white/20'
    : 'bg-white/60 border-white/40';

  const handleApprove = (deviceId) => {
    setDevices(devices.map(d => 
      d.id === deviceId ? { ...d, status: 'active', qrExpiry: '2025-11-14' } : d
    ));
  };

  const handleReject = (deviceId) => {
    setDevices(devices.filter(d => d.id !== deviceId));
  };

  const filteredDevices = devices.filter(device => {
    const matchesTab = activeTab === 'all' || device.status === activeTab;
    const matchesSearch = 
      device.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: devices.length,
    pending: devices.filter(d => d.status === 'pending').length,
    active: devices.filter(d => d.status === 'active').length,
    scansToday: 24
  };

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
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">
                  DevPass
                </h1>
                <p className={`text-xs ${textSecondary}`}>Administrator Dashboard</p>
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
            Admin Dashboard 
          </h2>
          <p className={`text-sm sm:text-base ${textSecondary}`}>
            Monitor and manage device registrations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Laptop className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.total}</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Total Devices</p>
          </div>

          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                <Clock className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.pending}</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Pending Approval</p>
          </div>

          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <CheckCircle className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.active}</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Active Devices</p>
          </div>

          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <Activity className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.scansToday}</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Scans Today</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${textMuted}`} />
            <input
              type="text"
              placeholder="Search by name, ID, device..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border ${inputBg} ${textPrimary} placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <button className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/60 hover:bg-white/80 text-gray-900'}`}>
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
            }`}
          >
            All Devices ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('scans')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap ${
              activeTab === 'scans'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
            }`}
          >
            Recent Scans
          </button>
        </div>

        {/* Content */}
        {activeTab === 'scans' ? (
          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6`}>
            <h3 className={`text-lg sm:text-xl font-bold ${textPrimary} mb-4 sm:mb-6`}>Recent Scan Activity</h3>
            <div className="space-y-3 sm:space-y-4">
              {recentScans.map((scan, index) => (
                <div key={index} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-white/60'}`}>
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'} flex-shrink-0`}>
                      <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-semibold text-sm sm:text-base ${textPrimary} truncate`}>{scan.studentName}</h4>
                      <p className={`text-xs sm:text-sm ${textSecondary}`}>{scan.gate} • {scan.time}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${textMuted} flex-shrink-0`} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredDevices.length === 0 ? (
              <div className={`${cardBg} rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center`}>
                <AlertCircle className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${textMuted}`} />
                <h3 className={`text-lg sm:text-xl font-bold ${textPrimary} mb-2`}>No devices found</h3>
                <p className={textSecondary}>Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredDevices.map((device) => (
                <div key={device.id} className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'} flex-shrink-0`}>
                        <Laptop className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-base sm:text-lg font-bold ${textPrimary} truncate`}>
                            {device.brand} {device.model}
                          </h3>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                            device.status === 'pending'
                              ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                              : darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                          </span>
                        </div>
                        <p className={`text-xs sm:text-sm ${textSecondary} mb-2`}>
                          {device.studentName} • {device.studentId}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                          <span className={`${textMuted}`}>{device.department}</span>
                          <span className={textMuted}>•</span>
                          <span className={`${textMuted}`}>{device.course}</span>
                          <span className={textMuted}>•</span>
                          <span className={`${textMuted}`}>Registered: {device.registrationDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSelectedDevice(device)}
                        className={`p-2 rounded-lg font-semibold transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                      >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      {device.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleReject(device.id)}
                            className={`p-2 rounded-lg font-semibold transition-all ${
                              darkMode 
                                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                                : 'bg-red-100 hover:bg-red-200 text-red-700'
                            }`}
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => handleApprove(device.id)}
                            className={`p-2 rounded-lg font-semibold transition-all ${
                              darkMode 
                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400' 
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                            }`}
                          >
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Device Details Modal */}
      {selectedDevice && (
        <DeviceDetailsModal
          device={selectedDevice}
          darkMode={darkMode}
          onClose={() => setSelectedDevice(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}