import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  Clock, 
  Users, 
  UserPlus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Camera,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Building,
  Lock,
  PlusCircle,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Download,
  Filter,
  Key,
  Bell,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import api from '../../api/axios';

export default function AdminSettings({ darkMode, onClose, adminData }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddSecurity, setShowAddSecurity] = useState(false);
  const [securityList, setSecurityList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: adminData?.name || 'Admin User',
    email: adminData?.email || 'admin@devpass.edu',
    phone: adminData?.phone || '+63 912 345 6789',
    role: adminData?.role || 'System Administrator',
    joinDate: adminData?.joinDate || 'January 15, 2024',
    lastLogin: adminData?.lastLogin || 'Today, 09:45 AM'
  });

  const [newSecurity, setNewSecurity] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    assignedGate: '',
    employeeId: '',
    shift: 'morning'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Animated background elements
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
    ? 'bg-white/10 border-white/20 focus:border-blue-500/50'
    : 'bg-white/60 border-white/40 focus:border-blue-500';

  // Fetch security and students
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [securityRes, studentsRes] = await Promise.all([
        api.get('/security/all'),
        api.get('/students/all')
      ]);
      setSecurityList(securityRes.data || []);
      setStudentList(studentsRes.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for demonstration
      setSecurityList([
        { 
          id: 1, 
          name: 'John Security', 
          email: 'john@security.com', 
          gate: 'Main Gate', 
          status: 'active', 
          employeeId: 'SEC001',
          phone: '+63 912 345 6789',
          shift: 'morning',
          lastActive: 'Today, 08:30 AM'
        },
        { 
          id: 2, 
          name: 'Jane Guard', 
          email: 'jane@security.com', 
          gate: 'Back Gate', 
          status: 'active', 
          employeeId: 'SEC002',
          phone: '+63 912 345 6790',
          shift: 'afternoon',
          lastActive: 'Today, 14:15 PM'
        },
        { 
          id: 3, 
          name: 'Michael Officer', 
          email: 'michael@security.com', 
          gate: 'East Gate', 
          status: 'inactive', 
          employeeId: 'SEC003',
          phone: '+63 912 345 6791',
          shift: 'night',
          lastActive: 'Yesterday, 22:00 PM'
        }
      ]);
      setStudentList([
        { 
          id: 1, 
          name: 'Alice Johnson', 
          studentId: '2024-001', 
          department: 'Computer Science', 
          course: 'BSCS', 
          status: 'active',
          email: 'alice@student.edu',
          registeredDevices: 3,
          joinDate: 'Jan 2024'
        },
        { 
          id: 2, 
          name: 'Bob Wilson', 
          studentId: '2024-002', 
          department: 'Engineering', 
          course: 'BSEE', 
          status: 'active',
          email: 'bob@student.edu',
          registeredDevices: 2,
          joinDate: 'Feb 2024'
        },
        { 
          id: 3, 
          name: 'Carol Davis', 
          studentId: '2024-003', 
          department: 'Business', 
          course: 'BSBA', 
          status: 'pending',
          email: 'carol@student.edu',
          registeredDevices: 1,
          joinDate: 'Mar 2024'
        },
        { 
          id: 4, 
          name: 'David Miller', 
          studentId: '2024-004', 
          department: 'Medicine', 
          course: 'BSN', 
          status: 'active',
          email: 'david@student.edu',
          registeredDevices: 2,
          joinDate: 'Jan 2024'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSecurity = async () => {
    // Validate form
    const newErrors = {};
    if (!newSecurity.name.trim()) newErrors.name = 'Name is required';
    if (!newSecurity.email.trim()) newErrors.email = 'Email is required';
    if (!newSecurity.password) newErrors.password = 'Password is required';
    if (!newSecurity.phone.trim()) newErrors.phone = 'Phone is required';
    if (!newSecurity.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await api.post('/security/create', newSecurity);
      setShowAddSecurity(false);
      setNewSecurity({
        name: '',
        email: '',
        password: '',
        phone: '',
        assignedGate: '',
        employeeId: '',
        shift: 'morning'
      });
      setErrors({});
      fetchUsers();
    } catch (error) {
      console.error('Error adding security:', error);
      alert('Failed to add security personnel');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSecurity = async (securityId) => {
    if (window.confirm('Are you sure you want to delete this security account?')) {
      try {
        await api.delete(`/security/${securityId}`);
        setSecurityList(securityList.filter(security => security.id !== securityId));
      } catch (error) {
        console.error('Error deleting security:', error);
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      await api.put('/admin/profile', profileData);
      setEditingProfile(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const filteredSecurity = securityList.filter(sec =>
    sec.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.gate?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = studentList.filter(student =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${bgClass}`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-10 w-80 h-80 ${darkMode ? 'bg-blue-600/20' : 'bg-blue-200/30'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-40 left-20 w-96 h-96 ${darkMode ? 'bg-indigo-600/20' : 'bg-indigo-200/20'} rounded-full blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
      </div>

      <div className={`${cardBg} rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative z-10`}>
        {/* Header */}
        <div className="sticky top-0 bg-inherit border-b border-white/10 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>Settings & Management</h2>
              <p className={`text-xs sm:text-sm ${textSecondary}`}>Manage your account and system users</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X className={`w-5 h-5 ${textSecondary}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
              activeTab === 'profile'
                ? `${textPrimary} border-b-2 border-blue-500`
                : `${textSecondary} hover:${darkMode ? 'bg-white/5' : 'bg-gray-50'}`
            }`}
          >
            <div className="flex items-center justify-center gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              User Information
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
              activeTab === 'users'
                ? `${textPrimary} border-b-2 border-blue-500`
                : `${textSecondary} hover:${darkMode ? 'bg-white/5' : 'bg-gray-50'}`
            }`}
          >
            <div className="flex items-center cursor-pointer justify-center gap-2">
              <Users className="w-4 h-4" />
              Security & Students
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'profile' ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Profile Header */}
              <div className={`${cardBg} rounded-2xl p-6 sm:p-8`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
                      {profileData.name.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-2`}>{profileData.name}</h3>
                    <p className={`${textSecondary} mb-3`}>{profileData.role}</p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Active
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                        <Shield className="w-3 h-3 inline mr-1" />
                        Administrator
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                        <Key className="w-3 h-3 inline mr-1" />
                        Super User
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      editingProfile
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-lg'
                        : darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {editingProfile ? (
                      <div className="flex items-center cursor-pointer gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </div>
                    ) : (
                      <div className="flex items-center cursor-pointer gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`${cardBg} rounded-xl p-4 transition-all ${hoverCardBg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs ${textSecondary}`}>Security Personnel</p>
                      <p className={`text-2xl font-bold ${textPrimary}`}>{securityList.length}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                      <Shield className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                  </div>
                </div>
                <div className={`${cardBg} rounded-xl p-4 transition-all ${hoverCardBg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs ${textSecondary}`}>Registered Students</p>
                      <p className={`text-2xl font-bold ${textPrimary}`}>{studentList.length}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                      <GraduationCap className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                  </div>
                </div>
                {/* <div className={`${cardBg} rounded-xl p-4 transition-all ${hoverCardBg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs ${textSecondary}`}>Active Sessions</p>
                      <p className={`text-2xl font-bold ${textPrimary}`}>1</p>
                    </div>
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                      <User className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Profile Details */}
              <div className={`${cardBg} rounded-2xl p-6`}>
                <h4 className={`text-lg font-bold ${textPrimary} mb-6 flex items-center gap-2`}>
                  <User className="w-5 h-5" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white/60'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <Mail className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className={`text-xs ${textSecondary}`}>Email Address</p>
                        {editingProfile ? (
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className={`w-full px-3 py-2 mt-1 rounded-lg border ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                          />
                        ) : (
                          <p className={`font-semibold ${textPrimary} truncate`}>{profileData.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white/60'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <Phone className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className={`text-xs ${textSecondary}`}>Phone Number</p>
                        {editingProfile ? (
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className={`w-full px-3 py-2 mt-1 rounded-lg border ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                          />
                        ) : (
                          <p className={`font-semibold ${textPrimary}`}>{profileData.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white/60'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                        <Building className={`w-4 h-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      </div>
                      <div>
                        <p className={`text-xs ${textSecondary}`}>Role</p>
                        <p className={`font-semibold ${textPrimary}`}>{profileData.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white/60'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                        <Calendar className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <div>
                        <p className={`text-xs ${textSecondary}`}>Join Date</p>
                        <p className={`font-semibold ${textPrimary}`}>{profileData.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings
              <div className={`${cardBg} rounded-2xl p-6`}>
                <h4 className={`text-lg font-bold ${textPrimary} mb-6 flex items-center gap-2`}>
                  <Lock className="w-5 h-5" />
                  Security Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} ${cardBg}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                        <Key className={`w-4 h-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      </div>
                      <div>
                        <p className={`font-semibold ${textPrimary}`}>Change Password</p>
                        <p className={`text-xs ${textSecondary}`}>Update your password regularly</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
                  </button>
                  <button className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} ${cardBg}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <Shield className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <div>
                        <p className={`font-semibold ${textPrimary}`}>Two-Factor Authentication</p>
                        <p className={`text-xs ${textSecondary}`}>Add an extra layer of security</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
                  </button>
                </div>
              </div> */}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textMuted}`} />
                  <input
                    type="text"
                    placeholder="Search by name, ID, email, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${inputBg} ${textPrimary} placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div className="flex gap-3">
                  {/* <button className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/60 hover:bg-white/80 text-gray-900'}`}>
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                  <button className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/60 hover:bg-white/80 text-gray-900'}`}>
                    <Download className="w-5 h-5" />
                    <span className="hidden sm:inline">Export</span>
                  </button> */}
                  <button
                    onClick={() => setShowAddSecurity(true)}
                    className="px-4 sm:px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Security</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>

              {/* Security Personnel */}
              <div className={`${cardBg} rounded-2xl p-4 sm:p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-xl font-bold ${textPrimary} flex items-center gap-2`}>
                      <Shield className="w-6 h-6" />
                      Security Personnel
                      <span className={`text-sm font-normal ${textSecondary}`}>({filteredSecurity.length})</span>
                    </h3>
                    <p className={`text-sm ${textSecondary} mt-1`}>Manage security personnel accounts and assignments</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                      {securityList.filter(s => s.status === 'active').length} Active
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700'}`}>
                      {securityList.filter(s => s.status === 'inactive').length} Inactive
                    </span>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                ) : filteredSecurity.length === 0 ? (
                  <div className={`text-center py-8 ${cardBg} rounded-xl`}>
                    <Shield className={`w-12 h-12 mx-auto mb-4 ${textMuted}`} />
                    <p className={`${textSecondary}`}>No security personnel found</p>
                    <button
                      onClick={() => setShowAddSecurity(true)}
                      className="mt-4 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg text-sm"
                    >
                      Add First Security Personnel
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSecurity.map((security) => (
                      <div key={security.id} className={`${cardBg} rounded-xl p-4 transition-all ${hoverCardBg}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                              {security.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className={`font-bold ${textPrimary}`}>{security.name}</h4>
                              <p className={`text-xs ${textSecondary}`}>ID: {security.employeeId}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                              <Edit className={`w-4 h-4 ${textSecondary}`} />
                            </button>
                            <button 
                              onClick={() => handleDeleteSecurity(security.id)}
                              className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className={`w-3 h-3 ${textMuted}`} />
                            <span className={`text-xs ${textSecondary} truncate`}>{security.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className={`w-3 h-3 ${textMuted}`} />
                            <span className={`text-xs ${textSecondary}`}>{security.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-3 h-3 ${textMuted}`} />
                            <span className={`text-xs ${textSecondary}`}>{security.gate}</span>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            <Clock className={`w-3 h-3 ${textMuted}`} />
                            <span className={`text-xs ${textSecondary}`}>Shift: {security.shift}</span>
                          </div> */}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t" style={{borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            security.status === 'active'
                              ? darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                              : darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {security.status === 'active' ? (
                              <>
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Active
                              </>
                            ) : 'Inactive'}
                          </span>
                          <span className={`text-xs ${textSecondary}`}>{security.lastActive}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Registered Students */}
              <div className={`${cardBg} rounded-2xl p-4 sm:p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-xl font-bold ${textPrimary} flex items-center gap-2`}>
                      <GraduationCap className="w-6 h-6" />
                      Registered Students
                      <span className={`text-sm font-normal ${textSecondary}`}>({filteredStudents.length})</span>
                    </h3>
                    <p className={`text-sm ${textSecondary} mt-1`}>View and manage all registered students</p>
                  </div>
                  {/* <button className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export List
                  </button> */}
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className={`text-center py-8 ${cardBg} rounded-xl`}>
                    <GraduationCap className={`w-12 h-12 mx-auto mb-4 ${textMuted}`} />
                    <p className={`${textSecondary}`}>No students found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textSecondary}`}>Student ID</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textSecondary}`}>Name</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textSecondary}`}>Department</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textSecondary}`}>Course</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textSecondary}`}>Devices</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textSecondary}`}>Status</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textSecondary}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => (
                          <tr 
                            key={student.id}
                            className={`border-b ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
                          >
                            <td className="py-3 px-4">
                              <span className={`font-mono font-semibold text-sm ${textPrimary}`}>
                                {student.studentId}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                  <span className={`font-medium ${textPrimary} block`}>{student.name}</span>
                                  <span className={`text-xs ${textSecondary}`}>{student.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className={`py-3 px-4 ${textSecondary}`}>{student.department}</td>
                            <td className={`py-3 px-4 ${textSecondary}`}>{student.course}</td>
                            <td className={`py-3 px-4`}>
                              <span className={`font-semibold ${textPrimary}`}>{student.registeredDevices}</span>
                              <span className={`text-xs ${textSecondary} ml-1`}>device(s)</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                student.status === 'active'
                                  ? darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                                  : student.status === 'pending'
                                  ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                  : darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {student.status === 'active' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                  <Eye className={`w-4 h-4 ${textSecondary}`} />
                                </button>
                                <button className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                  <Edit className={`w-4 h-4 ${textSecondary}`} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Security Modal */}
      {showAddSecurity && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-black border-white/10' : 'bg-white border-gray-200'} border rounded-2xl w-full max-w-md shadow-2xl`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold ${textPrimary} flex items-center gap-2`}>
                    <UserPlus className="w-6 h-6" />
                    Add Security Personnel
                  </h3>
                  <p className={`text-sm ${textSecondary} mt-1`}>Create a new security account</p>
                </div>
                <button
                  onClick={() => setShowAddSecurity(false)}
                  className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${textSecondary}`} />
                </button>
              </div>

              {errors.general && (
                <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{errors.general}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Full Name *</label>
                  <input
                    type="text"
                    value={newSecurity.name}
                    onChange={(e) => setNewSecurity({...newSecurity, name: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${textPrimary} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Email Address *</label>
                  <input
                    type="email"
                    value={newSecurity.email}
                    onChange={(e) => setNewSecurity({...newSecurity, email: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${textPrimary} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Employee ID *</label>
                  <input
                    type="text"
                    value={newSecurity.employeeId}
                    onChange={(e) => setNewSecurity({...newSecurity, employeeId: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${textPrimary} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.employeeId ? 'border-red-500' : ''}`}
                    placeholder="SEC001"
                  />
                  {errors.employeeId && <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Phone Number *</label>
                  <input
                    type="tel"
                    value={newSecurity.phone}
                    onChange={(e) => setNewSecurity({...newSecurity, phone: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${textPrimary} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+63 912 345 6789"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                {/* <div className="grid grid-cols-2 gap-4"> */}
                  {/* <div>
                    <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Shift</label>
                    <select
                      value={newSecurity.shift}
                      onChange={(e) => setNewSecurity({...newSecurity, shift: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${textPrimary} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="morning">Morning (6AM - 2PM)</option>
                      <option value="afternoon">Afternoon (2PM - 10PM)</option>
                      <option value="night">Night (10PM - 6AM)</option>
                    </select>
                  </div> */}
                  {/* <div>
                    <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Assigned Gate</label>
                    <select
                      value={newSecurity.assignedGate}
                      onChange={(e) => setNewSecurity({...newSecurity, assignedGate: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${textPrimary} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">Select gate</option>
                      <option value="Main Gate">Main Gate</option>
                      <option value="Back Gate">Back Gate</option>
                      <option value="Side Gate">Side Gate</option>
                      <option value="East Gate">East Gate</option>
                      <option value="West Gate">West Gate</option>
                    </select>
                  </div> */}
                {/* </div> */}

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textSecondary}`}>Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newSecurity.password}
                      onChange={(e) => setNewSecurity({...newSecurity, password: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${textPrimary} transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} rounded`}
                    >
                      {showPassword ? (
                        <EyeOff className={`w-5 h-5 ${textMuted}`} />
                      ) : (
                        <Eye className={`w-5 h-5 ${textMuted}`} />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddSecurity(false)}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSecurity}
                    disabled={loading}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        {/* <Save className="w-4 h-4" /> */}
                        Create Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}