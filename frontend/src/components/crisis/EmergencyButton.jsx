import { useState } from 'react';

export default function EmergencyButton() {
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="emergency-float">
      {confirm ? (
        <div className="emergency-confirm">
          <p>Need help right now?</p>
          <a href="tel:112" className="btn btn-danger">Call 112</a>
          <a href="tel:3002" className="btn btn-danger">Call 3002</a>
          <button className="btn btn-sm" onClick={() => setConfirm(false)}>Cancel</button>
        </div>
      ) : (
        <button
          className="emergency-fab"
          onClick={() => setConfirm(true)}
          title="Emergency Help"
        >
          SOS
        </button>
      )}
    </div>
  );
}
