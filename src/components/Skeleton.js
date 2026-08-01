// Pulsing placeholder bars shown while data is loading, shaped like the real content.

export function HistorySkeleton({ rows = 4 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-row" key={i}>
          <div className="skeleton-lines">
            <div className="skeleton-bar" style={{ width: "40%" }} />
            <div
              className="skeleton-bar"
              style={{ width: "60%", height: 16 }}
            />
            <div className="skeleton-bar" style={{ width: "30%" }} />
          </div>
          <div className="skeleton-actions">
            <div className="skeleton-circle" />
            <div className="skeleton-circle" />
            <div className="skeleton-circle" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotesSkeleton({ cards = 3 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: cards }).map((_, i) => (
        <div className="skeleton-note" key={i}>
          <div className="skeleton-bar" style={{ width: "90%" }} />
          <div className="skeleton-bar" style={{ width: "70%" }} />
          <div
            className="skeleton-bar"
            style={{ width: "35%", marginTop: 8 }}
          />
        </div>
      ))}
    </div>
  );
}
