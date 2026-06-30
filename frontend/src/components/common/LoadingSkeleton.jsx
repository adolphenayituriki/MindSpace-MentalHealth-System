export default function LoadingSkeleton({ lines = 4 }) {
  return (
    <div className="page-container">
      <div className="skeleton-header" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton-line" style={{ width: `${60 + Math.random() * 30}%` }} />
        ))}
      </div>
    </div>
  );
}
