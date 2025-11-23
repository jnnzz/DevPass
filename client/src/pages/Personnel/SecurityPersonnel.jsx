import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { 
  QrCode, 
  Shield, 
  Scan,
  Settings, 
  LogOut, 
  Bell, 
  Moon, 
  Sun,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  User,
  Laptop,
  Clock,
  MapPin,
  TrendingUp,
  Activity,
  CameraOff
} from 'lucide-react';

function ScanResultModal({ result, darkMode, onClose }) {
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  const isSuccess = result.status === 'success';
  const statusColor = isSuccess 
    ? darkMode ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-emerald-50 border-emerald-200'
    : darkMode ? 'bg-red-500/20 border-red-500/40' : 'bg-red-50 border-red-200';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-black border-white/10' : 'bg-white border-gray-200'} border rounded-2xl w-full max-w-md shadow-2xl`}>
        <div className="p-6 text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${statusColor} border-2`}>
            {isSuccess ? (
              <CheckCircle className={`w-10 h-10 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            ) : (
              <XCircle className={`w-10 h-10 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            )}
          </div>

          <h2 className={`text-2xl font-bold mb-2 ${textPrimary}`}>
            {isSuccess ? 'Access Granted ✓' : 'Access Denied ✗'}
          </h2>
          <p className={`text-sm mb-6 ${textSecondary}`}>
            {result.message}
          </p>

          {isSuccess && result.data && (
            <div className={`p-4 rounded-xl mb-6 text-left ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className={`w-5 h-5 ${textSecondary}`} />
                  <div className="flex-1">
                    <p className={`text-xs ${textSecondary}`}>Student Name</p>
                    <p className={`font-semibold ${textPrimary}`}>{result.data.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Laptop className={`w-5 h-5 ${textSecondary}`} />
                  <div className="flex-1">
                    <p className={`text-xs ${textSecondary}`}>Device</p>
                    <p className={`font-semibold ${textPrimary}`}>{result.data.device}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${textSecondary}`} />
                  <div className="flex-1">
                    <p className={`text-xs ${textSecondary}`}>QR Valid Until</p>
                    <p className={`font-semibold ${textPrimary}`}>{result.data.expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              isSuccess
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700'
                : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SecurityPersonnel() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [gate, setGate] = useState('Main Gate');
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Mock scan history
  const [scanHistory, setScanHistory] = useState([
    { 
      id: 1,
      studentName: "Juan Dela Cruz",
      studentId: "STU123456",
      device: "Dell XPS 15",
      time: "10:45 AM",
      status: "success"
    },
    { 
      id: 2,
      studentName: "Maria Santos",
      studentId: "STU123457",
      device: "MacBook Pro M2",
      time: "10:30 AM",
      status: "success"
    },
    { 
      id: 3,
      studentName: "Pedro Garcia",
      studentId: "STU123458",
      device: "HP Pavilion",
      time: "10:15 AM",
      status: "success"
    },
    { 
      id: 4,
      studentName: "Unknown User",
      studentId: "N/A",
      device: "N/A",
      time: "10:00 AM",
      status: "failed"
    }
  ]);

  const [stats, setStats] = useState({
    scansToday: 47,
    successRate: 96,
    lastHour: 12
  });

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

  // Cleanup camera stream on unmount or when scanning stops
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);

      // Set video stream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Simulate QR detection after camera starts
      setTimeout(() => {
        captureAndProcessQR();
      }, 3000);

    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const captureAndProcessQR = () => {
    // In a real implementation, you would use a QR code detection library here
    // For demo purposes, we'll simulate a scan result
    const isSuccess = Math.random() > 0.2;
    
    const result = isSuccess ? {
      status: 'success',
      message: 'Device verified successfully',
      data: {
        name: 'Juan Dela Cruz',
        studentId: 'STU123456',
        device: 'Dell XPS 15',
        expiryDate: '2025-11-14'
      }
    } : {
      status: 'failed',
      message: 'Invalid or expired QR code'
    };

    setScanResult(result);
    stopCamera();

    // Add to history
    const newScan = {
      id: Date.now(),
      studentName: result.data?.name || 'Unknown User',
      studentId: result.data?.studentId || 'N/A',
      device: result.data?.device || 'N/A',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: result.status
    };
    setScanHistory([newScan, ...scanHistory.slice(0, 9)]);

    // Update stats
    setStats(prev => ({
      scansToday: prev.scansToday + 1,
      successRate: Math.round((prev.scansToday * prev.successRate + (isSuccess ? 100 : 0)) / (prev.scansToday + 1)),
      lastHour: prev.lastHour + 1
    }));
  };

  const handleScan = () => {
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage and redirect even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_type');
      localStorage.removeItem('role');
      navigate('/');
    }
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
                <p className={`text-xs ${textSecondary}`}>Gate Scanner</p>
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
            Security Scanner 
          </h2>
          <div className="flex items-center gap-2">
            <MapPin className={`w-4 h-4 ${textSecondary}`} />
            <select
              value={gate}
              onChange={(e) => setGate(e.target.value)}
              className={`text-sm sm:text-base ${textSecondary} bg-transparent border-none focus:outline-none cursor-pointer`}
            >
              <option value="Main Gate">Main Gate</option>
              <option value="Engineering Gate">Engineering Gate</option>
              <option value="CCS Gate">CCS Gate</option>
              <option value="Library Gate">Library Gate</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Scan className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.scansToday}</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Scans Today</p>
          </div>

          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <TrendingUp className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.successRate}%</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Success Rate</p>
          </div>

          <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all ${hoverCardBg}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <Activity className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>{stats.lastHour}</h3>
            <p className={`text-xs sm:text-sm ${textSecondary}`}>Last Hour</p>
          </div>
        </div>

        {/* Scanner Section */}
        <div className={`${cardBg} rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8`}>
          <h3 className={`text-xl sm:text-2xl font-bold ${textPrimary} mb-6 text-center`}>
            Scan QR Code
          </h3>

          <div className="max-w-md mx-auto">
            {/* Scanner Visual */}
            <div className={`relative aspect-square rounded-2xl overflow-hidden mb-6 ${
              isScanning 
                ? 'bg-black border-2 border-blue-500' 
                : darkMode 
                ? 'bg-white/5 border-2 border-white/20' 
                : 'bg-gray-100 border-2 border-gray-300'
            }`}>
              {isScanning ? (
                <>
                  {/* Video Feed */}
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  {/* Canvas for QR detection (hidden) */}
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanning Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 border-4 border-blue-500 rounded-2xl relative">
                      {/* Corner markers */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                      
                      {/* Scanning line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-scan shadow-lg shadow-blue-500/50"></div>
                    </div>
                  </div>

                  {/* Scanning Text */}
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-white font-semibold text-sm bg-black/60 px-4 py-2 rounded-full inline-block">
                      Scanning for QR Code...
                    </p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  {cameraError ? (
                    <>
                      <CameraOff className={`w-20 h-20 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                      <p className={`text-sm text-center px-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                        {cameraError}
                      </p>
                    </>
                  ) : (
                    <>
                      <Camera className={`w-20 h-20 ${textMuted}`} />
                      <p className={`text-sm ${textSecondary}`}>Camera Ready</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Scan Button */}
            <button
              onClick={handleScan}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                isScanning
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
              }`}
            >
              {isScanning ? (
                <span className="flex items-center justify-center gap-2">
                  <XCircle className="w-6 h-6" />
                  Stop Scanning
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <QrCode className="w-6 h-6" />
                  Start Camera
                </span>
              )}
            </button>

            <p className={`text-center text-sm mt-4 ${textSecondary}`}>
              {isScanning ? 'Position the QR code within the frame' : 'Click to activate camera and scan QR codes'}
            </p>
          </div>
        </div>

        {/* Recent Scans */}
        <div className={`${cardBg} rounded-xl sm:rounded-2xl p-4 sm:p-6`}>
          <h3 className={`text-lg sm:text-xl font-bold ${textPrimary} mb-4 sm:mb-6`}>Recent Scans</h3>
          <div className="space-y-3 sm:space-y-4">
            {scanHistory.map((scan) => (
              <div key={scan.id} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-white/60'}`}>
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${
                    scan.status === 'success'
                      ? darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'
                      : darkMode ? 'bg-red-500/20' : 'bg-red-100'
                  }`}>
                    {scan.status === 'success' ? (
                      <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    ) : (
                      <XCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`font-semibold text-sm sm:text-base ${textPrimary} truncate`}>
                      {scan.studentName}
                    </h4>
                    <p className={`text-xs sm:text-sm ${textSecondary}`}>
                      {scan.device} • {scan.time}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded flex-shrink-0 ${
                  scan.status === 'success'
                    ? darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                    : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                }`}>
                  {scan.status === 'success' ? 'Granted' : 'Denied'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scan Result Modal */}
      {scanResult && (
        <ScanResultModal
          result={scanResult}
          darkMode={darkMode}
          onClose={() => setScanResult(null)}
        />
      )}

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(0); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}