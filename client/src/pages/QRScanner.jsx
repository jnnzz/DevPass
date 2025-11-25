import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, X, User, Laptop, Mail, GraduationCap, Phone, Calendar, CheckCircle, XCircle, Camera, CameraOff } from 'lucide-react';
import jsQR from 'jsqr';
import api from '../api/axios';

export default function QRScanner() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const isScanningRef = useRef(false);

  // Check authentication
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);
      isScanningRef.current = true;

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('autoplay', 'true');
        video.setAttribute('muted', 'true');
        
        const onVideoReady = () => {
          video.play().then(() => {
            setTimeout(() => {
              if (isScanningRef.current && videoRef.current) {
                startQRScanning();
              }
            }, 200);
          }).catch(err => {
            console.error('Video play error:', err);
            setCameraError('Failed to start video feed');
            setIsScanning(false);
            isScanningRef.current = false;
          });
        };

        if (video.readyState >= 2) {
          onVideoReady();
        } else {
          video.onloadedmetadata = onVideoReady;
          video.oncanplay = () => {
            if (isScanningRef.current && !scanIntervalRef.current) {
              onVideoReady();
            }
          };
        }

        video.onerror = (err) => {
          console.error('Video error:', err);
          setCameraError('Failed to load video feed');
          setIsScanning(false);
          isScanningRef.current = false;
        };
      }

    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please check permissions.');
      setIsScanning(false);
      isScanningRef.current = false;
    }
  };

  const startQRScanning = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.warn('Video or canvas ref not available');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!canvas.getContext) {
      console.error('Canvas context not available');
      return;
    }

    const context = canvas.getContext('2d', { willReadFrequently: true });

    const scan = () => {
      if (!isScanningRef.current || !video) {
        return;
      }

      if (video.readyState < video.HAVE_CURRENT_DATA) {
        scanIntervalRef.current = requestAnimationFrame(scan);
        return;
      }

      try {
        const videoWidth = video.videoWidth || video.clientWidth || 640;
        const videoHeight = video.videoHeight || video.clientHeight || 480;
        
        if (!videoWidth || !videoHeight || videoWidth === 0 || videoHeight === 0) {
          scanIntervalRef.current = requestAnimationFrame(scan);
          return;
        }

        const maxSize = 400;
        let canvasWidth, canvasHeight;
        
        if (videoWidth <= maxSize && videoHeight <= maxSize) {
          canvasWidth = videoWidth;
          canvasHeight = videoHeight;
        } else {
          const scale = Math.min(maxSize / videoWidth, maxSize / videoHeight);
          canvasWidth = Math.floor(videoWidth * scale);
          canvasHeight = Math.floor(videoHeight * scale);
        }

        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
        }

        context.imageSmoothingEnabled = false;
        context.drawImage(video, 0, 0, canvasWidth, canvasHeight);
        
        const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
        
        if (!imageData || !imageData.data || imageData.data.length === 0) {
          scanIntervalRef.current = requestAnimationFrame(scan);
          return;
        }

        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code && code.data) {
          // QR code detected - extract hash string
          const qrHash = code.data.trim();
          console.log('QR code detected! Hash length:', qrHash.length);
          console.log('Hash preview:', qrHash.substring(0, 20) + '...');
          
          if (scanIntervalRef.current) {
            cancelAnimationFrame(scanIntervalRef.current);
            scanIntervalRef.current = null;
          }
          isScanningRef.current = false;
          stopCamera();
          
          // Process the scanned hash
          handleQRScanned(qrHash);
          return;
        }
      } catch (error) {
        console.error('Scan error:', error);
      }

      scanIntervalRef.current = requestAnimationFrame(scan);
    };

    console.log('Starting QR scan loop...');
    scanIntervalRef.current = requestAnimationFrame(scan);
  };

  const handleQRScanned = async (qrData) => {
    stopCamera();
    setLoading(true);
    
    try {
      // Clean the QR data (remove whitespace, newlines, etc.)
      let hash = qrData.trim();
      
      // Try to parse as JSON first
      try {
        const jsonData = JSON.parse(hash);
        // If it's JSON, extract the hash
        if (jsonData.hash) {
          hash = jsonData.hash;
          console.log('Extracted hash from JSON:', hash.substring(0, 20) + '...');
        } else if (jsonData.deviceId) {
          // Old format - try to use deviceId to get hash (not ideal, but handle it)
          setScanResult({
            valid: false,
            message: 'QR code format outdated. Please regenerate QR code.',
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        // Not JSON, continue with hash extraction
      }
      
      // Handle URLs - extract hash from URL if it's a URL
      if (hash.startsWith('http://') || hash.startsWith('https://')) {
        // Try to extract hash from URL path
        const urlMatch = hash.match(/\/devices\/(\d+)\/scan/);
        if (urlMatch) {
          setScanResult({
            valid: false,
            message: 'Invalid QR code format. QR code should contain the device hash, not a URL.',
          });
          setLoading(false);
          return;
        }
        // If it's a different URL format, try to extract hash from query params or path
        const hashMatch = hash.match(/[a-zA-Z0-9]{32,}/); // Look for hash-like string (32+ chars)
        if (hashMatch) {
          hash = hashMatch[0];
        }
      }
      
      console.log('Final QR hash:', hash.substring(0, 20) + '...');
      
      // Send hash to backend to fetch student data
      const response = await api.post('/qr/read', {
        qr_data: hash
      });
      
      console.log('QR read response:', response.data);
      setScanResult(response.data);
    } catch (error) {
      console.error('QR read error:', error);
      console.error('Error response:', error.response?.data);
      setScanResult({
        valid: false,
        message: error.response?.data?.message || 'Invalid QR code or device not found. Please ensure the QR code is from a registered student device.',
      });
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      if (typeof scanIntervalRef.current === 'number') {
        cancelAnimationFrame(scanIntervalRef.current);
      } else {
        clearInterval(scanIntervalRef.current);
      }
      scanIntervalRef.current = null;
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
    }
    setIsScanning(false);
    isScanningRef.current = false;
  };

  const handleScan = () => {
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleClose = () => {
    setScanResult(null);
  };

  const darkMode = true;
  const bgClass = darkMode 
    ? 'bg-black text-white' 
    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900';

  const cardBg = darkMode
    ? 'bg-white/5 border border-white/10 backdrop-blur-xl'
    : 'bg-white/80 border border-white/60 backdrop-blur-xl';

  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-500' : 'text-gray-500';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500`}>
      {/* Header */}
      <nav className={`sticky top-0 z-40 ${cardBg} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">
                DevPass QR Reader
              </h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
              <X className={`w-5 h-5 ${textSecondary}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                    autoPlay
                  />
                  <canvas 
                    ref={canvasRef} 
                    style={{ display: 'none' }}
                    width="400"
                    height="400"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 border-4 border-blue-500 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-scan shadow-lg shadow-blue-500/50"></div>
                    </div>
                  </div>

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
                  ) : scanResult ? (
                    <>
                      {scanResult.valid ? (
                        <CheckCircle className={`w-20 h-20 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      ) : (
                        <XCircle className={`w-20 h-20 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                      )}
                      <p className={`text-sm ${textSecondary}`}>
                        {scanResult.valid ? 'QR Code Scanned' : scanResult.message}
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
            {!scanResult && (
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
            )}

            {scanResult && (
              <button
                onClick={handleClose}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              >
                Scan Another QR Code
              </button>
            )}

            <p className={`text-center text-sm mt-4 ${textSecondary}`}>
              {isScanning ? 'Position the QR code within the frame' : 'Scan a DevPass QR code to view student information'}
            </p>
          </div>
        </div>

        {/* Scan Result */}
        {scanResult && scanResult.valid && (
          <div className={`${cardBg} rounded-2xl sm:rounded-3xl p-6 sm:p-8`}>
            <div className="text-center mb-6">
              <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>Student Information</h2>
              <p className={`text-sm ${textSecondary}`}>QR Code Valid</p>
            </div>

            <div className="space-y-4">
              {/* Student Information */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
                  <User className={`w-5 h-5 ${textSecondary}`} />
                  Student Details
                </h3>
                <div className="space-y-3">
                  {scanResult.student_data?.student_name && (
                    <div className="flex items-start gap-3">
                      <User className={`w-5 h-5 ${textSecondary} mt-0.5`} />
                      <div className="flex-1">
                        <p className={`text-xs ${textSecondary}`}>Name</p>
                        <p className={`font-semibold ${textPrimary}`}>{scanResult.student_data.student_name}</p>
                      </div>
                    </div>
                  )}
                  {scanResult.student_data?.student_id && (
                    <div className="flex items-start gap-3">
                      <User className={`w-5 h-5 ${textSecondary} mt-0.5`} />
                      <div className="flex-1">
                        <p className={`text-xs ${textSecondary}`}>Student ID</p>
                        <p className={`font-semibold ${textPrimary}`}>{scanResult.student_data.student_id}</p>
                      </div>
                    </div>
                  )}
                  {scanResult.student_data?.student_email && (
                    <div className="flex items-start gap-3">
                      <Mail className={`w-5 h-5 ${textSecondary} mt-0.5`} />
                      <div className="flex-1">
                        <p className={`text-xs ${textSecondary}`}>Email</p>
                        <p className={`font-semibold ${textPrimary}`}>{scanResult.student_data.student_email}</p>
                      </div>
                    </div>
                  )}
                  {scanResult.student_data?.student_phone && (
                    <div className="flex items-start gap-3">
                      <Phone className={`w-5 h-5 ${textSecondary} mt-0.5`} />
                      <div className="flex-1">
                        <p className={`text-xs ${textSecondary}`}>Phone</p>
                        <p className={`font-semibold ${textPrimary}`}>{scanResult.student_data.student_phone}</p>
                      </div>
                    </div>
                  )}
                  {scanResult.student_data?.student_department && (
                    <div className="flex items-start gap-3">
                      <GraduationCap className={`w-5 h-5 ${textSecondary} mt-0.5`} />
                      <div className="flex-1">
                        <p className={`text-xs ${textSecondary}`}>Department</p>
                        <p className={`font-semibold ${textPrimary}`}>{scanResult.student_data.student_department}</p>
                      </div>
                    </div>
                  )}
                  {scanResult.student_data?.student_course && (
                    <div className="flex items-start gap-3">
                      <GraduationCap className={`w-5 h-5 ${textSecondary} mt-0.5`} />
                      <div className="flex-1">
                        <p className={`text-xs ${textSecondary}`}>Course</p>
                        <p className={`font-semibold ${textPrimary}`}>{scanResult.student_data.student_course}</p>
                      </div>
                    </div>
                  )}
                  {scanResult.student_data?.year_of_study && (
                    <div className="flex items-start gap-3">
                      <Calendar className={`w-5 h-5 ${textSecondary} mt-0.5`} />
                      <div className="flex-1">
                        <p className={`text-xs ${textSecondary}`}>Year of Study</p>
                        <p className={`font-semibold ${textPrimary}`}>Year {scanResult.student_data.year_of_study}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Device Information */}
              {scanResult.device && (
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
                    <Laptop className={`w-5 h-5 ${textSecondary}`} />
                    Device Details
                  </h3>
                  <div className="space-y-3">
                    {scanResult.device.brand && scanResult.device.model && (
                      <div className="flex items-start gap-3">
                        <Laptop className={`w-5 h-5 ${textSecondary} mt-0.5`} />
                        <div className="flex-1">
                          <p className={`text-xs ${textSecondary}`}>Device</p>
                          <p className={`font-semibold ${textPrimary}`}>{scanResult.device.brand} {scanResult.device.model}</p>
                        </div>
                      </div>
                    )}
                    {scanResult.device.device_type && (
                      <div className="flex items-start gap-3">
                        <Laptop className={`w-5 h-5 ${textSecondary} mt-0.5`} />
                        <div className="flex-1">
                          <p className={`text-xs ${textSecondary}`}>Type</p>
                          <p className={`font-semibold ${textPrimary}`}>{scanResult.device.device_type}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Result */}
        {scanResult && !scanResult.valid && (
          <div className={`${cardBg} rounded-2xl sm:rounded-3xl p-6 sm:p-8`}>
            <div className="text-center">
              <XCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>Invalid QR Code</h2>
              <p className={`text-sm ${textSecondary}`}>{scanResult.message}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

