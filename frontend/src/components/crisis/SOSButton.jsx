import { useState, useEffect } from 'react';

export default function SOSButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="sos-float">
      {open ? (
        <>
          <div className="modal-overlay" onClick={() => setOpen(false)} />
          <div className="modal-content" style={{ position: 'fixed', bottom: '50%', right: '50%', transform: 'translate(50%, 50%)', zIndex: 501 }}>
            <h2>Need help now?</h2>
            <p>You are not alone. Help is available 24/7.</p>
            <div className="modal-actions">
              <a href="tel:3002" className="btn btn-danger btn-lg" onClick={() => setOpen(false)}>
                Call 3002 &mdash; Mental Health
              </a>
              <a href="tel:112" className="btn btn-danger btn-lg" onClick={() => setOpen(false)}>
                Call 112 &mdash; Emergency
              </a>
              <button className="btn btn-secondary btn-lg w-full" onClick={() => setOpen(false)}>
                Not now
              </button>
            </div>
          </div>
        </>
      ) : (
        <button className="sos-btn" onClick={() => setOpen(true)} title="Get help">
          SOS
        </button>
      )}
    </div>
  );
}
