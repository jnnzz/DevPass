// useQRCode.js
import { useState, useEffect } from 'react';

export const useQRCode = (devices, studentInfo) => {
  const [qrCodes, setQrCodes] = useState({});

  useEffect(() => {
    const codes = {};
    devices.forEach(device => {
      if (device.status === 'active' && device.qrHash) {
        // Create JSON object with device and student info
        const qrData = {
          hash: device.qrHash.trim(), // The hash is the primary identifier
          deviceId: device.id,
          deviceType: device.type,
          brand: device.brand,
          model: device.model,
          studentId: studentInfo?.id || studentInfo?.studentId,
          studentName: studentInfo?.name,
          expiry: device.qrExpiry,
          timestamp: new Date().toISOString()
        };
        
        // Encode JSON as string for QR code
        const qrDataString = JSON.stringify(qrData);
        codes[device.id] = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDataString)}`;
      }
    });
    setQrCodes(codes);
  }, [devices, studentInfo]);

  return qrCodes;
};