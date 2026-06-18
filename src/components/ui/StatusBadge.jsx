export function StatusBadge({ status, children }) {
  return (
    <span className={`status status-${status}`}>
      {children || status}
    </span>
  );
}
