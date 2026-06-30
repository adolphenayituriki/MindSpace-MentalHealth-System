export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
