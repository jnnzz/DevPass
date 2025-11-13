// useQRCode.js
import { useState, useEffect } from 'react';

export const useQRCode = (devices, studentInfo) => {
  const [qrCodes, setQrCodes] = useState({});

  useEffect(() => {
    const codes = {};
    devices.forEach(device => {
      if (device.status === 'active') {
        const qrData = JSON.stringify({
          deviceId: device.id,
          studentId: studentInfo.studentId,
          studentName: studentInfo.name,
          deviceType: device.type,
          brand: device.brand,
          model: device.model,
          expiry: device.qrExpiry,
          timestamp: new Date().toISOString()
        });
        
        const qrDataEncoded = encodeURIComponent(qrData);
        codes[device.id] = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrDataEncoded}`;
      }
    });
    setQrCodes(codes);
  }, [devices, studentInfo]);

  return qrCodes;
};