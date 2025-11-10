import React from 'react';
import { Fingerprint, CheckCircle, XCircle } from 'lucide-react';

const SensorStatus = ({ sensorData, onFingerprintScan }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Fingerprint className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Fingerprint Sensor</h3>
      </div>

      {/* Fingerprint Scan Button */}
      <button
        onClick={onFingerprintScan}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
      >
        <Fingerprint className="w-6 h-6" />
        Scan Fingerprint
      </button>

      {/* Fingerprint Result */}
      {sensorData.fingerprint.matched && (
        <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-green-400 font-semibold">✓ Fingerprint Matched</div>
              <div className="text-green-300 text-sm">User ID: {sensorData.fingerprint.userId}</div>
            </div>
          </div>
        </div>
      )}

      {sensorData.fingerprint.userId === '' && sensorData.fingerprint.matched === false && (
        <div className="mt-4 p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400">
            <Fingerprint className="w-5 h-5" />
            <span className="text-sm">Place finger on sensor to unlock</span>
          </div>
        </div>
      )}

      {/* Sensor Info */}
      <div className="mt-4 p-3 bg-gray-700/20 rounded-lg">
        <div className="text-gray-400 text-xs mb-1">Sensor Type</div>
        <div className="text-white text-sm font-semibold">R307 Fingerprint Module</div>
        <div className="text-gray-500 text-xs mt-1">Connected via UART</div>
      </div>
    </div>
  );
};

export default SensorStatus;