const statusLabels = {
  available: "Available",
  completed: "Completed",
  locked: "Locked",
  running: "Running",
  booting: "Booting",
  stopped: "Stopped",
};

export function StatusBadge({ status, children }) {
  return (
    <span className={`status status-${status}`}>
      {children || statusLabels[status] || status}
    </span>
  );
}
