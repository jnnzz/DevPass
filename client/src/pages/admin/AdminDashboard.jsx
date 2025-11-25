import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import authService from '../../services/authService';
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
  Activity,
  RefreshCw
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
                <p className={`text-sm ${textSecondary}`}>Email</p>
                <p className={`font-semibold ${textPrimary}`}>{device.studentEmail}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary}`}>Phone</p>
                <p className={`font-semibold ${textPrimary}`}>{device.studentPhone}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary}`}>Department</p>
                <p className={`font-semibold ${textPrimary}`}>{device.department}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondary}`}>Course</p>
                <p className={`font-semibold ${textPrimary}`}>{device.course}</p>
              </div>
              {device.yearOfStudy && (
                <div>
                  <p className={`text-sm ${textSecondary}`}>Year of Study</p>
                  <p className={`font-semibold ${textPrimary}`}>{device.yearOfStudy}</p>
                </div>
              )}
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
                    : device.status === 'rejected'
                    ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
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
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // Start with 'all' to show all devices immediately
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    scansToday: 0
  });
  const [recentScans, setRecentScans] = useState([]);

  // Fetch devices from API
  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError('');
      const status = activeTab === 'all' ? 'all' : activeTab;
      const response = await adminService.getDevices({
        status: status,
        search: searchQuery || undefined,
        per_page: 100 // Get more devices to show all
      });
      
      // Transform API response to match frontend format
      // adminService.getDevices() already returns response.data, so response is the array
      // Check if response is an error message object
      if (response && response.message && !Array.isArray(response)) {
        throw new Error(response.message);
      }
      
      const devicesData = Array.isArray(response) ? response : [];
      
      const transformedDevices = devicesData.map(device => ({
        id: device.id,
        studentName: device.student?.name || 'N/A',
        studentId: device.student?.id || device.student?.pkStudentID || 'N/A',
        studentEmail: device.student?.email || 'N/A',
        studentPhone: device.student?.phone || 'N/A',
        department: device.student?.department || 'N/A',
        course: device.student?.course || 'N/A',
        yearOfStudy: device.student?.year_of_study || null,
        type: device.device_type,
        brand: device.brand,
        model: device.model,
        serialNumber: device.serial_number || 'N/A',
        status: device.status,
        registrationDate: device.created_at ? new Date(device.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        qrExpiry: device.qr_expires_at ? new Date(device.qr_expires_at).toISOString().split('T')[0] : null,
        notes: device.notes || '',
        approved_at: device.approved_at,
        rejected_at: device.rejected_at,
        rejection_reason: device.rejection_reason
      }));
      
      setDevices(transformedDevices);
      
      // If fetching all devices, calculate stats from them as fallback/update
      if (status === 'all' && transformedDevices.length > 0) {
        const calculatedStats = {
          total: transformedDevices.length,
          pending: transformedDevices.filter(d => d.status === 'pending').length,
          active: transformedDevices.filter(d => d.status === 'active').length,
          scansToday: stats.scansToday // Keep existing scansToday from API
        };
        // Always update stats when we have all devices data
        setStats(prev => ({ ...prev, ...calculatedStats }));
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load devices. Please try again.';
      setError(errorMessage);
      
      // Handle 403 - might be role issue, but don't logout immediately
      if (err.response?.status === 403) {
        const errorMsg = err.response?.data?.message || '';
        if (errorMsg.includes('Admin access required')) {
          // Check if user is actually admin
          const role = sessionStorage.getItem('role') || localStorage.getItem('role');
          if (role !== 'admin') {
            // Not admin, redirect to login
            setTimeout(() => {
              navigate('/');
            }, 2000);
          }
          // If role is admin but still getting 403, might be token issue - show error
        }
      }
      
      // Only redirect if it's a real authentication error (401) and no token exists
      if (err.response?.status === 401) {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (!token) {
          // No token means we're already logged out
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      // adminService.getStatistics() already returns response.data, so response is the stats object
      const statsData = response;
      console.log('Stats response:', statsData); // Debug log
      
      // Handle both object and array responses
      if (Array.isArray(statsData)) {
        // If it's an array, it might be the stats object with numeric keys
        const statsObj = {};
        statsData.forEach((value, index) => {
          const keys = ['total', 'pending', 'active', 'rejected', 'expired', 'scansToday'];
          if (keys[index]) {
            statsObj[keys[index]] = value;
          }
        });
        setStats({
          total: statsObj.total || 0,
          pending: statsObj.pending || 0,
          active: statsObj.active || 0,
          scansToday: statsObj.scansToday || 0
        });
      } else {
        // Normal object response
        setStats({
          total: statsData.total || statsData.total_devices || 0,
          pending: statsData.pending || statsData.pending_devices || 0,
          active: statsData.active || statsData.active_devices || 0,
          scansToday: statsData.scansToday || statsData.scans_today || 0
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      console.error('Stats error details:', err.response?.data);
      // If stats API fails, try to calculate from all devices
      // This will be done in the useEffect that fetches all devices
    }
  };

  // Fetch recent scans
  const fetchRecentScans = async () => {
    try {
      const response = await adminService.getRecentScans(20);
      // adminService.getActivities() already returns response.data, so response is the array
      const activities = Array.isArray(response) ? response : [];
      const transformedScans = activities.map(scan => ({
        studentName: scan.student?.name || scan.student_name || 'N/A',
        gate: scan.gate_name || 'N/A',
        time: new Date(scan.scanned_at || scan.scan_time || scan.created_at).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        status: scan.status || 'success'
      }));
      setRecentScans(transformedScans);
    } catch (err) {
      console.error('Error fetching recent scans:', err);
      // If table doesn't exist, set empty array
      setRecentScans([]);
    }
  };

  // Load data on component mount and when tab changes
  useEffect(() => {
    // Always fetch stats first
    fetchStats();
    
    // Also fetch all devices on mount to populate stats (even if not on 'all' tab)
    const fetchAllForStats = async () => {
      try {
        const allDevicesResponse = await adminService.getDevices({ status: 'all' });
        if (Array.isArray(allDevicesResponse) && allDevicesResponse.length > 0) {
          // Get current scansToday from stats state
          setStats(prev => {
            const calculatedStats = {
              total: allDevicesResponse.length,
              pending: allDevicesResponse.filter(d => d.status === 'pending').length,
              active: allDevicesResponse.filter(d => d.status === 'active').length,
              scansToday: prev.scansToday // Keep existing scansToday from API
            };
            return calculatedStats;
          });
        }
      } catch (err) {
        console.error('Error fetching all devices for stats:', err);
        // Don't set error here, just log it
      }
    };
    
    // Fetch all devices for stats in parallel (always fetch to get accurate counts)
    fetchAllForStats();
    
    if (activeTab === 'scans') {
      fetchRecentScans();
    } else {
      fetchDevices();
    }
  }, [activeTab]);
  

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

  const handleApprove = async (deviceId) => {
    try {
      setLoading(true);
      await adminService.approveDevice(deviceId);
      // Refresh devices list and stats
      await Promise.all([fetchDevices(), fetchStats()]);
      setSelectedDevice(null);
    } catch (err) {
      console.error('Error approving device:', err);
      setError('Failed to approve device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (deviceId, reason = '') => {
    try {
      setLoading(true);
      await adminService.rejectDevice(deviceId, reason);
      // Refresh devices list and stats
      await Promise.all([fetchDevices(), fetchStats()]);
      setSelectedDevice(null);
    } catch (err) {
      console.error('Error rejecting device:', err);
      setError('Failed to reject device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear sessionStorage (per-tab)
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('role');
      // Also clear localStorage for backwards compatibility
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_type');
      localStorage.removeItem('role');
      navigate('/');
    }
  };

  // Handle search with debounce - only for device tabs
  useEffect(() => {
    if (activeTab === 'scans') {
      return; // Don't search in scans tab
    }
    
    const timer = setTimeout(() => {
      fetchDevices();
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

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
              <button 
                onClick={handleLogout}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${darkMode ? 'hover:bg-white/10 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                title="Logout"
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
          <button
            onClick={() => setActiveTab('all')}
            className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg} text-left w-full cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Laptop className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.total}</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Total Devices</p>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg} text-left w-full cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                <Clock className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.pending}</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Pending Approval</p>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg} text-left w-full cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <CheckCircle className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.active}</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Active Devices</p>
          </button>

          <button
            onClick={() => setActiveTab('scans')}
            className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg} text-left w-full cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <Activity className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.scansToday}</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Scans Today</p>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${textMuted}`} />
            <input
              type="text"
              placeholder="Search by student name, ID, email, device brand/model, department, course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 sm:pl-12 ${searchQuery ? 'pr-10 sm:pr-12' : 'pr-4'} py-2.5 sm:py-3 rounded-lg sm:rounded-xl border ${inputBg} ${textPrimary} placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                title="Clear search"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
          <button 
            onClick={() => {
              fetchDevices();
              fetchStats();
            }}
            disabled={loading}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/60 hover:bg-white/80 text-gray-900'} disabled:opacity-50`}
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base  transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pending'
                ? ` ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'} ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} shadow-lg`
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'active'
                ? `${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'} ${darkMode ? 'text-emerald-400' : 'text-emerald-600'} shadow-lg`
                : darkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap cursor-pointer ${
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
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap cursor-pointer ${
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
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className={`text-lg sm:text-xl font-bold ${textPrimary}`}>Recent Scan Activity</h3>
              <button
                onClick={fetchRecentScans}
                className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${textSecondary}`} />
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {loading && activeTab === 'scans' ? (
                <div className="text-center py-8">
                  <RefreshCw className={`w-8 h-8 mx-auto mb-2 ${textMuted} animate-spin`} />
                  <p className={textSecondary}>Loading scans...</p>
                </div>
              ) : recentScans.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className={`w-12 h-12 mx-auto mb-2 ${textMuted}`} />
                  <p className={textSecondary}>No recent scans found</p>
                </div>
              ) : (
                recentScans.map((scan, index) => (
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
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {loading && (
              <div className={`${cardBg} rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center`}>
                <RefreshCw className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${textMuted} animate-spin`} />
                <h3 className={`text-lg sm:text-xl font-bold ${textPrimary} mb-2`}>Loading devices...</h3>
              </div>
            )}
            {!loading && error && (
              <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-red-500`}>
                <div className="flex items-center gap-3">
                  <AlertCircle className={`w-5 h-5 text-red-500`} />
                  <p className={`${textPrimary}`}>{error}</p>
                  <button
                    onClick={fetchDevices}
                    className={`ml-auto px-4 py-2 rounded-lg font-semibold transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            {!loading && !error && devices.length === 0 ? (
              <div className={`${cardBg} rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center`}>
                <AlertCircle className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${textMuted}`} />
                <h3 className={`text-lg sm:text-xl font-bold ${textPrimary} mb-2`}>No devices found</h3>
                <p className={textSecondary}>Try adjusting your search or filters</p>
              </div>
            ) : (
              !loading && !error && devices.map((device) => (
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
                              : device.status === 'rejected'
                              ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
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
