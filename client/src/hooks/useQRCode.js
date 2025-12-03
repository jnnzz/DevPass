// useQRCode.js
import { useState, useEffect } from 'react';

export const useQRCode = (devices, studentInfo) => {
  const [qrCodes, setQrCodes] = useState({});

  useEffect(() => {
    if (!devices) {
      setQrCodes({});
      return;
    }

    const codes = {};
    devices.forEach(device => {
      if (device.status === 'active' && device.qrCodeHash) {
        // Use the actual QR code hash from the backend
        // This hash is what the personnel scanner expects
        const qrDataEncoded = encodeURIComponent(device.qrCodeHash);
        codes[device.id] = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrDataEncoded}`;
      }
    });
    setQrCodes(codes);
  }, [devices]);

  return qrCodes;
};