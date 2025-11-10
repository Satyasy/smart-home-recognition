import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock } from 'lucide-react';
import CameraFeed from './components/CameraFeed';
import SensorStatus from './components/SensorStatus';
import ActuatorControl from './components/ActuatorControl';
import AccessLog from './components/AccessLog';
import SecurityChart from './components/SecurityChart';

const Dashboard = () => {
  const [doorStatus, setDoorStatus] = useState('locked');
  const [sensorData, setSensorData] = useState({
    faceRecognition: { detected: false, name: '', confidence: 0 },
    fingerprint: { matched: false, userId: '' },
    pir: { motion: false },
    servo: { angle: 0, locked: true },
    led: { red: true, green: false },
    buzzer: { active: false }
  });
  
  const [accessLog, setAccessLog] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);

  // Simulasi data real-time dari ESP32
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const time = now.toLocaleTimeString('id-ID');
      
      // Simulasi deteksi wajah (Face Recognition)
      const faceDetected = Math.random() > 0.7;
      const knownPerson = Math.random() > 0.5;
      const names = ['John Doe', 'Jane Smith', 'Admin', 'Unknown'];
      
      // Simulasi PIR sensor
      const motionDetected = Math.random() > 0.6;
      
      setSensorData(prev => ({
        ...prev,
        faceRecognition: {
          detected: faceDetected,
          name: faceDetected ? (knownPerson ? names[Math.floor(Math.random() * 3)] : 'Unknown') : '',
          confidence: faceDetected ? (knownPerson ? 85 + Math.random() * 15 : 30 + Math.random() * 40) : 0
        },
        pir: { motion: motionDetected }
      }));

      // Update activity history untuk grafik
      setActivityHistory(prev => {
        const newData = [...prev, {
          time: time,
          motion: motionDetected ? 1 : 0,
          access: 0
        }].slice(-20);
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fungsi untuk scan fingerprint
  const handleFingerprint = () => {
    const matched = Math.random() > 0.3;
    const userId = matched ? `FP-${Math.floor(Math.random() * 1000)}` : '';
    
    setSensorData(prev => ({
      ...prev,
      fingerprint: { matched, userId }
    }));

    if (matched) {
      unlockDoor('Fingerprint', userId);
    } else {
      triggerAlert('Fingerprint tidak terdaftar');
    }
  };

  // Fungsi untuk unlock door
  const unlockDoor = (method, identifier) => {
    setDoorStatus('unlocked');
    
    // Kontrol aktuator
    setSensorData(prev => ({
      ...prev,
      servo: { angle: 90, locked: false },
      led: { red: false, green: true },
      buzzer: { active: false }
    }));

    // Tambah log akses
    const now = new Date();
    const newLog = {
      time: now.toLocaleTimeString('id-ID'),
      date: now.toLocaleDateString('id-ID'),
      method: method,
      user: identifier,
      status: 'success',
      type: 'entry'
    };
    
    setAccessLog(prev => [newLog, ...prev].slice(0, 10));

    // Auto lock setelah 5 detik
    setTimeout(() => {
      lockDoor();
    }, 5000);
  };

  // Fungsi untuk lock door
  const lockDoor = () => {
    setDoorStatus('locked');
    setSensorData(prev => ({
      ...prev,
      servo: { angle: 0, locked: true },
      led: { red: true, green: false }
    }));
  };

  // Fungsi untuk trigger alert (buzzer)
  const triggerAlert = (reason) => {
    setSensorData(prev => ({
      ...prev,
      buzzer: { active: true },
      led: { red: true, green: false }
    }));

    const now = new Date();
    const newLog = {
      time: now.toLocaleTimeString('id-ID'),
      date: now.toLocaleDateString('id-ID'),
      method: 'Alert',
      user: reason,
      status: 'failed',
      type: 'alert'
    };
    
    setAccessLog(prev => [newLog, ...prev].slice(0, 10));

    setTimeout(() => {
      setSensorData(prev => ({
        ...prev,
        buzzer: { active: false }
      }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Smart Door Lock System</h1>
                <p className="text-gray-400">ESP32 CAM + Face Recognition & Fingerprint</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-800/50 px-6 py-3 rounded-xl border border-gray-700">
              {doorStatus === 'locked' ? (
                <>
                  <Lock className="w-6 h-6 text-red-400" />
                  <span className="text-red-400 font-semibold">LOCKED</span>
                </>
              ) : (
                <>
                  <Unlock className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-semibold">UNLOCKED</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ESP32 CAM Feed */}
          <div className="lg:col-span-2">
            <CameraFeed 
              sensorData={sensorData} 
              doorStatus={doorStatus}
            />
          </div>

          {/* Sensor & Actuator Status */}
          <div className="space-y-6">
            <SensorStatus 
              sensorData={sensorData}
              onFingerprintScan={handleFingerprint}
            />
            <ActuatorControl sensorData={sensorData} />
          </div>
        </div>

        {/* Access Log & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <AccessLog accessLog={accessLog} />
          <SecurityChart activityHistory={activityHistory} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;